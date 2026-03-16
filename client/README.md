# AT-Bank Client

A mobile-friendly, modern React frontend for the AT-Bank ecosystem. This client provides a sleek interface for Athletic Trainers to monitor health data and explore career opportunities in a dedicated job marketplace.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Component Library**: [Material UI (MUI)](https://mui.com/)
- **Routing**: [React Router 6](https://reactrouter.com/)
- **Data Fetching**: [TanStack Query (React Query) v5](https://tanstack.com/query/latest)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Internationalization**: [i18next](https://www.i18next.com/) & [react-i18next](https://react.i18next.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 📂 Project Structure

```text
client/
├── src/
│   ├── components/    # Reusable UI components (Layout, Forms, Monitors)
│   ├── pages/         # Main application pages (Dashboard, Sign In, Sign Up)
│   ├── hooks/         # Custom React hooks (Alerts, API integrations)
│   ├── context/       # React Context providers
│   ├── store/         # Zustand state stores
│   ├── locales/       # Translation files (JSON)
│   ├── theme.ts       # MUI theme customization
│   └── i18n.ts        # Internationalization configuration
└── public/            # Static assets
```

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (Latest LTS recommended)
- **npm** or **yarn**

### Installation

1. Navigate to the `client` directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running Locally

To start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🌍 Multi-language Support

The client supports multiple languages via `i18next`. Translation strings are located in `src/locales/`.

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` directory.
