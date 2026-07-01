import time
import httpx


class Fetcher:

    TIMEOUT = 15

    @staticmethod
    async def fetch(url: str):

        start = time.perf_counter()

        try:

            async with httpx.AsyncClient(
                follow_redirects=True,
                timeout=Fetcher.TIMEOUT,
                verify=True,
                headers={
                    "User-Agent": "CyberVulScanner/1.0"
                }
            ) as client:

                response = await client.get(url)

            elapsed = round(
                (time.perf_counter() - start) * 1000,
                2
            )

            cookies = []

            for cookie in response.cookies.jar:

                cookies.append({
                    "name": cookie.name,
                    "value": cookie.value,
                    "domain": cookie.domain,
                    "path": cookie.path,
                    "secure": cookie.secure,
                    "expires": cookie.expires,
                    "rest": dict(cookie._rest) if hasattr(cookie, "_rest") else {}
                })

            return {

                "success": True,
                "status_code": response.status_code,
                "final_url": str(response.url),
                "response_time_ms": elapsed,
                "headers": dict(response.headers),
                "cookies": cookies,
                "html": response.text

            }

        except Exception as e:

            return {

                "success": False,
                "error": str(e)

            }