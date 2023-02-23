const { getServerRedis } = require('./redis.service');

module.exports = {
  getClusterInfo: async ({ headers, url, user }, res) => {
    const { getModel, sequelize } = global;
    const Server = getModel({ model: 'Server' });

    const public_path = url.trim().split('/');

    const key = `/${public_path[1]}/v[0-9]/${public_path[3]}`.split('?')[0];
    const pub_key =
      `/${public_path[1]}/${public_path[2]}/${public_path[3]}`.split('?')[0];

    const clusterInfo = await getServerRedis(user.shop.id, user.shop.name);
    if (!clusterInfo.success) return clusterInfo;

    return {
      status: true,
      message: 'get tenant success',
      target: `http://${clusterInfo.target.ip}:5002`
    };
  }
};

// const getShop = async (key, pub_key) => {
//   const rs = await getShopRedis(key);
//   if (rs) return rs;

//   const rsl = await getShopRedis(pub_key);
//   if (rsl) return rsl;

//   const ServiceModel = await global.clientConnection.model('Service');
//   return await ServiceModel.findOne({
//     publicPath: { $regex: key, $options: 'i' }
//   });

//   // return await servicesByConf.find(conf => conf.public_path == key);
// };
