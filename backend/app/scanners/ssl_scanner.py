import ssl
import socket
from datetime import datetime
from urllib.parse import urlparse


class SSLScanner:

    DEFAULT_PORT = 443

    @staticmethod
    def scan(url: str):

        try:
            parsed = urlparse(url)
            hostname = parsed.hostname

            if not hostname:
                return {
                    "enabled": False,
                    "error": "Invalid hostname"
                }

            context = ssl.create_default_context()

            with socket.create_connection((hostname, SSLScanner.DEFAULT_PORT), timeout=10) as sock:

                with context.wrap_socket(sock, server_hostname=hostname) as ssock:

                    cert = ssock.getpeercert()

                    valid_from = datetime.strptime(
                        cert["notBefore"],
                        "%b %d %H:%M:%S %Y %Z"
                    )

                    valid_until = datetime.strptime(
                        cert["notAfter"],
                        "%b %d %H:%M:%S %Y %Z"
                    )

                    days_remaining = (valid_until - datetime.utcnow()).days

                    return {
                        "enabled": True,
                        "issuer": cert.get("issuer"),
                        "subject": cert.get("subject"),
                        "valid_from": str(valid_from),
                        "valid_until": str(valid_until),
                        "days_remaining": days_remaining,
                        "expired": days_remaining < 0,
                        "tls_version": ssock.version(),
                        "cipher": ssock.cipher()[0],
                        "issues": []
                    }

        except Exception as e:
            return {
                "enabled": False,
                "error": str(e),
                "issues": [
                    {
                        "type": "SSL_ERROR",
                        "severity": "HIGH",
                        "details": str(e)
                    }
                ]
            }