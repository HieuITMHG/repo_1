from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests

from .billing_client import BillingServiceClient

app = FastAPI(title="Repo 1 - Order Management Service", version="1.0.0")
billing_client = BillingServiceClient()

class CheckoutRequest(BaseModel):
    order_id: str
    amount: float
    product_id: str

@app.post("/api/v1/orders/checkout")
def checkout(order: CheckoutRequest):
    """Process checkout and call repo_2 billing service."""
    try:
        charge_result = billing_client.charge_customer(
            order_id=order.order_id,
            amount=order.amount
        )
        return {
            "status": "success",
            "order_id": order.order_id,
            "charge": charge_result
        }
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Billing failed: {str(exc)}")

@app.get("/api/v1/internal/health")
def internal_health():
    """
    LEVEL 3 (CALLER-LOCAL FLOOR TEST):
    This route exists in BOTH repo_1 and repo_2.
    """
    return {"service": "repo_1_order_service", "status": "healthy"}

def check_self_health_locally():
    """
    Calls its OWN internal health endpoint.
    A correct cross-repo engine MUST NOT link this to repo_2's /api/v1/internal/health.
    """
    return requests.get("http://localhost:8000/api/v1/internal/health").json()
