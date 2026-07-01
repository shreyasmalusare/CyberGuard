import re
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup


class Crawler:

    MAX_PAGES = 30

    @staticmethod
    def extract_links(base_url: str, html: str):

        soup = BeautifulSoup(html, "html.parser")

        links = set()

        for tag in soup.find_all("a", href=True):
            href = tag["href"]

            full_url = urljoin(base_url, href)
            parsed = urlparse(full_url)

            # keep only http/https
            if parsed.scheme not in ["http", "https"]:
                continue

            links.add(full_url)

        return list(links)


    @staticmethod
    def filter_same_domain(base_url: str, links: list):

        base_domain = urlparse(base_url).netloc

        filtered = []

        for link in links:
            if urlparse(link).netloc == base_domain:
                filtered.append(link)

        return list(set(filtered))


    @staticmethod
    def crawl(fetcher_result: dict, base_url: str):

        html = fetcher_result.get("html", "")

        if not html:
            return {
                "pages": []
            }

        # 1. extract links
        links = Crawler.extract_links(base_url, html)

        # 2. filter domain
        links = Crawler.filter_same_domain(base_url, links)

        # 3. limit crawling scope
        links = links[:Crawler.MAX_PAGES]

        # 4. structure output
        pages = []

        for link in links:
            pages.append({
                "url": link,
                "scanned": False
            })

        return {
            "pages": pages
        }