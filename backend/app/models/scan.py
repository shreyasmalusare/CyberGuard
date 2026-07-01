from __future__ import annotations

from datetime import datetime

from sqlalchemy import Enum
from sqlalchemy import Float
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.database.base import Base
from app.models.base_model import BaseModel
from app.core.enums.scan_status import ScanStatus


class Scan(Base, BaseModel):
    __tablename__ = "scans"

    scan_reference: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        index=True,
        nullable=False,
    )

    target_url: Mapped[str] = mapped_column(
        String(2048),
        nullable=False,
        index=True,
    )

    status: Mapped[ScanStatus] = mapped_column(
        Enum(ScanStatus),
        default=ScanStatus.QUEUED,
        nullable=False,
        index=True,
    )

    progress: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    current_stage: Mapped[str] = mapped_column(
        String(100),
        default="Queued",
        nullable=False,
    )

    risk_score: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
    )

    total_urls: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    total_findings: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    critical_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    high_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    medium_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    low_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    info_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    finished_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )