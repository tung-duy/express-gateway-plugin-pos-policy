// const { Redis } = require('@fwork/backend-helper');

function setCompanyServer(companyId, serviceName, server) {
  const value = JSON.stringify({
    name: server.name,
    port: server.port
  });
  const key = `${companyId}_${serviceName}`;
  Redis.set(key, value);
}

// async function getCompanyServer(companyId, serviceName) {
//   const valueRedis = await getCompanyServerRedis(companyId, serviceName);
//   console.log('valueRedis: ', valueRedis);

//   if (valueRedis && valueRedis.name && valueRedis.port) {
//     return valueRedis;
//   }

//   const ServerModel = await global.clientConnection.model('Server');
//   const CompanyServerModel = await global.clientConnection.model(
//     'CompanyServer',
//   );

//   const companyServer = await CompanyServerModel.findOne({
//     companyId,
//     serviceName,
//   });
//   console.log('companyServer: ', companyServer);

//   if (!companyServer) {
//     return null;
//   }
//   const server = await ServerModel.findById(companyServer.serverId);
//   if (!server) {
//     return null;
//   }
//   setCompanyServer(companyId, serviceName, server);
//   return {
//     name: server.name,
//     port: server.port,
//   };
// }

// async function getCompanyServerRedis(companyId, serviceName) {
//   return new Promise(function (resolve, reject) {
//     const key = `${companyId}_${serviceName}`;
//     Redis.get(key, function (err, value) {
//       if (value) {
//         return resolve(JSON.parse(value));
//       }
//       resolve(null);
//     });
//   });
// }

async function getServiceRedis(public_path) {
  return new Promise(function (resolve, reject) {
    Redis.get(public_path, function (err, value) {
      if (value) {
        return resolve(JSON.parse(value));
      }
      resolve(null);
    });
  });
}

module.exports = {
  setCompanyServer,
  getServiceRedis
};
