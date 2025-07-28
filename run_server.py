#!/usr/bin/env python3
"""
Startup script for Sweet Delights API server
"""
import uvicorn
from backend.database import SessionLocal, init_menu_items
from backend.models import Base
from backend.database import engine

def initialize_database():
    """Initialize database with tables and sample data"""
    print("Initializing database...")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Initialize menu items
    db = SessionLocal()
    try:
        init_menu_items(db)
        print("Database initialized successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    # Initialize database
    initialize_database()
    
    # Start the server
    print("Starting Sweet Delights API server...")
    uvicorn.run(
        "backend.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    ) 