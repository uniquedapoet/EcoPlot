from flask import Flask
from flask_cors import CORS
from routes.plants import plants_bp
from models.plants import Plant

app = Flask(__name__)
CORS(app=app)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.register_blueprint(plants_bp, url_prefix='/plants')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005)