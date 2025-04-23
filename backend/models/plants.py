from sqlalchemy import (
    Table,
    Column,
    Integer,
    String,
    or_
)
from db import Base, PlantEngine, PlantSession
from pathlib import Path
import pandas as pd
from typing import List
from sqlalchemy.exc import IntegrityError

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
    spacing = Column(String, nullable=True)

    @staticmethod
    def create_table_from_csv(file_location: Path):
        session = Session()
        try:
            plants_table = pd.read_csv(file_location, index_col=0)

            for _, row in plants_table.iterrows():
                plant = Plant(**row.to_dict())
                session.add(plant)

            session.commit()
            return 'Plants Table Created'

        except FileNotFoundError as e:
            return f'Error Creating Plants Table ({e})'

        finally:
            session.close()

    @staticmethod
    def plants():
        session = Session()
        try:
            plants = session.query(Plant).all()
            plants = [{column.key: getattr(
                plant, column.key) for column in Plant.__table__.columns
            } for plant in plants]

            return plants

        except IntegrityError as e:
            return f'Problem returning plant data ({e})'

        finally:
            session.close()

    @staticmethod
    def create_table():
        Base.metadata.create_all(PlantEngine, checkfirst=True)

    # !!! ORDER RECCOMENDATIONS BECAUSE A LOT ARE RETURNED !!!
    @staticmethod
    def recommend(sunlight: str, water: str, soil: str) -> List[str]:
        session = Session()
        try:
            final_query = session.query(Plant)

            matched_plants = []
            query = []

            if sunlight:
                query.append(Plant.sunlight == sunlight)

            if water:
                query.append(Plant.water == water)

            if soil:
                query.append(Plant.soil == soil)

            final_query = final_query.filter(or_(*query))

            plants = final_query.all()

            plants = [{column.name: getattr(
                plant, column.name)for column in Plant.__table__.columns
            } for plant in plants]

            for plant in plants:
                match_count = 0

                if plant['sunlight'] == sunlight:
                    match_count += 1

                if plant['soil'] == soil:
                    match_count += 1.5

                if plant['water'] == water:
                    match_count += 1

                plant['match_count'] = match_count
                matched_plants.append(plant)

            matched_plants.sort(key = lambda x: x['match_count'], reverse=True)

            return matched_plants[:15]

        except IntegrityError as e:
            return f'Error finding recommended plants ({e})'
        
        finally:
            session.close()
        
    @staticmethod
    def remove_all_plants():
        session = Session()
        try:
            session.query(Plant).delete()
            session.commit()

        except IntegrityError as e:
            return f'Error Finding Plants Table {e}'
        
        finally:
            session.close()
