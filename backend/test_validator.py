from app.scanners.url_validator import URLValidator

urls = [
    "google.com",
    "https://github.com",
    "http://example.com",
    "invalid-domain-xyz-12345.com",
    "ftp://example.com",
    ""
]

for url in urls:
    print("=" * 50)
    print("Input:", url)
    result = URLValidator.validate(url)
    print(result)