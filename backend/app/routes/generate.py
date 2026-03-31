
from fastapi import APIRouter, UploadFile, File
from app.agents.vision_agent import analyze_image
from app.agents.variation_agent import generate_variations
from app.agents.prompt_agent import build_prompts
from app.services.openai_service import generate_images
from app.services.supabase_service import get_cached_result, save_generation

router = APIRouter()

@router.post("/generate")
async def generate(file: UploadFile = File(...)):

    image_bytes = await file.read()

    # ✅ 1. CHECK CACHE
    cached = await get_cached_result(image_bytes)
    if cached:
        return {
            "json": cached["variations"],
            "images": cached["images"]
        }

    # ✅ 2. RUN PIPELINE
    json_data = await analyze_image(image_bytes)
    variations = await generate_variations(json_data)
    prompts = await build_prompts(variations)
    images = await generate_images(prompts)

    # ✅ 3. SAVE RESULT
    await save_generation(image_bytes, json_data, variations, prompts, images)

    return {
        "json": variations,
        "images": images
    }