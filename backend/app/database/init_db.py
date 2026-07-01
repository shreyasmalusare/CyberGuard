from app.database.base import Base
from app.database.database import engine

# Import all models here
from app.models.scan import Scan


def init_database():
    Base.metadata.create_all(bind=engine)