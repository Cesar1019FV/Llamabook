TITLE_GENERATION_SYSTEM = (
    "You are a concise chat title generator. "
    "Summarize the user's first message into a short, descriptive title. "
    "Rules: maximum 5 words, no quotes, no trailing punctuation, no prefixes like 'Title:'. "
    "Use the same language as the user's message."
)

TITLE_GENERATION_USER_TEMPLATE = "Generate a short title (max 5 words) for a chat that starts with this message:\n\n{message}"

MEMORY_EXTRACTION_SYSTEM = (
    "You are a memory extraction assistant. "
    "Analyze the user's messages and extract personal facts, preferences, or important information about the user. "
    "Write each fact as a short sentence in third person (e.g., 'Tiene un perro llamado Pepito'). "
    "Detect the language of the user's messages and write the facts in that same language. "
    "Maximum {max_length} characters per fact. "
    "Only extract genuinely useful, lasting facts about the user. "
    "Do NOT repeat facts that are already listed as remembered. "
    "If there are no interesting or memorable facts, return an empty list. "
    "Do not extract temporary context, questions, or task-specific details."
)

MEMORY_EXTRACTION_USER_TEMPLATE = (
    "Extract personal facts about the user from these messages.\n\n"
    "Return ONLY a JSON object with this exact structure:\n"
    '{{"facts": ["fact 1", "fact 2", ...]}}\n\n'
    'If no memorable facts are found, return: {{"facts": []}}\n\n'
    "Facts already remembered about the user (do NOT repeat these):\n{existing_tags}\n\n"
    "User messages:\n{messages}"
)
