const httpProxy = require('http-proxy');

const { getSalesClusterInfo } = require('../services/pos.service');

module.exports = {
  name: 'sales-policy',
  policy: (actionParams) => {
    return async (req, res, next) => {
      const info = await getSalesClusterInfo(req, res);

      if (!info.status) {
        return res.status(404).json({
          message: info.message
        });
      }

      const proxy = httpProxy.createProxyServer({ changeOrigin: true });
      proxy.on('error', (error, req, res) => {
        console.log(`${info.target} - error:`, error);

        if (!res.headersSent) {
          res.status(502).send('Bad gateway.');
        } else {
          res.end();
        }
      });

      proxy.web(req, res, { target: info.target });
    };
  }
};
