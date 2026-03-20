# AT-Bank Web Frontend

The web-based frontend for AT-Bank, serving as a comprehensive portal for Athletic Trainers to manage health monitoring and engage with the job-finding platform.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Components**: [Material UI (MUI)](https://mui.com/)
- **Mocking**: [Mock Service Worker (MSW)](https://mswjs.io/) for API simulation during development.
- **Routing**: [React Router 7](https://reactrouter.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)

## 📂 Project Structure

```text
web/
├── src/
│   ├── components/    # UI components
│   ├── mocks/         # MSW handlers and browser worker setup
│   ├── pages/         # Application pages
│   ├── hooks/         # Custom React hooks
│   └── main.tsx       # Application entry point
├── public/            # Static assets and MSW worker script
└── tsconfig.json      # TypeScript configuration
```

## 🛠️ Getting Started

### Installation

1. Navigate to the `web` directory:

   ```bash
   cd web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🧪 Mocking with MSW

This project uses **Mock Service Worker** to intercept API requests and return manual responses. This allows frontend development to proceed independently of the backend.

The mock handlers are defined in `src/mocks/handlers.ts` and the worker is initialized in `src/main.tsx` when running in development mode.

## 📦 Build

```bash
npm run build
```
