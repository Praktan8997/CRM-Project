from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal
from .schemas import (
    TicketCreate, TicketUpdate, TicketCreateResponse, 
    TicketListItem, TicketDetail, TicketUpdateResponse
)
from .crud import create_ticket, get_tickets, get_ticket, update_ticket, ticket_exists
from typing import Optional, List

router = APIRouter()

# ============ DATABASE CONNECTION ============

def get_db():
    """
    Get database connection for each request.
    This ensures connection is properly closed after request completes.
    """
    db = SessionLocal()
    try:
        yield db  # Provide db to the endpoint
    finally:
        db.close()  # Close connection when done


# ============ CREATE ENDPOINT ============

@router.post("/tickets", response_model=TicketCreateResponse)
def create_new_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    """
    Create a new ticket.
    
    Request body: { customer_name, customer_email, subject, description }
    Response: { ticket_id, created_at }
    
    Error:
    - 400: If ticket with same email and subject already exists
    """
    # Step 1: Check if ticket already exists
    if ticket_exists(db, ticket.customer_email, ticket.subject):
        raise HTTPException(
            status_code=400,
            detail="Ticket with this email and subject already exists"
        )
    
    # Step 2: Create the ticket
    new_ticket = create_ticket(db, ticket)
    
    # Step 3: Return response with ticket_id and created_at
    return TicketCreateResponse(
        ticket_id=new_ticket.ticket_id,
        created_at=new_ticket.created_at
    )


# ============ READ ENDPOINTS ============

@router.get("/tickets", response_model=List[TicketListItem])
def all_tickets(
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all tickets with optional filtering.
    
    Query parameters:
    - status: Filter by ticket status (e.g., 'Open', 'Closed')
    - search: Search by customer name (partial match)
    
    Response: List of tickets with limited fields
    """
    # Step 1: Get filtered tickets from database
    tickets = get_tickets(db, status=status, search=search)
    
    # Step 2: Convert to response format
    response_list = []
    for ticket in tickets:
        response_item = TicketListItem(
            ticket_id=ticket.ticket_id,
            customer_name=ticket.customer_name,
            subject=ticket.subject,
            status=ticket.status,
            created_at=ticket.created_at
        )
        response_list.append(response_item)
    
    # Step 3: Return response
    return response_list


@router.get("/tickets/{ticket_id}", response_model=TicketDetail)
def single_ticket(ticket_id: str, db: Session = Depends(get_db)):
    """
    Get a single ticket with all details.
    
    URL parameter: ticket_id (e.g., 'TKT-abc12345')
    
    Response: Full ticket information
    
    Error:
    - 404: If ticket not found
    """
    # Step 1: Get ticket from database
    ticket = get_ticket(db, ticket_id)
    
    # Step 2: Check if ticket exists
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Step 3: Return full ticket details
    return TicketDetail(
        ticket_id=ticket.ticket_id,
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description,
        status=ticket.status,
        notes=ticket.notes
    )


# ============ UPDATE ENDPOINT ============

@router.put("/tickets/{ticket_id}", response_model=TicketUpdateResponse)
def update_ticket_route(ticket_id: str, ticket: TicketUpdate, db: Session = Depends(get_db)):
    """
    Update a ticket's status and/or notes.
    
    URL parameter: ticket_id
    Request body: { status (optional), notes (optional) }
    Response: { success, updated_at }
    
    Error:
    - 404: If ticket not found
    """
    # Step 1: Check if ticket exists
    existing_ticket = get_ticket(db, ticket_id)
    if not existing_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Step 2: Update the ticket
    updated_ticket = update_ticket(
        db,
        ticket_id,
        status=ticket.status,
        notes=ticket.notes
    )
    
    # Step 3: Return success response with updated_at timestamp
    return TicketUpdateResponse(
        success=True,
        updated_at=updated_ticket.updated_at
    )



