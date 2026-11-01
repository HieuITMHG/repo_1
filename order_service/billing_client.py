import os
import requests
import httpx
from typing import Dict, Any

BILLING_SERVICE_URL = os.getenv("BILLING_SERVICE_URL", "http://billing-service:5000")

class BillingServiceClient:
    """Client calling Python Flask billing service in repo_2."""

    def __init__(self, base_url: str = BILLING_SERVICE_URL):
        self.base_url = base_url.rstrip("/")

    def charge_customer(self, order_id: str, amount: float, currency: str = "USD") -> Dict[str, Any]:
        """
        LEVEL 3 (HARD): Calls Flask Blueprint route.
        Target in repo_2 is registered via Blueprint(url_prefix="/api/v1/billing")
        Endpoint: POST /api/v1/billing/charge
        """
        endpoint = f"{self.base_url}/api/v1/billing/charge"
        payload = {
            "order_id": order_id,
            "amount": amount,
            "currency": currency
        }
        response = requests.post(endpoint, json=payload, timeout=5.0)
        response.raise_for_status()
        return response.json()

    async def get_invoice_async(self, invoice_id: str) -> Dict[str, Any]:
        """
        LEVEL 2 (MEDIUM): Uses httpx async client.
        Calls: GET /api/v1/billing/invoices/{invoice_id}
        """
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.base_url}/api/v1/billing/invoices/{invoice_id}")
            resp.raise_for_status()
            return resp.json()
