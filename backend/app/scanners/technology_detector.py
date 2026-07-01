import re


class TechnologyDetector:

    @staticmethod
    def detect(headers: dict, html: str):

        technologies = set()

        # --------------------------
        # 1. HEADER-BASED DETECTION
        # --------------------------

        server = headers.get("server", "").lower()
        powered_by = headers.get("x-powered-by", "").lower()

        if "php" in powered_by:
            technologies.add("PHP")

        if "express" in powered_by:
            technologies.add("Express.js")

        if "asp.net" in powered_by:
            technologies.add("ASP.NET")

        if "nginx" in server:
            technologies.add("Nginx")

        if "apache" in server:
            technologies.add("Apache")

        # --------------------------
        # 2. HTML-BASED DETECTION
        # --------------------------

        if "wp-content" in html or "wordpress" in html.lower():
            technologies.add("WordPress")

        if "react" in html.lower():
            technologies.add("React")

        if "angular" in html.lower():
            technologies.add("Angular")

        if "vue" in html.lower():
            technologies.add("Vue.js")

        if "django" in html.lower():
            technologies.add("Django")

        if "laravel" in html.lower():
            technologies.add("Laravel")

        # --------------------------
        # 3. SCRIPT FINGERPRINTING
        # --------------------------

        if re.search(r"jquery", html, re.IGNORECASE):
            technologies.add("jQuery")

        if re.search(r"bootstrap", html, re.IGNORECASE):
            technologies.add("Bootstrap")

        # --------------------------
        # FINAL OUTPUT
        # --------------------------

        return {
            "technologies": list(technologies)
        }