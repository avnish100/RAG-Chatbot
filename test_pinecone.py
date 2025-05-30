import os
from pinecone import Pinecone
api_key = os.getenv("PINECONE_API_KEY")
print(f"API Key found: {bool(api_key)}")
print(f"API Key length: {len(api_key) if api_key else 0}")
try:
    pc = Pinecone(api_key=api_key.strip())
    print("Pinecone initialized successfully")
    indexes = pc.list_indexes()
    print(f"Available indexes: {[idx.name for idx in indexes]}")
except Exception as e:
    print(f"Error: {str(e)}")
