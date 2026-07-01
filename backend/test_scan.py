import asyncio
from app.services.scanner_service import ScannerService


async def run_test():

    url = "https://example.com"

    print("\n🚀 Starting scan test...\n")

    result = await ScannerService.run_full_scan(url)

    print("\n================ RESULT ================\n")
    print(result)
    print("\n========================================\n")


if __name__ == "__main__":
    asyncio.run(run_test())