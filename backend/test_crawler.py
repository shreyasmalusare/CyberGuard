import asyncio

from app.scanners.fetcher import Fetcher
from app.scanners.crawler import Crawler


async def main():

    fetch = await Fetcher.fetch("https://example.com")

    if not fetch["success"]:
        print(fetch)
        return

    pages = Crawler.crawl(
        "https://example.com",
        fetch["html"]
    )

    print("=" * 50)

    print("Discovered URLs")

    print("=" * 50)

    for page in pages:
        print(page)


asyncio.run(main())