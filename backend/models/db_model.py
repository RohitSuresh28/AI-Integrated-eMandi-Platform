from pymongo import MongoClient  # type: ignore
import mysql.connector

# MongoDB connection
try:
    client = MongoClient("Mongo_DB Connection String")
    db = client.latest  # Connect to 'eMandi' database
    print("MongoDB connected successfully!")

    # Collections
    farmers = db.farmers
    buyers = db.buyers
    logistics = db.logistics
    produce = db.produce
    bids = db.bids
    tasks = db.tasks

    # Optional: Indexing for faster queries (if applicable)
    produce.create_index("produce_id", unique=True)
    # bids.create_index("bid_id", unique=True)

except Exception as e:
    print(f"MongoDB Error: {e}")

# MySQL connection
mysql_conn = None
try:
    mysql_conn = mysql.connector.connect(
        host='localhost',       # Replace with your MySQL host
        user='root',            # Replace with your MySQL username
        password='Password',  # Replace with your MySQL password
        database='agri_analysis'  # Replace with your MySQL database name
    )

    if mysql_conn.is_connected():
        print("MySQL connected successfully!")
        mysql_cursor = mysql_conn.cursor()

        # Function to insert data into MySQL and MongoDB
        def insert_farmer(data):
            try:
                # Insert into MongoDB
                farmers.insert_one(data)
                print("Farmer data inserted into MongoDB successfully!")

                # Insert into MySQL
                query = "INSERT INTO farmers (name, contact_info, location, produce_type) VALUES (%s, %s, %s, %s)"
                mysql_cursor.execute(query, (data['name'], data['contact_info'], data['location'], data['produce_type']))
                mysql_conn.commit()
                print("Farmer data inserted into MySQL successfully!")

            except Exception as e:
                print(f"Error inserting farmer data: {e}")

        def insert_buyer(data):
            try:
                # Insert into MongoDB
                buyers.insert_one(data)
                print("Buyer data inserted into MongoDB successfully!")

                # Insert into MySQL
                query = "INSERT INTO buyers (name, contact_info, location, purchase_history) VALUES (%s, %s, %s, %s)"
                mysql_cursor.execute(query, (data['name'], data['contact_info'], data['location'], data['purchase_history']))
                mysql_conn.commit()
                print("Buyer data inserted into MySQL successfully!")

            except Exception as e:
                print(f"Error inserting buyer data: {e}")

        def insert_logistics(data):
            try:
                # Insert into MongoDB
                logistics.insert_one(data)
                print("Logistics data inserted into MongoDB successfully!")

                # Insert into MySQL
                query = "INSERT INTO logistics (company_name, contact_info, service_area) VALUES (%s, %s, %s)"
                mysql_cursor.execute(query, (data['company_name'], data['contact_info'], data['service_area']))
                mysql_conn.commit()
                print("Logistics data inserted into MySQL successfully!")

            except Exception as e:
                print(f"Error inserting logistics data: {e}")

        def insert_produce(data):
            try:
                # Insert into MongoDB
                produce.insert_one(data)
                print("Produce data inserted into MongoDB successfully!")

                # Insert into MySQL
                query = "INSERT INTO produce (produce_id, name, quantity) VALUES (%s, %s, %s)"
                mysql_cursor.execute(query, (data['produce_id'], data['name'], data['quantity'], data['price']))
                mysql_conn.commit()
                print("Produce data inserted into MySQL successfully!")

            except Exception as e:
                print(f"Error inserting produce data: {e}")

        # def insert_bid(data):
        #     try:
        #         # Insert into MongoDB
        #         bids.insert_one(data)
        #         print("Bid data inserted into MongoDB successfully!")

        #         # Insert into MySQL
        #         query = "INSERT INTO bids (bid_id, produce_id, buyer_id, bid_amount) VALUES (%s, %s, %s, %s)"
        #         mysql_cursor.execute(query, (data['bid_id'], data['produce_id'], data['buyer_id'], data['bid_amount']))
        #         mysql_conn.commit()
        #         print("Bid data inserted into MySQL successfully!")

        #     except Exception as e:
        #         print(f"Error inserting bid data: {e}")

        def insert_task(data):
            try:
                # Insert into MongoDB
                tasks.insert_one(data)
                print("Task data inserted into MongoDB successfully!")

                # Insert into MySQL
                query = "INSERT INTO tasks (description, status, assigned_to) VALUES (%s, %s, %s)"
                mysql_cursor.execute(query, (data['description'], data['status'], data['assigned_to']))
                mysql_conn.commit()
                print("Task data inserted into MySQL successfully!")

            except Exception as e:
                print(f"Error inserting task data: {e}")

except mysql.connector.Error as err:
    print(f"MySQL Error: {err}")
