# Sweet Delights Bakery

A beautiful bakery website with integrated order management system.

## Features

- Responsive frontend showcasing bakery products and team
- FastAPI backend for order management
- SQLite database for storing orders and menu items
- Shopping cart functionality
- Order placement and tracking
- Admin API endpoints for order management

## Setup Instructions

### Prerequisites

- Python 3.11 or higher
- pip (Python package installer)

### Installation

1. Clone or download this repository
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the backend server:
   ```bash
   python run_server.py
   ```
   
   This will:
   - Initialize the database with menu items
   - Start the FastAPI server on http://localhost:8000
   
2. Open your web browser and navigate to:
   - Frontend: `http://localhost:8000/static/index.html`
   - API Documentation: `http://localhost:8000/docs`

## API Endpoints

### Menu Items
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Add new menu item

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/{order_id}` - Get specific order
- `PUT /api/orders/{order_id}/status` - Update order status
- `DELETE /api/orders/{order_id}` - Delete order

## Order Status Values

- `pending` - Order received, awaiting confirmation
- `confirmed` - Order confirmed by bakery
- `preparing` - Order is being prepared
- `ready` - Order ready for pickup
- `completed` - Order completed

## Database

The application uses SQLite database (`sweet_delights.db`) with the following tables:
- `menu_items` - Bakery products
- `orders` - Customer orders
- `order_items` - Individual items within orders

## Frontend Features

- Browse menu items with prices
- Add items to shopping cart
- Adjust quantities in cart
- Place orders with customer information
- Responsive design for mobile and desktop

## Development

To run in development mode with auto-reload:
```bash
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

The database will be automatically created and populated with sample menu items on first run.