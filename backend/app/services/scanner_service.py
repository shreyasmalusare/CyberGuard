import asyncio

from app.scanners.fetcher import Fetcher
from app.scanners.crawler import Crawler
from app.scanners.ssl_scanner import SSLScanner
from app.scanners.cookie_scanner import CookieScanner
from app.scanners.header_scanner import HeaderScanner
from app.scanners.technology_detector import TechnologyDetector
from app.scanners.vulnerability_engine import VulnerabilityEngine


class ScannerService:

    @staticmethod
    async def run_full_scan(url: str):

        # -----------------------------
        # 1. FETCH PHASE
        # -----------------------------
        fetch_result = await Fetcher.fetch(url)

        if not fetch_result.get("success"):
            return {
                "success": False,
                "error": fetch_result.get("error")
            }

        html = fetch_result.get("html", "")
        headers = fetch_result.get("headers", {})

        # -----------------------------
        # 2. CRAWLER PHASE
        # -----------------------------
        crawler_result = Crawler.crawl(fetch_result, url)
        pages = crawler_result.get("pages", [])

        # -----------------------------
        # 3. SCANNER PHASE (CORE)
        # -----------------------------
        ssl_result = SSLScanner.scan(url)
        cookie_result = CookieScanner.scan(fetch_result.get("cookies", []))
        header_result = HeaderScanner.scan(headers)
        tech_result = TechnologyDetector.detect(headers, html)

        # -----------------------------
        # 4. MERGE ANALYSIS DATA
        # -----------------------------
        scan_data = {
            "cookies": cookie_result,
            "headers": header_result,
            "ssl": ssl_result,
            "technologies": tech_result.get("technologies", []),
            "pages": pages
        }

        # -----------------------------
        # 5. VULNERABILITY ENGINE
        # -----------------------------
        report = VulnerabilityEngine.analyze(scan_data)

        # -----------------------------
        # 6. FINAL RESPONSE (FRONTEND READY)
        # -----------------------------
        return {
            "success": True,
            "target": url,

            "scan_summary": {
                "status_code": fetch_result.get("status_code"),
                "response_time_ms": fetch_result.get("response_time_ms"),
                "final_url": fetch_result.get("final_url")
            },

            "analysis": {
                "technologies": tech_result.get("technologies", []),
                "pages": pages
            },

            "raw": {
                "headers": header_result,
                "cookies": cookie_result,
                "ssl": ssl_result
            },

            "report": report
        }