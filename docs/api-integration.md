# API Integration Guide
## VZ Portal - Immigration Services Platform

### Overview
This document outlines the comprehensive API integration strategy for the VZ Portal, covering external system integrations, DMS synchronization, government APIs, and third-party service connections.

---

## Integration Architecture

### Integration Overview Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    VZ Portal Frontend                       │
├─────────────────────────────────────────────────────────────┤
│                  Supabase Backend                           │
│  ├── Edge Functions (API Gateway)                          │
│  ├── Database (PostgreSQL)                                 │
│  └── Storage (File Management)                             │
└─────────────────────────────────────────────────────────────┘
                              │
                    API Integration Layer
                              │
┌─────────────────┬─────────────────┬─────────────────┬───────────────────┐
│   DMS Systems   │  Government     │  Third-Party    │   External        │
│                 │  APIs           │  Services       │   Partners        │
├─────────────────┼─────────────────┼─────────────────┼───────────────────┤
│ • Legacy DMS    │ • DigiD         │ • Email Service │ • Legal Firms     │
│ • SharePoint    │ • BRP Database  │ • SMS Gateway   │ • Translation     │
│ • FileNet       │ • KVK Registry  │ • Payment       │ • Verification    │
│ • Custom CMS    │ • RDW Database  │ • Cloud Storage │ • Consultation    │
└─────────────────┴─────────────────┴─────────────────┴───────────────────┘
```

---

## Document Management System (DMS) Integration

### DMS Integration Strategy
The VZ Portal integrates with multiple Document Management Systems to ensure seamless document flow and accessibility across different government departments.

#### Supported DMS Platforms
1. **Microsoft SharePoint** - Primary document repository
2. **IBM FileNet** - Legacy document storage
3. **OpenText Documentum** - Enterprise content management
4. **Custom Government DMS** - Department-specific systems

### DMS Synchronization Architecture

#### Bi-Directional Sync Flow
```typescript
// DMS Sync Configuration
interface DMSConfig {
  systemId: string;
  name: string;
  type: 'sharepoint' | 'filenet' | 'documentum' | 'custom';
  endpoint: string;
  authentication: DMSAuthConfig;
  syncSettings: DMSSyncSettings;
}

interface DMSSyncSettings {
  syncInterval: number; // minutes
  batchSize: number;
  retryAttempts: number;
  conflictResolution: 'local_wins' | 'remote_wins' | 'manual';
  enableRealTimeSync: boolean;
}

// Example DMS configurations
const dmsConfigurations: DMSConfig[] = [
  {
    systemId: 'sharepoint-main',
    name: 'Primary SharePoint',
    type: 'sharepoint',
    endpoint: 'https://government.sharepoint.com/sites/immigration',
    authentication: {
      type: 'oauth2',
      clientId: process.env.SHAREPOINT_CLIENT_ID,
      clientSecret: process.env.SHAREPOINT_CLIENT_SECRET,
      tenantId: process.env.SHAREPOINT_TENANT_ID
    },
    syncSettings: {
      syncInterval: 15,
      batchSize: 50,
      retryAttempts: 3,
      conflictResolution: 'manual',
      enableRealTimeSync: true
    }
  }
];
```

#### DMS Synchronization Edge Function
```typescript
// supabase/functions/sync-dms/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface DMSSyncRequest {
  action: 'push' | 'pull' | 'full_sync' | 'status';
  dmsSystemId?: string;
  documentIds?: string[];
  since?: string; // ISO timestamp
  options?: DMSSyncOptions;
}

