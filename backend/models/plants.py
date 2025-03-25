from sqlalchemy import (
    Table,
    Column,
    Integer,
    String
)
from db import Base, PlantEngine, PlantSession

engine = PlantEngine
Session = PlantSession

class Plant(Base):
    __tablename__ = 'plants'
    id = Column(Integer, primary_key=True, autoincrement=True)
    plant_name = Column(String, nullable=False)
    sunlight = Column(String, nullable=False)
    water = Column(String, nullable=False)
    soil = Column(String, nullable=False)
    plant_name_scientific = Column(String, nullable=True)
    companions = Column(String, nullable=True)
    varieties = Column(String, nullable=True)
    notes = Column(String, nullable=True)

    
     
