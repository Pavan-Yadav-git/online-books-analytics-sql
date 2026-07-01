// SQL Bookstore Portfolio Dashboard Application Logic - Full-Stack Python Version

// Query Definitions
const SQL_QUERIES = [
    // --- BASIC QUERIES ---
    {
        id: 1,
        category: "Basic",
        title: "Retrieve all books in the 'Fiction' genre",
        description: "Retrieves all details for books categorized as 'Fiction'. Demonstrates basic filtering with the WHERE clause.",
        sqlConcepts: ["SELECT *", "WHERE Filtering", "String Literals"],
        sql: `SELECT * FROM Books \nWHERE Genre = 'Fiction';`
    },
    {
        id: 2,
        category: "Basic",
        title: "Find books published after the year 1950",
        description: "Finds all books with a published year greater than 1950. Demonstrates numeric comparison operators.",
        sqlConcepts: ["Numeric Comparison (>)"],
        sql: `SELECT * FROM Books \nWHERE Published_Year > 1950;`
    },
    {
        id: 3,
        category: "Basic",
        title: "List all customers from Canada",
        description: "Retrieves all customers who reside in Canada. Demonstrates simple text comparison.",
        sqlConcepts: ["WHERE Filtering"],
        sql: `SELECT * FROM Customers \nWHERE Country = 'Canada';`
    },
    {
        id: 4,
        category: "Basic",
        title: "Show orders placed in November 2023",
        description: "Lists all book orders made between November 1st and November 30th, 2023. Demonstrates range queries on date columns represented as ISO-8601 strings.",
        sqlConcepts: ["BETWEEN Range Filter", "Date Literals"],
        sql: `SELECT * FROM Orders \nWHERE Order_Date BETWEEN '2023-11-01' AND '2023-11-30';`
    },
    {
        id: 5,
        category: "Basic",
        title: "Retrieve the total stock of books available",
        description: "Aggregates the stock across all books in the inventory. Demonstrates the SUM aggregate function.",
        sqlConcepts: ["SUM() Aggregate", "Column Aliasing (AS)"],
        sql: `SELECT SUM(Stock) AS Total_Stock \nFROM Books;`
    },
    {
        id: 6,
        category: "Basic",
        title: "Find the details of the most expensive book",
        description: "Retrieves the book record with the highest price. Demonstrates sorting descending and limiting results to a single row.",
        sqlConcepts: ["ORDER BY", "DESC Sorting", "LIMIT Clause"],
        sql: `SELECT * FROM Books \nORDER BY Price DESC \nLIMIT 1;`
    },
    {
        id: 7,
        category: "Basic",
        title: "Show all customers who ordered more than 1 quantity of a book",
        description: "Retrieves order records where the purchased quantity is greater than 1. Demonstrates numeric filters.",
        sqlConcepts: ["WHERE Filtering", "Comparison (> 1)"],
        sql: `SELECT * FROM Orders \nWHERE Quantity > 1;`
    },
    {
        id: 8,
        category: "Basic",
        title: "Retrieve all orders where the total amount exceeds $20",
        description: "Retrieves order records where the revenue generated exceeds $20. Demonstrates numeric filtering on decimal prices.",
        sqlConcepts: ["Decimal Comparisons"],
        sql: `SELECT * FROM Orders \nWHERE Total_Amount > 20.00;`
    },
    {
        id: 9,
        category: "Basic",
        title: "List all unique genres available in the Books table",
        description: "Retrieves a distinct list of genres represented in our bookstore inventory.",
        sqlConcepts: ["DISTINCT Clause"],
        sql: `SELECT DISTINCT Genre FROM Books;`
    },
    {
        id: 10,
        category: "Basic",
        title: "Find the book with the lowest stock",
        description: "Retrieves the book record that has the least remaining inventory. Demonstrates sorting ascending and limiting.",
        sqlConcepts: ["ORDER BY ASC", "LIMIT Clause"],
        sql: `SELECT * FROM Books \nORDER BY Stock ASC \nLIMIT 1;`
    },
    {
        id: 11,
        category: "Basic",
        title: "Calculate the total revenue generated from all orders",
        description: "Finds the sum of the total amount spent on all orders in the database. Demonstrates basic aggregation.",
        sqlConcepts: ["SUM() Aggregate"],
        sql: `SELECT SUM(Total_Amount) AS Total_Revenue \nFROM Orders;`
    },

    // --- ADVANCED QUERIES ---
    {
        id: 12,
        category: "Advanced",
        title: "Retrieve the total number of books sold for each genre",
        description: "Calculates the total quantity of books ordered per genre. Joins orders and books, and uses GROUP BY.",
        sqlConcepts: ["INNER JOIN", "GROUP BY", "SUM() Aggregation"],
        sql: `SELECT b.Genre, SUM(o.Quantity) AS Total_Books_Sold\nFROM Orders o\nJOIN Books b ON o.Book_ID = b.Book_ID\nGROUP BY b.Genre\nORDER BY Total_Books_Sold DESC;`
    },
    {
        id: 13,
        category: "Advanced",
        title: "Find the average price of books in the 'Fantasy' genre",
        description: "Calculates the average price of all books in the database belonging to the 'Fantasy' genre.",
        sqlConcepts: ["AVG() Aggregate", "WHERE Filter", "ROUND() Formatting"],
        sql: `SELECT ROUND(AVG(Price), 2) AS Average_Price\nFROM Books\nWHERE Genre = 'Fantasy';`
    },
    {
        id: 14,
        category: "Advanced",
        title: "List customers who have placed at least 2 orders",
        description: "Finds customer records associated with multiple orders. Demonstrates aggregation filtering using the HAVING clause.",
        sqlConcepts: ["JOIN Operations", "GROUP BY Multiple Columns", "HAVING Aggregate Filtering"],
        sql: `SELECT o.Customer_ID, c.Name, COUNT(o.Order_ID) AS Order_Count\nFROM Orders o\nJOIN Customers c ON o.Customer_ID = c.Customer_ID\nGROUP BY o.Customer_ID, c.Name\nHAVING COUNT(o.Order_ID) >= 2\nORDER BY Order_Count DESC;`
    },
    {
        id: 15,
        category: "Advanced",
        title: "Find the most frequently ordered book",
        description: "Determines which book was ordered in the highest number of transaction records.",
        sqlConcepts: ["JOIN", "COUNT() Aggregation", "GROUP BY", "ORDER BY DESC", "LIMIT"],
        sql: `SELECT o.Book_ID, b.Title, b.Author, COUNT(o.Order_ID) AS Order_Count\nFROM Orders o\nJOIN Books b ON o.Book_ID = b.Book_ID\nGROUP BY o.Book_ID, b.Title, b.Author\nORDER BY Order_Count DESC\nLIMIT 1;`
    },
    {
        id: 16,
        category: "Advanced",
        title: "Show the top 3 most expensive books of 'Fantasy' genre",
        description: "Retrieves the three highest-priced books in the 'Fantasy' category. Demonstrates targeted sorting.",
        sqlConcepts: ["Multiple WHERE criteria", "Sorting & Limits"],
        sql: `SELECT * FROM Books\nWHERE Genre = 'Fantasy'\nORDER BY Price DESC\nLIMIT 3;`
    },
    {
        id: 17,
        category: "Advanced",
        title: "Retrieve the total quantity of books sold by each author",
        description: "Summarizes total units sold, grouped by author, sorting from highest sales volume to lowest.",
        sqlConcepts: ["JOIN", "SUM() Aggregation", "GROUP BY", "ORDER BY DESC"],
        sql: `SELECT b.Author, SUM(o.Quantity) AS Total_Books_Sold\nFROM Orders o\nJOIN Books b ON o.Book_ID = b.Book_ID\nGROUP BY b.Author\nORDER BY Total_Books_Sold DESC;`
    },
    {
        id: 18,
        category: "Advanced",
        title: "List cities where customers who spent over $30 in a single order are located",
        description: "Retrieves a unique list of cities where a customer placed an order exceeding $30.",
        sqlConcepts: ["DISTINCT Clause", "JOIN", "WHERE Comparison"],
        sql: `SELECT DISTINCT c.City, c.Country\nFROM Orders o\nJOIN Customers c ON o.Customer_ID = c.Customer_ID\nWHERE o.Total_Amount > 30.00\nORDER BY c.City;`
    },
    {
        id: 19,
        category: "Advanced",
        title: "Find the customer who spent the most on orders overall",
        description: "Aggregates the sum of all transaction totals for each customer, sorting to find the single highest spender.",
        sqlConcepts: ["SUM() Aggregation", "GROUP BY", "ORDER BY DESC", "LIMIT"],
        sql: `SELECT c.Customer_ID, c.Name, c.Email, ROUND(SUM(o.Total_Amount), 2) AS Total_Spent\nFROM Orders o\nJOIN Customers c ON o.Customer_ID = c.Customer_ID\nGROUP BY c.Customer_ID, c.Name, c.Email\nORDER BY Total_Spent DESC\nLIMIT 1;`
    },
    {
        id: 20,
        category: "Advanced",
        title: "Calculate the stock remaining after fulfilling all orders",
        description: "Computes the remaining book stock by subtracting the total quantity sold from the original book stock. Demonstrates LEFT JOIN and NULL handling.",
        sqlConcepts: ["LEFT JOIN", "COALESCE() Null Handling", "Mathematical Computations"],
        sql: `SELECT b.Book_ID, b.Title, b.Stock AS Original_Stock, \n       COALESCE(SUM(o.Quantity), 0) AS Total_Units_Sold,  \n       (b.Stock - COALESCE(SUM(o.Quantity), 0)) AS Remaining_Stock\nFROM Books b\nLEFT JOIN Orders o ON b.Book_ID = o.Book_ID\nGROUP BY b.Book_ID, b.Title, b.Stock\nORDER BY Remaining_Stock ASC;`
    },

    // --- EXPERT / SHOWCASE QUERIES ---
    {
        id: 21,
        category: "Expert",
        title: "Customer Lifetime Value (CLV) & Tier Segmentation",
        description: "Aggregates total customer spending and uses window functions (DENSE_RANK) to rank customers. Further divides customers into tiers (Gold, Silver, Bronze) based on spending thresholds.",
        sqlConcepts: ["CTEs (Common Table Expressions)", "Window Functions (DENSE_RANK)", "CASE WHEN Conditional Logic", "Data Grouping"],
        sql: `WITH CustomerSpent AS (\n    SELECT c.Customer_ID, c.Name, c.City, c.Country, \n           ROUND(SUM(o.Total_Amount), 2) AS Total_Spent\n    FROM Customers c\n    JOIN Orders o ON c.Customer_ID = o.Customer_ID\n    GROUP BY c.Customer_ID, c.Name, c.City, c.Country\n)\nSELECT Customer_ID, Name, City, Country, Total_Spent,\n       DENSE_RANK() OVER (ORDER BY Total_Spent DESC) AS Spend_Rank,\n       CASE \n           WHEN Total_Spent >= 250 THEN 'Gold Tier (Spent $250+)'\n           WHEN Total_Spent >= 120 THEN 'Silver Tier (Spent $120-$250)'\n           ELSE 'Bronze Tier (Spent <$120)'\n       END AS Customer_Segment\nFROM CustomerSpent\nORDER BY Total_Spent DESC;`
    },
    {
        id: 22,
        category: "Expert",
        title: "Monthly Sales Performance & 3-Month Moving Average",
        description: "Group sales by month and uses window functions to compute a 3-month moving average of revenue. This helps smooth out seasonal trends and evaluate business growth.",
        sqlConcepts: ["SQLite Date Formatting (strftime)", "CTEs", "Window Functions (AVG OVER)", "Frame Specifications (ROWS BETWEEN)"],
        sql: `WITH MonthlySales AS (\n    SELECT strftime('%Y-%m', Order_Date) AS Month,\n           ROUND(SUM(Total_Amount), 2) AS Monthly_Revenue,\n           COUNT(Order_ID) AS Total_Orders\n    FROM Orders\n    GROUP BY Month\n)\nSELECT Month, Monthly_Revenue, Total_Orders,\n       ROUND(AVG(Monthly_Revenue) OVER (\n           ORDER BY Month \n           ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n       ), 2) AS Three_Month_Moving_Average\nFROM MonthlySales\nORDER BY Month;`
    },
    {
        id: 23,
        category: "Expert",
        title: "High-Value and High-Volume Orders Deep Dive",
        description: "Identifies outlier transactions: orders where both the quantity is greater than the overall average order quantity AND the order total is greater than the overall average order total. Showcases double uncorrelated subqueries.",
        sqlConcepts: ["Subqueries in WHERE Clause", "Multiple Table Joins", "Outlier Analysis"],
        sql: `SELECT o.Order_ID, c.Name AS Customer_Name, b.Title AS Book_Title, \n       b.Genre, o.Quantity, o.Total_Amount, o.Order_Date\nFROM Orders o\nJOIN Customers c ON o.Customer_ID = c.Customer_ID\nJOIN Books b ON o.Book_ID = b.Book_ID\nWHERE o.Quantity > (SELECT AVG(Quantity) FROM Orders)\n  AND o.Total_Amount > (SELECT AVG(Total_Amount) FROM Orders)\nORDER BY o.Total_Amount DESC;`
    },
    {
        id: 24,
        category: "Expert",
        title: "Author Revenue Contribution & Store Market Share",
        description: "Calculates the financial impact of each author: total books sold, total revenue generated, average book price, and percentage contribution to overall store revenue. Uses CTEs and a CROSS JOIN for the grand total.",
        sqlConcepts: ["Multiple CTEs", "CROSS JOIN", "LEFT JOIN", "COALESCE", "Percentage Mathematics"],
        sql: `WITH AuthorStats AS (\n    SELECT b.Author,\n           COUNT(DISTINCT b.Book_ID) AS Unique_Books_Written,\n           SUM(o.Quantity) AS Total_Units_Sold,\n           ROUND(SUM(o.Total_Amount), 2) AS Author_Revenue,\n           ROUND(AVG(b.Price), 2) AS Avg_Book_Price\n    FROM Books b\n    LEFT JOIN Orders o ON b.Book_ID = o.Book_ID\n    GROUP BY b.Author\n),\nTotalRevenue AS (\n    SELECT SUM(Total_Amount) AS Grand_Total FROM Orders\n)\nSELECT a.Author, a.Unique_Books_Written, \n       COALESCE(a.Total_Units_Sold, 0) AS Total_Units_Sold,\n       COALESCE(a.Author_Revenue, 0) AS Author_Revenue, \n       a.Avg_Book_Price,\n       ROUND((COALESCE(a.Author_Revenue, 0) * 100.0 / r.Grand_Total), 2) AS Store_Revenue_Contribution_Pct\nFROM AuthorStats a\nCROSS JOIN TotalRevenue r\nWHERE a.Total_Units_Sold > 0\nORDER BY Author_Revenue DESC;`
    },
    {
        id: 25,
        category: "Expert",
        title: "Stock Replenishment & Reorder Priority Dashboard",
        description: "Evaluates inventory risk by grouping remaining stock with past sales frequencies. Categorizes reorder priority using conditional logic, highlighting items with low stock but high purchase velocity.",
        sqlConcepts: ["CASE WHEN Sorting", "LEFT JOIN", "Aggregate CTEs", "Inventory Optimization"],
        sql: `WITH BookSalesCount AS (\n    SELECT Book_ID, COUNT(Order_ID) AS Order_Frequency,\n           SUM(Quantity) AS Total_Quantity_Sold\n    FROM Orders\n    GROUP BY Book_ID\n)\nSELECT b.Book_ID, b.Title, b.Author, b.Genre, b.Stock,\n       COALESCE(s.Order_Frequency, 0) AS Order_Frequency,\n       COALESCE(s.Total_Quantity_Sold, 0) AS Total_Quantity_Sold,\n       CASE \n           WHEN b.Stock < 10 AND COALESCE(s.Order_Frequency, 0) >= 3 THEN 'CRITICAL (Low Stock & High Demand)'\n           WHEN b.Stock < 20 AND COALESCE(s.Order_Frequency, 0) >= 2 THEN 'HIGH (Reorder Soon)'\n           WHEN b.Stock < 30 AND COALESCE(s.Order_Frequency, 0) >= 1 THEN 'MEDIUM (Monitor Stock)'\n           ELSE 'LOW (Adequate Stock)'\n       END AS Replenishment_Priority\nFROM Books b\nLEFT JOIN BookSalesCount s ON b.Book_ID = s.Book_ID\nWHERE b.Stock < 30 OR COALESCE(s.Order_Frequency, 0) > 0\nORDER BY \n    CASE \n        WHEN Replenishment_Priority LIKE 'CRITICAL%' THEN 1\n        WHEN Replenishment_Priority LIKE 'HIGH%' THEN 2\n        WHEN Replenishment_Priority LIKE 'MEDIUM%' THEN 3\n        ELSE 4\n    END, \n    b.Stock ASC;`
    }
];