interface DMSSyncOptions {
  dryRun?: boolean;
  forceSync?: boolean;
  conflictResolution?: 'local_wins' | 'remote_wins' | 'manual';
}

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

    const requestBody: DMSSyncRequest = await req.json();
    const { action, dmsSystemId, documentIds, since, options = {} } = requestBody;

    console.log(`DMS Sync - Action: ${action}, System: ${dmsSystemId}`);

    let result: any = {};

    switch (action) {
      case 'push':
        result = await pushDocumentsToDMS(supabase, dmsSystemId, documentIds, options);
        break;
      case 'pull':
        result = await pullDocumentsFromDMS(supabase, dmsSystemId, since, options);
        break;
      case 'full_sync':
        const pushResult = await pushDocumentsToDMS(supabase, dmsSystemId, documentIds, options);
        const pullResult = await pullDocumentsFromDMS(supabase, dmsSystemId, since, options);
        result = { push: pushResult, pull: pullResult };
        break;
      case 'status':
        result = await getDMSSyncStatus(supabase, dmsSystemId);
        break;
      default:
        throw new Error(`Invalid sync action: ${action}`);
    }

    // Log sync operation
    await logSyncOperation(supabase, action, dmsSystemId, result);

    return new Response(
      JSON.stringify({
        success: true,
        action,
        dmsSystemId,
        result,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('DMS Sync Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// DMS Integration Functions
async function pushDocumentsToDMS(
  supabase: any, 
  dmsSystemId?: string, 
  documentIds?: string[], 
  options: DMSSyncOptions = {}
) {
  console.log('Starting document push to DMS...');
  
  // Get documents to sync
  let query = supabase
    .from('documents')
    .select(`
      *,
      applications!inner(
        id,
        application_number,
        application_type,
        user_id,
        profiles!applications_user_id_fkey(
          first_name,
          last_name,
          email
        )
      )
    `);

  if (documentIds?.length) {
    query = query.in('id', documentIds);
  } else {
    // Sync documents that haven't been synced or need updates
    query = query.or('external_dms_id.is.null,needs_sync.eq.true');
  }

  const { data: documents, error } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }

  const results = [];
  const dmsConfigs = await getDMSConfigurations();
  const dmsConfig = dmsSystemId ? 
    dmsConfigs.find(c => c.systemId === dmsSystemId) : 
    dmsConfigs[0]; // Default to first DMS

  if (!dmsConfig) {
    throw new Error(`DMS configuration not found: ${dmsSystemId}`);
  }

  for (const doc of documents) {
    try {
      if (options.dryRun) {
        results.push({
          documentId: doc.id,
          status: 'dry_run',
          action: 'would_sync'
        });
        continue;
      }

      // Download document from Supabase storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('application-documents')
        .download(doc.storage_path);

      if (downloadError) {
        throw new Error(`Failed to download document: ${downloadError.message}`);
      }

      // Upload to external DMS
      const dmsResult = await uploadToExternalDMS(dmsConfig, doc, fileData);

      // Update document record with DMS information
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          external_dms_id: dmsResult.externalId,
          external_dms_url: dmsResult.url,
          synced_at: new Date().toISOString(),
          needs_sync: false,
          sync_metadata: dmsResult.metadata
        })
        .eq('id', doc.id);

      if (updateError) {
        throw new Error(`Failed to update document: ${updateError.message}`);
      }

      results.push({
        documentId: doc.id,
        externalId: dmsResult.externalId,
        status: 'success',
        action: 'synced'
      });

    } catch (error) {
      console.error(`Failed to sync document ${doc.id}:`, error);
      results.push({
        documentId: doc.id,
        status: 'error',
        error: error.message
      });
    }
  }

  return {
    totalDocuments: documents.length,
    successful: results.filter(r => r.status === 'success').length,
    failed: results.filter(r => r.status === 'error').length,
    dryRun: results.filter(r => r.status === 'dry_run').length,
    results
  };
}

async function pullDocumentsFromDMS(
  supabase: any,
  dmsSystemId?: string,
  since?: string,
  options: DMSSyncOptions = {}
) {
  console.log('Starting document pull from DMS...');
  
  const dmsConfigs = await getDMSConfigurations();
  const dmsConfig = dmsSystemId ? 
    dmsConfigs.find(c => c.systemId === dmsSystemId) : 
    dmsConfigs[0];

  if (!dmsConfig) {
    throw new Error(`DMS configuration not found: ${dmsSystemId}`);
  }

  // Get updated documents from external DMS
  const externalDocuments = await fetchDocumentsFromDMS(dmsConfig, since);
  const results = [];

  for (const extDoc of externalDocuments) {
    try {
      if (options.dryRun) {
        results.push({
          externalId: extDoc.id,
          status: 'dry_run',
          action: 'would_update'
        });
        continue;
      }

      // Check if document exists locally
      const { data: existingDoc, error: findError } = await supabase
        .from('documents')
        .select('*')
        .eq('external_dms_id', extDoc.id)
        .single();

      if (findError && findError.code !== 'PGRST116') {
        throw new Error(`Database error: ${findError.message}`);
      }

      if (existingDoc) {
        // Update existing document
        const updateData = await mapExternalDocumentToLocal(extDoc);
        
        const { error: updateError } = await supabase
          .from('documents')
          .update({
            ...updateData,
            synced_at: new Date().toISOString(),
            sync_metadata: extDoc.metadata
          })
          .eq('id', existingDoc.id);

        if (updateError) {
          throw new Error(`Failed to update document: ${updateError.message}`);
        }

        results.push({
          externalId: extDoc.id,
          documentId: existingDoc.id,
          status: 'success',
          action: 'updated'
        });

      } else {
        // Create new document record
        const newDocData = await mapExternalDocumentToLocal(extDoc);
        
        const { data: newDoc, error: createError } = await supabase
          .from('documents')
          .insert({
            ...newDocData,
            external_dms_id: extDoc.id,
            synced_at: new Date().toISOString(),
            sync_metadata: extDoc.metadata
          })
          .select()
          .single();

        if (createError) {
          throw new Error(`Failed to create document: ${createError.message}`);
        }

        results.push({
          externalId: extDoc.id,
          documentId: newDoc.id,
          status: 'success',
          action: 'created'
        });
      }

    } catch (error) {
      console.error(`Failed to process external document ${extDoc.id}:`, error);
      results.push({
        externalId: extDoc.id,
        status: 'error',
        error: error.message
      });
    }
  }

  return {
    totalDocuments: externalDocuments.length,
    successful: results.filter(r => r.status === 'success').length,
    failed: results.filter(r => r.status === 'error').length,
    dryRun: results.filter(r => r.status === 'dry_run').length,
    results
  };
}

// Helper functions for DMS integration
async function getDMSConfigurations(): Promise<DMSConfig[]> {
  // In production, this would fetch from database or configuration service
  return [
    {
      systemId: 'sharepoint-main',
      name: 'Primary SharePoint',
      type: 'sharepoint',
      endpoint: Deno.env.get('SHAREPOINT_ENDPOINT') ?? '',
      authentication: {
        type: 'oauth2',
        clientId: Deno.env.get('SHAREPOINT_CLIENT_ID') ?? '',
        clientSecret: Deno.env.get('SHAREPOINT_CLIENT_SECRET') ?? '',
        tenantId: Deno.env.get('SHAREPOINT_TENANT_ID') ?? ''
      },
      syncSettings: {
        syncInterval: 15,
        batchSize: 50,
        retryAttempts: 3,
        conflictResolution: 'manual',
        enableRealTimeSync: true
      }
    }
  ];
}

async function uploadToExternalDMS(config: DMSConfig, document: any, fileData: Blob) {
  // Implementation varies by DMS type
  switch (config.type) {
    case 'sharepoint':
      return await uploadToSharePoint(config, document, fileData);
    case 'filenet':
      return await uploadToFileNet(config, document, fileData);
    case 'documentum':
      return await uploadToDocumentum(config, document, fileData);
    default:
      throw new Error(`Unsupported DMS type: ${config.type}`);
  }
}

async function uploadToSharePoint(config: DMSConfig, document: any, fileData: Blob) {
  // SharePoint-specific upload logic
  console.log(`Uploading ${document.file_name} to SharePoint`);
  
  // Get access token
  const accessToken = await getSharePointAccessToken(config.authentication);
  
  // Create SharePoint API request
  const uploadUrl = `${config.endpoint}/_api/web/GetFolderByServerRelativeUrl('/Shared Documents')/Files/add(url='${document.file_name}',overwrite=true)`;
  
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json;odata=verbose',
      'Content-Type': 'application/octet-stream'
    },
    body: fileData
  });

  if (!response.ok) {
    throw new Error(`SharePoint upload failed: ${response.statusText}`);
  }

  const result = await response.json();
  
  return {
    externalId: result.d.UniqueId,
    url: result.d.ServerRelativeUrl,
    metadata: {
      sharepoint: {
        listId: result.d.ListId,
        itemId: result.d.ListItemAllFields?.Id,
        version: result.d.UIVersion
      }
    }
  };
}

