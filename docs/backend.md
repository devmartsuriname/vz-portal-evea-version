# Backend Architecture & Implementation
## VZ Portal - Immigration Services Platform

### Overview
This document outlines the complete backend architecture using Supabase as the Backend-as-a-Service (BaaS) platform, providing authentication, database, storage, and serverless functions for the VZ Portal.

---

## Supabase Configuration

### Project Details
- **Project ID**: `lnkmarduszgtybwlslrg`
- **Project URL**: `https://lnkmarduszgtybwlslrg.supabase.co`
- **Environment**: Connected to Lovable project
- **Region**: EU (Netherlands/Germany for GDPR compliance)

### Client Configuration
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lnkmarduszgtybwlslrg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

---

## Database Schema Design

### Core Enums and Types
```sql
-- User roles with hierarchical permissions
CREATE TYPE user_role AS ENUM (
  'citizen',           -- General public users
  'officer',           -- Immigration officers
  'supervisor',        -- Officer supervisors
  'admin',             -- System administrators
  'legal_representative' -- Authorized legal representatives
);

-- Application types for different immigration services
CREATE TYPE application_type_enum AS ENUM (
  'residence_permit',
  'visa_application', 
  'citizenship',
  'family_reunification',
  'work_permit',
  'student_visa',
  'asylum_request',
  'temporary_protection'
);

-- Application status workflow
CREATE TYPE application_status_enum AS ENUM (
  'draft',                    -- User is still editing
  'submitted',                -- Submitted for review
  'under_review',             -- Being processed by officer
  'additional_info_required', -- Waiting for user input
  'interview_scheduled',      -- Interview appointment set
  'decision_pending',         -- Decision being finalized
  'approved',                 -- Application approved
  'rejected',                 -- Application rejected
  'withdrawn',                -- User withdrew application
  'on_hold',                  -- Temporarily suspended
  'appealed',                 -- Under appeal process
  'expired'                   -- Application expired
);

-- Document types for uploads
CREATE TYPE document_type_enum AS ENUM (
  'passport',
  'birth_certificate',
  'marriage_certificate',
  'divorce_decree',
  'diploma',
  'transcript',
  'employment_contract',
  'salary_slip',
  'bank_statement',
  'medical_report',
  'police_clearance',
  'housing_contract',
  'sponsor_letter',
  'other'
);

-- Priority levels for case management
CREATE TYPE priority_level AS ENUM (
  'low',
  'normal', 
  'high',
  'urgent',
  'emergency'
);

-- Supported languages
CREATE TYPE language_code AS ENUM ('nl', 'en');

-- Message types for communication system
CREATE TYPE message_type_enum AS ENUM (
  'user_message',
  'officer_message',
  'system_notification',
  'status_update',
  'document_request',
  'appointment_reminder',
  'decision_notification'
);

-- Audit trail actions
CREATE TYPE audit_action_enum AS ENUM (
  'INSERT',
  'UPDATE',
  'DELETE',
  'LOGIN',
  'LOGOUT',
  'VIEW',
  'DOWNLOAD',
  'UPLOAD',
  'APPROVE',
  'REJECT',
  'ASSIGN',
  'ESCALATE'
);
```

### Core Tables

