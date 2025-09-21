# Technical Architecture
## VZ Portal - Immigration Services Platform

### Architecture Overview
The VZ Portal is built using a modern, scalable architecture leveraging React, Vite, TypeScript, and Supabase to deliver a robust immigration services platform for the Dutch government.

---

## System Architecture

### High-Level Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                   │
├─────────────────────────────────────────────────────────────┤
│  React App (Vite + TypeScript)                             │
│  ├── UI Components (shadcn/ui + Evea Layout-1)            │
│  ├── State Management (React Query + Context)              │
│  ├── Routing (React Router)                                │
│  └── Authentication (Supabase Auth)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                    HTTPS/WebSocket
                              │
┌─────────────────────────────────────────────────────────────┐
│                 Supabase Backend Services                   │
├─────────────────────────────────────────────────────────────┤
│  Authentication & Authorization                             │
│  ├── User Management & Sessions                            │
│  ├── Role-Based Access Control (RBAC)                      │
│  └── Row Level Security (RLS)                              │
├─────────────────────────────────────────────────────────────┤
│  Database (PostgreSQL)                                     │
│  ├── Application Data                                      │
│  ├── Document Metadata                                     │
│  ├── User Profiles & Permissions                           │
│  └── Audit Logs & Communication History                    │
├─────────────────────────────────────────────────────────────┤
│  Storage                                                    │
│  ├── Document Files (Encrypted)                            │
│  ├── User Avatars                                          │
│  └── System Assets                                         │
├─────────────────────────────────────────────────────────────┤
│  Edge Functions                                             │
│  ├── Document Processing                                   │
│  ├── External API Integration                              │
│  ├── Notification Services                                 │
│  └── Data Synchronization                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                         API Calls
                              │
┌─────────────────────────────────────────────────────────────┐
│                 External Systems                            │
├─────────────────────────────────────────────────────────────┤
│  Government APIs                                            │
│  ├── DigiD Authentication                                  │
│  ├── BRP (Personal Records Database)                       │
│  └── Other Government Services                             │
├─────────────────────────────────────────────────────────────┤
│  Document Management System (DMS)                          │
│  ├── Legacy Document Storage                               │
│  ├── Document Synchronization                              │
│  └── Metadata Exchange                                     │
├─────────────────────────────────────────────────────────────┤
│  Third-Party Services                                       │
│  ├── Email Service (Transactional)                         │
│  ├── SMS Gateway                                           │
│  ├── Payment Processor                                     │
│  └── Virus Scanning Service                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components with Evea Layout-1 adaptation
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React (migrated from Iconify)

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── forms/          # Form-specific components
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   └── common/         # Shared components
├── pages/              # Route components
│   ├── auth/           # Authentication pages
│   ├── citizen/        # Citizen-facing pages
│   ├── officer/        # Officer dashboard and tools
│   └── admin/          # Administrative interfaces
├── hooks/              # Custom React hooks
├── contexts/           # React context providers
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
├── assets/             # Static assets (images, fonts, etc.)
└── integrations/       # External service integrations
    └── supabase/       # Supabase client configuration
```

### Component Architecture
```tsx
// Example component structure with government-specific patterns
interface ComponentProps {
  // Props definition with accessibility considerations
  'aria-label'?: string;
  className?: string;
  children?: React.ReactNode;
}

export const GovernmentComponent: React.FC<ComponentProps> = ({
  'aria-label': ariaLabel,
  className,
  children,
  ...props
}) => {
  // Component logic with error boundaries and accessibility
  return (
    <div 
      className={cn("government-component", className)}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </div>
  );
};
```

### State Management Strategy
```tsx
// Global state using React Context for authentication
interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

