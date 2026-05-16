from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# ============ REQUEST SCHEMAS ============
# These define what data the client sends to the API

class TicketCreate(BaseModel):
    """Data needed to create a new ticket"""
    customer_name: str
    customer_email: EmailStr  # Email validation
    subject: str
    description: str


class TicketUpdate(BaseModel):
    """Data to update an existing ticket"""
    status: Optional[str] = None  # Can be None
    notes: Optional[str] = None   # Can be None


# ============ RESPONSE SCHEMAS ============
# These define what data the API sends back to the client

class TicketCreateResponse(BaseModel):
    """Response when creating a ticket"""
    ticket_id: str
    created_at: datetime


class TicketListItem(BaseModel):
    """Single ticket in a list (limited fields)"""
    ticket_id: str
    customer_name: str
    subject: str
    status: str
    created_at: datetime


class TicketDetail(BaseModel):
    """Complete ticket information"""
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    notes: Optional[str]


class TicketUpdateResponse(BaseModel):
    """Response when updating a ticket"""
    success: bool
    updated_at: datetime
