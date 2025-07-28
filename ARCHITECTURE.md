# Sweet Delights Bakery - Architecture Documentation

## Overview

Sweet Delights Bakery is a full-stack web application that combines a beautiful frontend showcase with a robust backend order management system. The application follows a modern web architecture pattern with clear separation of concerns.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (HTML/CSS/JS) │◄──►│   (FastAPI)     │◄──►│   (SQLite)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend
- **HTML5**: Semantic markup for bakery website
- **CSS3**: Responsive design with modern styling
- **JavaScript**: Client-side interactivity and API communication
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Typography (Playfair Display, Inter)

### Backend
- **Python 3.11**: Core programming language
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server for running FastAPI applications

### Database
- **SQLite**: Lightweight, serverless database
- **File**: `sweet_delights.db`

## Project Structure

```
7-28-2/
├── backend/                 # Backend application
│   ├── __init__.py
│   ├── main.py             # FastAPI application entry point
│   ├── models.py           # SQLAlchemy database models
│   ├── schemas.py          # Pydantic data validation schemas
│   └── database.py         # Database operations and CRUD
├── frontend/               # Frontend files (served as static)
│   ├── index.html          # Main bakery website
│   ├── admin.html          # Admin interface
│   ├── styles.css          # CSS styling
│   └── script.js           # JavaScript functionality
├── sweet_delights.db       # SQLite database
├── requirements.txt         # Python dependencies
├── run_server.py           # Application startup script
└── README.md               # Project documentation
```

## Backend Architecture

### API Layer (`main.py`)
- **FastAPI Application**: Main application instance with CORS middleware
- **Static File Serving**: Serves frontend files from root directory
- **Dependency Injection**: Database session management
- **API Endpoints**: RESTful endpoints for menu and order management

### Data Layer

#### Models (`models.py`)
```python
# Core entities
- MenuItem: Bakery products with pricing and categorization
- Order: Customer orders with status tracking
- OrderItem: Individual items within orders (many-to-many relationship)
```

#### Schemas (`schemas.py`)
```python
# Data validation and serialization
- MenuItemBase/Create/MenuItem: Menu item data structures
- OrderBase/Create/Order: Order data structures
- OrderItemBase/Create/OrderItem: Order item data structures
- OrderStatusUpdate: Status update validation
```

#### Database Operations (`database.py`)
- **CRUD Operations**: Complete Create, Read, Update, Delete operations
- **Menu Management**: Menu item retrieval and creation
- **Order Management**: Order processing, status updates, and deletion
- **Data Initialization**: Sample menu items population

## Database Schema

### Tables

#### `menu_items`
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| name | String | Product name |
| description | Text | Product description |
| price | Float | Product price |
| category | String | Product category |
| image_url | String | Optional product image |

#### `orders`
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| customer_name | String | Customer name |
| customer_email | String | Customer email |
| customer_phone | String | Customer phone (optional) |
| status | String | Order status (pending/confirmed/preparing/ready/completed) |
| total_amount | Float | Order total |
| order_date | DateTime | Order creation timestamp |
| special_instructions | Text | Special instructions (optional) |

#### `order_items`
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| order_id | Integer | Foreign key to orders |
| menu_item_id | Integer | Foreign key to menu_items |
| quantity | Integer | Item quantity |
| unit_price | Float | Price per unit |

### Relationships
- **Order → OrderItem**: One-to-many (one order can have multiple items)
- **MenuItem → OrderItem**: One-to-many (one menu item can be in multiple orders)
- **OrderItem → Order**: Many-to-one (order items belong to an order)
- **OrderItem → MenuItem**: Many-to-one (order items reference a menu item)

## API Endpoints

### Menu Management
- `GET /api/menu` - Retrieve all menu items
- `POST /api/menu` - Create new menu item

### Order Management
- `POST /api/orders` - Create new order
- `GET /api/orders` - Retrieve all orders
- `GET /api/orders/{order_id}` - Retrieve specific order
- `PUT /api/orders/{order_id}/status` - Update order status
- `DELETE /api/orders/{order_id}` - Delete order

## Frontend Architecture

### Components

#### Main Website (`index.html`)
- **Hero Section**: Landing page with call-to-action
- **About Section**: Company story and statistics
- **Team Section**: Staff showcase
- **Menu Section**: Product catalog with shopping cart
- **Contact Section**: Order placement form

#### Admin Interface (`admin.html`)
- **Order Management**: View and manage customer orders
- **Status Updates**: Change order status through UI
- **Order Details**: View complete order information

### JavaScript Functionality (`script.js`)
- **API Communication**: Fetch and POST requests to backend
- **Shopping Cart**: Client-side cart management
- **Form Handling**: Order placement and validation
- **Dynamic Updates**: Real-time UI updates

