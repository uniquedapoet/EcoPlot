from flask import Blueprint, request, jsonify
from models.plants import Plant

plants_bp = Blueprint('plants', __name__)


@plants_bp.route('/', methods=['GET'])
def plants():
    plants = Plant.plants()

    if plants:
        return jsonify({'plants': plants})

    else:
        return jsonify({"error": "error fetching plant data"})


@plants_bp.route("/recommend", methods=["POST"])
def recommend():
    garden_specs = request.json

    try:
        recommendations = Plant.recommend(garden_specs)

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
