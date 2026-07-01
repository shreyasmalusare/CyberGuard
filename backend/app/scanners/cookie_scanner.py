class CookieScanner:

    @staticmethod
    def scan(cookies: list):

        analyzed_cookies = []

        for cookie in cookies:

            name = cookie.get("name")
            value = cookie.get("value")
            secure = cookie.get("secure", False)
            expires = cookie.get("expires")

            rest = cookie.get("rest", {}) or {}

            # Extract hidden attributes safely
            httponly = "HttpOnly" in rest
            samesite = rest.get("SameSite")

            issues = []

            # -------------------------
            # Stage 2: Security checks
            # -------------------------

            # 1. Secure flag check
            if not secure:
                issues.append({
                    "type": "MISSING_SECURE_FLAG",
                    "severity": "HIGH"
                })

            # 2. HttpOnly check
            if not httponly:
                issues.append({
                    "type": "MISSING_HTTPONLY_FLAG",
                    "severity": "HIGH"
                })

            # 3. SameSite check
            if not samesite:
                issues.append({
                    "type": "MISSING_SAMESITE_POLICY",
                    "severity": "MEDIUM"
                })
            else:
                if samesite.lower() == "none":
                    issues.append({
                        "type": "SAMESITE_NONE_RISK",
                        "severity": "MEDIUM"
                    })

            # 4. Expiry check (session vs persistent)
            if expires is None:
                issues.append({
                    "type": "SESSION_COOKIE_DETECTED",
                    "severity": "INFO"
                })

            # 5. Weak cookie name patterns
            weak_keywords = ["session", "sid", "token", "auth", "jwt"]

            if any(k in name.lower() for k in weak_keywords):
                issues.append({
                    "type": "POTENTIALLY_SENSITIVE_COOKIE",
                    "severity": "INFO"
                })

            # -------------------------
            # Stage 3: Build result
            # -------------------------

            analyzed_cookies.append({
                "name": name,
                "value": value,
                "secure": secure,
                "httponly": httponly,
                "samesite": samesite,
                "expires": expires,
                "issues": issues
            })

        return {
            "cookies": analyzed_cookies
        }