#### User Profiles Table
```sql
-- Extended user profiles beyond Supabase Auth
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'citizen',
  
  -- Personal Information
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  nationality TEXT,
  phone_number TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Netherlands',
  
  -- System Preferences
  preferred_language language_code DEFAULT 'nl',
  timezone TEXT DEFAULT 'Europe/Amsterdam',
  notification_preferences JSONB DEFAULT '{
    "email": true,
    "sms": false,
    "push": true,
    "status_updates": true,
    "reminders": true,
    "marketing": false
  }',
  
  -- Profile Management
  profile_completed BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Audit Fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id),
  updated_by UUID REFERENCES public.profiles(id),
  
  -- Constraints
  CONSTRAINT valid_phone CHECK (phone_number ~ '^\+?[0-9\s\-\(\)]+$'),
  CONSTRAINT valid_postal_code CHECK (postal_code ~ '^[0-9]{4}\s?[A-Z]{2}$')
);

-- Indexes for performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_active ON public.profiles(is_active);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles  
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Officers can view citizen profiles in their cases" ON public.profiles
  FOR SELECT USING (
    role = 'citizen' AND EXISTS (
      SELECT 1 FROM public.applications 
      WHERE user_id = profiles.id 
      AND officer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### Applications Table
```sql
-- Immigration applications
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  officer_id UUID REFERENCES public.profiles(id),
  supervisor_id UUID REFERENCES public.profiles(id),
  
  -- Application Details
  application_type application_type_enum NOT NULL,
  application_number TEXT UNIQUE GENERATED ALWAYS AS (
    'VZ' || TO_CHAR(created_at, 'YYYY') || '-' || 
    LPAD(EXTRACT(DOY FROM created_at)::TEXT, 3, '0') || '-' ||
    LPAD(EXTRACT(HOUR FROM created_at)::TEXT, 2, '0') ||
    LPAD(EXTRACT(MINUTE FROM created_at)::TEXT, 2, '0') ||
    SUBSTRING(id::TEXT, 1, 4)
  ) STORED,
  
  -- Status Management
  status application_status_enum DEFAULT 'draft',
  priority priority_level DEFAULT 'normal',
  
  -- Dates
  submitted_at TIMESTAMPTZ,
  review_started_at TIMESTAMPTZ,
  decision_date TIMESTAMPTZ,
  expiry_date TIMESTAMPTZ,
  
  -- Application Data
  form_data JSONB NOT NULL DEFAULT '{}',
  decision_notes TEXT,
  rejection_reason TEXT,
  
  -- Processing Information
  estimated_processing_days INTEGER,
  sla_deadline TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  -- Audit Fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  version INTEGER DEFAULT 1,
  
  -- Constraints
  CONSTRAINT valid_dates CHECK (
    (submitted_at IS NULL OR submitted_at >= created_at) AND
    (decision_date IS NULL OR decision_date >= submitted_at) AND
    (expiry_date IS NULL OR expiry_date > created_at)
  ),
  CONSTRAINT valid_status_transitions CHECK (
    (status = 'draft' AND submitted_at IS NULL) OR
    (status != 'draft' AND submitted_at IS NOT NULL)
  )
);

-- Indexes
CREATE INDEX idx_applications_user_id ON public.applications(user_id);
CREATE INDEX idx_applications_officer_id ON public.applications(officer_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_applications_type ON public.applications(application_type);
CREATE INDEX idx_applications_priority ON public.applications(priority);
CREATE INDEX idx_applications_submitted_at ON public.applications(submitted_at);
CREATE INDEX idx_applications_number ON public.applications(application_number);
CREATE INDEX idx_applications_sla_deadline ON public.applications(sla_deadline);

-- GIN index for JSONB and array columns
CREATE INDEX idx_applications_form_data ON public.applications USING GIN(form_data);
CREATE INDEX idx_applications_tags ON public.applications USING GIN(tags);

-- Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Citizens can view own applications" ON public.applications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Citizens can create applications" ON public.applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Citizens can update own draft applications" ON public.applications
  FOR UPDATE USING (
    user_id = auth.uid() AND status = 'draft'
  );

CREATE POLICY "Officers can view assigned applications" ON public.applications
  FOR SELECT USING (
    officer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('supervisor', 'admin')
    )
  );

CREATE POLICY "Officers can update assigned applications" ON public.applications
  FOR UPDATE USING (
    officer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('supervisor', 'admin')
    )
  );
