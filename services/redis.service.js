// const { Redis } = require('@fwork/backend-helper');

function setServerRedis(shopId, shopName, server) {
  const value = JSON.stringify({
    ip: server.ip
  });
  const key = `db_${shopName}`;
  global.redis.set(key, value);
}

// async function getCompanyServer(shopId, shopName) {
//   const valueRedis = await getServerRedis(shopId, shopName);
//   console.log('valueRedis: ', valueRedis);

//   if (valueRedis && valueRedis.name && valueRedis.port) {
//     return valueRedis;
//   }

//   const ServerModel = await global.clientConnection.model('Server');
//   const CompanyServerModel = await global.clientConnection.model(
//     'CompanyServer'
//   );

//   const companyServer = await CompanyServerModel.findOne({
//     shopId,
//     shopName
//   });
//   console.log('companyServer: ', companyServer);

//   if (!companyServer) {
//     return null;
//   }
//   const server = await ServerModel.findById(companyServer.serverId);
//   if (!server) {
//     return null;
//   }
//   setServerRedis(shopId, shopName, server);
//   return {
//     name: server.name,
//     port: server.port
//   };
// }

async function getServerRedis(shopId, shopName, serverId) {
  const { getModel, redis } = global;

  const Server = getModel({ model: 'Server' });

  return new Promise(function (resolve, reject) {
    const key = `db_${shopName}`;
    redis.get(key, async function (err, value) {
      if (value) {
        return resolve({
          success: true,
          target: JSON.parse(value)
        });
      }
      const clusterInfo = await Server.findOne({
        where: { id: serverId },
        raw: true
      });
      if (!clusterInfo)
        return resolve({
          success: false,
          ms: `${shopName} is not available`,
          target: null
        });
      const newData = JSON.stringify({
        ip: clusterInfo.ip,
        ip_db: clusterInfo.ip_db,
        posBePort: clusterInfo.posBePort,
        ldBePort: clusterInfo.ldBePort,
        salesBePort: clusterInfo.salesBePort
      });
      const key = `db_${shopName}`;
      redis.set(key, newData);
      return resolve({
        success: true,
        target: { ip: clusterInfo.ip, posBePort: clusterInfo.posBePort }
      });
    });
  });
}

async function getServerBySubdomain(subdomain) {
  const { getModel, redis } = global;

  const Shop = getModel({ model: 'Shop' });
  const Server = getModel({ model: 'Server' });
  
  return new Promise(function (resolve, reject) {
    const key = `db_${subdomain}`;
    redis.get(key, async function (err, value) {
      if (value) {
        return resolve({
          success: true,
          target: JSON.parse(value)
        });
      }
      const shopInfo = await Shop.findOne({
        where: { subdomain },
        raw: true
      });

      if (!shopInfo)
        return resolve({
          success: false,
          ms: `${subdomain} is not available`,
          target: null
        });
      const clusterInfo = await Server.findOne({
        where: { id: shopInfo.serverId },
        raw: true
      });
      if (!clusterInfo)
        return resolve({
          success: false,
          ms: `${subdomain} is not available`,
          target: null
        });
      const newData = JSON.stringify({
        ip: clusterInfo.ip,
        ip_db: clusterInfo.ip_db,
        posBePort: clusterInfo.posBePort,
        ldBePort: clusterInfo.ldBePort,
        salesBePort: clusterInfo.salesBePort
      });
      const key = `db_${subdomain}`;
      redis.set(key, newData);
      return resolve({
        success: true,
        target: { ip: clusterInfo.ip, posBePort: clusterInfo.posBePort }
      });
    });
  });
}

// async function getServiceRedis(public_path) {
//   return new Promise(function (resolve, reject) {
//     Redis.get(public_path, function (err, value) {
//       if (value) {
//         return resolve(JSON.parse(value));
//       }
//       resolve(null);
//     });
//   });
// }

module.exports = {
  setServerRedis,
  getServerRedis,
  getServerBySubdomain
};
