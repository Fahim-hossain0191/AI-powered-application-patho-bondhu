import sys
from db.retriever import get_connection

try:
    print("Attempting connection...")
    conn = get_connection()
    print("Database connected successfully!")
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print("Tables in database:", [t[0] for t in tables])
    cursor.close()
    conn.close()
except Exception as e:
    print("Database connection failed:", e)

