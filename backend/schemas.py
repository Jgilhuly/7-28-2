from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Menu Item Schemas
class MenuItemBase(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: Optional[str] = None

class MenuItemCreate(MenuItemBase):
    pass

class MenuItem(MenuItemBase):
    id: int
    
    class Config:
        from_attributes = True

# Order Item Schemas
class OrderItemBase(BaseModel):
    menu_item_id: int
    quantity: int
    unit_price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    menu_item: MenuItem
    
    class Config:
        from_attributes = True

# Order Schemas
class OrderBase(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    special_instructions: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: int
    status: str
    total_amount: float
    order_date: datetime
    items: List[OrderItem]
    
    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str 