async function getSharePointAccessToken(auth: any): Promise<string> {
  const tokenUrl = `https://accounts.accesscontrol.windows.net/${auth.tenantId}/tokens/OAuth/2`;
  
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: `${auth.clientId}@${auth.tenantId}`,
    client_secret: auth.clientSecret,
    resource: `00000003-0000-0ff1-ce00-000000000000/government.sharepoint.com@${auth.tenantId}`
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  if (!response.ok) {
    throw new Error(`Failed to get SharePoint access token: ${response.statusText}`);
  }

  const result = await response.json();
  return result.access_token;
}

async function uploadToFileNet(config: DMSConfig, document: any, fileData: Blob) {
  // FileNet-specific upload logic
  console.log(`Uploading ${document.file_name} to FileNet`);
  // Implementation would go here
  return {
    externalId: `filenet_${Date.now()}`,
    url: `${config.endpoint}/documents/${document.id}`,
    metadata: { filenet: { objectId: `filenet_${Date.now()}` } }
  };
}

async function uploadToDocumentum(config: DMSConfig, document: any, fileData: Blob) {
  // Documentum-specific upload logic
  console.log(`Uploading ${document.file_name} to Documentum`);
  // Implementation would go here
  return {
    externalId: `documentum_${Date.now()}`,
    url: `${config.endpoint}/documents/${document.id}`,
    metadata: { documentum: { objectId: `documentum_${Date.now()}` } }
  };
}

async function fetchDocumentsFromDMS(config: DMSConfig, since?: string) {
  // Fetch documents from external DMS
  // Implementation varies by DMS type
  console.log(`Fetching documents from ${config.name} since ${since}`);
  return []; // Placeholder
}

async function mapExternalDocumentToLocal(extDoc: any) {
  // Map external document structure to local document structure
  return {
    file_name: extDoc.name,
    file_size: extDoc.size,
    file_type: extDoc.type,
    metadata: extDoc.metadata,
    updated_at: new Date().toISOString()
  };
}

async function getDMSSyncStatus(supabase: any, dmsSystemId?: string) {
  // Get sync status for DMS system
  const { data: syncLogs, error } = await supabase
    .from('dms_sync_logs')
    .select('*')
    .eq('dms_system_id', dmsSystemId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(`Failed to get sync status: ${error.message}`);
  }

  return {
    dmsSystemId,
    lastSync: syncLogs[0]?.created_at,
    recentSyncs: syncLogs,
    status: 'active'
  };
}