// Global State
let chartInstances = {};
let tablePagination = {
    data: [],
    columns: [],
    currentPage: 1,
    pageSize: 10
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initDatabase();
    setupDropdown();
    setupEventListeners();
});

// Tab Navigation Logic
function initTabs() {
    const tabButtons = document.querySelectorAll("[data-tab-target]");
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active classes
            tabButtons.forEach(btn => {
                btn.classList.remove("border-indigo-500", "text-indigo-400", "bg-indigo-950/20");
                btn.classList.add("border-transparent", "text-zinc-400", "hover:text-zinc-200");
            });
            document.querySelectorAll(".tab-content").forEach(content => {
                content.classList.remove("active");
            });

            // Add active classes to clicked tab
            button.classList.add("border-indigo-500", "text-indigo-400", "bg-indigo-950/20");
            button.classList.remove("border-transparent", "text-zinc-400", "hover:text-zinc-200");
            
            const target = document.querySelector(button.dataset.tabTarget);
            target.classList.add("active");

            // Re-render charts if analytics tab is chosen (fixes size issues)
            if (button.dataset.tabTarget === "#tab-dashboard") {
                renderCharts();
            }
        });
    });
}

// Setup Connection with Python Backend API
function initDatabase() {
    const statusText = document.getElementById("db-status-text");
    const statusIndicator = document.getElementById("db-status-indicator");
    
    fetch('/api/kpis')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                // Update Status UI
                statusText.innerText = "Python SQLite Active";
                statusIndicator.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]";
                
                // Initialize Dashboard Counters and Charts
                updateOverviewCounters(data);
                renderCharts();
                populateDataExplorer();

                // Load first query by default
                loadQuery(1);
            } else {
                throw new Error(data.message || "Unknown error");
            }
        })
        .catch(err => {
            console.error("Failed to connect to Python SQLite API:", err);
            statusText.innerText = "Python Server Offline";
            statusIndicator.className = "w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]";
        });
}

