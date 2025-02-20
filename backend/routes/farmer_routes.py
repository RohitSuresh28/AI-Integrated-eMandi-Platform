from flask import Blueprint, request, jsonify  # type: ignore
from bson.objectid import ObjectId  # type: ignore
from models.db_model import farmers, produce, bids
import mysql.connector
from utils.auth import check_credentials

farmer_routes = Blueprint('farmer_routes', __name__)

# MySQL connection setup
mysql_conn = None
try:
    mysql_conn = mysql.connector.connect(
        host='localhost',       # Replace with your MySQL host
        user='User_name',            # Replace with your MySQL username
        password='Password',  # Replace with your MySQL password
        database='agri_analysis'  # Replace with your MySQL database name
    )

    if mysql_conn.is_connected():
        print("MySQL connected successfully!")
    else:
        print("Failed to connect to MySQL.")

except mysql.connector.Error as err:
    print(f"MySQL Error: {err}")
    mysql_conn = None

# @farmer_routes.route('/login', methods=['POST'])
# def login_farmer():
#     data = request.json
#     email = data.get('email')
#     password = data.get('password')
#     if not email or not password:
#         return jsonify({'error': 'Email and password are required'}), 400
#     return check_credentials(email, password, 'farmers', mysql_conn)
# Register a farmer
@farmer_routes.route('/register', methods=['POST'])
def register_farmer():
    try:
        data = request.json
        # MongoDB logging
        farmer_id = farmers.insert_one(data).inserted_id
        print(f"Farmer registered with MongoDB ID: {farmer_id}")

        # MySQL logging
        if mysql_conn:
            cursor = mysql_conn.cursor()
            query = "INSERT INTO farmers (name, contact_info, location, produce_type) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (data['name'], data['contact_info'], data['location'], data['produce_type'], ))
            mysql_conn.commit()
            cursor.close()
            print("Farmer data inserted into MySQL successfully!")
        else:
            print("Cannot execute query: MySQL connection is not established.")

        return jsonify({"message": "Farmer registered successfully!", "farmer_id": str(farmer_id)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add produce
@farmer_routes.route('/produce', methods=['POST'])
def add_produce():
    try:
        data = request.json
        data['produce_id'] = str(ObjectId())  # Assign unique produce ID
        produce_id = produce.insert_one(data).inserted_id

        # MySQL logging
        if mysql_conn:
            cursor = mysql_conn.cursor()
            query = "INSERT INTO produce (produce_id, name, quantity) VALUES (%s, %s, %s)"
            cursor.execute(query, (data['produce_id'], data['name'], data['quantity']))
            mysql_conn.commit()
            cursor.close()
            print("Produce data inserted into MySQL successfully!")
        else:
            print("Cannot execute query: MySQL connection is not established.")

        return jsonify({"message": "Produce added successfully!", "produce": {**data, "_id": str(produce_id)}})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch all produce
@farmer_routes.route('/produce', methods=['GET'])
def get_produce():
    try:
        produce_list = list(produce.find())
        for item in produce_list:
            item['_id'] = str(item['_id'])
            item['produce_id'] = item.get('produce_id', str(ObjectId()))  # Ensure produce_id is a string
        return jsonify(produce_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch all bids
@farmer_routes.route('/bids', methods=['GET'])
def get_bids():
    try:
        bid_list = list(bids.find())
        for bid in bid_list:
            bid['_id'] = str(bid['_id'])
            bid['bid_id'] = bid.get('bid_id', str(ObjectId()))  # Ensure bid_id is a string
        return jsonify(bid_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Accept a bid
@farmer_routes.route('/accept-bid', methods=['POST'])
def accept_bid():
    try:
        data = request.json
        bid_id = data.get('bid_id')
        if not bid_id:
            return jsonify({"message": "Bid ID is required"}), 400

        bid = bids.find_one({"bid_id": bid_id})
        if not bid:
            return jsonify({"message": "Bid not found"}), 404

        bids.update_one({"bid_id": bid_id}, {"$set": {"status": "accepted"}})

        # MySQL logging
        if mysql_conn:
            cursor = mysql_conn.cursor()
            query = "UPDATE bids SET status = 'accepted' WHERE bid_id = %s"
            cursor.execute(query, (bid_id,))
            mysql_conn.commit()
            cursor.close()
            print("Bid status updated in MySQL successfully!")
        else:
            print("Cannot execute query: MySQL connection is not established.")

        return jsonify({"message": "Bid accepted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
