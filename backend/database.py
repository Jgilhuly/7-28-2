from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import List
from . import models, schemas

# Database configuration
SQLITE_DATABASE_URL = "sqlite:///./sweet_delights.db"
engine = create_engine(SQLITE_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Menu Items CRUD
def get_menu_items(db: Session) -> List[models.MenuItem]:
    return db.query(models.MenuItem).all()

def create_menu_item(db: Session, item: schemas.MenuItemCreate) -> models.MenuItem:
    db_item = models.MenuItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# Orders CRUD
def create_order(db: Session, order: schemas.OrderCreate) -> models.Order:
    # Calculate total amount
    total_amount = sum(item.quantity * item.unit_price for item in order.items)
    
    # Create order
    db_order = models.Order(
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_phone=order.customer_phone,
        special_instructions=order.special_instructions,
        total_amount=total_amount
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            menu_item_id=item.menu_item_id,
            quantity=item.quantity,
            unit_price=item.unit_price
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session) -> List[models.Order]:
    return db.query(models.Order).all()

def get_order(db: Session, order_id: int) -> models.Order:
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def update_order_status(db: Session, order_id: int, status: str) -> models.Order:
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if order:
        order.status = status
        db.commit()
        db.refresh(order)
    return order

def delete_order(db: Session, order_id: int) -> bool:
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if order:
        db.delete(order)
        db.commit()
        return True
    return False

# Initialize menu items
def init_menu_items(db: Session):
    # Check if menu items already exist
    if db.query(models.MenuItem).first() is not None:
        return
    
    # Sample menu items based on your HTML
    menu_items = [
        # Fresh Breads
        {"name": "Artisan Sourdough", "description": "Classic sourdough with crispy crust and tangy flavor", "price": 6.50, "category": "Fresh Breads"},
        {"name": "Whole Wheat Multigrain", "description": "Hearty bread packed with seeds and grains", "price": 7.00, "category": "Fresh Breads"},
        {"name": "French Baguette", "description": "Traditional crispy baguette, perfect for sandwiches", "price": 4.50, "category": "Fresh Breads"},
        
        # Pastries & Desserts
        {"name": "Butter Croissants", "description": "Flaky, buttery croissants baked to golden perfection", "price": 3.25, "category": "Pastries & Desserts"},
        {"name": "Chocolate Eclair", "description": "Light choux pastry filled with vanilla cream and chocolate glaze", "price": 4.75, "category": "Pastries & Desserts"},
        {"name": "Apple Danish", "description": "Sweet pastry topped with cinnamon apples and glaze", "price": 4.25, "category": "Pastries & Desserts"},
        
        # Specialty Cakes
        {"name": "Custom Birthday Cakes", "description": "Made to order with your choice of flavors and decorations", "price": 35.00, "category": "Specialty Cakes"},
        {"name": "Wedding Cakes", "description": "Elegant multi-tier cakes for your special day", "price": 150.00, "category": "Specialty Cakes"},
        {"name": "Cheesecake Slices", "description": "Rich and creamy New York style cheesecake", "price": 5.50, "category": "Specialty Cakes"},
    ]
    
    for item_data in menu_items:
        db_item = models.MenuItem(**item_data)
        db.add(db_item)
    
    db.commit() 