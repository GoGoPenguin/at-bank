# AT-Bank API

A modern, high-performance FastAPI backend for the AT-Bank application. This API powers both the health monitoring suite and the job marketplace for Athletic Trainers, supporting scalable data management for athletic metrics and career networking.

## 🚀 Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12+)
- **Dependency Injection**: [dependency-injector](https://python-dependency-injector.ets-labs.org/)
- **Databases**:
  - **MongoDB** (via [MongoEngine](http://mongoengine.org/)): Primary data storage.
  - **Firestore**: Integrated via Firebase Admin SDK.
- **Package Manager**: [uv](https://github.com/astral-sh/uv)
- **Deployment**: [Firebase Functions](https://firebase.google.com/docs/functions) support via `firebase-functions` SDK.
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/)
- **Authentication**: JWT-based (using `PyJWT`) with Bcrypt password hashing.

## 📂 Project Structure

```text
api/
├── main.py              # Entry point for FastAPI & Firebase Functions
├── pyproject.toml       # Project dependencies & configuration
├── docker-compose.yml   # Local MongoDB setup
├── src/
│   ├── container/       # Dependency Injection containers
│   ├── document/        # MongoDB / Firestore models
│   ├── handler/         # Global error handlers
│   ├── middleware/      # JWT, Access Logging, GZip
│   ├── router/          # API Route definitions
│   ├── service/         # Business logic layer
│   └── schema/          # Pydantic models for request/response
└── script/              # Utility scripts
```

## 🛠️ Getting Started

### Prerequisites

- **Python 3.12+**
- **uv**: The lightning-fast Python package installer.

  ```bash
  brew install uv
  ```

- **Docker**: For running the local database.

### Installation

1. Clone the repository and navigate to the `api` directory.
2. Install dependencies:

   ```bash
   uv sync
   ```

### Configuration

Copy the environment template and fill in your local settings:

```bash
cp .env.template .env
```

Key configuration items in `.env`:

- `DB__*`: MongoDB connection details.
- `JWT__SECRET`: Secret key for token signing.
- `CORS__ALLOW_ORIGINS`: Allowed frontend origins.
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to your Firebase service account JSON.

### Running Locally

1. **Start MongoDB**:

   ```bash
   docker-compose up -d
   ```

2. **Run the API Server**:

   ```bash
   uv run python main.py
   ```

   The server will be available at `http://localhost:80` (or as configured in your `.env`).

## 🧪 Development

### Linting & Formatting

We use `ruff` for fast linting and formatting:

```bash
uv run ruff check .
uv run ruff format .
```

## ☁️ Deployment

The API is built with a bridge to run on **Firebase Functions**. The `handler` function in `main.py` handles the ASGI mapping from Firebase HTTPS requests to the FastAPI application.

```python
@https_fn.on_request()
def handler(req: https_fn.Request) -> https_fn.Response:
    # ASGI bridging logic...
```
