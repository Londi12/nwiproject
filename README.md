# NWI Visas CRM System

A comprehensive Customer Relationship Management (CRM) system specifically designed for immigration services, built for NWI Visas. This application streamlines the management of immigration applications, client relationships, document processing, and administrative tasks.

## 🌟 Features

### Core Functionality
- **Lead Management**: Track and manage potential clients with immigration-specific lead sources and statuses
- **Application Processing**: Handle various visa types including Express Entry, Provincial Nominee, Family Sponsorship, Student Visas, Work Permits, and more
- **Document Management**: Organize and track immigration documents with status monitoring and compliance oversight
- **Task Management**: Immigration-focused task types with priority levels and deadline tracking
- **Call Scheduling**: Manage client consultations and follow-up calls
- **CV Parsing & Templates**: Advanced CV parsing with immigration-optimized templates

### Immigration-Specific Features
- **ANZSCO Integration**: Australian occupation classification and skills assessment tracking
- **Multi-Country Support**: Canada, USA, UK, Australia, New Zealand, Germany
- **Visa Type Management**: Comprehensive coverage of immigration visa categories
- **Document Compliance**: Immigration-specific document types and status tracking
- **Skills Assessment**: Integration with Australian skills assessment requirements

### Technology Stack
- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **Document Processing**: PDF.js, Mammoth.js, Tesseract.js for OCR
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Londi12/nwiproject.git
   cd nwiproject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin panel components
│   ├── applications/   # Application management
│   ├── calls/          # Call scheduling
│   ├── cv/             # CV parsing and templates
│   ├── dashboard/      # Dashboard components
│   ├── documents/      # Document management
│   ├── leads/          # Lead management
│   ├── tasks/          # Task management
│   └── ui/             # Base UI components (shadcn/ui)
├── entities/           # Data models and business logic
├── pages/              # Main application pages
├── utils/              # Utility functions
├── integrations/       # External service integrations
└── data/               # Static data and configurations
```

## 🎯 Key Components

### Lead Management
- Immigration-specific lead sources (Website, Facebook, WhatsApp, Referral, etc.)
- Status tracking (New, Contacted, Qualified, Converted, Lost)
- Interest area categorization

### Application Processing
- Visa type management with country-specific requirements
- Application status tracking from draft to approval
- CV status integration
- Payment management

### Document Management
- Immigration document types (Passport, Education Certificates, IELTS Results, etc.)
- Status tracking (Required, Requested, Received, Under Review, Approved)
- Compliance monitoring

### Task Management
- Immigration-specific task types (Follow-up, Document Request, CV Update, etc.)
- Priority levels and deadline management
- Integration with leads and applications

## 🔧 Configuration

### Environment Setup
The application uses Vite for development and build processes. Configuration files:
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

### Styling
The application uses a consistent design system with:
- Rounded-2xl borders for cards
- Slate color schemes with blue accents
- Hover effects and transitions
- Skeleton loading states
- Color-coded status indicators

## 🏗️ Architecture

### Entity System
The application uses a structured entity system for data management:
- **Lead**: Client lead management
- **Application**: Immigration application processing
- **Document**: Document tracking and compliance
- **Task**: Task management and scheduling
- **Call**: Call scheduling and tracking
- **User**: User management and authentication

### Component Design
- Modular component architecture
- Consistent UI patterns across all panels
- Reusable shadcn/ui components
- Responsive design principles

## 🌍 Immigration Focus

This CRM is specifically designed for immigration services with:
- Pre-configured visa types and countries
- Immigration-specific document categories
- ANZSCO occupation codes for Australian applications
- Skills assessment tracking
- Compliance monitoring tools

## 📝 License

This project is private and proprietary to NWI Visas.

## 🤝 Contributing

This is a private project for NWI Visas. For internal development guidelines and contribution processes, please contact the development team.

## 📞 Support

For technical support or questions about the NWI Visas CRM system, please contact the development team.

---

**NWI Visas** - Streamlining Immigration Services Through Technology