// Populate natural language questions dropdown
function setupDropdown() {
    const select = document.getElementById("query-select");
    
    // Clear and group queries
    select.innerHTML = '<option value="" disabled selected>Select a business question to query...</option>';
    
    const categories = ["Basic", "Advanced", "Expert"];
    categories.forEach(cat => {
        const group = document.createElement("optgroup");
        group.label = `${cat} SQL Questions`;
        
        const filtered = SQL_QUERIES.filter(q => q.category === cat);
        filtered.forEach(q => {
            const opt = document.createElement("option");
            opt.value = q.id;
            opt.text = `Q${q.id}: ${q.title}`;
            group.appendChild(opt);
        });
        
        select.appendChild(group);
    });

    // Populate Sidebar query list
    const sidebarList = document.getElementById("sidebar-query-list");
    sidebarList.innerHTML = "";
    SQL_QUERIES.forEach(q => {
        const item = document.createElement("button");
        item.className = "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all hover:bg-zinc-800/60 border border-transparent hover:border-zinc-700/30 flex items-start space-x-2 text-zinc-400 focus:outline-none";
        item.dataset.queryId = q.id;
        
        let colorClass = "text-indigo-400 bg-indigo-950/40 border-indigo-900/30";
        if (q.category === "Advanced") colorClass = "text-emerald-400 bg-emerald-950/40 border-emerald-900/30";
        if (q.category === "Expert") colorClass = "text-purple-400 bg-purple-950/40 border-purple-900/30";

        item.innerHTML = `
            <span class="inline-block px-1.5 py-0.5 text-[10px] font-bold rounded border ${colorClass} shrink-0 mt-0.5">${q.category}</span>
            <span class="truncate">${q.title}</span>
        `;
        item.addEventListener("click", () => {
            loadQuery(q.id);
            // Sync with select dropdown
            select.value = q.id;
        });
        sidebarList.appendChild(item);
    });
}

