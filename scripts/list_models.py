import asyncio
import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv(".env.local")

async def main():
    client = AsyncOpenAI(api_key=os.environ.get('GOOGLE_API_KEY'), base_url='https://generativelanguage.googleapis.com/v1beta/openai/')
    models = await client.models.list()
    for m in models.data:
        print(m.id)

if __name__ == "__main__":
    asyncio.run(main())
