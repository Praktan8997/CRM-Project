from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class Ticket(Base):
    """
    Ticket database model - represents a support ticket in the database.
    
    Fields:
    - id: Auto-incrementing primary key (internal use)
    - ticket_id: Unique ticket identifier (returned to user, e.g., 'TKT-abc123')
    - customer_name: Name of the customer
    - customer_email: Email of the customer
    - subject: Short description of the issue
    - description: Detailed description of the issue
    - status: Current status (default: 'Open')
    - notes: Internal notes or admin comments
    - created_at: When ticket was created
    - updated_at: When ticket was last modified
    """
    __tablename__ = "tickets"

    # Primary key - internal use
    id = Column(Integer, primary_key=True, index=True)
    
    # Unique ticket ID shown to users
    ticket_id = Column(String, unique=True, index=True)
    
    # Customer information
    customer_name = Column(String)
    customer_email = Column(String)
    
    # Ticket details
    subject = Column(String)
    description = Column(String)
    
    # Ticket management
    status = Column(String, default="Open")
    notes = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
