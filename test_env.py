import os
from dotenv import load_dotenv

# Load the environment variables
load_dotenv()

# Print the API key
print(f"PINECONE_API_KEY: {os.getenv('PINECONE_API_KEY')}")