// Load query details into Editor Panel
function loadQuery(id) {
    const query = SQL_QUERIES.find(q => q.id === id);
    if (!query) return;

    // Highlight active sidebar item
    document.querySelectorAll("#sidebar-query-list button").forEach(btn => {
        if (parseInt(btn.dataset.queryId) === id) {
            btn.classList.add("bg-indigo-950/30", "border-indigo-500/40", "text-indigo-200");
            btn.classList.remove("text-zinc-400", "hover:bg-zinc-800/60");
        } else {
            btn.classList.remove("bg-indigo-950/30", "border-indigo-500/40", "text-indigo-200");
            btn.classList.add("text-zinc-400", "hover:bg-zinc-800/60");
        }
    });

    // Populate Fields
    document.getElementById("query-title-display").innerText = `Question #${query.id}: ${query.title}`;
    document.getElementById("query-desc-display").innerText = query.description;
    
    // Render SQL Concepts
    const conceptsContainer = document.getElementById("query-concepts");
    conceptsContainer.innerHTML = "";
    query.sqlConcepts.forEach(c => {
        const badge = document.createElement("span");
        badge.className = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-950 text-indigo-300 border border-indigo-900/40";
        badge.innerText = c;
        conceptsContainer.appendChild(badge);
    });

    // Populate SQL Code Input
    const editor = document.getElementById("sql-editor-textarea");
    editor.value = query.sql;
    
    // Clear old result panel state
    const resultContainer = document.getElementById("sql-result-container");
    resultContainer.classList.add("hidden");
    document.getElementById("run-query-btn").classList.add("pulse-badge");
}