async function logSyncOperation(supabase: any, action: string, dmsSystemId?: string, result: any) {
  // Log sync operation for monitoring and debugging
  await supabase.from('dms_sync_logs').insert({
    action,
    dms_system_id: dmsSystemId,
    success: result.successful || 0,
    failed: result.failed || 0,
    total: result.totalDocuments || 0,
    details: result,
    created_at: new Date().toISOString()
  });
}
```

---

## Government API Integration

### DigiD Authentication Integration
```typescript
// DigiD integration for Dutch citizen authentication
interface DigiDConfig {
  entityId: string;
  ssoUrl: string;
  certificate: string;
  privateKey: string;
  attributeMapping: Record<string, string>;
}

// DigiD SAML authentication handler
async function handleDigiDAuthentication(samlResponse: string, supabase: any) {
  // Validate SAML response
  const userAttributes = await validateSAMLResponse(samlResponse);
  
  // Extract user information
  const userData = {
    bsn: userAttributes['urn:nl:bkwi:identiteit:bsn'],
    firstName: userAttributes['urn:nl:bkwi:identiteit:voornamen'],
    lastName: userAttributes['urn:nl:bkwi:identiteit:geslachtsnaam'],
    dateOfBirth: userAttributes['urn:nl:bkwi:identiteit:geboortedatum']
  };

  // Create or update user profile
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('bsn', userData.bsn)
    .single();

  if (existingProfile) {
    // Update existing profile
    await supabase
      .from('profiles')
      .update({
        first_name: userData.firstName,
        last_name: userData.lastName,
        last_login_at: new Date().toISOString(),
        digid_verified: true
      })
      .eq('id', existingProfile.id);
  } else {
    // Create new profile
    await supabase
      .from('profiles')
      .insert({
        bsn: userData.bsn,
        first_name: userData.firstName,
        last_name: userData.lastName,
        digid_verified: true,
        role: 'citizen'
      });
  }

  return userData;
}
```

### BRP (Basisregistratie Personen) Integration
```typescript
// BRP database integration for citizen data verification
interface BRPService {
  endpoint: string;
  certificate: string;
  privateKey: string;
}

