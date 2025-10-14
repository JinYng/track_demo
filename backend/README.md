# AI Genomics Assistant - Backend

FastAPI-based backend for the AI Genomics Assistant application.

## Features

- **FastAPI**: Modern, fast web framework for building APIs
- **Automatic Documentation**: OpenAPI/Swagger docs at `/docs`
- **Type Safety**: Full Python type hints and validation
- **AI Integration**: Ready for AI/ML model integration
- **Genomics Support**: Built-in support for genomic file formats
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Caching**: Redis for caching and session management

## Quick Start

### Using Poetry (Recommended)

```bash
# Install dependencies
poetry install

# Activate virtual environment
poetry shell

# Run development server
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Using pip

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/api/v1/openapi.json

## API Endpoints

### AI Analysis

- `POST /api/v1/ai/analyze` - Analyze genomic data
- `GET /api/v1/ai/models` - List available AI models

### Data Management

- `POST /api/v1/data/upload` - Upload genomic files
- `GET /api/v1/data/files` - List uploaded files
- `GET /api/v1/data/files/{file_id}` - Get file information
- `DELETE /api/v1/data/files/{file_id}` - Delete file

### Knowledge Base

- `GET /api/v1/knowledge/search` - Search knowledge base
- `GET /api/v1/knowledge/categories` - List categories
- `GET /api/v1/knowledge/entries/{entry_id}` - Get knowledge entry

### Session Management

- `POST /api/v1/sessions/` - Create analysis session
- `GET /api/v1/sessions/` - List sessions
- `GET /api/v1/sessions/{session_id}` - Get session details
- `PUT /api/v1/sessions/{session_id}` - Update session
- `DELETE /api/v1/sessions/{session_id}` - Delete session

## Development

### Code Quality

```bash
# Format code
poetry run black .
poetry run isort .

# Lint code
poetry run flake8 .
poetry run mypy .

# Run tests
poetry run pytest
```

### Database Migration

```bash
# Create migration
poetry run alembic revision --autogenerate -m "Description"

# Apply migration
poetry run alembic upgrade head
```

## Supported File Formats

- **VCF** (Variant Call Format)
- **BAM** (Binary Alignment Map)
- **FASTA** (FASTA sequence format)
- **GFF/GTF** (General Feature Format)
- **BED** (Browser Extensible Data)

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

See `.env.example` for all available configuration options.
