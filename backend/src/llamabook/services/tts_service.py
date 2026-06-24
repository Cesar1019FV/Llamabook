from __future__ import annotations

import re

import edge_tts

_MAX_TTS_CHARS = 5000

_CODE_BLOCK_PLACEHOLDER = "código."
_INLINE_CODE_RE = re.compile(r"`([^`]+)`")
_BOLD_ITALIC_RE = re.compile(r"\*{1,3}([^*]+)\*{1,3}|_{1,3}([^_]+)_{1,3}")
_STRIKE_RE = re.compile(r"~~([^~]+)~~")
_LINK_RE = re.compile(r"\[([^\]]*)\]\([^)]+\)")
_IMAGE_RE = re.compile(r"!\[([^\]]*)\]\([^)]+\)")
_HEADING_RE = re.compile(r"^#{1,6}\s+", re.MULTILINE)
_BLOCKQUOTE_RE = re.compile(r"^\s*>\s?", re.MULTILINE)
_LIST_ITEM_RE = re.compile(r"^\s*[-*+]\s+", re.MULTILINE)
_ORDERED_ITEM_RE = re.compile(r"^\s*\d+\.\s+", re.MULTILINE)
_HR_RE = re.compile(r"^\s*([-*_])\1{2,}\s*$", re.MULTILINE)
_CODE_FENCE_RE = re.compile(r"```[^\n]*\n[\s\S]*?```", re.MULTILINE)
_TABLE_SEPARATOR_RE = re.compile(r"^\s*\|?[\s:|-]+\|?\s*$", re.MULTILINE)
_TABLE_PIPE_RE = re.compile(r"\|")
_HTML_TAG_RE = re.compile(r"<[^>]+>")
_EMOJI_RE = re.compile(
    "["
    "\U0001f600-\U0001f64f"
    "\U0001f300-\U0001f5ff"
    "\U0001f680-\U0001f6ff"
    "\U0001f1e0-\U0001f1ff"
    "\U00002500-\U00002bef"
    "\U00002700-\U000027bf"
    "\U0001f900-\U0001f9ff"
    "\U00002600-\U000026ff"
    "\U0001fa00-\U0001fa6f"
    "\U0001fa70-\U0001faff"
    "]",
    flags=re.UNICODE,
)
_WHITESPACE_RE = re.compile(r"[ \t]+")
_MULTI_NEWLINE_RE = re.compile(r"\n{3,}")


def clean_text_for_tts(markdown_text: str) -> str:
    text = _CODE_FENCE_RE.sub(_CODE_BLOCK_PLACEHOLDER, markdown_text)
    text = _IMAGE_RE.sub(r"\1", text)
    text = _LINK_RE.sub(r"\1", text)
    text = _INLINE_CODE_RE.sub(r"\1", text)
    text = _BOLD_ITALIC_RE.sub(r"\1\2", text)
    text = _STRIKE_RE.sub(r"\1", text)
    text = _TABLE_SEPARATOR_RE.sub("", text)
    text = _TABLE_PIPE_RE.sub(" ", text)
    text = _HEADING_RE.sub("", text)
    text = _BLOCKQUOTE_RE.sub("", text)
    text = _LIST_ITEM_RE.sub("", text)
    text = _ORDERED_ITEM_RE.sub("", text)
    text = _HR_RE.sub("", text)
    text = _HTML_TAG_RE.sub("", text)
    text = _EMOJI_RE.sub("", text)
    text = _WHITESPACE_RE.sub(" ", text)
    text = _MULTI_NEWLINE_RE.sub("\n\n", text)
    text = text.strip()
    if len(text) > _MAX_TTS_CHARS:
        text = text[:_MAX_TTS_CHARS]
    return text


async def generate_audio(text: str, voice: str) -> bytes:
    communicate = edge_tts.Communicate(text, voice)
    chunks: list[bytes] = []
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            chunks.append(chunk["data"])
    return b"".join(chunks)


TTS_VOICES: dict[str, list[dict[str, str]]] = {
    "es": [
        {"id": "es-ES-AlvaroNeural", "label": "Álvaro (España)"},
        {"id": "es-AR-ElenaNeural", "label": "Elena (Argentina)"},
        {"id": "es-MX-GerardoNeural", "label": "Gerardo (México)"},
    ],
    "en": [
        {"id": "en-US-GuyNeural", "label": "Guy (US)"},
        {"id": "en-US-JennyNeural", "label": "Jenny (US)"},
        {"id": "en-GB-RyanNeural", "label": "Ryan (UK)"},
    ],
}


def get_default_voice(lang: str) -> str:
    voices = TTS_VOICES.get(lang) or TTS_VOICES["es"]
    return voices[0]["id"]