// Execute Query Function via Python API Server
function executeSQL() {
    const sqlCode = document.getElementById("sql-editor-textarea").value;
    const resultContainer = document.getElementById("sql-result-container");
    const errorContainer = document.getElementById("sql-error-container");
    const tableHeader = document.getElementById("table-header-row");
    const tableBody = document.getElementById("table-body-rows");
    
    errorContainer.classList.add("hidden");
    resultContainer.classList.add("hidden"); // Hide results during processing
    document.getElementById("run-query-btn").classList.remove("pulse-badge");

    // Fetch API
    fetch('/api/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql: sqlCode })
    })
    .then(res => res.json())
    .then(data => {
        resultContainer.classList.remove("hidden");
        
        if (data.status === 'success') {
            document.getElementById("query-meta-stats").innerHTML = `
                <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-indigo-500"></span>Status: Success</span>
                <span>Rows: ${data.values.length}</span>
                <span>Speed: ${data.time}</span>
            `;

            if (data.values.length === 0) {
                // Success but no rows returned
                tableHeader.innerHTML = "<th>Status</th>";
                tableBody.innerHTML = `<tr><td class="px-6 py-4 text-zinc-400 italic text-center">Query executed successfully. No records returned.</td></tr>`;
                updatePaginationControls(0);
                return;
            }

            // Set global pagination state
            tablePagination.columns = data.columns;
            tablePagination.data = data.values;
            tablePagination.currentPage = 1;

            // Render Table Page
            renderTablePage();
        } else {
            throw new Error(data.message || "Unknown execution error");
        }
    })
    .catch(err => {
        console.error("SQL execution error:", err);
        resultContainer.classList.add("hidden");
        errorContainer.classList.remove("hidden");
        document.getElementById("error-text-display").innerText = err.message || err;
    });
}