```

#### Documents Table
```sql
-- Document management
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  verified_by UUID REFERENCES public.profiles(id),
  
  -- File Information
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  
  -- Document Classification
  document_type document_type_enum,
  document_category TEXT,
  is_required BOOLEAN DEFAULT FALSE,
  
  -- Processing Status
  is_verified BOOLEAN DEFAULT FALSE,
  verification_notes TEXT,
  ocr_text TEXT,
  
  -- Version Control
  version INTEGER DEFAULT 1,
  previous_version_id UUID REFERENCES public.documents(id),
  is_current_version BOOLEAN DEFAULT TRUE,
  
  -- Security
  access_level TEXT DEFAULT 'restricted',
  encryption_key_id TEXT,
  virus_scan_status TEXT DEFAULT 'pending',
  virus_scan_result JSONB,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  extracted_data JSONB DEFAULT '{}',
  
  -- Audit Fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size < 104857600), -- 100MB limit
  CONSTRAINT valid_version CHECK (version > 0),
  CONSTRAINT valid_virus_scan_status CHECK (
    virus_scan_status IN ('pending', 'clean', 'infected', 'error')
  )
);

-- Indexes
CREATE INDEX idx_documents_application_id ON public.documents(application_id);
CREATE INDEX idx_documents_uploaded_by ON public.documents(uploaded_by);
CREATE INDEX idx_documents_type ON public.documents(document_type);
CREATE INDEX idx_documents_verified ON public.documents(is_verified);
CREATE INDEX idx_documents_current_version ON public.documents(is_current_version);
CREATE INDEX idx_documents_created_at ON public.documents(created_at);
CREATE INDEX idx_documents_virus_scan ON public.documents(virus_scan_status);

-- Full-text search index for OCR text
CREATE INDEX idx_documents_ocr_text ON public.documents USING GIN(to_tsvector('english', ocr_text));

-- Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view documents for accessible applications" ON public.documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE id = application_id AND (
        user_id = auth.uid() OR 
        officer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('supervisor', 'admin')
        )
      )
    )
  );

CREATE POLICY "Users can upload documents for their applications" ON public.documents
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE id = application_id AND user_id = auth.uid()
    )
  );
```

#### Communication System Tables
```sql
-- Message threads for communication
CREATE TABLE public.message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  participants UUID[] NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES public.profiles(id)
);

-- Individual messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  thread_id UUID NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  
  -- Message Content
  message_type message_type_enum DEFAULT 'user_message',
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE, -- Internal officer notes
  
  -- Attachments
  document_ids UUID[] DEFAULT '{}',
  
  -- Status
  read_by JSONB DEFAULT '{}', -- Track who has read the message
  delivered_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Audit Fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_message_threads_application ON public.message_threads(application_id);
CREATE INDEX idx_message_threads_participants ON public.message_threads USING GIN(participants);
CREATE INDEX idx_messages_thread ON public.messages(thread_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Row Level Security
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message threads
CREATE POLICY "Users can view threads for accessible applications" ON public.message_threads
  FOR SELECT USING (
    auth.uid() = ANY(participants) OR
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE id = application_id AND (
        user_id = auth.uid() OR 
        officer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('supervisor', 'admin')
        )
      )
    )
  );

-- RLS Policies for messages  
CREATE POLICY "Users can view messages in accessible threads" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.message_threads 
      WHERE id = thread_id AND (
        auth.uid() = ANY(participants) OR
        created_by = auth.uid()
      )
    ) AND
    (is_internal = FALSE OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('officer', 'supervisor', 'admin')
    ))
  );

CREATE POLICY "Users can send messages in accessible threads" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.message_threads 
      WHERE id = thread_id AND auth.uid() = ANY(participants)
    )
  );
```

#### Audit Trail Table
```sql
-- Comprehensive audit logging
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What was changed
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action audit_action_enum NOT NULL,
  
  -- Change details
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[],
  
  -- Who and when
  user_id UUID REFERENCES public.profiles(id),
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  
  -- Context
  application_id UUID REFERENCES public.applications(id),
  reason TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamp
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_action_context CHECK (
    (action IN ('LOGIN', 'LOGOUT') AND table_name = 'auth') OR
    (action NOT IN ('LOGIN', 'LOGOUT') AND table_name != 'auth')
  )
);

-- Indexes for audit queries
CREATE INDEX idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_application_id ON public.audit_logs(application_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);

