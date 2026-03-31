import copy

VARIATION_STYLES = [
    {
        "name": "hyper_realistic",
        "style": "hyper-realistic photography, 4K, ultra detailed, sharp focus",
        "lighting": "studio lighting, highly detailed shadows",
        "extra": ["macro textures", "ultra realism"]
    },
    {
        "name": "surreal",
        "style": "surrealism, dream-like, abstract elements",
        "lighting": "soft glowing light, ethereal atmosphere",
        "extra": ["floating objects", "impossible physics"]
    },
    {
        "name": "noir",
        "style": "film noir, black and white, cinematic",
        "lighting": "high contrast, dramatic shadows",
        "extra": ["grain", "moody atmosphere"]
    },
    {
        "name": "cyberpunk",
        "style": "cyberpunk, futuristic, neon-lit",
        "lighting": "neon glow, high contrast artificial lighting",
        "extra": ["holograms", "high-tech environment"]
    }
]


async def generate_variations(json_data):

    variations = []

    for v in VARIATION_STYLES:
        new_item = copy.deepcopy(json_data)

        new_item["style"] = v["style"]
        new_item["lighting"] = v["lighting"]

        # extend details safely
        if "details" not in new_item:
            new_item["details"] = []

        new_item["details"].extend(v["extra"])

        variations.append(new_item)

    return variations
