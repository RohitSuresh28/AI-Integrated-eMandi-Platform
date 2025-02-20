from flask import Blueprint, request, jsonify  # type: ignore
from models.db_model import buyers, bids, produce
import mysql.connector

buyer_routes = Blueprint('buyer_routes', __name__)

# MySQL connection setup
mysql_conn = None
try:
    mysql_conn = mysql.connector.connect(
        host='localhost',       # Replace with your MySQL host
        user='root',            # Replace with your MySQL username
        password='Rohit@2809',  # Replace with your MySQL password
        database='agri_analysis'  # Replace with your MySQL database name
    )

    if mysql_conn.is_connected():
        print("MySQL connected successfully!")
    else:
        print("Failed to connect to MySQL.")

except mysql.connector.Error as err:
    print(f"MySQL Error: {err}")
    mysql_conn = None

# Register a new buyer
@buyer_routes.route('/register', methods=['POST'])
def register_buyer():
    try:
        data = request.json
        # MongoDB logging
        buyer_id = buyers.insert_one(data).inserted_id
        print(f"Buyer registered with MongoDB ID: {buyer_id}")

        # MySQL logging
        if mysql_conn:
            cursor = mysql_conn.cursor()
            query = "INSERT INTO buyers (name, contact_info, location) VALUES (%s, %s, %s)"
            cursor.execute(query, (data['name'], data['contact_info'], data['location']))
            mysql_conn.commit()
            cursor.close()
            print("Buyer data inserted into MySQL successfully!")
        else:
            print("Cannot execute query: MySQL connection is not established.")

        return jsonify({'message': 'Buyer registered successfully', 'buyer_id': str(buyer_id)}), 201
    except Exception as e:
        return jsonify({"error registering buyer": str(e)}), 500

# View all produce
@buyer_routes.route('/produce', methods=['GET'])
def view_produce():
    try:
        # Fetch all produce from the database
        produce_list = list(produce.find({}, {'_id': 0}))  # Exclude '_id' field
        return jsonify(produce_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Place a bid on produce
@buyer_routes.route('/place-bid', methods=['POST'])
def place_bid():
    try:
        data = request.json
        produce_id = data.get('produce_id')
        buyer_id = data.get('buyer_id')
        bid_amount = data.get('bid_amount')

        if not produce_id or not buyer_id or not bid_amount:
            return jsonify({'error': 'All fields are required'}), 400

        # MongoDB logging
        bid = {
            'produce_id': produce_id,
            'buyer_id': buyer_id,
            'bid_amount': bid_amount
        }
        b=bids.insert_one(bid).inserted_id
        print(f"Bid placed with MongoDB")

        # MySQL logging
        if mysql_conn:
            cursor = mysql_conn.cursor()
            query = "INSERT INTO bids (bid_id,produce_id, buyer_id, bid_amount) VALUES (%s,%s, %s, %s)"
            cursor.execute(query, (str(b),produce_id, buyer_id, bid_amount))
            mysql_conn.commit()
            cursor.close()
            print("Bid data inserted into MySQL successfully!")
        else:
            print("Cannot execute query: MySQL connection is not established.")

        return jsonify({'message': 'Bid placed successfully'}), 201

    # data = request.json
    # produce_id = data.get('produce_id')
    # buyer_id = data.get('buyer_id')
    # bid_amount = data.get('bid_amount')

    # if not produce_id or not buyer_id or not bid_amount:
    #     return jsonify({'error': 'All fields are required'}), 400

    # bid = {
    #     'produce_id': produce_id,
    #     'buyer_id': buyer_id,
    #     'bid_amount': bid_amount
    # }
    # bids.insert_one(bid)
    # return jsonify({'message': 'Bid placed successfully'}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500