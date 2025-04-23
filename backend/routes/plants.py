from flask import Blueprint, request, jsonify
from models.plants import Plant
from flask_cors import CORS

plants_bp = Blueprint('plants', __name__)
CORS(plants_bp)


@plants_bp.route('/', methods=['GET'])
def plants():
    plants = Plant.plants()

    if plants == []:
        Plant.create_table_from_csv("backend/database/Plants_Table.csv")
        plants = Plant.plants()

    return jsonify({"plants": plants})


@plants_bp.route("/recommend", methods=["POST"])
def recommend():
    garden_specs = request.json  # dict:,sunlight,water,soil,

    try:
        recommendations = Plant.recommend(**garden_specs)
        recommendations = [{key: recommendation[key] for key in list(recommendation.keys())}
                           for recommendation in recommendations]

        return jsonify({'Recommended Plants': recommendations})

    except Exception as e:

        return jsonify({'error': f'error getting plant recommendations {e}'})


@plants_bp.route("/<int:plant_id>", methods=["POST"])
def plant(plant_id):
    try:
        plant = Plant.plant(plant_id)

        return jsonify({'plant': plant})
    except Exception as e:

        return jsonify({'error': f"error getting plant data {e}"})


@plants_bp.route("/<int:plant_id>/companion", methods=["POST"])
def companion(plant_id):
    try:
        companions = Plant.companions(plant_id)

        return jsonify({'companions': companions})

    except Exception as e:

        return jsonify({'error': f'error getting companion data {e}'})
