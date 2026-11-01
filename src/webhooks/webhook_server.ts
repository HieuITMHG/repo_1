import express, { Request, Response, Router } from "express";

const app = express();
app.use(express.json());

const webhookRouter = Router();

/**
 * LEVEL 3 (HARD): Nested Router Prefix
 * Router prefix is '/api/v1/webhooks', endpoint is '/payment-callback'
 * Full path: POST /api/v1/webhooks/payment-callback
 * Target of repo_2 BillingService callback!
 */
webhookRouter.post("/payment-callback", (req: Request, res: Response) => {
  const { transactionId, status, orderId } = req.body;
  console.log(`[Repo_1 Webhook] Received payment update for order ${orderId}: ${status} (${transactionId})`);
  res.status(200).json({ acknowledged: true, processedAt: new Date().toISOString() });
});

/**
 * Health check on router
 * Full path: GET /api/v1/webhooks/health
 */
webhookRouter.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "webhook_server_ok" });
});

// Register sub-router with prefix
app.use("/api/v1/webhooks", webhookRouter);

// Local internal health check (To test caller-local floor)
app.get("/api/v1/internal/health", (req: Request, res: Response) => {
  res.status(200).json({ service: "repo_1_storefront", alive: true });
});

export default app;