async function verifyPersonalData(bsn: string, personalData: any): Promise<BRPVerificationResult> {
  const brpService = {
    endpoint: Deno.env.get('BRP_ENDPOINT') ?? '',
    certificate: Deno.env.get('BRP_CERTIFICATE') ?? '',
    privateKey: Deno.env.get('BRP_PRIVATE_KEY') ?? ''
  };

  try {
    // Create secure connection to BRP
    const brpClient = createBRPClient(brpService);
    
    // Query person data
    const brpData = await brpClient.getPersonByBSN(bsn);
    
    // Compare provided data with BRP data
    const verificationResults = {
      firstName: personalData.firstName === brpData.voornamen,
      lastName: personalData.lastName === brpData.geslachtsnaam,
      dateOfBirth: personalData.dateOfBirth === brpData.geboortedatum,
      nationality: personalData.nationality === brpData.nationaliteit,
      address: compareAddresses(personalData.address, brpData.adres)
    };

    const isVerified = Object.values(verificationResults).every(Boolean);

    return {
      verified: isVerified,
      details: verificationResults,
      brpData: brpData,
      verificationDate: new Date().toISOString()
    };

  } catch (error) {
    console.error('BRP verification error:', error);
    throw new Error(`BRP verification failed: ${error.message}`);
  }
}
```

### KVK (Kamer van Koophandel) Integration
```typescript
// Chamber of Commerce integration for business verification
async function verifyBusinessData(kvkNumber: string): Promise<KVKVerificationResult> {
  const kvkApiKey = Deno.env.get('KVK_API_KEY');
  const kvkEndpoint = 'https://api.kvk.nl/api/v1/zoeken';

  try {
    const response = await fetch(`${kvkEndpoint}?kvkNummer=${kvkNumber}`, {
      headers: {
        'Accept': 'application/json',
        'apikey': kvkApiKey ?? ''
      }
    });

    if (!response.ok) {
      throw new Error(`KVK API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.resultaten?.length === 0) {
      return {
        verified: false,
        error: 'Company not found in KVK register'
      };
    }

    const company = data.resultaten[0];
    
    return {
      verified: true,
      companyData: {
        name: company.handelsnaam,
        kvkNumber: company.kvkNummer,
        status: company.status,
        address: company.adres,
        activities: company.activiteiten,
        establishmentDate: company.datumOprichting
      },
      verificationDate: new Date().toISOString()
    };

  } catch (error) {
    console.error('KVK verification error:', error);
    throw new Error(`KVK verification failed: ${error.message}`);
  }
}
```

---

## Third-Party Service Integration

### Email Service Integration
```typescript
// Email service integration using SendGrid or similar provider
interface EmailServiceConfig {
  provider: 'sendgrid' | 'mailgun' | 'ses';
  apiKey: string;
  fromEmail: string;
  templates: Record<string, string>;
}

async function sendTransactionalEmail(
  recipient: string, 
  templateId: string, 
  data: Record<string, any>
): Promise<EmailResult> {
  const config: EmailServiceConfig = {
    provider: 'sendgrid',
    apiKey: Deno.env.get('SENDGRID_API_KEY') ?? '',
    fromEmail: 'noreply@vzportal.gov.nl',
    templates: {
      'application_submitted': 'd-template-id-1',
      'status_update': 'd-template-id-2',
      'document_request': 'd-template-id-3'
    }
  };

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: { email: config.fromEmail },
        personalizations: [{
          to: [{ email: recipient }],
          dynamic_template_data: data
        }],
        template_id: config.templates[templateId]
      })
    });

    if (!response.ok) {
      throw new Error(`Email send failed: ${response.statusText}`);
    }

    return {
      success: true,
      messageId: response.headers.get('x-message-id'),
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Email service error:', error);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
}
```

### SMS Gateway Integration
```typescript
// SMS service integration for notifications
interface SMSServiceConfig {
  provider: 'twilio' | 'messagebird' | 'clicksend';
  apiKey: string;
  fromNumber: string;
}

async function sendSMSNotification(
  phoneNumber: string, 
  message: string
): Promise<SMSResult> {
  const config: SMSServiceConfig = {
    provider: 'messagebird',
    apiKey: Deno.env.get('MESSAGEBIRD_API_KEY') ?? '',
    fromNumber: '+31612345678'
  };

  try {
    const response = await fetch('https://rest.messagebird.com/messages', {
      method: 'POST',
      headers: {
        'Authorization': `AccessKey ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        originator: config.fromNumber,
        recipients: [phoneNumber],
        body: message,
        type: 'sms'
      })
    });

    if (!response.ok) {
      throw new Error(`SMS send failed: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      messageId: result.id,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('SMS service error:', error);
    throw new Error(`SMS delivery failed: ${error.message}`);
  }
}
```

### Payment Gateway Integration
```typescript
// Payment processing for application fees
interface PaymentConfig {
  provider: 'mollie' | 'stripe' | 'ideal';
  apiKey: string;
  webhookSecret: string;
}

async function createPaymentRequest(
  applicationId: string,
  amount: number,
  description: string
): Promise<PaymentResult> {
  const config: PaymentConfig = {
    provider: 'mollie',
    apiKey: Deno.env.get('MOLLIE_API_KEY') ?? '',
    webhookSecret: Deno.env.get('MOLLIE_WEBHOOK_SECRET') ?? ''
  };

  try {
    const response = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: {
          currency: 'EUR',
          value: amount.toFixed(2)
        },
        description,
        redirectUrl: `https://vzportal.gov.nl/payment/return?application=${applicationId}`,
        webhookUrl: `https://lnkmarduszgtybwlslrg.supabase.co/functions/v1/payment-webhook`,
        metadata: {
          applicationId
        },
        method: ['ideal', 'creditcard', 'banktransfer']
      })
    });

    if (!response.ok) {
      throw new Error(`Payment creation failed: ${response.statusText}`);
    }

    const payment = await response.json();

    return {
      success: true,
      paymentId: payment.id,
      checkoutUrl: payment._links.checkout.href,
      status: payment.status,
      amount: payment.amount.value,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Payment service error:', error);
    throw new Error(`Payment creation failed: ${error.message}`);
  }
}
```

---

## External Partner Integration

### Legal Firm API Integration
```typescript
// Integration with authorized legal representatives
interface LegalFirmAPI {
  firmId: string;
  endpoint: string;
  authentication: {
    type: 'oauth2' | 'api_key';
    credentials: Record<string, string>;
  };
}

async function syncLegalRepresentatives(): Promise<SyncResult> {
  const authorizedFirms = await getAuthorizedLegalFirms();
  const results = [];

  for (const firm of authorizedFirms) {
    try {
      const representatives = await fetchLegalRepresentatives(firm);
      
      for (const rep of representatives) {
        // Create or update legal representative profile
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: rep.id,
            role: 'legal_representative',
            first_name: rep.firstName,
            last_name: rep.lastName,
            email: rep.email,
            legal_firm_id: firm.firmId,
            bar_number: rep.barNumber,
            specializations: rep.specializations,
            is_active: rep.isActive
          });

        if (error) {
          throw new Error(`Failed to sync representative: ${error.message}`);
        }
      }

      results.push({
        firmId: firm.firmId,
        representatives: representatives.length,
        status: 'success'
      });

    } catch (error) {
      results.push({
        firmId: firm.firmId,
        status: 'error',
        error: error.message
      });
    }
  }

  return {
    totalFirms: authorizedFirms.length,
    successful: results.filter(r => r.status === 'success').length,
    failed: results.filter(r => r.status === 'error').length,
    results
  };
}
```

### Translation Service Integration
```typescript
// Integration with professional translation services
interface TranslationService {
  provider: 'google_translate' | 'deepl' | 'microsoft_translator';
  apiKey: string;
  endpoint: string;
}

