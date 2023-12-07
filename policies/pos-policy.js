const httpProxy = require('http-proxy');

const { getClusterInfo } = require('../services/pos.service');

module.exports = {
  name: 'pos-policy',
  policy: (actionParams) => {
    return async (req, res, next) => {
      const info = await getClusterInfo(req, res);

      if (!info.status) {
        console.log("🚀 ~ file: pos-policy.js:12 ~ return ~ info:", info)
        return res.status(401).json({
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
