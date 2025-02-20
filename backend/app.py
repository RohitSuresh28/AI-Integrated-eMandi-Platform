from flask import Flask # type: ignore
from flask_cors import CORS # type: ignore
from flask import jsonify # type: ignore
from routes.farmer_routes import farmer_routes
from routes.buyer_routes import buyer_routes
from routes.logistics_routes import logistics_routes
from models.db_model import farmers, buyers, logistics

app = Flask(__name__)
CORS(app) 
app.register_blueprint(farmer_routes, url_prefix='/farmer')
app.register_blueprint(buyer_routes, url_prefix='/buyer')
app.register_blueprint(logistics_routes, url_prefix='/logistics')

# Handle User Tabs for UI
@app.route('/users', methods=['GET'])
def get_users():
    """Return all users for navbar display."""
    farmer_list = [{'id': f['_id'], 'name': f['name']} for f in farmers.find()]
    buyer_list = [{'id': b['_id'], 'name': b['name']} for b in buyers.find()]
    logistics_list = [{'id': l['_id'], 'name': l['name']} for l in logistics.find()]
    return jsonify({
        'farmers': farmer_list,
        'buyers': buyer_list,
        'logistics': logistics_list
    })

if __name__ == "__main__":
    app.run(debug=True)
