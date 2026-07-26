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


# ============ ADMIN PROFILE SCHEMAS ============

class AdminProfileSchema(BaseModel):
    name: str
    role: str
    email: str

    class Config:
        orm_mode = True
        from_attributes = True


class AdminProfileUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None


# ============ TEAM MEMBER SCHEMAS ============

class TeamMemberSchema(BaseModel):
    id: int
    name: str
    role: str
    email: str
    status: str
    tickets_handled: int

    class Config:
        orm_mode = True
        from_attributes = True


# ============ ANALYTICS SCHEMAS ============

class TicketByDate(BaseModel):
    date: str
    count: int


class AnalyticsData(BaseModel):
    total_tickets: int
    open_tickets: int
    in_progress_tickets: int
    closed_tickets: int
    tickets_by_date: list[TicketByDate]
    resolution_rate: float

