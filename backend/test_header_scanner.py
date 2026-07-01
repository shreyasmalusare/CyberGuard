import asyncio

from app.scanner.fetcher import Fetcher
from app.scanner.header_scanner import HeaderScanner


async def main():

    result = await Fetcher.fetch("https://example.com")

    if not result["success"]:
        print(result)
        return

    findings = HeaderScanner.scan(result["headers"])

    print("=" * 60)

    print("Detected Vulnerabilities")

    print("=" * 60)

    for finding in findings:

        print()

        print("Title :", finding["title"])

        print("Severity :", finding["severity"])

        print("Evidence :", finding["evidence"])

        print("Recommendation :", finding["recommendation"])

        print("-" * 60)


asyncio.run(main())