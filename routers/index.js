const express = require('express');
const router = express.Router();

router.get('/ping', (req, res, next) => {
  res.json({ name: 'API Gateway service are running...', ping: 'PONG as' });
});

module.exports = router;
