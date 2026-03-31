import os
import base64
import asyncio
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ---------------------------
# RETRY HELPER (SYNC SAFE)
# ---------------------------
async def retry_async(func, retries=3, delay=1):
    for attempt in range(retries):
        try:
            return func()  # ✅ FIX: removed await
        except Exception as e:
            if attempt == retries - 1:
                raise e
            await asyncio.sleep(delay * (2 ** attempt))


# ---------------------------
# VISION ANALYSIS (Agent 1)
# ---------------------------
async def analyze_image_with_openai(image_bytes: bytes):

    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    def _call():  # ✅ FIX: sync function
        return client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a visual AI. Analyze images and return ONLY valid JSON. "
                        "No explanations, no text, only JSON."
                    )
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "Analyze this image and return STRICT JSON with this schema:\n"
                                "{\n"
                                "  \"subject\": \"...\",\n"
                                "  \"style\": \"...\",\n"
                                "  \"colors\": [\"...\"],\n"
                                "  \"lighting\": \"...\",\n"
                                "  \"composition\": \"...\",\n"
                                "  \"details\": [\"...\"]\n"
                                "}"
                            )
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            temperature=0.2
        )

    result = await retry_async(_call)

    content = result.choices[0].message.content

    return content


# ---------------------------
# IMAGE GENERATION (Agent 3)
# ---------------------------
async def generate_images(prompts):

    images = []

    def _generate(prompt):
        return client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            size="1024x1024"
        )

    for prompt in prompts:
        res = await retry_async(lambda: _generate(prompt))

        image_data = res.data[0]

        # ✅ Handle BOTH response types
        if hasattr(image_data, "url") and image_data.url:
            images.append(image_data.url)

        elif hasattr(image_data, "b64_json"):
            image_base64 = image_data.b64_json
            image_url = f"data:image/png;base64,{image_base64}"
            images.append(image_url)

        else:
            images.append(None)

    return images