from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from .vector_store import VectorStore


class RAGBot:
    def __init__(self, vector_store: VectorStore):
        self.vs = vector_store
        self.llm = ChatGoogleGenerativeAI(
            model=os.getenv("GEMINI_MODEL_ID", "gemini-1.5-flash"),
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0
        )
        
        # Create the RAG prompt template
        self.template = """You are an internal support bot. Answer questions using the context below.
        
Context:
{context}

Question: {question}

If the context is empty, please respond with "I don't have enough information to answer that question."
Answer the question based on the context above."""
        
        self.prompt = PromptTemplate.from_template(self.template)
        
        # Create the RAG chain with empty context handling
        def get_context(input_dict):
            results = self.vs.search(input_dict["question"])
            if not results:
                return "No relevant information found."
            return "\n".join(results)
            
        self.chain = (
            {"context": get_context, 
             "question": RunnablePassthrough()}
            | self.prompt
            | self.llm
            | StrOutputParser()
        )

    def answer_question(self, question: str) -> str:
        """
        Answer a question using the RAG system
        """
        try:
            return self.chain.invoke({"question": question})
        except Exception as e:
            return f"An error occurred: {str(e)}"