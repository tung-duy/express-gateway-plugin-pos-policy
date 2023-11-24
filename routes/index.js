const express = require('express');
const router = express.Router();
const { getServerBySuffix } = require('../services/redis.service');

router.get('/ping', (req, res, next) => {
  res.json({ name: 'API Gateway service are running...', ping: 'PONG as' });
});

router.get('/domain', async (req, res, next) => {
  try {
    if (!url.length) {
      return {
        success: false,
        message: `URL is invalid`,
      }
    }

    const segments = url.split("/");
    const suffix = segments[1]
    if (typeof suffix == 'undefined') {
      return {
        success: false,
        message: `Path is invalid`,
      }
    }
    const firstVariable = suffix.length > 1 ? segments[1] : "/";

    const clusterInfo = await getServerBySuffix({ suffix: firstVariable });

    if (!clusterInfo.success) return clusterInfo;

  } catch (err) {
    console.log("🚀 ~ file: index.js:32 ~ router.get ~ err:", err)
    return next(err)
  }
});
module.exports = router;
