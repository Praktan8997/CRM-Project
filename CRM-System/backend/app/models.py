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


class AdminProfile(Base):
    """
    Persists admin profile details.
    """
    __tablename__ = "admin_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Alex Rivera")
    role = Column(String, default="Senior Lead")
    email = Column(String, default="alex.rivera@supportflow.com")


class TeamMember(Base):
    """
    Persists team directory profiles.
    """
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String)
    email = Column(String)
    status = Column(String, default="Active")  # Active, Offline, Away
    tickets_handled = Column(Integer, default=0)