-- Row Level Security  
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Only admins and supervisors can view audit logs
CREATE POLICY "Admins and supervisors can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('supervisor', 'admin')
    )
  );
```

---

## Database Functions and Triggers

### Automated Timestamp Updates
```sql
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

### Audit Trail Triggers
```sql
-- Function to create audit trail entries
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  old_data JSONB;
  new_data JSONB;
  changed_fields TEXT[];
  audit_action audit_action_enum;
BEGIN
  -- Determine action type
  IF TG_OP = 'DELETE' THEN
    audit_action := 'DELETE';
    old_data := to_jsonb(OLD);
    new_data := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    audit_action := 'UPDATE';
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
    
    -- Find changed fields
    SELECT array_agg(key) INTO changed_fields
    FROM jsonb_each(old_data) o
    FULL OUTER JOIN jsonb_each(new_data) n ON o.key = n.key
    WHERE o.value IS DISTINCT FROM n.value;
    
  ELSIF TG_OP = 'INSERT' THEN
    audit_action := 'INSERT';
    old_data := NULL;
    new_data := to_jsonb(NEW);
  END IF;

  -- Insert audit log
  INSERT INTO public.audit_logs (
    table_name,
    record_id,
    action,
    old_values,
    new_values,
    changed_fields,
    user_id,
    timestamp
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    audit_action,
    old_data,
    new_data,
    changed_fields,
    auth.uid(),
    NOW()
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_profiles_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

CREATE TRIGGER audit_applications_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

CREATE TRIGGER audit_documents_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();
```

### Application Status Management
```sql
-- Function to handle application status changes
CREATE OR REPLACE FUNCTION public.handle_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Update timestamps based on status
  CASE NEW.status
    WHEN 'submitted' THEN
      IF OLD.status = 'draft' THEN
        NEW.submitted_at := NOW();
      END IF;
    WHEN 'under_review' THEN
      IF NEW.review_started_at IS NULL THEN
        NEW.review_started_at := NOW();
      END IF;
    WHEN 'approved', 'rejected' THEN
      IF NEW.decision_date IS NULL THEN
        NEW.decision_date := NOW();
      END IF;
    ELSE
      -- No special handling for other statuses
  END CASE;

  -- Update version number on significant changes
  IF OLD.form_data IS DISTINCT FROM NEW.form_data OR
     OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.version := OLD.version + 1;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_application_status_change
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_application_status_change();
```

### Notification Triggers
```sql
-- Function to send notifications on status changes
CREATE OR REPLACE FUNCTION public.notify_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger for status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Insert a system message
    INSERT INTO public.messages (
      thread_id,
      sender_id,
      message_type,
      content
    ) 
    SELECT 
      mt.id,
      NEW.officer_id,
      'status_update',
      'Application status changed from ' || OLD.status || ' to ' || NEW.status
    FROM public.message_threads mt
    WHERE mt.application_id = NEW.id
    LIMIT 1;
    
    -- TODO: Trigger email/SMS notification via edge function
    PERFORM pg_notify('status_change', json_build_object(
      'application_id', NEW.id,
      'user_id', NEW.user_id,
      'old_status', OLD.status,
      'new_status', NEW.status
    )::text);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER notify_application_status_change
  AFTER UPDATE ON public.applications
  FOR each ROW EXECUTE FUNCTION public.notify_application_status_change();
```

---

## Storage Configuration

### Storage Buckets
```sql
-- Create storage buckets for different file types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES 
  (
    'application-documents', 
    'application-documents', 
    false, 
    104857600, -- 100MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']::text[]
  ),
  (
    'user-avatars', 
    'user-avatars', 
    true, 
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
  ),
  (
    'system-assets', 
    'system-assets', 
    true, 
    52428800, -- 50MB limit
    NULL -- Allow all file types for system assets
  );
```

