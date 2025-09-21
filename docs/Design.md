# Design System & UI Guidelines
## VZ Portal - Immigration Services Platform

### Overview
This document outlines the design system for the VZ Portal, based on the Evea React Template Layout-1 with government-specific adaptations for accessibility, usability, and brand alignment.

---

## Design Foundation

### Design Philosophy
- **Government-First**: Professional, trustworthy, and accessible design
- **User-Centric**: Intuitive navigation optimized for diverse user needs
- **Inclusive**: WCAG 2.1 AA compliant with multilingual support
- **Modern**: Clean, contemporary aesthetics with progressive enhancement

### Base Template: Evea Layout-1
The VZ Portal design system is built upon the **Evea React Template Layout-1**, providing:
- Proven component architecture
- Responsive grid system
- Modern CSS framework integration
- Accessibility best practices foundation

---

## Visual Identity

### Color Palette
Based on Evea's color system with government branding adaptations:

#### Primary Colors
```css
/* Government Blue - Professional and trustworthy */
--primary: 212 85% 32%;           /* hsl(212, 85%, 32%) - Main brand blue */
--primary-foreground: 0 0% 100%;  /* White text on primary */
--primary-hover: 212 85% 28%;     /* Darker blue for hover states */
--primary-glow: 212 85% 45%;      /* Lighter blue for accents */

/* Secondary Colors */
--secondary: 210 20% 25%;         /* Dark gray-blue for secondary actions */
--secondary-foreground: 0 0% 100%; /* White text on secondary */
```

#### Neutral Palette
```css
/* Backgrounds and surfaces */
--background: 0 0% 100%;          /* Pure white background */
--foreground: 222 84% 5%;         /* Nearly black text */
--muted: 210 40% 95%;             /* Light gray for subtle backgrounds */
--muted-foreground: 215 16% 47%;  /* Medium gray for secondary text */

/* Borders and dividers */
--border: 214 32% 91%;            /* Light border color */
--input: 214 32% 91%;             /* Input field borders */
--ring: 212 85% 32%;              /* Focus ring color (matches primary) */
```

#### Status Colors
```css
/* Success - Green for completed actions */
--success: 142 76% 36%;           /* Professional green */
--success-foreground: 0 0% 100%;  /* White text on success */

/* Warning - Amber for attention needed */
--warning: 38 92% 50%;            /* Clear amber warning */
--warning-foreground: 0 0% 0%;    /* Black text on warning */

/* Error - Red for errors and critical actions */
--destructive: 0 72% 51%;         /* Clear red for errors */
--destructive-foreground: 0 0% 100%; /* White text on error */
```

#### Government Accent Colors
```css
/* Dutch Government Orange */
--accent-orange: 24 100% 50%;     /* Official Dutch orange */
--accent-orange-foreground: 0 0% 100%;

/* European Blue */
--accent-eu: 225 73% 57%;         /* EU blue for European services */
--accent-eu-foreground: 0 0% 100%;
```

### Typography
Following Evea's typography system with DM Sans integration:

#### Font Family
```css
/* Primary Font - DM Sans (Google Fonts) */
--font-primary: 'DM Sans', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

#### Font Weights & Scales
```css
/* Typography Scale */
--text-xs: 0.75rem;     /* 12px - Fine print */
--text-sm: 0.875rem;    /* 14px - Secondary text */
--text-base: 1rem;      /* 16px - Body text */
--text-lg: 1.125rem;    /* 18px - Large body */
--text-xl: 1.25rem;     /* 20px - Small headings */
--text-2xl: 1.5rem;     /* 24px - Section headings */
--text-3xl: 1.875rem;   /* 30px - Page headings */
--text-4xl: 2.25rem;    /* 36px - Hero headings */

/* Font Weights */
--font-normal: 400;     /* Regular text */
--font-medium: 500;     /* Medium emphasis */
--font-semibold: 600;   /* Strong emphasis */
--font-bold: 700;       /* Headings and important text */
```

#### Typography Usage
- **Headings**: DM Sans Semibold (600) for all headings
- **Body Text**: DM Sans Regular (400) for readable content
- **UI Elements**: DM Sans Medium (500) for buttons and navigation
- **Emphasis**: DM Sans Bold (700) for critical information

---

## Component System

### Layout Components
Based on Evea Layout-1 structure with government adaptations:

#### Header Component
```tsx
// Adapted from Evea's navigation with government branding
interface HeaderProps {
  user?: User;
  language: 'nl' | 'en';
  onLanguageChange: (lang: 'nl' | 'en') => void;
}

