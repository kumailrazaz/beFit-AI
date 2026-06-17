import re
from pathlib import Path


TOKEN_RE = re.compile(r"[a-zA-Z][a-zA-Z0-9-]{2,}")


class RAGService:
    def __init__(self, knowledge_dir: Path | None = None) -> None:
        self.knowledge_dir = knowledge_dir or Path(__file__).resolve().parents[1] / "knowledge"
        self.documents: dict[str, str] = {}

    def load(self) -> None:
        self.documents = {
            path.stem: path.read_text(encoding="utf-8")
            for path in sorted(self.knowledge_dir.glob("*.md"))
        }

    def retrieve(self, query: str) -> str | None:
        if not self.documents:
            self.load()

        query_terms = set(TOKEN_RE.findall(query.lower()))
        if not query_terms:
            return None

        best_score = 0
        best_document: str | None = None

        for topic, content in self.documents.items():
            corpus = f"{topic} {content}".lower()
            score = sum(corpus.count(term) for term in query_terms)
            if topic.lower() in query.lower():
                score += 3
            if score > best_score:
                best_score = score
                best_document = content

        return best_document if best_score > 0 else None


rag_service = RAGService()
