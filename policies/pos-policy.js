const httpProxy = require('http-proxy');
const { getClusterInfo } = require('../services/pos.service');

module.exports = {
  name: 'pos-policy',
  policy: (actionParams) => {
    return async (req, res, next) => {
      console.log('-------------------req.user', req.user);
      console.log('-------------------req.headers', req.headers);

      const info = await getClusterInfo(req, res);

      if (!info.status) {
        return res.status(404).json({
          message: info.message
        });
      }

      const proxy = httpProxy.createProxyServer({ changeOrigin: true });
      proxy.on('error', (error, req, res) => {
        console.log(`${target} - error:`, error);

        if (!res.headersSent) {
          res.status(502).send('Bad gateway.');
        } else {
          res.end();
        }
      });

      proxy.web(req, res, { target });
    };
  }
};