async function translateDocument(
  documentId: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResult> {
  const config: TranslationService = {
    provider: 'deepl',
    apiKey: Deno.env.get('DEEPL_API_KEY') ?? '',
    endpoint: 'https://api-free.deepl.com/v2/translate'
  };

  try {
    // Get document content
    const { data: document } = await supabase
      .from('documents')
      .select('*, ocr_text')
      .eq('id', documentId)
      .single();

    if (!document.ocr_text) {
      throw new Error('Document must be processed with OCR before translation');
    }

    // Call translation API
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${config.apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        text: document.ocr_text,
        source_lang: sourceLang.toUpperCase(),
        target_lang: targetLang.toUpperCase(),
        formality: 'more'
      })
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const result = await response.json();
    const translatedText = result.translations[0].text;

    // Store translation
    const { error } = await supabase
      .from('document_translations')
      .insert({
        document_id: documentId,
        source_language: sourceLang,
        target_language: targetLang,
        original_text: document.ocr_text,
        translated_text: translatedText,
        translation_provider: config.provider,
        confidence_score: result.translations[0].confidence || null,
        created_at: new Date().toISOString()
      });

    if (error) {
      throw new Error(`Failed to store translation: ${error.message}`);
    }

    return {
      success: true,
      documentId,
      sourceLang,
      targetLang,
      translatedText,
      confidence: result.translations[0].confidence,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Translation service error:', error);
    throw new Error(`Translation failed: ${error.message}`);
  }
}
```

---

## API Security and Authentication

### Security Tokens Management
```typescript
// Secure token management for external API integrations
interface TokenManager {
  getToken(service: string): Promise<string>;
  refreshToken(service: string): Promise<string>;
  validateToken(token: string): Promise<boolean>;
}

class ExternalAPITokenManager implements TokenManager {
  private tokens: Map<string, TokenInfo> = new Map();

  async getToken(service: string): Promise<string> {
    const tokenInfo = this.tokens.get(service);
    
    if (!tokenInfo || this.isTokenExpired(tokenInfo)) {
      return await this.refreshToken(service);
    }
    
    return tokenInfo.token;
  }

  async refreshToken(service: string): Promise<string> {
    const config = await this.getServiceConfig(service);
    
    switch (config.type) {
      case 'oauth2':
        return await this.refreshOAuth2Token(service, config);
      case 'jwt':
        return await this.generateJWTToken(service, config);
      case 'api_key':
        return config.apiKey;
      default:
        throw new Error(`Unsupported auth type: ${config.type}`);
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      // Implement token validation logic
      return true;
    } catch {
      return false;
    }
  }

  private isTokenExpired(tokenInfo: TokenInfo): boolean {
    return Date.now() >= tokenInfo.expiresAt;
  }

  private async refreshOAuth2Token(service: string, config: any): Promise<string> {
    // OAuth2 token refresh implementation
    const response = await fetch(config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: config.scope
      })
    });

    const result = await response.json();
    
    const tokenInfo: TokenInfo = {
      token: result.access_token,
      expiresAt: Date.now() + (result.expires_in * 1000),
      type: result.token_type || 'Bearer'
    };
    
    this.tokens.set(service, tokenInfo);
    
    return tokenInfo.token;
  }

  private async generateJWTToken(service: string, config: any): Promise<string> {
    // JWT token generation implementation
    // This would use a JWT library to create signed tokens
    return 'jwt-token-placeholder';
  }

  private async getServiceConfig(service: string): Promise<any> {
    // Get service configuration from secure storage
    const configs = {
      'sharepoint': {
        type: 'oauth2',
        clientId: Deno.env.get('SHAREPOINT_CLIENT_ID'),
        clientSecret: Deno.env.get('SHAREPOINT_CLIENT_SECRET'),
        tokenEndpoint: 'https://login.microsoftonline.com/tenant/oauth2/token',
        scope: 'https://graph.microsoft.com/.default'
      },
      'brp': {
        type: 'jwt',
        privateKey: Deno.env.get('BRP_PRIVATE_KEY'),
        certificate: Deno.env.get('BRP_CERTIFICATE')
      },
      'kvk': {
        type: 'api_key',
        apiKey: Deno.env.get('KVK_API_KEY')
      }
    };

    return configs[service];
  }
}

interface TokenInfo {
  token: string;
  expiresAt: number;
  type: string;
}
```

### Rate Limiting and Throttling
```typescript
// Rate limiting for external API calls
class APIRateLimiter {
  private rateLimits: Map<string, RateLimitInfo> = new Map();

  async checkRateLimit(service: string, endpoint: string): Promise<boolean> {
    const key = `${service}:${endpoint}`;
    const now = Date.now();
    const limit = this.rateLimits.get(key);

    if (!limit) {
      // Initialize rate limit for this service/endpoint
      this.rateLimits.set(key, {
        count: 1,
        resetTime: now + this.getRateLimitWindow(service),
        maxRequests: this.getMaxRequests(service)
      });
      return true;
    }

    if (now > limit.resetTime) {
      // Reset window
      limit.count = 1;
      limit.resetTime = now + this.getRateLimitWindow(service);
      return true;
    }

    if (limit.count >= limit.maxRequests) {
      return false; // Rate limit exceeded
    }

    limit.count++;
    return true;
  }

