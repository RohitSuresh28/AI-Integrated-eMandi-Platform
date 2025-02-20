from flask import Blueprint, request, jsonify # type: ignore
from models.db_model import tasks, bids, produce  # Assuming you have a tasks, bids, and produce collections
import mysql.connector
logistics_routes = Blueprint('logistics_routes', __name__)

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
# Add a new task with the highest bid for the corresponding produce
@logistics_routes.route('/tasks', methods=['POST'])
def add_task():
    """Add a new task with the highest bid for the corresponding produce."""
    data = request.json
    task_id = str(data.get('task_id'))  # Ensure task_id is a string
    title = data.get('title')
    produce_id = data.get('produce_id')  # Get the produce_id from the task data
    
    if not title or not produce_id:
        return jsonify({'error': 'Title and Produce ID are required'}), 400

    # Find the highest bid for the given produce_id
    # highest_bid = bids.find({'produce_id': produce_id}).sort('bid_amount', -1).limit(1)  # Sort by bid_amount descending
    highest_bid_cursor = bids.find({'produce_id': produce_id}).sort('bid_amount', -1).limit(1)  # Sort by bid_amount descending
    highest_bid = list(highest_bid_cursor)
    if not highest_bid:
        return jsonify({'error': 'No bids found for the specified produce'}), 404
    
    highest_bid_amount = highest_bid[0]['bid_amount']

    # Create the task with the highest bid amount
    new_task = {
        'task_id': task_id,
        'title': title,
        'produce_id': produce_id,
        'highest_bid': highest_bid_amount,
        'status': 'pending'
    }
    
    tasks.insert_one(new_task)
    if mysql_conn:
        cursor = mysql_conn.cursor()
        query = "INSERT INTO tasks (task_id, title, produce_id, highest_bid, status) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (task_id, title, produce_id, highest_bid_amount, 'pending'))
        mysql_conn.commit()
        cursor.close()
        print("Task data inserted into MySQL successfully!")
    else:
        print("Cannot execute query: MySQL connection is not established.")
    return jsonify({'message': 'Task added successfully with highest bid'}), 201

# Fetch all tasks
@logistics_routes.route('/tasks', methods=['GET'])
def get_tasks():
    """Fetch all tasks."""
    try:
        task_list = list(tasks.find())  # Fetch all tasks from MongoDB
        if not task_list:
            return jsonify({'message': 'No tasks found'}), 404

        # Convert MongoDB ObjectId to string for serialization
        for task in task_list:
            task['_id'] = str(task['_id'])  # Convert ObjectId to string

        return jsonify(task_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Fetch the highest bid for a specific produce ID
@logistics_routes.route('/tasks/highest-bid/<produce_id>', methods=['GET'])
def get_highest_bid(produce_id):
    """Fetch the highest bid for a specific produce."""
    try:
        highest_bid = bids.find({'produce_id': produce_id}).sort('bid_amount', -1).limit(1)
        
        if not highest_bid:
            return jsonify({'error': 'No bids found for the specified produce'}), 404
        
        # Get the highest bid amount from the fetched data
        highest_bid_amount = highest_bid[0]['bid_amount']
        return jsonify({'highest_bid': highest_bid_amount}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update task status
@logistics_routes.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    """Update the status of a task."""
    data = request.json
    status = data.get('status')

    if not status:
        return jsonify({'error': 'Status is required'}), 400

    try:
        result = tasks.update_one({'task_id': task_id}, {'$set': {'status': status}})
        if result.matched_count == 0:
            return jsonify({'error': 'Task not found'}), 404
        if mysql_conn:
            cursor = mysql_conn.cursor()
            query = "UPDATE tasks SET status = %s WHERE task_id = %s"
            cursor.execute(query, (status, task_id))
            mysql_conn.commit()
            cursor.close()
            print("Task status updated in MySQL successfully!")
        else:
            print("Cannot execute query: MySQL connection is not established.")

        return jsonify({'message': 'Task updated successfully'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
