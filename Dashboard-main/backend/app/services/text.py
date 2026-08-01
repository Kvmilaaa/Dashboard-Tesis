import re
from functools import lru_cache

DEFAULT_STOPWORDS_ES = {
    "de",
    "la",
    "que",
    "el",
    "en",
    "y",
    "a",
    "los",
    "del",
    "se",
    "las",
    "por",
    "un",
    "para",
    "con",
    "no",
    "una",
}


@lru_cache(maxsize=1)
def _load_stopwords() -> set[str]:
    try:
        from nltk.corpus import stopwords

        return set(stopwords.words("spanish"))
    except Exception:
        return DEFAULT_STOPWORDS_ES


def clean_text(text: str | None) -> str:
    if text is None:
        return ""

    normalized = re.sub(r"[^\w\s]", "", str(text).lower())
    stopwords_es = _load_stopwords()
    words = [word for word in normalized.split() if word and word not in stopwords_es]
    return " ".join(words)
