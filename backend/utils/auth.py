from flask import jsonify
import mysql.connector

def check_credentials(email, password, user_type, mysql_conn):
    try:
        cursor = mysql_conn.cursor(dictionary=True)
        query = f"SELECT * FROM {user_type} WHERE email = %s AND password = %s"
        cursor.execute(query, (email, password))
        user = cursor.fetchone()
        cursor.close()
        if user:
            return jsonify({'message': f'{user_type.capitalize()} logged in successfully!', 'user_id': user['id']}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500 