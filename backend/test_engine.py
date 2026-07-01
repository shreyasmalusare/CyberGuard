import asyncio
from app.scanners.scanner_engine import ScannerEngine


async def main():

    result = await ScannerEngine.scan("https://example.com")

    if not result["success"]:
        print(result)
        return

    print("=" * 60)
    print("SCAN SUMMARY")
    print("=" * 60)

    print("Target:", result["target"])
    print("Hostname:", result["hostname"])
    print("IP:", result["ip_address"])
    print("Status Code:", result["scan_summary"]["status_code"])
    print("Response Time:", result["scan_summary"]["response_time_ms"], "ms")

    print("\nVulnerabilities:")
    for finding in result["vulnerabilities"]:
        print(f"[{finding['severity']}] {finding['title']}")

    print("\nDiscovered Pages:")
    for page in result["analysis"]["pages"]:
        print(page)


asyncio.run(main())