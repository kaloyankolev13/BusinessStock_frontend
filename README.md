# Business App Frontend

A modern React frontend for a multi-firm business management system built with TypeScript, Tailwind CSS, and Vite.

## Features

- **Multi-firm Support**: Switch between different companies/firms
- **Inventory Management**: Items, categories, suppliers, and stock tracking
- **Sales Management**: Invoices, clients, and sales tracking
- **Purchase Management**: Purchase orders and supplier management
- **User Management**: Role-based access control
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with Tailwind CSS

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd stock_app_frontend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Update the environment variables in `.env`:
```env
VITE_API_BASE_URL=https://localhost:7001/api
```

5. Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Sidebar, Header, etc.)
│   └── ui/             # Basic UI components
├── pages/              # Page components
├── lib/                # Utilities and configurations
│   ├── api.ts          # API client setup
│   └── utils.ts        # Utility functions
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
└── styles/             # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend is designed to work with an ASP.NET Core Web API backend. The API client is configured in `src/lib/api.ts` and includes:

- Automatic JWT token handling
- Request/response interceptors
- Error handling
- TypeScript support

## Database Schema

The frontend is built to work with the following main entities:

- **Users** - ASP.NET Identity users
- **Firms** - Companies/organizations
- **Items** - Products/inventory items
- **Categories** - Item categorization
- **Suppliers** - Vendor management
- **Clients** - Customer management
- **Invoices** - Sales documents
- **Purchase Orders** - Purchasing documents
- **Currencies** - Multi-currency support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
