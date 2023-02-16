module.exports = {
  getClusterInfo: async ({ headers, url }, res) => {
    const public_path = url.trim().split('/');
    console.log(
      '🚀 ~ file: pos.service.js:4 ~ getClusterInfo: ~ public_path',
      public_path
    );
    const key = `/${public_path[1]}/v[0-9]/${public_path[3]}`.split('?')[0];
    const pub_key =
      `/${public_path[1]}/${public_path[2]}/${public_path[3]}`.split('?')[0];

    // const service = await getShop(key, pub_key);
    // console.log('service:', service);

    // if (!service)
    //   return {
    //     status: false,
    //     ms: 'The service is not available',
    //     target: null
    //   };

    return {
      status: true,
      message: 'get tenant success',
      target: `http://192.168.80.92:5002`
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
