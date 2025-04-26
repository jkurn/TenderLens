# TenderLens

## Problem
Public-sector suppliers and consultancies waste huge chunks of time combing dozens of scattered tender portals, parsing dense, jargon-laden RFP documents, and still miss winnable opportunities; this slow, manual, error-prone process costs them revenue, burns staff hours, and often means they find out too late to craft a competitive bid.

## Solution
TenderLens: RFP Market Researcher Agent Public-sector suppliers and consultancies waste huge chunks of time combing dozens of scattered tender portals, parsing dense, jargon-laden RFP documents, and still miss winnable opportunities; this slow, manual, error-prone process costs them revenue, burns staff hours, and often means they find out too late to craft a competitive bid.

TenderLens is a modern web application built with React, Express, and TypeScript, designed to help users manage and analyze tender documents efficiently. The application features a robust frontend with beautiful UI components and a powerful backend for document processing and analysis.

## 🚀 Features

- Modern React-based frontend with Tailwind CSS
- Express.js backend with TypeScript
- Document processing capabilities (PDF, Word)
- Real-time updates with WebSocket
- Authentication system
- Database integration with Drizzle ORM
- Beautiful UI components using Radix UI
- Form handling with React Hook Form
- Data visualization with Recharts
- Type-safe development with TypeScript

## 🛠️ Tech Stack

- **Frontend:**
  - React 18
  - Vite
  - Tailwind CSS
  - Radix UI Components
  - React Query
  - Wouter (Routing)
  - Framer Motion
  - Recharts

- **Backend:**
  - Express.js
  - TypeScript
  - Drizzle ORM
  - WebSocket
  - Passport.js (Authentication)
  - OpenAI Integration

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- PostgreSQL database

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd TenderLens
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory with necessary configurations.

4. Initialize the database:
   ```bash
   npm run db:push
   ```

## 🚀 Development

To start the development server:

```bash
npm run dev
```

This will start both the frontend and backend servers in development mode.

## 🏗️ Building for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check
- `npm run db:push` - Push database schema changes

## 🏗️ Project Structure

```
TenderLens/
├── client/           # Frontend React application
├── server/           # Backend Express application
├── shared/           # Shared types and utilities
├── scripts/          # Build and utility scripts
└── ...
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