// Features:
// - Government logo and branding
// - User authentication status
// - Language switcher (Dutch/English)
// - Accessibility navigation skip links
// - Mobile-responsive hamburger menu
```

#### Sidebar Navigation
```tsx
// Role-based navigation adapted from Evea's sidebar
interface SidebarProps {
  userRole: 'citizen' | 'officer' | 'admin';
  currentPath: string;
  collapsed?: boolean;
}

// Features:
// - Role-specific menu items
// - Collapsible navigation
// - Active state indication
// - Keyboard navigation support
```

#### Main Content Area
```tsx
// Responsive content wrapper with accessibility features
interface MainContentProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  description?: string;
}

// Features:
// - Breadcrumb navigation
// - Page title and description
// - Screen reader landmarks
// - Responsive content grid
```

### Form Components
Enhanced from Evea's form system for government use:

#### Multi-Step Form Wizard
```tsx
interface FormWizardProps {
  steps: FormStep[];
  onComplete: (data: FormData) => void;
  allowSaveDraft?: boolean;
  autoSave?: boolean;
}

// Features:
// - Progress indication
// - Step validation
// - Auto-save drafts
// - Accessibility announcements
// - Mobile-optimized navigation
```

#### File Upload Component
```tsx
interface FileUploadProps {
  acceptedTypes: string[];
  maxSize: number;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  scanForViruses?: boolean;
}

// Features:
// - Drag-and-drop interface
// - File type validation
// - Virus scanning integration
// - Progress indicators
// - Accessibility support
```

### Data Display Components

#### Application Status Card
```tsx
interface StatusCardProps {
  application: Application;
  showDetails?: boolean;
  actions?: StatusAction[];
}

// Features:
// - Visual status indicators
// - Progress timeline
// - Quick actions
// - Responsive layout
```

#### Document Library
```tsx
interface DocumentLibraryProps {
  documents: Document[];
  canUpload?: boolean;
  canDelete?: boolean;
  sortBy?: 'date' | 'name' | 'type';
}

