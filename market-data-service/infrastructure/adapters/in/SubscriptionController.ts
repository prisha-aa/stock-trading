import express from "express";

import { FinnhubWebSocket } from "./FinnhubWebSocket";
import { SymbolSubscription } from "../../../domain/ports/SymbolSubscription";

export function createSubscriptionController(
  registry: SymbolSubscription,
  finnhub: FinnhubWebSocket
): express.Router {
  const router = express.Router();

  router.post("/subscribe", async (req, res) => {
    const { clientId, symbol } = req.body;
    await registry.subscribe(clientId, symbol);
    finnhub.subscribe(symbol);
    res.status(200).send("Subscribed");
  });

  router.post("/unsubscribe", async (req, res) => {
    const { clientId, symbol } = req.body;
    await registry.unsubscribe(clientId, symbol);
    if (registry.getClientsFor(symbol).length === 0) {
      finnhub.unsubscribe(symbol);
    }
    res.status(200).send("Unsubscribed");
  });

  return router;
}