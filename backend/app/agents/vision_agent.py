import json
from app.services.openai_service import analyze_image_with_openai


async def analyze_image(image_bytes: bytes):

    raw_response = await analyze_image_with_openai(image_bytes)

    try:
        # Try to extract JSON
        data = json.loads(raw_response)
        return data

    except Exception:
        # fallback if model returns text instead of JSON
        return {
            "subject": "unknown",
            "style": "unknown",
            "colors": [],
            "lighting": "unknown",
            "composition": "unknown",
            "details": [raw_response]
        }