import time

from app.scanners.url_validator import URLValidator
from app.scanners.fetcher import Fetcher
from app.scanners.header_scanner import HeaderScanner
from app.scanners.crawler import Crawler


class ScannerEngine:

    @staticmethod
    async def scan(url: str):

        start_time = time.perf_counter()

        # -----------------------------
        # Validate URL
        # -----------------------------

        validation = URLValidator.validate(url)

        if not validation["success"]:
            return validation

        # -----------------------------
        # Fetch Website
        # -----------------------------

        fetch_result = await Fetcher.fetch(
            validation["normalized_url"]
        )

        if not fetch_result["success"]:
            return fetch_result

        # -----------------------------
        # Header Scan
        # -----------------------------

        header_findings = HeaderScanner.scan(
            fetch_result["headers"]
        )
    
         # -----------------------------
# Crawl Website
# -----------------------------

        pages = Crawler.crawl(
            validation["normalized_url"],
            fetch_result["html"]
            )


        elapsed = round(
            time.perf_counter() - start_time,
            2,
        )

        return {
    "success": True,
    "target": validation["normalized_url"],
    "hostname": validation["hostname"],
    "ip_address": validation["ip_address"],

    "scan_summary": {
        "status_code": fetch_result["status_code"],
        "response_time_ms": fetch_result["response_time_ms"],
        "scan_time_seconds": elapsed
    },

    "analysis": {
        "headers": fetch_result["headers"],
        "cookies": fetch_result["cookies"],
        "technologies": [],
        "pages": pages,
    },

    "vulnerabilities": header_findings,

    "risk": {
        "score": 0,
        "level": "Unknown"
    }
}