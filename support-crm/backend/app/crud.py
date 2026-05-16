from sqlalchemy.orm import Session
from .models import Ticket
import uuid
from typing import Optional

# ============ CREATE OPERATIONS ============

def ticket_exists(db: Session, customer_email: str, subject: str):
    """
    Check if a ticket already exists with the same email and subject.
    Returns True if exists, False otherwise.
    """
    # Query the database for matching ticket
    existing_ticket = db.query(Ticket).filter(
        Ticket.customer_email == customer_email,
        Ticket.subject == subject
    ).first()
    
    # Return True if found, False if not found
    return existing_ticket is not None


def create_ticket(db: Session, ticket):
    """
    Create a new ticket in the database.
    Steps:
    1. Generate a unique ticket ID
    2. Create a new Ticket object with data from request
    3. Save to database
    4. Return the created ticket
    """
    # Step 1: Generate unique ticket ID
    ticket_id = f"TKT-{uuid.uuid4().hex[:8].upper()}"
    
    # Step 2: Create new ticket object
    new_ticket = Ticket(
        ticket_id=ticket_id,
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description
    )
    
    # Step 3: Save to database
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)  # Refresh to get any database-generated values
    
    # Step 4: Return created ticket
    return new_ticket


# ============ READ OPERATIONS ============

def get_tickets(db: Session, status: Optional[str] = None, search: Optional[str] = None):
    """
    Get all tickets with optional filtering.
    Supports:
    - Filter by status (e.g., 'Open', 'Closed')
    - Search by customer_name (partial match)
    """
    # Start with base query to get all tickets
    query = db.query(Ticket)
    
    # Apply status filter if provided
    if status:
        query = query.filter(Ticket.status == status)
    
    # Apply search filter if provided (case-insensitive partial match)
    if search:
        query = query.filter(Ticket.customer_name.ilike(f"%{search}%"))
    
    # Return all filtered results
    return query.all()


def get_ticket(db: Session, ticket_id: str):
    """
    Get a single ticket by its ticket_id.
    Returns the ticket if found, None if not found.
    """
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    return ticket


# ============ UPDATE OPERATIONS ============

def update_ticket(db: Session, ticket_id: str, status: Optional[str] = None, notes: Optional[str] = None):
    """
    Update a ticket's status and/or notes.
    Steps:
    1. Find the ticket by ticket_id
    2. Update the fields that were provided
    3. Save changes to database
    4. Return the updated ticket
    """
    # Step 1: Find the ticket
    ticket = get_ticket(db, ticket_id)
    
    # If ticket doesn't exist, return None
    if not ticket:
        return None
    
    # Step 2: Update fields if provided
    if status:
        ticket.status = status
    
    if notes is not None:
        ticket.notes = notes
    
    # Step 3: Save changes to database
    db.commit()
    db.refresh(ticket)
    
    # Step 4: Return updated ticket
    return ticket
