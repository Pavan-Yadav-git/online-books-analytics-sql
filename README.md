# Interactive SQL Analytics Portfolio: Python Backend + Glassmorphic UI

An interactive, visually stunning single-page web dashboard showcasing advanced database querying and analytical skills using a **Python ASGI Backend (Starlette/SQLite)** and a **custom glassmorphic frontend (HTML/CSS/JS)**.

This portfolio maps out a real-world scenario of an **Online Bookstore** database containing three key relational tables: **Books**, **Customers**, and **Orders**. When the Python server starts, it loads the datasets from raw CSV files, seeds an in-memory SQLite database, and exposes REST endpoints for executing queries and fetching dynamic analytics.

---

## 🚀 Key Features

*   **Python-Driven SQL Executor:** Executes custom SQL queries (joins, subqueries, aggregates, window functions) on the backend using Python's native `sqlite3` and returns formatted JSON datasets to the frontend.
*   **25 Business Query Presets:** A structured portfolio of 25 questions classified by complexity (Basic, Advanced, Expert) displaying detailed SQL code, descriptions, and results. (All emojis have been removed from query strings to ensure clean, valid SQL execution).
*   **First Tab SQL Console:** The interactive query terminal is the first active view upon page load, letting reviewers immediately test query sets.
*   **Interactive Analytics Dashboard:** Rich visual summaries showing KPIs (revenue, units sold, inventory levels, genres) generated dynamically by running SQL aggregation queries on the Python server.
*   **Database Schema Explorer:** Collapsible panel showing the relational structure, column data types, primary keys, and foreign keys.
*   **Data Explorer:** Inspect the raw database tables (`Books`, `Customers`, `Orders`) up to 50 rows each.
*   **Export Results:** Download any SQL query result directly as a `.csv` file.

---

## 📊 Database Schema

The database model is fully normalized to 3NF:

```
                  ┌─────────────────┐
                  │    CUSTOMERS    │
                  ├─────────────────┤
                  │ Customer_ID(PK) │
                  │ Name, Email     │
                  │ Phone, City     │
                  │ Country         │
                  └────────┬────────┘
                           │ (1)
                           │
                           │ (0..N)
                  ┌────────▼────────┐
                  │     ORDERS      │
                  ├─────────────────┤
                  │ Order_ID (PK)   │
                  │ Customer_ID(FK) │
                  │ Book_ID (FK)    │
                  │ Order_Date      │
                  │ Quantity        │
                  │ Total_Amount    │
                  └────────▲────────┘
                           │ (0..N)
                           │
                           │ (1)
                  ┌────────┴────────┐
                  │      BOOKS      │
                  ├─────────────────┤
                  │ Book_ID (PK)    │
                  │ Title, Author   │
                  │ Genre, Price    │
                  │ Stock           │
                  │ Published_Year  │
                  └─────────────────┘
```

---

## 📂 Project Structure

```
├── Books.csv                # Raw books dataset (500 records)
├── Customers.csv            # Raw customers dataset (500 records)
├── Orders.csv               # Raw orders dataset (500 records)
├── app.py                   # Python ASGI Starlette server & SQLite seeds
├── app.js                   # Frontend controller (API fetches & rendering)
├── index.html               # Main frontend dashboard layout (Tailwind & CDN)
├── style.css                # Custom glassmorphic styles & animations
├── requirements.txt         # Python package dependencies
└── README.md                # Project documentation
```

---

## 🛠️ Local Installation & Development

To run the application locally on your machine:

1.  Make sure you have **Python 3.9+** installed.
2.  Open your terminal in the project directory.
3.  Activate your virtual environment (if available):
    *   **Windows:** `.venv\Scripts\activate`
    *   **Mac/Linux:** `source .venv/bin/activate`
4.  Ensure dependencies are installed:
    ```bash
    pip install -r requirements.txt
    ```
    *(Requirements: `starlette`, `pandas`, `uvicorn`)*
5.  Start the Python backend:
    ```bash
    python app.py
    ```
6.  Open your browser and navigate to:
    ```
    http://localhost:8080/
    ```

---

## 🌐 API Reference Endpoints

The Python backend exposes the following REST APIs:
*   `POST /api/execute`: Accepts JSON body `{"sql": "..."}` and returns query results, column headers, and execution metrics.
*   `GET /api/kpis`: Returns dynamic high-level statistics calculated using SQL aggregates.
*   `GET /api/charts`: Returns formatted datasets for Chart.js (Genre Revenue, Sales Trends, Author volume, Inventory).
*   `GET /api/raw?table=Books`: Returns first 50 rows of raw data for schema inspector.

---

## 📦 Online Deployment Options

Because this project runs a Python backend, it is not suited for static web hosts like GitHub Pages. Instead, you can deploy it for free directly from your GitHub repo using full-stack hosting providers:

### Render Deployment
1.  Sign in to [Render](https://render.com) and link your GitHub account.
2.  Click **New +** ➔ **Web Service** and select your repository.
3.  Set the following configurations:
    *   **Environment:** `Python`
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `python app.py`
4.  Click **Deploy Web Service** and your dashboard will be online!
