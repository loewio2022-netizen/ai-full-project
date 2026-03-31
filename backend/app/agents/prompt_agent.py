async def build_prompts(variations):

    prompts = []

    for v in variations:
        prompt = f"""
        {v.get("subject", "")},
        in {v.get("style", "")},
        with {v.get("lighting", "")},

        color palette: {", ".join(v.get("colors", []))},

        composition: {v.get("composition", "")},

        details: {", ".join(v.get("details", []))},

        ultra high quality, cinematic, 4K, professional photography
        """

        prompts.append(prompt.strip())

    return prompts