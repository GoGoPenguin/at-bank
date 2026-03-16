# AT-Bank Monorepo

Welcome to the **AT-Bank** monorepo. AT-Bank is a comprehensive ecosystem designed for **Athletic Trainers (ATs)**. It serves a dual purpose: providing high-performance health monitoring tools for athletic data, and acting as a dedicated job-finding platform where ATs can connect with companies and career opportunities.

## 🏗️ Repository Structure

This monorepo is organized into several key components:

- **[api/](file:///Users/user/Documents/gogopenguin/at-bank/api/README.md)**: A high-performance FastAPI backend. Supports standalone server execution and Firebase Functions. Uses MongoDB and Firestore.
- **[client/](file:///Users/user/Documents/gogopenguin/at-bank/client/README.md)**: The primary, mobile-friendly React frontend for end-users, built with MUI and Vite.
- **[web/](file:///Users/user/Documents/gogopenguin/at-bank/web/README.md)**: A web-oriented frontend designed for rapid development with MSW (Mock Service Worker) for API simulation.
- **[admin/](file:///Users/user/Documents/gogopenguin/at-bank/admin/README.md)**: (Work in Progress) An administration dashboard for platform management.

## 🛠️ Global Prerequisites

To work across all projects in this repository, you will need:

- **Node.js** (Latest LTS) & **npm**: For `client`, `web`, and `admin`.
- **Python 3.12+**: For the `api`.
- **uv**: Python package manager.
- **Docker**: For local database services (MongoDB).
- **Firebase CLI**: For deployment and hosting management.

## 🚀 Getting Started

Each project has its own detailed setup guide. Please refer to the specific README in each subdirectory for installation and running instructions.

1. **Backend**: See [api/README.md](file:///Users/user/Documents/gogopenguin/at-bank/api/README.md)
2. **End-User Client**: See [client/README.md](file:///Users/user/Documents/gogopenguin/at-bank/client/README.md)
3. **Web Development**: See [web/README.md](file:///Users/user/Documents/gogopenguin/at-bank/web/README.md)

## ☁️ Firebase Integration

This repository is configured for Firebase. Hosting and Functions settings can be found in `firebase.json` and `.firebaserc`.

- **Functions**: Managed within the `api/` directory.
- **Hosting**: Frontends are deployed to Firebase Hosting.

---

*For detailed documentation on specific features or modules, please explore the `README.md` files within each component folder.*
