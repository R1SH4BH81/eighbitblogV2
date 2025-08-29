export const healthController = {
  health: (req, res) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
      version: process.env.APP_VERSION || "unknown",
    });
  },

  ready: async (req, res) => {
    // replace with real dependency checks if needed
    const dbOk = true;
    if (!dbOk) {
      return res.status(503).json({ status: "degraded" });
    }
    res.json({ status: "ready" });
  },
};

// Usage:
// app.get("/health", healthController.health);
// app.get("/ready", healthController.ready);