// Render Table Page based on pagination configuration
function renderTablePage() {
    const tableHeader = document.getElementById("table-header-row");
    const tableBody = document.getElementById("table-body-rows");
    const columns = tablePagination.columns;
    const data = tablePagination.data;
    const page = tablePagination.currentPage;
    const size = tablePagination.pageSize;
    
    // Headers
    tableHeader.innerHTML = columns.map(c => `
        <th class="px-6 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
            ${c}
        </th>
    `).join("");

    // Chunking Data
    const startIndex = (page - 1) * size;
    const endIndex = Math.min(startIndex + size, data.length);
    const paginatedRows = data.slice(startIndex, endIndex);

    if (paginatedRows.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="${columns.length}" class="px-6 py-4 text-zinc-400 text-center italic">No records found.</td></tr>`;
    } else {
        tableBody.innerHTML = paginatedRows.map((row, idx) => `
            <tr class="hover:bg-zinc-800/35 transition-colors border-b border-zinc-800/40">
                ${row.map(val => {
                    let formattedVal = val;
                    if (val === null || val === undefined) {
                        formattedVal = `<span class="text-zinc-600 italic font-mono text-xs">NULL</span>`;
                    } else if (typeof val === 'number') {
                        formattedVal = val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 });
                    }
                    return `<td class="px-6 py-3.5 text-sm text-zinc-300 font-mono">${formattedVal}</td>`;
                }).join("")}
            </tr>
        `).join("");
    }

    updatePaginationControls(data.length);
}

// Update Pagination Control Displays
function updatePaginationControls(totalRows) {
    const page = tablePagination.currentPage;
    const size = tablePagination.pageSize;
    const maxPage = Math.ceil(totalRows / size) || 1;
    
    document.getElementById("pagination-info").innerText = `Showing ${Math.min((page - 1) * size + 1, totalRows)}-${Math.min(page * size, totalRows)} of ${totalRows} records`;
    
    const prevBtn = document.getElementById("pagination-prev");
    const nextBtn = document.getElementById("pagination-next");

    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === maxPage;

    // Style disabled state
    prevBtn.className = `px-3 py-1.5 rounded-lg border border-zinc-700/60 bg-zinc-900/60 text-sm font-medium transition-colors ${page === 1 ? 'text-zinc-600 cursor-not-allowed opacity-50' : 'text-zinc-300 hover:bg-zinc-800/60'}`;
    nextBtn.className = `px-3 py-1.5 rounded-lg border border-zinc-700/60 bg-zinc-900/60 text-sm font-medium transition-colors ${page === maxPage ? 'text-zinc-600 cursor-not-allowed opacity-50' : 'text-zinc-300 hover:bg-zinc-800/60'}`;
}

// Setup Event Listeners
function setupEventListeners() {
    // Dropdown selection sync
    document.getElementById("query-select").addEventListener("change", (e) => {
        loadQuery(parseInt(e.target.value));
    });

    // Run Button
    document.getElementById("run-query-btn").addEventListener("click", executeSQL);

    // SQL Custom Execution on Ctrl+Enter
    document.getElementById("sql-editor-textarea").addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            executeSQL();
        }
    });

    // Pagination Click
    document.getElementById("pagination-prev").addEventListener("click", () => {
        if (tablePagination.currentPage > 1) {
            tablePagination.currentPage--;
            renderTablePage();
        }
    });
    document.getElementById("pagination-next").addEventListener("click", () => {
        const totalRows = tablePagination.data.length;
        const maxPage = Math.ceil(totalRows / tablePagination.pageSize);
        if (tablePagination.currentPage < maxPage) {
            tablePagination.currentPage++;
            renderTablePage();
        }
    });

    // Download CSV
    document.getElementById("export-csv-btn").addEventListener("click", () => {
        const columns = tablePagination.columns;
        const data = tablePagination.data;
        if (data.length === 0) return;

        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Header
        csvContent += columns.map(c => `"${c}"`).join(",") + "\n";
        
        // Rows
        data.forEach(row => {
            csvContent += row.map(val => {
                if (val === null || val === undefined) return '""';
                let strVal = String(val);
                if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
                    strVal = `"${strVal.replace(/"/g, '""')}"`;
                }
                return strVal;
            }).join(",") + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sql_result_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// Calculate business KPI stats from Python API
