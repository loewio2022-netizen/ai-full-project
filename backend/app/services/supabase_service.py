import os
import hashlib
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def hash_image(image_bytes: bytes) -> str:
    return hashlib.sha256(image_bytes).hexdigest()


async def get_cached_result(image_bytes: bytes):
    image_hash = hash_image(image_bytes)

    response = supabase.table("generations") \
        .select("*") \
        .eq("image_hash", image_hash) \
        .execute()

    if response.data:
        return response.data[0]

    return None


async def save_generation(image_bytes, original_json, variations, prompts, images):

    image_hash = hash_image(image_bytes)

    data = {
        "image_hash": image_hash,
        "original_json": original_json,
        "variations": variations,
        "prompts": prompts,
        "images": images
    }

    supabase.table("generations").insert(data).execute()