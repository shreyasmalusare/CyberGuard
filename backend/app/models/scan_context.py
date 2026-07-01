from dataclasses import dataclass, field


@dataclass
class ScanContext:

    target_url: str

    hostname: str

    ip_address: str

    response=None

    headers: dict = field(default_factory=dict)

    cookies: list = field(default_factory=list)

    html: str = ""

    discovered_pages: list = field(default_factory=list)

    technologies: list = field(default_factory=list)

    ssl: dict = field(default_factory=dict)

    vulnerabilities: list = field(default_factory=list)

    risk_score: int = 0

    risk_level: str = "Unknown"