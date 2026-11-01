import axios from "axios";

const CATALOG_BASE_URL = process.env.CATALOG_SERVICE_URL || "http://catalog-service:8000";

export interface Product {
  id: string;
  name: string;
  price: number;
}

export class CatalogClient {
  /**
   * LEVEL 1 (EASY): Static exact URL match
   * Calls: GET /api/v1/products on repo_2
   */
  async listProducts(): Promise<Product[]> {
    const url = `${CATALOG_BASE_URL}/api/v1/products`;
    const response = await axios.get<Product[]>(url);
    return response.data;
  }

  /**
   * LEVEL 2 (MEDIUM): Dynamic Path Parameter template interpolation
   * Calls: GET /api/v1/products/{product_id}
   * Notice: Uses `${id}` in TS vs `{product_id}` in Python FastAPI
   */
  async getProductDetails(productId: string): Promise<Product> {
    const response = await axios.get<Product>(`${CATALOG_BASE_URL}/api/v1/products/${productId}`);
    return response.data;
  }

  /**
   * LEVEL 3 (HARD): Sub-router prefix match
   * Target in repo_2 is inside an APIRouter(prefix="/api/v1/inventory") -> @router.post("/reserve")
   */
  async reserveInventory(sku: string, quantity: number): Promise<{ success: boolean; reservationId: string }> {
    const endpoint = `${CATALOG_BASE_URL}/api/v1/inventory/reserve`;
    const response = await axios.post(endpoint, { sku, quantity });
    return response.data;
  }

  /**
   * LEVEL 2 (MEDIUM): Bare path using fetch with default GET (Method fallback test)
   */
  async checkCatalogHealth(): Promise<boolean> {
    const res = await fetch(`${CATALOG_BASE_URL}/api/v1/health`);
    return res.status === 200;
  }
}