function updateOverviewCounters(kpiData) {
    if (kpiData) {
        document.getElementById("kpi-revenue").innerText = kpiData.revenue;
        document.getElementById("kpi-books").innerText = kpiData.books_sold;
        document.getElementById("kpi-customers").innerText = kpiData.customers;
        document.getElementById("kpi-genres").innerText = kpiData.genres;
        return;
    }
    
    // Otherwise fetch
    fetch('/api/kpis')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById("kpi-revenue").innerText = data.revenue;
                document.getElementById("kpi-books").innerText = data.books_sold;
                document.getElementById("kpi-customers").innerText = data.customers;
                document.getElementById("kpi-genres").innerText = data.genres;
            }
        });
}

// Render business overview charts using aggregates from Python backend
function renderCharts() {
    // Destroy old charts if they exist to avoid hover glitches
    Object.keys(chartInstances).forEach(key => {
        chartInstances[key].destroy();
    });

    fetch('/api/charts')
        .then(res => res.json())
        .then(res => {
            if (res.status !== 'success') return;
            
            // Chart 1: Revenue by Genre
            const c1Data = res.genre_revenue;
            const ctx1 = document.getElementById("chart-genre-revenue").getContext("2d");
            chartInstances.genreRevenue = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: c1Data.labels,
                    datasets: [{
                        label: 'Revenue ($)',
                        data: c1Data.data,
                        backgroundColor: 'rgba(99, 102, 241, 0.4)',
                        borderColor: '#6366f1',
                        borderWidth: 1.5,
                        borderRadius: 6
                    }]
                },
                options: getChartOptions('Genre Revenue Performance ($)')
            });

            // Chart 2: Monthly Revenue Sales Trend
            const c2Data = res.sales_trend;
            const ctx2 = document.getElementById("chart-sales-trend").getContext("2d");
            chartInstances.salesTrend = new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: c2Data.labels,
                    datasets: [{
                        label: 'Monthly Revenue ($)',
                        data: c2Data.data,
                        borderColor: '#10b981', // Emerald 500
                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                        fill: true,
                        tension: 0.35,
                        borderWidth: 2,
                        pointBackgroundColor: '#10b981'
                    }]
                },
                options: getChartOptions('Store Revenue Growth Timeline')
            });

            // Chart 3: Top Selling Authors
            const c3Data = res.top_authors;
            const ctx3 = document.getElementById("chart-top-authors").getContext("2d");
            chartInstances.topAuthors = new Chart(ctx3, {
                type: 'doughnut',
                data: {
                    labels: c3Data.labels,
                    datasets: [{
                        label: 'Books Sold',
                        data: c3Data.data,
                        backgroundColor: [
                            'rgba(99, 102, 241, 0.5)',
                            'rgba(16, 185, 129, 0.5)',
                            'rgba(168, 85, 247, 0.5)',
                            'rgba(249, 115, 22, 0.5)',
                            'rgba(239, 68, 68, 0.5)'
                        ],
                        borderColor: [
                            '#6366f1', '#10b981', '#a855f7', '#f97316', '#ef4444'
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#a1a1aa', font: { family: 'Inter', size: 10 } }
                        },
                        title: {
                            display: true,
                            text: 'Top Authors by Units Sold',
                            color: '#e4e4e7',
                            font: { family: 'Inter', size: 13, weight: 'bold' }
                        }
                    }
                }
            });

            // Chart 4: Inventory levels vs Units Sold by Genre
            const c4Data = res.inventory;
            const ctx4 = document.getElementById("chart-inventory-analysis").getContext("2d");
            chartInstances.inventory = new Chart(ctx4, {
                type: 'bar',
                data: {
                    labels: c4Data.labels,
                    datasets: [
                        {
                            label: 'Warehouse Stock',
                            data: c4Data.inventory,
                            backgroundColor: 'rgba(39, 39, 42, 0.6)',
                            borderColor: '#71717a',
                            borderWidth: 1,
                            borderRadius: 4
                        },
                        {
                            label: 'Total Units Sold',
                            data: c4Data.sold,
                            backgroundColor: 'rgba(168, 85, 247, 0.4)',
                            borderColor: '#a855f7',
                            borderWidth: 1,
                            borderRadius: 4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { display: false }, ticks: { color: '#71717a', font: { family: 'Inter', size: 9 } } },
                        y: { grid: { color: '#27272a' }, ticks: { color: '#71717a', font: { family: 'Inter', size: 9 } } }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { color: '#a1a1aa', font: { family: 'Inter', size: 10 } }
                        },
                        title: {
                            display: true,
                            text: 'Stock Availability vs Sales Velocity',
                            color: '#e4e4e7',
                            font: { family: 'Inter', size: 13, weight: 'bold' }
                        }
                    }
                }
            });
        })
        .catch(err => console.error("Failed to fetch analytics charts data:", err));
}

