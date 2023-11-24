const { getServerRedis, getServerBySuffix, getServicesByCode } = require('./redis.service');
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
      const { suffix } = headers
      if (!suffix) {
        return {
          success: false,
          message: `Header is invalid`,
        }
      }

      const clusterInfo = await getServerBySuffix({ suffix });

      if (!clusterInfo.success) return clusterInfo;

      return {
        status: true,
        message: 'get tenant success',
        target: `http://${clusterInfo.service.destination}:${clusterInfo.service.port}`
      };
    } catch (err) {
      console.log("🚀 ~ file: pos.service.js:43 ~ getSalesClusterInfo: ~ err:", err)
      return {
        success: false,
        message: `Request is invalid`,
      }
    }
  }
};