### Storage Security Policies
```sql
-- Application documents (private)
CREATE POLICY "Users can view documents for their applications" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'application-documents' AND (
      -- Users can access their own documents
      auth.uid()::text = (storage.foldername(name))[1] OR
      -- Officers can access documents for their assigned cases
      EXISTS (
        SELECT 1 FROM public.applications a
        JOIN public.documents d ON d.application_id = a.id
        WHERE d.storage_path = name
        AND (a.officer_id = auth.uid() OR a.user_id = auth.uid())
      ) OR
      -- Supervisors and admins can access all documents
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('supervisor', 'admin')
      )
    )
  );

CREATE POLICY "Users can upload documents for their applications" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'application-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'application-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'application-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- User avatars (public read, restricted write)
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- System assets (public read, admin write)
CREATE POLICY "Anyone can view system assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'system-assets');

CREATE POLICY "Admins can manage system assets" ON storage.objects
  FOR ALL USING (
    bucket_id = 'system-assets' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Edge Functions

### Function Configuration
```toml
# supabase/config.toml
project_id = "lnkmarduszgtybwlslrg"

[functions.process-document]
verify_jwt = true

[functions.sync-dms]
verify_jwt = true

[functions.send-notification]
verify_jwt = false

[functions.generate-report]
verify_jwt = true