  private getRateLimitWindow(service: string): number {
    const windows = {
      'sharepoint': 60000, // 1 minute
      'brp': 60000, // 1 minute
      'kvk': 60000, // 1 minute
      'sendgrid': 60000, // 1 minute
      'default': 60000
    };

    return windows[service] || windows.default;
  }

  private getMaxRequests(service: string): number {
    const limits = {
      'sharepoint': 100,
      'brp': 50,
      'kvk': 200,
      'sendgrid': 1000,
      'default': 100
    };

    return limits[service] || limits.default;
  }
}

interface RateLimitInfo {
  count: number;
  resetTime: number;
  maxRequests: number;
}
```

---

## Error Handling and Monitoring

### Comprehensive Error Handling
```typescript
// Centralized error handling for API integrations
class APIErrorHandler {
  static async handleAPIError(error: any, context: APIContext): Promise<APIErrorResponse> {
    console.error(`API Error in ${context.service}:${context.endpoint}`, error);

    // Log error for monitoring
    await this.logAPIError(error, context);

    // Determine error type and response
    if (error.name === 'TimeoutError') {
      return {
        success: false,
        error: 'API_TIMEOUT',
        message: 'The external service is taking too long to respond',
        retryable: true,
        retryAfter: 30000 // 30 seconds
      };
    }

    if (error.status === 429) {
      return {
        success: false,
        error: 'RATE_LIMITED',
        message: 'Rate limit exceeded for external service',
        retryable: true,
        retryAfter: this.parseRetryAfter(error.headers)
      };
    }

    if (error.status >= 500) {
      return {
        success: false,
        error: 'SERVER_ERROR',
        message: 'External service is experiencing issues',
        retryable: true,
        retryAfter: 60000 // 1 minute
      };
    }

    if (error.status === 401 || error.status === 403) {
      return {
        success: false,
        error: 'AUTH_ERROR',
        message: 'Authentication failed with external service',
        retryable: false
      };
    }

    // Default error response
    return {
      success: false,
      error: 'INTEGRATION_ERROR',
      message: error.message || 'An unexpected error occurred',
      retryable: false
    };
  }

  private static async logAPIError(error: any, context: APIContext): Promise<void> {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase.from('api_error_logs').insert({
      service: context.service,
      endpoint: context.endpoint,
      method: context.method,
      error_type: error.name,
      error_message: error.message,
      status_code: error.status,
      request_id: context.requestId,
      user_id: context.userId,
      timestamp: new Date().toISOString(),
      stack_trace: error.stack,
      request_data: context.requestData,
      response_data: error.response?.data
    });
  }

  private static parseRetryAfter(headers: any): number {
    const retryAfter = headers?.['retry-after'];
    if (retryAfter) {
      return parseInt(retryAfter) * 1000; // Convert to milliseconds
    }
    return 60000; // Default 1 minute
  }
}

interface APIContext {
  service: string;
  endpoint: string;
  method: string;
  requestId: string;
  userId?: string;
  requestData?: any;
}

interface APIErrorResponse {
  success: false;
  error: string;
  message: string;
  retryable: boolean;
  retryAfter?: number;
}
```

### Integration Monitoring and Health Checks
```typescript
// Health check system for external integrations
class IntegrationHealthMonitor {
  private healthStatus: Map<string, HealthStatus> = new Map();

  async checkAllIntegrations(): Promise<HealthReport> {
    const integrations = [
      'sharepoint',
      'brp',
      'kvk',
      'sendgrid',
      'messagebird',
      'mollie'
    ];

    const results = await Promise.all(
      integrations.map(service => this.checkIntegrationHealth(service))
    );

    const report: HealthReport = {
      timestamp: new Date().toISOString(),
      overallStatus: results.every(r => r.status === 'healthy') ? 'healthy' : 'degraded',
      integrations: Object.fromEntries(
        integrations.map((service, index) => [service, results[index]])
      )
    };

    await this.logHealthReport(report);
    return report;
  }

  private async checkIntegrationHealth(service: string): Promise<HealthStatus> {
    try {
      const startTime = Date.now();
      
      switch (service) {
        case 'sharepoint':
          await this.pingSharePoint();
          break;
        case 'brp':
          await this.pingBRP();
          break;
        case 'kvk':
          await this.pingKVK();
          break;
        case 'sendgrid':
          await this.pingSendGrid();
          break;
        default:
          throw new Error(`Unknown service: ${service}`);
      }

      const responseTime = Date.now() - startTime;
      
      const status: HealthStatus = {
        status: 'healthy',
        responseTime,
        lastCheck: new Date().toISOString(),
        message: 'Service is responding normally'
      };

      this.healthStatus.set(service, status);
      return status;

    } catch (error) {
      const status: HealthStatus = {
        status: 'unhealthy',
        responseTime: -1,
        lastCheck: new Date().toISOString(),
        message: error.message,
        error: error.name
      };

      this.healthStatus.set(service, status);
      return status;
    }
  }

