import chromadb
from sentence_transformers import SentenceTransformer
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from utils.config import CHROMA_DB_DIR, MODEL_NAME
class ChromaDBInitializer:
    _chroma_client = None
    _embedding_function = None
    _model = None
    _db_path = None
    
    @classmethod
    def get_chroma_client(cls, persist_directory=CHROMA_DB_DIR, safe_mode=True):
         if cls._chroma_client is None or cls._db_path != persist_directory:
            try:
                cls._chroma_client = chromadb.PersistentClient(path=persist_directory)
                cls._db_path = persist_directory
            except Exception as e:
                if safe_mode:
                    cls._chroma_client = chromadb.Client()
                    cls._db_path = persist_directory
                else:
                    raise e
         return cls._chroma_client

    @classmethod
    def get_embedding_function(cls):
        if cls._embedding_function is None:
            cls._embedding_function = SentenceTransformerEmbeddingFunction(model_name=MODEL_NAME)
        return cls._embedding_function

    @classmethod
    def get_model(cls):
        if cls._model is None:
            cls._model = SentenceTransformer(MODEL_NAME)
        return cls._model

    @classmethod
    def get_or_create_collection(cls, collection_name, persist_directory=CHROMA_DB_DIR):
        chroma_client = cls.get_chroma_client(persist_directory=persist_directory)
        embedding_function = cls.get_embedding_function()
        return chroma_client.get_or_create_collection(name=collection_name, embedding_function=embedding_function)
