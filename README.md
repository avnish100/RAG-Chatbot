# AI Support Chatbot

An intelligent support chatbot built with FastAPI, Next.js, and Google's Gemini AI model, featuring document processing and semantic search capabilities.

## Features

- 🤖 AI-powered chat interface using Google's Gemini model
- 📄 Document processing and analysis
- 🔍 Semantic search using Pinecone vector database
- 🚀 FastAPI backend with modern API design
- 💻 Next.js frontend with responsive UI
- 🐳 Docker containerization for easy deployment

## Tech Stack

### Backend
- FastAPI
- Uvicorn
- OpenAI
- Sentence Transformers
- Pinecone
- LangChain
- Python 3.10

### Frontend
- Next.js
- React
- TypeScript

## Prerequisites

- Docker and Docker Compose
- Python 3.10+
- Node.js (for local frontend development)
- Google API Key
- Pinecone API Key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
GOOGLE_API_KEY=your_google_api_key
GEMINI_MODEL_ID=your_gemini_model_id
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
```

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-support-chatbot
```

2. Build and run with Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Development

### Backend Development

1. Create a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the development server:
```bash
uvicorn app.main:app --reload
```

### Frontend Development

1. Navigate to the frontend directory:
```bash
cd web/ragbot
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure
