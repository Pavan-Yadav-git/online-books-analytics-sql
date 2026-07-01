import os
import time
import sqlite3
import pandas as pd
import uvicorn
from starlette.applications import Starlette
from starlette.responses import JSONResponse, FileResponse, PlainTextResponse
from starlette.routing import Route

# Path configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Initialize Database Connection
# check_same_thread=False allows sharing connection between async request threads in Starlette safely
conn = sqlite3.connect(':memory:', check_same_thread=False)

def seed_database():
    print("Seeding in-memory SQLite database from CSV files...")
    try:
        # Load CSVs using Pandas
        books_df = pd.read_csv(os.path.join(BASE_DIR, 'Books.csv'))
        customers_df = pd.read_csv(os.path.join(BASE_DIR, 'Customers.csv'))
        orders_df = pd.read_csv(os.path.join(BASE_DIR, 'Orders.csv'))
        
        # Write DataFrames to SQLite tables
        books_df.to_sql('Books', conn, if_exists='replace', index=False)
        customers_df.to_sql('Customers', conn, if_exists='replace', index=False)
        orders_df.to_sql('Orders', conn, if_exists='replace', index=False)
        
        # Verify row counts
        book_count = conn.execute("SELECT COUNT(*) FROM Books;").fetchone()[0]
        cust_count = conn.execute("SELECT COUNT(*) FROM Customers;").fetchone()[0]
        order_count = conn.execute("SELECT COUNT(*) FROM Orders;").fetchone()[0]
        
        print(f"Database seeded successfully!")
        print(f"Tables: Books ({book_count} rows), Customers ({cust_count} rows), Orders ({order_count} rows)")
    except Exception as e:
        print(f"Error seeding database: {e}")
        raise e

# --- Request Handlers ---

# Serves index.html at root
async def serve_homepage(request):
    return FileResponse(os.path.join(BASE_DIR, 'index.html'))

# Serves style.css
async def serve_css(request):
    return FileResponse(os.path.join(BASE_DIR, 'style.css'))

# Serves app.js
async def serve_js(request):
    return FileResponse(os.path.join(BASE_DIR, 'app.js'))

# Serves KPI summaries via SQL aggregations
async def get_kpis(request):
    try:
        revenue = conn.execute("SELECT SUM(Total_Amount) FROM Orders;").fetchone()[0] or 0
        books_sold = conn.execute("SELECT SUM(Quantity) FROM Orders;").fetchone()[0] or 0
        customers = conn.execute("SELECT COUNT(*) FROM Customers;").fetchone()[0] or 0
        genres = conn.execute("SELECT COUNT(DISTINCT Genre) FROM Books;").fetchone()[0] or 0
        
        return JSONResponse({
            'status': 'success',
            'revenue': f"${revenue:,.2f}",
            'books_sold': f"{books_sold:,}",
            'customers': f"{customers:,}",
            'genres': f"{genres:,}"
        })
    except Exception as e:
        return JSONResponse({'status': 'error', 'message': str(e)}, status_code=500)

# Serves chart datasets via SQL aggregations
async def get_chart_data(request):
    try:
        # Chart 1: Revenue by Genre
        c1 = conn.execute("""
            SELECT b.Genre, ROUND(SUM(o.Total_Amount), 2) AS Revenue
            FROM Orders o
            JOIN Books b ON o.Book_ID = b.Book_ID
            GROUP BY b.Genre
            ORDER BY Revenue DESC
            LIMIT 5;
        """).fetchall()
        
        # Chart 2: Monthly sales trend
        c2 = conn.execute("""
            SELECT strftime('%Y-%m', Order_Date) AS Month, ROUND(SUM(Total_Amount), 2) AS Revenue
            FROM Orders
            GROUP BY Month
            ORDER BY Month;
        """).fetchall()
        
        # Chart 3: Top Selling Authors
        c3 = conn.execute("""
            SELECT b.Author, SUM(o.Quantity) AS Units
            FROM Orders o
            JOIN Books b ON o.Book_ID = b.Book_ID
            GROUP BY b.Author
            ORDER BY Units DESC
            LIMIT 5;
        """).fetchall()
        
        # Chart 4: Inventory levels vs Units Sold by Genre
        c4 = conn.execute("""
            SELECT b.Genre, SUM(b.Stock) AS Inventory, COALESCE(SUM(o.Quantity), 0) AS Sold
            FROM Books b
            LEFT JOIN Orders o ON b.Book_ID = o.Book_ID
            GROUP BY b.Genre
            ORDER BY Inventory DESC;
        """).fetchall()
        
        return JSONResponse({
            'status': 'success',
            'genre_revenue': {'labels': [r[0] for r in c1], 'data': [r[1] for r in c1]},
            'sales_trend': {'labels': [r[0] for r in c2], 'data': [r[1] for r in c2]},
            'top_authors': {'labels': [r[0] for r in c3], 'data': [r[1] for r in c3]},
            'inventory': {
                'labels': [r[0] for r in c4],
                'inventory': [r[1] for r in c4],
                'sold': [r[2] for r in c4]
            }
        })
    except Exception as e:
        return JSONResponse({'status': 'error', 'message': str(e)}, status_code=500)

# Serves first 50 rows of raw tables for Data Explorer
async def get_raw_table(request):
    try:
        table_name = request.query_params.get('table', 'Books')
        if table_name not in ['Books', 'Customers', 'Orders']:
            return JSONResponse({'status': 'error', 'message': 'Invalid table name'}, status_code=400)
            
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM {table_name} LIMIT 50;")
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()
        
        return JSONResponse({
            'status': 'success',
            'columns': columns,
            'values': rows
        })
    except Exception as e:
        return JSONResponse({'status': 'error', 'message': str(e)}, status_code=500)

# Executes custom/presets queries from SQL editor
async def execute_query(request):
    try:
        body = await request.json()
        sql_query = body.get('sql', '').strip()
        
        if not sql_query:
            return JSONResponse({'status': 'error', 'message': 'Empty query'}, status_code=400)
            
        # Time SQL execution
        start_time = time.perf_counter()
        cursor = conn.cursor()
        cursor.execute(sql_query)
        
        # Check if query returned rows (e.g. SELECT) or just modified database
        columns = [col[0] for col in cursor.description] if cursor.description else []
        rows = cursor.fetchall()
        end_time = time.perf_counter()
        
        exec_time_ms = (end_time - start_time) * 1000
        
        return JSONResponse({
            'status': 'success',
            'columns': columns,
            'values': rows,
            'time': f"{exec_time_ms:.2f} ms"
        })
    except Exception as e:
        return JSONResponse({
            'status': 'error',
            'message': str(e)
        }, status_code=400)

# --- Routing ---
routes = [
    Route('/', serve_homepage),
    Route('/style.css', serve_css),
    Route('/app.js', serve_js),
    Route('/api/kpis', get_kpis),
    Route('/api/charts', get_chart_data),
    Route('/api/raw', get_raw_table),
    Route('/api/execute', execute_query, methods=['POST']),
]

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app):
    seed_database()
    yield

# Instantiate application
app = Starlette(routes=routes, lifespan=lifespan)

if __name__ == '__main__':
    # Render sets the PORT environment variable. Fall back to 8080 for local testing.
    port = int(os.environ.get("PORT", 8080))
    # Bind to 0.0.0.0 to allow Render/external routing to access the container
    uvicorn.run("app:app", host="0.0.0.0", port=port, log_level="info", reload=False)