// Generate Standardized Dark Chart Options
function getChartOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#71717a', font: { family: 'Inter', size: 10 } }
            },
            y: {
                grid: { color: '#27272a' },
                ticks: { color: '#71717a', font: { family: 'Inter', size: 10 } }
            }
        },
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: title,
                color: '#e4e4e7',
                font: { family: 'Inter', size: 13, weight: 'bold' }
            }
        }
    };
}

// Populate the Data Explorer raw tables from Python API
function populateDataExplorer() {
    const tables = ["Books", "Customers", "Orders"];
    tables.forEach(table => {
        fetch(`/api/raw?table=${table}`)
            .then(res => res.json())
            .then(data => {
                if (data.status !== 'success') return;
                
                const headerEl = document.getElementById(`explorer-header-${table.toLowerCase()}`);
                const bodyEl = document.getElementById(`explorer-body-${table.toLowerCase()}`);

                headerEl.innerHTML = data.columns.map(c => `
                    <th class="px-4 py-2.5 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                        ${c}
                    </th>
                `).join("");

                bodyEl.innerHTML = data.values.map(row => `
                    <tr class="hover:bg-zinc-800/30 transition-colors border-b border-zinc-800/40">
                        ${row.map(val => `
                            <td class="px-4 py-2 text-xs text-zinc-300 font-mono">${val === null ? 'NULL' : val}</td>
                        `).join("")}
                    </tr>
                `).join("");
            })
            .catch(err => console.error(`Failed to load Data Explorer for table ${table}:`, err));
    });
}
