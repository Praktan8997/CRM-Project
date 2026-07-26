from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal
from .schemas import (
    TicketCreate, TicketUpdate, TicketCreateResponse, 
    TicketListItem, TicketDetail, TicketUpdateResponse,
    AdminProfileSchema, AdminProfileUpdate, TeamMemberSchema,
    AnalyticsData, TicketByDate
)
from .crud import create_ticket, get_tickets, get_ticket, update_ticket, ticket_exists
from .models import AdminProfile, TeamMember, Ticket
from typing import Optional, List
from datetime import datetime, timedelta

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


# ============ ADMIN SETTINGS PROFILE ROUTES ============

@router.get("/admin/profile", response_model=AdminProfileSchema)
def get_admin_profile(db: Session = Depends(get_db)):
    """Retrieve the settings profile of the administrator."""
    profile = db.query(AdminProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Admin profile not found")
    return profile


@router.put("/admin/profile", response_model=AdminProfileSchema)
def update_admin_profile(profile_data: AdminProfileUpdate, db: Session = Depends(get_db)):
    """Update the administrator settings profile."""
    profile = db.query(AdminProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Admin profile not found")
    
    if profile_data.name is not None:
        profile.name = profile_data.name
    if profile_data.role is not None:
        profile.role = profile_data.role
    if profile_data.email is not None:
        profile.email = profile_data.email
        
    db.commit()
    db.refresh(profile)
    return profile


# ============ TEAM DIRECTORY ROUTES ============

@router.get("/team", response_model=List[TeamMemberSchema])
def get_team_directory(db: Session = Depends(get_db)):
    """List all support team members."""
    members = db.query(TeamMember).all()
    return members


# ============ REAL-TIME ANALYTICS ROUTES ============

@router.get("/analytics", response_model=AnalyticsData)
def get_ticket_analytics(db: Session = Depends(get_db)):
    """Compute and compile real-time ticket performance and volume stats."""
    tickets = db.query(Ticket).all()
    total = len(tickets)
    
    open_count = 0
    in_progress = 0
    closed = 0
    
    for t in tickets:
        if t.status == "Open":
            open_count += 1
        elif t.status == "In Progress":
            in_progress += 1
        elif t.status == "Closed":
            closed += 1
            
    # Group by date for the last 7 days
    today = datetime.utcnow().date()
    date_buckets = {}
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        date_str = day.strftime("%Y-%m-%d")
        date_buckets[date_str] = 0
        
    for t in tickets:
        t_date_str = t.created_at.date().strftime("%Y-%m-%d")
        if t_date_str in date_buckets:
            date_buckets[t_date_str] += 1
            
    tickets_by_date = [
        TicketByDate(date=date, count=count)
        for date, count in sorted(date_buckets.items())
    ]
    
    resolution_rate = (closed / total * 100) if total > 0 else 0.0
    
    return AnalyticsData(
        total_tickets=total,
        open_tickets=open_count,
        in_progress_tickets=in_progress,
        closed_tickets=closed,
        tickets_by_date=tickets_by_date,
        resolution_rate=round(resolution_rate, 2)
    )



