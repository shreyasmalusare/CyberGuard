class HeaderScanner:

    REQUIRED_HEADERS = {
        "content-security-policy": {
            "severity": "HIGH",
            "title": "Missing Content Security Policy",
            "description": "Prevents XSS attacks."
        },
        "strict-transport-security": {
            "severity": "HIGH",
            "title": "Missing HSTS",
            "description": "Forces HTTPS connections."
        },
        "x-frame-options": {
            "severity": "MEDIUM",
            "title": "Missing X-Frame-Options",
            "description": "Prevents clickjacking."
        },
        "x-content-type-options": {
            "severity": "MEDIUM",
            "title": "Missing X-Content-Type-Options",
            "description": "Prevents MIME sniffing."
        },
        "referrer-policy": {
            "severity": "LOW",
            "title": "Missing Referrer Policy",
            "description": "Controls referrer leakage."
        },
        "permissions-policy": {
            "severity": "LOW",
            "title": "Missing Permissions Policy",
            "description": "Restricts browser features."
        }
    }

    @staticmethod
    def scan(headers: dict):

        findings = []
        missing_headers = []

        headers = headers or {}

        normalized = {
            k.lower(): v for k, v in headers.items()
        }

        for header, info in HeaderScanner.REQUIRED_HEADERS.items():

            if header not in normalized:

                missing_headers.append(header)

                findings.append({
                    "type": f"MISSING_{header.upper()}",
                    "severity": info["severity"],
                    "title": info["title"],
                    "description": info["description"],
                    "evidence": f"{header} missing"
                })

        return {
            "missing_headers": missing_headers,
            "findings": findings
        }