// Features:
// - Grid/list view toggle
// - Document previews
// - Batch operations
// - Accessibility labels
```

---

## Responsive Design

### Breakpoint System
Following Evea's responsive approach with government-specific optimizations:

```css
/* Mobile First Breakpoints */
--screen-sm: 640px;   /* Small tablets */
--screen-md: 768px;   /* Tablets */
--screen-lg: 1024px;  /* Small desktops */
--screen-xl: 1280px;  /* Large desktops */
--screen-2xl: 1536px; /* Ultra-wide screens */
```

### Grid System
```css
/* Container Sizing */
.container {
  max-width: 1200px;     /* Optimal reading width */
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsive Grid */
.grid-responsive {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Mobile Optimization
- **Touch Targets**: Minimum 44px for all interactive elements
- **Navigation**: Collapsible mobile menu with clear hierarchy
- **Forms**: Single-column layout with large input fields
- **Performance**: Optimized images and lazy loading

---

## Accessibility Standards

### WCAG 2.1 AA Compliance
Following Evea's accessibility foundation with government enhancements:

#### Color Contrast
```css
/* High Contrast Ratios */
--contrast-normal: 4.5:1;    /* Normal text minimum */
--contrast-large: 3:1;       /* Large text minimum */
--contrast-enhanced: 7:1;    /* Enhanced contrast option */

/* Focus Indicators */
--focus-ring: 2px solid var(--ring);
--focus-offset: 2px;
```

#### Keyboard Navigation
- **Tab Order**: Logical tab sequence for all interactive elements
- **Skip Links**: Jump to main content and navigation
- **Focus Management**: Clear focus indicators and trapped focus in modals
- **Keyboard Shortcuts**: Alt+M for menu, Alt+S for search, etc.

#### Screen Reader Support
```tsx
// Accessibility annotations for complex components
interface AccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-current'?: 'page' | 'step' | 'location';
  role?: string;
}
```

#### Language Support
- **HTML Lang Attributes**: Proper language declaration
- **Multilingual Content**: Dutch and English interface support
- **RTL Support**: Right-to-left text direction support (future enhancement)

---

## Animation & Interactions

### Motion System
Adapted from Evea's animation library:

```css
/* Transition Durations */
--duration-fast: 150ms;     /* Quick state changes */
--duration-normal: 300ms;   /* Standard transitions */
--duration-slow: 500ms;     /* Complex animations */

/* Easing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Loading States
```tsx
// Progressive loading indicators
interface LoadingProps {
  type: 'skeleton' | 'spinner' | 'progress';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}
```

### Error States
```tsx
// Consistent error presentation
interface ErrorStateProps {
  type: 'network' | 'validation' | 'permission' | 'server';
  message: string;
  action?: ErrorAction;
  retry?: () => void;
}
```

---

## Icon System

### Migration from Iconify to Lucide React
Evea uses Iconify icons, but the VZ Portal will use Lucide React for better tree-shaking and performance:

#### Icon Mapping
```tsx
// Common icon mappings from Evea to Lucide
const iconMap = {
  // Navigation
  'mdi:menu': Menu,
  'mdi:close': X,
  'mdi:arrow-left': ArrowLeft,
  'mdi:arrow-right': ArrowRight,
  
  // Actions
  'mdi:plus': Plus,
  'mdi:edit': Edit,
  'mdi:delete': Trash2,
  'mdi:save': Save,
  
  // Status
  'mdi:check': Check,
  'mdi:alert': AlertTriangle,
  'mdi:information': Info,
  'mdi:close-circle': XCircle,
  
  // Files
  'mdi:file-document': FileText,
  'mdi:download': Download,
  'mdi:upload': Upload,
  'mdi:attachment': Paperclip,
};
```

#### Icon Usage Guidelines
```tsx
// Consistent icon sizing and styling
interface IconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';  // 16px, 20px, 24px, 32px
  color?: 'primary' | 'secondary' | 'muted' | 'destructive';
  'aria-hidden'?: boolean;
}

// Usage example
<Button>
  <Save size="sm" aria-hidden="true" />
  Save Application
</Button>
```

---

## Performance Guidelines

### Image Optimization
Following Evea's asset optimization with government-specific needs:

```tsx
// Optimized image component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
}
```

### Code Splitting
```tsx
// Lazy loading for route components
const CitizenDashboard = lazy(() => import('./pages/CitizenDashboard'));
const OfficerDashboard = lazy(() => import('./pages/OfficerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
```

### Bundle Optimization
- **Tree Shaking**: Remove unused Evea components
- **Code Splitting**: Route-based and component-based splitting
- **Asset Optimization**: Compress images and optimize SVGs
- **CDN Integration**: Serve static assets from CDN

---

## Brand Guidelines

### Government Branding
- **Logo Placement**: Top-left corner with proper spacing
- **Color Usage**: Primary blue for government actions, orange for Dutch identity
- **Typography**: Professional and readable with proper hierarchy
- **Voice & Tone**: Clear, helpful, and authoritative

### Accessibility Branding
- **High Contrast Mode**: Alternative color scheme for visual impairments
- **Large Text Option**: 125% and 150% text scaling options
- **Reduced Motion**: Respect user preferences for reduced animations
- **Language Options**: Clear language selection with flag indicators

---

## Implementation Guidelines

### Component Development
1. **Start with Evea Base**: Adapt existing Evea Layout-1 components
2. **Government Customization**: Apply color palette and typography
3. **Accessibility Enhancement**: Add WCAG 2.1 AA compliance features
4. **Responsive Testing**: Ensure mobile-first responsive behavior
5. **Performance Optimization**: Implement lazy loading and code splitting

### Design Tokens
```tsx
// Centralized design token system
export const tokens = {
  colors: {
    primary: 'hsl(var(--primary))',
    primaryForeground: 'hsl(var(--primary-foreground))',
    // ... all color tokens
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  typography: {
    fontFamily: {
      sans: 'var(--font-primary)',
      mono: 'var(--font-mono)',
    },
    fontSize: {
      xs: 'var(--text-xs)',
      sm: 'var(--text-sm)',
      base: 'var(--text-base)',
      // ... all size tokens
    },
  },
};
```

### Testing Strategy
- **Visual Regression**: Screenshot testing for component consistency
- **Accessibility Testing**: Automated and manual accessibility audits
- **Cross-Browser Testing**: Support for modern browsers
- **Performance Testing**: Core Web Vitals monitoring

---

## Maintenance & Evolution

### Design System Governance
- **Component Library**: Centralized component documentation
- **Version Control**: Semantic versioning for design system updates
- **Breaking Changes**: Clear migration guides for updates
- **Feedback Loop**: Regular user testing and design iteration

### Future Enhancements
- **Dark Mode**: Optional dark theme for user preference
- **Custom Themes**: Role-based or departmental theming
- **Advanced Animations**: Micro-interactions for enhanced UX
- **Multi-Language RTL**: Right-to-left language support

---

**Document Status**: In Development  
**Last Updated**: December 2024  
**Next Review**: Bi-weekly during implementation phases  
**Design System Version**: 1.0.0-beta