const express = require('express');
const router = express.Router();
const { getServerBySuffix } = require('../services/redis.service');

router.use("/healthz", require("./healthcheck"));
router.get('/ping', (req, res, next) => {
  res.json({ name: 'API Gateway service are running...', ping: 'PONG as' });
});

router.get('/:suffix', async (req, res, next) => {
  try {
    const { suffix } = req.params

    if (!suffix) {
      return next({
        success: false,
        message: `Suffix is invalid`,
      })
    }

    const clusterInfo = await getServerBySuffix({ suffix });

    if (!clusterInfo.success) return next(clusterInfo);

    return res.json({
      success: clusterInfo.success,
      shop: clusterInfo.shop.dbName,
      type: clusterInfo.type,
      suffix
    });
  } catch (err) {
    console.log("🚀 ~ file: index.js:32 ~ router.get ~ err:", err)
    return next(err)
  }
});
module.exports = router;
