from pathlib import Path

ALLOWED_MIME_PREFIXES = (
    "text/",
    "application/pdf",
    "application/json",
    "application/xml",
    "application/markdown",
    "application/x-yaml",
    "application/vnd.openxmlformats",
    "application/msword",
    "application/vnd.ms-excel",
    "application/vnd.ms-powerpoint",
    "application/rtf",
    "image/",
    "audio/",
    "video/",
)

BLOCKED_EXTENSIONS = {
    ".exe",
    ".dll",
    ".bat",
    ".cmd",
    ".sh",
    ".com",
    ".app",
    ".msi",
    ".jar",
    ".py",
    ".pyc",
    ".js",
    ".vbs",
    ".ps1",
}


def is_mime_allowed(mime_type: str, filename: str) -> bool:
    ext = Path(filename).suffix.lower()
    if ext in BLOCKED_EXTENSIONS:
        return False
    return any(mime_type.lower().startswith(prefix) for prefix in ALLOWED_MIME_PREFIXES)


def safe_filename(name: str) -> str:
    cleaned = "".join(c for c in name if c.isalnum() or c in " ._-").strip()
    if not cleaned:
        cleaned = "upload"
    return cleaned
