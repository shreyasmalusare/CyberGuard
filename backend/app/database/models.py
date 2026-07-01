from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from app.database.init_db import Base


class ScanHistory(Base):

    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)

    url = Column(String, index=True)

    status_code = Column(Integer)
    final_url = Column(String)

    risk_score = Column(Integer)
    severity = Column(String)

    report = Column(Text)   # JSON stored as string

    created_at = Column(DateTime, default=datetime.utcnow)