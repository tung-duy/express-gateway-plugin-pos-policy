const express = require('express');
const dns = require('dns');
const router = express.Router();

const { getServerBySuffix } = require('../services/redis.service');
const validateInput = require('../middleware/validateInput');
const { merchantValidation } = require('../validations/merchant');
router.use("/healthz", require("./healthcheck"));
router.get('/ping', (req, res, next) => {
  res.json({ name: 'API Gateway service are running...', ping: 'PONG as' });
});

router.get('/merchant', validateInput(merchantValidation), async (req, res, next) => {
  try {
    const { domain } = req.params
      const { address } = await new Promise((rs, rj) => {
        const a = dns.lookup(domain, (err, address, family) => {
          if (err) {
            console.log(`Không thể tìm thấy IP của domain: ${domain}`);
            console.error(err);
            return rj(err);
          }
        
        return rs({
          address,
          family
        })
          
        });
      })
      
    return res.json({
      address: address,
      ipv: family
    });
  } catch (err) {
    console.log("🚀 ~ router.get ~ err:", err)
    return next(err)
  }
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
