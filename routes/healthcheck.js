const express = require("express");
const router = express.Router();

/* This is a healthcheck endpoint that returns the uptime of the server, a message, and a timestamp. */
router.get("/", async (_req, res, _next) => {
  const _healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    instances: process.env.NODE_APP_INSTANCE,
  };
  try {
    res.send(_healthcheck);
  } catch (error) {
    _healthcheck.message = error;
    res.status(503).send();
  }
});

module.exports = router;
