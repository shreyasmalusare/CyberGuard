from app.scanners.ssl_scanner import SSLScanner

result = SSLScanner.scan(
    "https://example.com"
)

print(result)