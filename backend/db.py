from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os


Base = declarative_base()

plant_db_path = os.path.abspath('backend/database/plants.db')

db_dir = os.path.dirname(plant_db_path)
os.makedirs(db_dir, exist_ok=True)

PlantEngine = create_engine(f"sqlite:///{plant_db_path}")
PlantSession = sessionmaker(bind=PlantEngine)

import models

Base.metadata.create_all(PlantEngine, checkfirst=True)