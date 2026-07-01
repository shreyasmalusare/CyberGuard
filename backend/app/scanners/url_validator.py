from urllib.parse import urlparse
import socket


class URLValidator:
    """
    Validates and normalizes target URLs before scanning.
    """

    @staticmethod
    def validate(url: str) -> dict:

        if not url:
            return {
                "success": False,
                "error": "URL cannot be empty."
            }

        url = url.strip()

        # Parse first
        parsed = urlparse(url)

        # Add HTTPS only if no scheme exists
        if not parsed.scheme:
            url = "https://" + url
            parsed = urlparse(url)

        # Allow only HTTP and HTTPS
        if parsed.scheme.lower() not in ("http", "https"):
            return {
                "success": False,
                "error": "Only HTTP and HTTPS URLs are supported."
            }

        # Validate hostname
        if not parsed.hostname:
            return {
                "success": False,
                "error": "Invalid hostname."
            }

        try:
            ip_address = socket.gethostbyname(parsed.hostname)

        except socket.gaierror:
            return {
                "success": False,
                "error": "DNS lookup failed."
            }

        return {
            "success": True,
            "normalized_url": url,
            "hostname": parsed.hostname,
            "scheme": parsed.scheme,
            "ip_address": ip_address,
        }