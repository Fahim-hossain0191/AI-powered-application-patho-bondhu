import sys
import traceback

try:
    print("Start test...")
    import mysql.connector
    print("mysql.connector imported successfully.")
    
    print("Attempting pure Python connect...")
    conn = mysql.connector.connect(
        host='127.0.0.1', 
        port=3306, 
        user='root', 
        database='pathobondhu',
        use_pure=True
    )
    print("Pure Python connection succeeded:", conn)
    conn.close()
except Exception as e:
    print("Caught exception:")
    traceback.print_exc(file=sys.stdout)
except BaseException as be:
    print("Caught BaseException:")
    traceback.print_exc(file=sys.stdout)