[functions.virus-scan]
verify_jwt = true
```

### Document Processing Function
```typescript
// supabase/functions/process-document/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentProcessRequest {
  documentId: string;
  processType: 'ocr' | 'virus_scan' | 'metadata_extraction' | 'validation';
  options?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { documentId, processType, options = {} }: DocumentProcessRequest = await req.json();

    console.log(`Processing document ${documentId} with type ${processType}`);

    // Get document details
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      throw new Error(`Document not found: ${docError?.message}`);
    }

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('application-documents')
      .download(document.storage_path);

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    let result: Record<string, any> = {};

    switch (processType) {
      case 'ocr':
        result = await performOCR(fileData, options);
        break;
      case 'virus_scan':
        result = await performVirusScan(fileData, options);
        break;
      case 'metadata_extraction':
        result = await extractMetadata(fileData, document.mime_type, options);
        break;
      case 'validation':
        result = await validateDocument(fileData, document.document_type, options);
        break;
      default:
        throw new Error(`Unknown process type: ${processType}`);
    }

    // Update document with processing results
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        [`${processType}_result`]: result,
        [`${processType}_processed_at`]: new Date().toISOString(),
        ...(processType === 'ocr' && { ocr_text: result.text }),
        ...(processType === 'virus_scan' && { 
          virus_scan_status: result.clean ? 'clean' : 'infected',
          virus_scan_result: result 
        }),
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId);

    if (updateError) {
      throw new Error(`Failed to update document: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        documentId, 
        processType, 
        result 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Document processing error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});

// Helper functions for different processing types
async function performOCR(fileData: Blob, options: any) {
  // Implementation for OCR processing
  // This would integrate with an OCR service like Tesseract or cloud OCR
  console.log('Performing OCR processing...');
  
  // Placeholder implementation
  return {
    text: "Extracted text would go here",
    confidence: 0.95,
    language: 'en',
    processing_time: Date.now()
  };
}

async function performVirusScan(fileData: Blob, options: any) {
  // Implementation for virus scanning
  // This would integrate with antivirus services
  console.log('Performing virus scan...');
  
  // Placeholder implementation
  return {
    clean: true,
    threats_found: [],
    scan_engine: 'ClamAV',
    scan_time: Date.now()
  };
}

async function extractMetadata(fileData: Blob, mimeType: string, options: any) {
  // Implementation for metadata extraction
  console.log('Extracting metadata...');
  
  // Placeholder implementation
  return {
    file_size: fileData.size,
    mime_type: mimeType,
    creation_date: new Date().toISOString(),
    properties: {}
  };
}

async function validateDocument(fileData: Blob, documentType: string, options: any) {
  // Implementation for document validation
  console.log('Validating document...');
  
  // Placeholder implementation
  return {
    valid: true,
    validation_errors: [],
    document_type: documentType,
    validation_time: Date.now()
  };
}
```

### DMS Synchronization Function
```typescript
// supabase/functions/sync-dms/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DMSSyncRequest {
  action: 'push' | 'pull' | 'sync';
  documentIds?: string[];
  since?: string; // ISO timestamp for incremental sync
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, documentIds, since }: DMSSyncRequest = await req.json();

    console.log(`DMS sync action: ${action}`);

    let result: Record<string, any> = {};

    switch (action) {
      case 'push':
        result = await pushToExternalDMS(supabase, documentIds);
        break;
      case 'pull':
        result = await pullFromExternalDMS(supabase, since);
        break;
      case 'sync':
        const pushResult = await pushToExternalDMS(supabase, documentIds);
        const pullResult = await pullFromExternalDMS(supabase, since);
        result = { push: pushResult, pull: pullResult };
        break;
      default:
        throw new Error(`Unknown sync action: ${action}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        action, 
        result,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('DMS sync error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});

async function pushToExternalDMS(supabase: any, documentIds?: string[]) {
  // Implementation for pushing documents to external DMS
  console.log('Pushing to external DMS...');
  
  // Get documents to sync
  let query = supabase.from('documents').select('*');
  
  if (documentIds?.length) {
    query = query.in('id', documentIds);
  } else {
    // Get unsynced documents
    query = query.is('external_dms_id', null);
  }
  
  const { data: documents, error } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }

  const syncResults = [];
  
  for (const doc of documents) {
    try {
      // Placeholder for external DMS API call
      const externalId = await uploadToExternalDMS(doc);
      
      // Update document with external ID
      await supabase
        .from('documents')
        .update({ 
          external_dms_id: externalId,
          synced_at: new Date().toISOString()
        })
        .eq('id', doc.id);
      
      syncResults.push({ 
        documentId: doc.id, 
        externalId, 
        status: 'success' 
      });
      
    } catch (error) {
      syncResults.push({ 
        documentId: doc.id, 
        status: 'error', 
        error: error.message 
      });
    }
  }
  
  return {
    processed: documents.length,
    successful: syncResults.filter(r => r.status === 'success').length,
    failed: syncResults.filter(r => r.status === 'error').length,
    results: syncResults
  };
}

async function pullFromExternalDMS(supabase: any, since?: string) {
  // Implementation for pulling documents from external DMS
  console.log('Pulling from external DMS...');
  
  // Placeholder for external DMS API call to get updated documents
  const externalDocuments = await fetchFromExternalDMS(since);
  
  const syncResults = [];
  
  for (const extDoc of externalDocuments) {
    try {
      // Find existing document by external ID
      const { data: existingDoc } = await supabase
        .from('documents')
        .select('*')
        .eq('external_dms_id', extDoc.id)
        .single();
      
      if (existingDoc) {
        // Update existing document
        await supabase
          .from('documents')
          .update({
            metadata: { ...existingDoc.metadata, ...extDoc.metadata },
            updated_at: new Date().toISOString(),
            synced_at: new Date().toISOString()
          })
          .eq('id', existingDoc.id);
        
        syncResults.push({ 
          externalId: extDoc.id, 
          action: 'updated', 
          status: 'success' 
        });
      } else {
        // Create new document record
        const { data: newDoc } = await supabase
          .from('documents')
          .insert({
            external_dms_id: extDoc.id,
            file_name: extDoc.filename,
            file_size: extDoc.size,
            file_type: extDoc.type,
            metadata: extDoc.metadata,
            created_at: extDoc.created_at,
            synced_at: new Date().toISOString()
          })
          .select()
          .single();
        
        syncResults.push({ 
          externalId: extDoc.id, 
          documentId: newDoc.id,
          action: 'created', 
          status: 'success' 
        });
      }
      
    } catch (error) {
      syncResults.push({ 
        externalId: extDoc.id, 
        action: 'error', 
        error: error.message 
      });
    }
  }
  
  return {
    processed: externalDocuments.length,
    successful: syncResults.filter(r => r.status === 'success').length,
    failed: syncResults.filter(r => r.status === 'error').length,
    results: syncResults
  };
}

// Placeholder functions for external DMS integration
async function uploadToExternalDMS(document: any): Promise<string> {
  // Implementation would make actual API calls to external DMS
  console.log(`Uploading document ${document.id} to external DMS`);
  return `ext_${Date.now()}_${document.id.substring(0, 8)}`;
}

async function fetchFromExternalDMS(since?: string): Promise<any[]> {
  // Implementation would make actual API calls to external DMS
  console.log(`Fetching documents from external DMS since ${since}`);
  return []; // Placeholder return
}
```

### Notification Service Function
```typescript
// supabase/functions/send-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: 'email' | 'sms' | 'push';
  recipients: string[]; // User IDs or email addresses/phone numbers
  template: string;
  data: Record<string, any>;
  scheduled_for?: string; // ISO timestamp for scheduled notifications
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { type, recipients, template, data, scheduled_for }: NotificationRequest = await req.json();

    console.log(`Sending ${type} notification to ${recipients.length} recipients`);

    const results = [];

    for (const recipient of recipients) {
      try {
        let result;
        
        switch (type) {
          case 'email':
            result = await sendEmailNotification(supabase, recipient, template, data);
            break;
          case 'sms':
            result = await sendSMSNotification(recipient, template, data);
            break;
          case 'push':
            result = await sendPushNotification(recipient, template, data);
            break;
          default:
            throw new Error(`Unknown notification type: ${type}`);
        }

        results.push({
          recipient,
          status: 'sent',
          result
        });

      } catch (error) {
        results.push({
          recipient,
          status: 'failed',
          error: error.message
        });
      }
    }

    // Log notification attempt
    await supabase.from('notification_logs').insert({
      type,
      template,
      recipients_count: recipients.length,
      successful_count: results.filter(r => r.status === 'sent').length,
      failed_count: results.filter(r => r.status === 'failed').length,
      data,
      scheduled_for,
      sent_at: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        type,
        template,
        results,
        summary: {
          total: recipients.length,
          sent: results.filter(r => r.status === 'sent').length,
          failed: results.filter(r => r.status === 'failed').length
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Notification service error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});

async function sendEmailNotification(supabase: any, recipient: string, template: string, data: any) {
  // Get recipient details if recipient is a user ID
  let emailAddress = recipient;
  
  if (recipient.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', recipient)
      .single();
    
    const { data: user } = await supabase.auth.admin.getUserById(recipient);
    emailAddress = user.user?.email;
    
    if (profile) {
      data.first_name = profile.first_name;
      data.last_name = profile.last_name;
    }
  }

  // Get email template
  const emailTemplate = getEmailTemplate(template, data);
  
  // Send email using your preferred email service
  // This is a placeholder - integrate with your email service provider
  console.log(`Sending email to ${emailAddress} with template ${template}`);
  
  return {
    email: emailAddress,
    template,
    message_id: `email_${Date.now()}`,
    sent_at: new Date().toISOString()
  };
}

async function sendSMSNotification(recipient: string, template: string, data: any) {
  // Send SMS using your preferred SMS gateway
  console.log(`Sending SMS to ${recipient} with template ${template}`);
  
  return {
    phone: recipient,
    template,
    message_id: `sms_${Date.now()}`,
    sent_at: new Date().toISOString()
  };
}

async function sendPushNotification(recipient: string, template: string, data: any) {
  // Send push notification
  console.log(`Sending push notification to ${recipient} with template ${template}`);
  
  return {
    user_id: recipient,
    template,
    message_id: `push_${Date.now()}`,
    sent_at: new Date().toISOString()
  };
}

function getEmailTemplate(template: string, data: any): { subject: string; body: string } {
  const templates: Record<string, (data: any) => { subject: string; body: string }> = {
    'application_submitted': (data) => ({
      subject: `Application Submitted - ${data.application_number}`,
      body: `Dear ${data.first_name},\n\nYour immigration application has been successfully submitted.\n\nApplication Number: ${data.application_number}\nApplication Type: ${data.application_type}\n\nWe will review your application and contact you if additional information is needed.\n\nBest regards,\nVZ Portal Team`
    }),
    'status_update': (data) => ({
      subject: `Application Status Update - ${data.application_number}`,
      body: `Dear ${data.first_name},\n\nYour application status has been updated.\n\nApplication Number: ${data.application_number}\nNew Status: ${data.new_status}\n\nPlease log into your VZ Portal account for more details.\n\nBest regards,\nVZ Portal Team`
    }),
    'document_request': (data) => ({
      subject: `Additional Documents Required - ${data.application_number}`,
      body: `Dear ${data.first_name},\n\nWe need additional documents for your application.\n\nApplication Number: ${data.application_number}\nRequired Documents: ${data.required_documents.join(', ')}\n\nPlease upload the required documents through your VZ Portal account.\n\nBest regards,\nVZ Portal Team`
    })
  };

  return templates[template]?.(data) || {
    subject: 'VZ Portal Notification',
    body: 'You have a new notification from VZ Portal.'
  };
}
```

---

## Performance Optimization

### Database Optimization
1. **Indexing Strategy**: Strategic indexes on frequently queried columns
2. **Query Optimization**: Use EXPLAIN ANALYZE to optimize slow queries
3. **Connection Pooling**: Supabase handles connection pooling automatically
4. **Partitioning**: Consider table partitioning for large audit logs

### Caching Strategy
1. **Client-Side Caching**: React Query for API response caching
2. **Database Caching**: PostgreSQL query plan caching
3. **CDN Caching**: Static asset caching via CDN
4. **Application Caching**: Cache frequently accessed data in memory

### Monitoring and Analytics
1. **Database Performance**: Monitor query performance and connection usage
2. **API Performance**: Track API response times and error rates
3. **Storage Usage**: Monitor storage consumption and access patterns
4. **User Analytics**: Track user behavior and application usage

---

## Security Implementation

### Authentication Security
1. **JWT Tokens**: Secure token generation and validation
2. **Session Management**: Automatic token refresh and secure storage
3. **Password Security**: Strong password requirements and hashing
4. **Multi-Factor Authentication**: Optional 2FA for enhanced security

### Data Security
1. **Encryption at Rest**: All sensitive data encrypted in database
2. **Encryption in Transit**: HTTPS/TLS for all communications
3. **Row Level Security**: Granular access control at database level
4. **Audit Logging**: Comprehensive audit trail for compliance

### API Security
1. **Rate Limiting**: Prevent abuse with request throttling
2. **Input Validation**: Comprehensive validation on all inputs
3. **CORS Configuration**: Restricted cross-origin requests
4. **SQL Injection Prevention**: Parameterized queries and prepared statements

---

## Backup and Recovery

### Backup Strategy
1. **Automated Backups**: Daily automated database backups
2. **Point-in-Time Recovery**: Ability to restore to specific timestamps
3. **Storage Backups**: Regular backups of uploaded files
4. **Configuration Backups**: Version control for database schema and configurations

### Disaster Recovery
1. **High Availability**: Multi-region deployment for redundancy
2. **Failover Procedures**: Automated failover to backup systems
3. **Data Replication**: Real-time replication to secondary databases
4. **Recovery Testing**: Regular testing of backup and recovery procedures

---

## Maintenance and Operations

### Database Maintenance
1. **Regular Vacuuming**: Automated database maintenance tasks
2. **Index Maintenance**: Regular index analysis and optimization
3. **Statistics Updates**: Keep database statistics current for optimal query planning
4. **Schema Migrations**: Version-controlled database schema changes

### Monitoring and Alerting
1. **Health Checks**: Regular application and database health monitoring
2. **Performance Metrics**: Track key performance indicators
3. **Error Monitoring**: Real-time error tracking and alerting
4. **Capacity Planning**: Monitor growth trends and plan for scaling

---

**Document Status**: In Development  
**Last Updated**: December 2024  
**Backend Version**: 1.0.0  
**Next Review**: Weekly during development phases