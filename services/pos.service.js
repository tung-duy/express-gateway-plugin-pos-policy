const { getServerRedis } = require('./redis.service');

module.exports = {
  getClusterInfo: async ({ headers, url, user }, res) => {
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
    console.log("🚀 ~ file: pos.service.js:19 ~ getSalesClusterInfo: ~ headers:", headers)
    // const clusterInfo = await getServerRedis(
    //   user.shop.id,
    //   user.shop.name,
    //   user.shop.serverId
    // );
    // if (!clusterInfo.success) return clusterInfo;

    return {
      status: true,
      message: 'get tenant success',
      // target: `http://${clusterInfo.target.ip}:${clusterInfo.target.salesBePort}`
      target: `http://localhost:5502`

    };
  }
};
