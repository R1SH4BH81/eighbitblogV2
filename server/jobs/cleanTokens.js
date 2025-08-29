const cron = require("node-cron");
const RefreshToken = require("../models/RefreshToken.models");

// Run every night at midnight
const cleanExpiredTokens = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();
      const result = await RefreshToken.deleteMany({ expiresAt: { $lt: now } });
      if (result.deletedCount > 0) {
        console.log(`Cleaned ${result.deletedCount} expired refresh tokens`);
      }
    } catch (err) {
      console.error("Error cleaning tokens:", err.message);
    }
  });
};

module.exports = cleanExpiredTokens;