// Local server state using React Query
const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: () => supabase.from('applications').select('*'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

---

## Backend Architecture (Supabase)

### Database Design
**Project ID**: `lnkmarduszgtybwlslrg`

#### Core Tables Structure
```sql
-- Users and Authentication (managed by Supabase Auth)
-- Extended with profiles table for additional user data

-- User Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'citizen',
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  preferred_language language_code DEFAULT 'nl',
  notification_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Immigration Applications
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  application_type application_type_enum NOT NULL,
  status application_status_enum DEFAULT 'draft',
  priority priority_level DEFAULT 'normal',
  submitted_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  officer_id UUID REFERENCES public.profiles(id),
  form_data JSONB NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Management
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  document_type document_type_enum,
  version INTEGER DEFAULT 1,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES public.profiles(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communication System
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message_type message_type_enum DEFAULT 'user_message',
  subject TEXT,
  content TEXT NOT NULL,
  attachments UUID[] DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Trail
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action audit_action_enum NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES public.profiles(id),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);
```

#### Custom Types and Enums
```sql
-- User roles
CREATE TYPE user_role AS ENUM (
  'citizen',
  'officer', 
  'supervisor',
  'admin',
  'legal_representative'
);

-- Application types
CREATE TYPE application_type_enum AS ENUM (
  'residence_permit',
  'visa_application',
  'citizenship',
  'family_reunification',
  'work_permit',
  'student_visa',
  'asylum_request'
);

-- Application status
CREATE TYPE application_status_enum AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'additional_info_required',
  'approved',
  'rejected',
  'withdrawn',
  'on_hold'
);

-- Document types
CREATE TYPE document_type_enum AS ENUM (
  'passport',
  'birth_certificate',
  'marriage_certificate',
  'diploma',
  'employment_contract',
  'bank_statement',
  'medical_report',
  'police_clearance',
  'other'
);

-- Priority levels
CREATE TYPE priority_level AS ENUM (
  'low',
  'normal',
  'high',
  'urgent'
);

-- Language codes
CREATE TYPE language_code AS ENUM ('nl', 'en');

-- Message types
CREATE TYPE message_type_enum AS ENUM (
  'user_message',
  'system_notification',
  'status_update',
  'document_request',
  'appointment_reminder'
);

-- Audit actions
CREATE TYPE audit_action_enum AS ENUM (
  'INSERT',
  'UPDATE', 
  'DELETE',
  'LOGIN',
  'LOGOUT',
  'VIEW',
  'DOWNLOAD'
);
```

### Row Level Security (RLS) Policies
```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Applications: Citizens see their own, officers see assigned cases
CREATE POLICY "Citizens can view own applications" ON public.applications
  FOR SELECT USING (
    user_id = auth.uid() OR 
    officer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('supervisor', 'admin')
    )
  );

CREATE POLICY "Citizens can create applications" ON public.applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Documents: Access based on application access
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
```

### Storage Configuration
```sql
-- Create storage buckets for different document types
INSERT INTO storage.buckets (id, name, public) VALUES
  ('application-documents', 'application-documents', false),
  ('user-avatars', 'user-avatars', true),
  ('system-assets', 'system-assets', true);

-- Storage policies for document security
CREATE POLICY "Users can upload documents for their applications" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'application-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view documents for accessible applications" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'application-documents' AND (
      auth.uid()::text = (storage.foldername(name))[1] OR
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('officer', 'supervisor', 'admin')
      )
    )
  );
```

### Edge Functions Architecture
Located in `supabase/functions/`:

#### Document Processing Function
```typescript
// supabase/functions/process-document/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { documentId, processType } = await req.json();
    
    // Document processing logic
    // - OCR for text extraction
    // - Virus scanning
    // - Metadata extraction
    // - Format validation

    return new Response(
      JSON.stringify({ success: true, documentId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
```

#### DMS Synchronization Function
```typescript
// supabase/functions/sync-dms/index.ts
// Handles bi-directional synchronization with external Document Management System
```

#### Notification Service Function
```typescript
// supabase/functions/send-notification/index.ts
// Manages email, SMS, and in-app notifications
```

---

## Security Architecture

### Authentication & Authorization
1. **Multi-Factor Authentication**: Email/password with optional 2FA
2. **Role-Based Access Control**: Granular permissions based on user roles
3. **Session Management**: Secure JWT tokens with automatic refresh
4. **Password Security**: Strong password requirements and encryption

### Data Protection
1. **Encryption at Rest**: All sensitive data encrypted in database
2. **Encryption in Transit**: HTTPS/TLS for all communications
3. **Data Masking**: Sensitive information masked in logs and non-production environments
4. **Backup Security**: Encrypted backups with access controls

### API Security
1. **Rate Limiting**: Prevent abuse with request throttling
2. **Input Validation**: Comprehensive validation on all inputs
3. **SQL Injection Prevention**: Parameterized queries and ORM usage
4. **CORS Configuration**: Restricted cross-origin requests

### Compliance
1. **GDPR Compliance**: Data privacy and user rights implementation
2. **Audit Logging**: Comprehensive audit trail for all actions
3. **Data Retention**: Configurable data retention policies
4. **Right to be Forgotten**: User data deletion mechanisms

---

## Performance Architecture

### Frontend Optimization
1. **Code Splitting**: Route-based and component-based splitting
2. **Lazy Loading**: Deferred loading of non-critical components
3. **Image Optimization**: WebP format with fallbacks, responsive images
4. **Bundle Analysis**: Regular bundle size monitoring and optimization

### Backend Optimization
1. **Database Indexing**: Strategic indexes on frequently queried columns
2. **Connection Pooling**: Efficient database connection management
3. **Caching Strategy**: Query result caching with appropriate TTL
4. **CDN Integration**: Static asset delivery via CDN

### Monitoring & Analytics
1. **Core Web Vitals**: Monitoring LCP, FID, CLS metrics
2. **Database Performance**: Query performance monitoring
3. **Error Tracking**: Real-time error reporting and alerting
4. **User Analytics**: Privacy-compliant usage analytics

---

## Scalability Architecture

### Horizontal Scaling
1. **Stateless Design**: Application designed for horizontal scaling
2. **Load Balancing**: Distributed load across multiple instances
3. **Database Scaling**: Read replicas and connection pooling
4. **Storage Scaling**: Distributed file storage with CDN

### Vertical Scaling
1. **Resource Monitoring**: CPU, memory, and disk usage tracking
2. **Auto-scaling**: Automatic resource allocation based on demand
3. **Performance Tuning**: Regular optimization of database queries and application code
4. **Capacity Planning**: Proactive scaling based on usage patterns

---

## Integration Architecture

### External System Integration
1. **API Gateway**: Centralized API management and security
2. **Service Mesh**: Microservice communication and monitoring
3. **Event-Driven Architecture**: Asynchronous processing with message queues
4. **Circuit Breakers**: Fault tolerance for external service calls

### Data Integration
1. **ETL Processes**: Data extraction, transformation, and loading
2. **Real-time Sync**: Live data synchronization with external systems
3. **Data Validation**: Comprehensive data quality checks
4. **Conflict Resolution**: Automated conflict resolution for data synchronization

---

## Deployment Architecture

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Supabase Local**: Local Supabase instance for development
- **Database Migrations**: Version-controlled database schema changes
- **Environment Configuration**: Separate configs for development, staging, production

### Production Environment
- **Lovable Platform**: Hosted on Lovable with automatic deployments
- **Custom Domain**: Government domain with SSL certificate
- **Environment Variables**: Secure environment variable management
- **Health Checks**: Application and database health monitoring

### CI/CD Pipeline
1. **Code Quality**: Automated linting, type checking, and testing
2. **Security Scanning**: Vulnerability scanning for dependencies
3. **Build Process**: Optimized production builds with asset optimization
4. **Deployment Strategy**: Blue-green deployments with rollback capabilities

---

## Disaster Recovery & Business Continuity

### Backup Strategy
1. **Database Backups**: Daily automated backups with point-in-time recovery
2. **File Storage Backups**: Distributed backup of uploaded documents
3. **Configuration Backups**: Version-controlled infrastructure configuration
4. **Testing**: Regular backup restoration testing

### Disaster Recovery Plan
1. **RTO/RPO Targets**: Recovery Time Objective < 4 hours, Recovery Point Objective < 1 hour
2. **Failover Procedures**: Automated failover to backup systems
3. **Data Replication**: Real-time data replication to secondary systems
4. **Communication Plan**: Stakeholder notification procedures during incidents

---

## Future Architecture Considerations

### Microservices Migration
- **Service Decomposition**: Gradual migration to microservices architecture
- **API Gateway**: Centralized API management and routing
- **Service Discovery**: Dynamic service registration and discovery
- **Data Consistency**: Eventual consistency patterns for distributed data

### AI/ML Integration
- **Document Processing**: AI-powered document analysis and classification
- **Predictive Analytics**: Processing time prediction and workload optimization
- **Chatbot Integration**: AI-powered customer support
- **Fraud Detection**: ML-based fraud detection for applications

### Emerging Technologies
- **Progressive Web App**: PWA features for mobile app-like experience
- **WebRTC**: Real-time video consultations
- **Blockchain**: Document verification and audit trail
- **IoT Integration**: Integration with IoT devices for document capture

---

**Document Status**: In Development  
**Last Updated**: December 2024  
**Architecture Version**: 1.0.0  
**Next Review**: Monthly during development, quarterly post-launch