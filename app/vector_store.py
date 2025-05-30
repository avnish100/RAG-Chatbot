import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
from typing import List, Optional
import uuid

# Load environment variables
load_dotenv()

class VectorStore:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)
        
        # Get Pinecone API key
        api_key = os.getenv("PINECONE_API_KEY")
        if not api_key:
            raise ValueError("PINECONE_API_KEY environment variable is not set")
            
        try:
            # Initialize Pinecone with debug info
            print(f"Initializing Pinecone with API key: {api_key[:8]}...")  # Only print first 8 chars for security
            self.pc = Pinecone(
                api_key=api_key.strip()  # Ensure no whitespace
            )
            
            # Get or create index
            index_name = os.getenv("PINECONE_INDEX_NAME", "support-bot")
            print(f"Using index name: {index_name}")
            
            # Check if index exists and create if it doesn't
            try:
                indexes = [index.name for index in self.pc.list_indexes()]
                if index_name not in indexes:
                    print(f"Creating new Pinecone index: {index_name}")
                    self.pc.create_index(
                        name=index_name,
                        dimension=384,  # matches all-MiniLM-L6-v2 embeddings
                        metric="cosine",
                        spec=ServerlessSpec(
                            cloud="aws",
                            region="us-east-1"
                        )
                    )
                self.index = self.pc.Index(index_name)
            except Exception as e:
                raise RuntimeError(f"Failed to create or access Pinecone index: {str(e)}")
                
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Pinecone: {str(e)}")

    def add_documents(self, texts: List[str]) -> None:
        if not texts:
            return
            
        # Create embeddings
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        
        # Prepare vectors for Pinecone
        vectors = []
        for i, (text, embedding) in enumerate(zip(texts, embeddings)):
            vector_id = str(uuid.uuid4())
            vectors.append((vector_id, embedding.tolist(), {"text": text}))
        
        # Upsert to Pinecone in batches
        batch_size = 100
        for i in range(0, len(vectors), batch_size):
            batch = vectors[i:i + batch_size]
            self.index.upsert(vectors=batch)

    def search(self, query: str, top_k: int = 3) -> List[str]:
        # Create query embedding
        q_emb = self.model.encode([query], convert_to_numpy=True)
        
        # Search Pinecone
        results = self.index.query(
            vector=q_emb[0].tolist(),
            top_k=top_k,
            include_metadata=True
        )
        
        # Extract texts from results
        texts = []
        for match in results.matches:
            if match.metadata and "text" in match.metadata:
                texts.append(match.metadata["text"])
                
        return texts