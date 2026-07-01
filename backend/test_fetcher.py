import asyncio

from app.scanners.scanner_context import ScannerContext
from app.scanners.fetcher import Fetcher
from app.scanners.url_validator import URLValidator


async def main():

    validation = URLValidator.validate("https://example.com")

    if not validation["success"]:
        print(validation)
        return

    context = ScannerContext(
        target_url="https://example.com"
    )

    context.normalized_url = validation["normalized_url"]
    context.hostname = validation["hostname"]
    context.scheme = validation["scheme"]
    context.ip_address = validation["ip_address"]

    context = await Fetcher.fetch(context)

    print("=" * 60)

    print("Status:", context.status_code)

    print("Response Time:", context.response_time_ms)

    print("Final URL:", context.final_url)

    print("Headers:", len(context.headers))

    print("Cookies:", len(context.cookies))

    print("HTML Length:", len(context.html))

    print("=" * 60)


asyncio.run(main())