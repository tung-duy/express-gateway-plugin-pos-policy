const { getServerRedis, getServerBySubdomain, getServicesByCode } = require('./redis.service');
const { POS_BACKEND, POS_SALES_BACKEND } = require('../constants');
module.exports = {
  getClusterInfo: async ({ headers, url, user }, res) => {
    if (!user.shop) {
      return {
        success: false,
        message: `${user.email} has not updated shop information`,
        target: null
      }
    }
    const clusterInfo = await getServerRedis({ subdomain: user.shop.subdomain, serverId: user.shop.serverId });
    if (!clusterInfo.success) return clusterInfo;
    const data = await getServicesByCode(POS_BACKEND);
    if (!data.success) return data;
    
    return {
      status: true,
      message: 'get tenant success',
      target: `http://${data.service.destination}:${data.service.port}`
    };
  },
  getSalesClusterInfo: async ({ headers, url, user }, res) => {
    try {
      if (!url.length) {
        return {
          success: false,
          message: `URL is invalid`,
        }
      }

      const segments = url.split("/");
      const prefix = segments[1]
      if (typeof prefix == 'undefined') {
        return {
          success: false,
          message: `Path is invalid`,
        }
      }
      const firstVariable = prefix.length > 1 ? segments[1] : "/";

      const clusterInfo = await getServerRedis({ subdomain: firstVariable });
      console.log("🚀 ~ file: pos.service.js:24 ~ getSalesClusterInfo: ~ clusterInfo:", clusterInfo)
      if (!clusterInfo.success) return clusterInfo;

      const data = await getServicesByCode(POS_SALES_BACKEND);
      if (!data.success) return data;

      return {
        status: true,
        message: 'get tenant success',
        target: `http://${data.service.destination}:${data.service.port}`
      };
    } catch (err) {
      return {
        success: false,
        message: `Request is invalid`,
      }
    }
  }
};