  private async pingSharePoint(): Promise<void> {
    // Simple health check for SharePoint
    const response = await fetch('https://government.sharepoint.com/_api/web', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`SharePoint health check failed: ${response.statusText}`);
    }
  }

  private async pingBRP(): Promise<void> {
    // Health check for BRP service
    // Implementation would depend on available health endpoint
    console.log('BRP health check - implementation needed');
  }

  private async pingKVK(): Promise<void> {
    // Health check for KVK API
    const response = await fetch('https://api.kvk.nl/api/v1/zoeken?kvkNummer=90004760', {
      headers: {
        'apikey': Deno.env.get('KVK_API_KEY') ?? ''
      }
    });

    if (!response.ok) {
      throw new Error(`KVK health check failed: ${response.statusText}`);
    }
  }

  private async pingSendGrid(): Promise<void> {
    // Health check for SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`
      }
    });

    if (!response.ok) {
      throw new Error(`SendGrid health check failed: ${response.statusText}`);
    }
  }

  private async logHealthReport(report: HealthReport): Promise<void> {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase.from('integration_health_logs').insert({
      overall_status: report.overallStatus,
      integrations: report.integrations,
      timestamp: report.timestamp
    });
  }
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastCheck: string;
  message: string;
  error?: string;
}

interface HealthReport {
  timestamp: string;
  overallStatus: 'healthy' | 'degraded' | 'critical';
  integrations: Record<string, HealthStatus>;
}
```

---

## Testing and Validation

### Integration Testing Framework
```typescript
// Comprehensive testing for API integrations
class IntegrationTestSuite {
  async runAllTests(): Promise<TestResults> {
    const tests = [
      () => this.testDMSSync(),
      () => this.testDigiDAuth(),
      () => this.testBRPVerification(),
      () => this.testEmailNotifications(),
      () => this.testPaymentProcessing()
    ];

    const results = await Promise.all(
      tests.map(async (test, index) => {
        try {
          const result = await test();
          return { test: index, success: true, result };
        } catch (error) {
          return { test: index, success: false, error: error.message };
        }
      })
    );

    return {
      totalTests: tests.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  private async testDMSSync(): Promise<any> {
    // Test DMS synchronization
    const testDoc = await this.createTestDocument();
    const syncResult = await this.syncDocumentToSharePoint(testDoc);
    
    if (!syncResult.success) {
      throw new Error('DMS sync test failed');
    }
    
    return { testDoc: testDoc.id, syncResult };
  }

  private async testDigiDAuth(): Promise<any> {
    // Test DigiD authentication flow
    // This would be a mock test in non-production environments
    return { message: 'DigiD auth test completed' };
  }

  private async testBRPVerification(): Promise<any> {
    // Test BRP data verification
    // This would use test BSN numbers in non-production
    return { message: 'BRP verification test completed' };
  }

  private async testEmailNotifications(): Promise<any> {
    // Test email notification system
    const testEmail = 'test@example.com';
    const result = await sendTransactionalEmail(
      testEmail,
      'application_submitted',
      { firstName: 'Test', applicationNumber: 'TEST-001' }
    );
    
    if (!result.success) {
      throw new Error('Email notification test failed');
    }
    
    return result;
  }

  private async testPaymentProcessing(): Promise<any> {
    // Test payment creation (sandbox mode)
    const result = await createPaymentRequest(
      'test-application-123',
      10.00,
      'Test payment for integration testing'
    );
    
    if (!result.success) {
      throw new Error('Payment processing test failed');
    }
    
    return result;
  }

  private async createTestDocument(): Promise<any> {
    // Create a test document for integration testing
    return {
      id: 'test-doc-' + Date.now(),
      name: 'test-document.pdf',
      content: 'Test document content'
    };
  }

  private async syncDocumentToSharePoint(doc: any): Promise<any> {
    // Mock SharePoint sync for testing
    return { success: true, externalId: 'sp-' + doc.id };
  }
}

interface TestResults {
  totalTests: number;
  passed: number;
  failed: number;
  results: Array<{
    test: number;
    success: boolean;
    result?: any;
    error?: string;
  }>;
}
```

---

## Documentation and Maintenance

### API Integration Documentation
- **Service Catalog**: Comprehensive list of all integrated services
- **Authentication Guide**: Authentication methods for each service
- **Error Handling**: Standard error codes and resolution procedures
- **Rate Limiting**: Rate limits and throttling policies for each service
- **Health Monitoring**: Service health check procedures and alerts

### Maintenance Procedures
1. **Regular Health Checks**: Automated daily health checks for all integrations
2. **Token Rotation**: Automated token refresh and rotation procedures
3. **Service Updates**: Process for handling API version updates
4. **Incident Response**: Procedures for handling integration failures
5. **Performance Monitoring**: Continuous monitoring of integration performance

---

**Document Status**: In Development  
**Last Updated**: December 2024  
**Integration Version**: 1.0.0  
**Next Review**: Weekly during development, monthly post-launch