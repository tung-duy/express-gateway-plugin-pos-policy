const { getServerRedis, getServerBySubdomain } = require('./redis.service');

module.exports = {
  getClusterInfo: async ({ headers, url, user }, res) => {
    if (!user.shop) {
      return {
        success: false,
        message: `${user.email} has not updated shop information`,
        target: null
      }
    }
    const clusterInfo = await getServerRedis(
      user.shop.id,
      user.shop.name,
      user.shop.serverId
    );
    if (!clusterInfo.success) return clusterInfo;

    return {
      status: true,
      message: 'get tenant success',
      target: `http://${clusterInfo.target.ip}:${clusterInfo.target.posBePort}`
    };
  },
  getSalesClusterInfo: async ({ headers, url, user }, res) => {
    try {
      if (!headers?.origin || !headers?.referer) {
        return {
          success: false,
          message: `Headers is invalid`,
        }
      }
      const { hostname } = new URL(headers?.origin) || new URL(headers?.referer);
      const parts = hostname?.split('.');
      const subdomain = parts[0] || '';
      const clusterInfo = await getServerBySubdomain(subdomain)
      console.log("🚀 ~ file: pos.service.js:24 ~ getSalesClusterInfo: ~ clusterInfo:", clusterInfo)

      if (!clusterInfo.success) return clusterInfo;

      return {
        status: true,
        message: 'get tenant success',
        target: `http://${clusterInfo.target.ip}:${clusterInfo.target.salesBePort}`
      };
    } catch (err) {
      return {
        success: false,
        message: `Request is invalid`,
      }
    }
  }
};