### Styling (`styles.css`)
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, bakery-themed design
- **CSS Grid/Flexbox**: Layout management
- **Animations**: Smooth transitions and hover effects

## Data Flow

### Order Placement Flow
1. **Customer browses menu** → Frontend displays menu items from API
2. **Adds items to cart** → JavaScript manages cart state
3. **Submits order** → Frontend sends order data to `/api/orders`
4. **Backend processes** → Creates order and order items in database
5. **Confirmation** → Frontend receives order confirmation

### Admin Order Management Flow
1. **Admin views orders** → Frontend fetches orders from `/api/orders`
2. **Updates status** → Frontend sends status update to `/api/orders/{id}/status`
3. **Backend updates** → Database reflects new status
4. **UI updates** → Frontend reflects status change

## Security Considerations

### Current Implementation
- **CORS Configuration**: Allows all origins (development only)
- **Input Validation**: Pydantic schemas validate all inputs
- **SQL Injection Protection**: SQLAlchemy ORM prevents injection
- **Error Handling**: Proper HTTP status codes and error messages

### Production Recommendations
- **CORS Restrictions**: Limit to specific domains
- **Authentication**: Implement user authentication for admin access
- **HTTPS**: Use SSL/TLS encryption
- **Rate Limiting**: Implement API rate limiting
- **Input Sanitization**: Additional input validation

## Deployment Architecture

### Development
```
┌─────────────────┐
│   Local Server  │
│   Port 8000     │
│   (Uvicorn)     │
└─────────────────┘
```

### Production Considerations
- **Web Server**: Nginx or Apache for static file serving
- **Application Server**: Gunicorn with Uvicorn workers
- **Database**: Consider PostgreSQL for production scale
- **Caching**: Redis for session management
- **CDN**: CloudFront for static assets

## Performance Characteristics

### Backend Performance
- **FastAPI**: High-performance async framework
- **SQLAlchemy**: Efficient database operations
- **SQLite**: Fast for small to medium workloads

### Frontend Performance
- **Static Files**: Fast loading with proper caching
- **Responsive Images**: Optimized for different screen sizes
- **Minimal Dependencies**: Lightweight JavaScript

## Scalability Considerations

### Current Limitations
- **SQLite**: Single-file database limits concurrent writes
- **Single Server**: No load balancing
- **No Caching**: Database queries not cached

### Scaling Strategies
- **Database Migration**: Move to PostgreSQL for better concurrency
- **Load Balancer**: Multiple application instances
- **Caching Layer**: Redis for frequently accessed data
- **CDN**: Distribute static assets globally
- **Microservices**: Split into separate services (menu, orders, admin)

## Monitoring and Logging

### Current State
- **Basic Logging**: Uvicorn access logs
- **Error Handling**: FastAPI exception handling

### Recommended Improvements
- **Structured Logging**: Implement proper logging framework
- **Health Checks**: API health check endpoints
- **Metrics Collection**: Application performance monitoring
- **Error Tracking**: Centralized error reporting

## Development Workflow

### Setup
1. Install Python 3.11+
2. Install dependencies: `pip install -r requirements.txt`
3. Run application: `python run_server.py`
4. Access frontend: `http://localhost:8000/static/index.html`

### Development Mode
```bash
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

### Database Management
- **Auto-creation**: Tables created automatically on startup
- **Sample Data**: Menu items populated on first run
- **Manual Reset**: Delete `sweet_delights.db` to reset

## Testing Strategy

### Current State
- **Manual Testing**: Manual API endpoint testing
- **Frontend Testing**: Browser-based testing

### Recommended Testing
- **Unit Tests**: Pytest for backend functions
- **Integration Tests**: API endpoint testing
- **Frontend Tests**: Jest for JavaScript functions
- **E2E Tests**: Selenium for complete user flows

## Future Enhancements

### Short-term
- **User Authentication**: Admin login system
- **Order Notifications**: Email/SMS order confirmations
- **Payment Integration**: Stripe or PayPal integration
- **Image Upload**: Product image management

### Long-term
- **Mobile App**: React Native or Flutter app
- **Inventory Management**: Stock tracking system
- **Analytics Dashboard**: Sales and customer analytics
- **Multi-location Support**: Multiple bakery locations
- **Delivery Integration**: Third-party delivery services

## Conclusion

The Sweet Delights Bakery application demonstrates a well-structured full-stack architecture with clear separation between frontend presentation and backend business logic. The use of modern technologies (FastAPI, SQLAlchemy, Pydantic) provides a solid foundation for future enhancements and scaling.

The architecture supports both the customer-facing bakery website and the internal order management system, making it suitable for small to medium-sized bakery operations with potential for growth and feature expansion. 