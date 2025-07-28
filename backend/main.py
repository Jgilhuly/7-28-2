from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
import uvicorn

from . import models, schemas, database
from .database import SessionLocal, engine

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sweet Delights API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (your existing frontend)
app.mount("/static", StaticFiles(directory="."), name="static")

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Sweet Delights API is running!"}

# Menu Items Endpoints
@app.get("/api/menu", response_model=List[schemas.MenuItem])
def get_menu_items(db: Session = Depends(get_db)):
    return database.get_menu_items(db)

@app.post("/api/menu", response_model=schemas.MenuItem)
def create_menu_item(item: schemas.MenuItemCreate, db: Session = Depends(get_db)):
    return database.create_menu_item(db, item)

# Orders Endpoints
@app.post("/api/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return database.create_order(db, order)

@app.get("/api/orders", response_model=List[schemas.Order])
def get_orders(db: Session = Depends(get_db)):
    return database.get_orders(db)

@app.get("/api/orders/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = database.get_order(db, order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.put("/api/orders/{order_id}/status")
def update_order_status(order_id: int, status: schemas.OrderStatusUpdate, db: Session = Depends(get_db)):
    order = database.update_order_status(db, order_id, status.status)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order status updated successfully"}

@app.delete("/api/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    success = database.delete_order(db, order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 