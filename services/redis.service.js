async function getServerRedis({ subdomain, serverId = null }) {
  try {
    const dbKey = `db_${subdomain}`;
    let serverKey = `server_${serverId}`;
    const dbData = await redis.get(dbKey);
    if (dbData) {
      return {
        success: true,
        target: JSON.parse(dbData),
      };
    }
    const serverDataInfo = await redis.get(serverKey);
    const newDbData = {}
    if (!serverDataInfo) {
      const { getModel, redis } = global;
      const Server = getModel({ model: "Server" });
      let id = serverId
      if (!id) {
        const Shop = getModel({ model: "Shop" });
        const shopInfo = await Shop.findOne({
          where: { subdomain },
          raw: true,
        });
  
        if (!shopInfo) {
          return {
            success: false,
            message: `${subdomain} is not available`,
            target: null,
          };
        }
        id = shopInfo.serverId
        serverKey = `server_${id}`;
      }
      const clusterInfo = await Server.findOne({
        where: { id },
        raw: true,
      });
      if (!clusterInfo) {
        return {
          success: false,
          message: `${subdomain} is not available`,
          target: null,
        };
      }
      const serverData = JSON.stringify({
        destination: clusterInfo.destination,
        port: clusterInfo.port
      })
      redis.set(serverKey, serverData);
      newDbData.destination = clusterInfo.destination
      newDbData.port = clusterInfo.port
    } else {
      newDbData.destination = JSON.parse(serverDataInfo).destination
      newDbData.port = JSON.parse(serverDataInfo).port
    }
    redis.set(dbKey, JSON.stringify(newDbData));
    
    return { success: true };
  } catch (err) {
    console.log("🚀 ~ file: redis.service.js:51 ~ getServerRedis ~ err:", err);
    return {
      success: false,
      message: `Get server information failed`
    };
  }
}
async function getServicesByCode(code) {
  try {
    const servicesData = await redis.get('services');
    const data = {};
    if (!servicesData) {
      const { getModel, redis } = global;
  
      const Service = getModel({ model: "Service" });
      const serviceInfos = await Service.findAll();
      if (!Array.isArray(serviceInfos) && !serviceInfos.length) {
        return {
          success: false,
          message: "Service information not found"
        }
      }
      redis.set('services', JSON.stringify(serviceInfos));
      const service = serviceInfos.find(el => el.code === code);
      if (!service) {
        data.success = false;
        data.message = "Service code is invalid"
        return data;
      }
      data.success = true;
      data.service = service
      return data;
    }
    const serviceTemp = JSON.parse(servicesData);
    const service = serviceTemp.find(el => el.code === code);
    if (!service) {
      data.success = false;
      data.message = "Service code is invalid"
      return data;
    }
    data.success = true;
    data.service = service
    return data;
  } catch (error) {
    console.log("🚀 ~ file: redis.service.js:77 ~ getServicesByCode ~ error:", error)
    return {
      success: false,
      message: "Can not get service by code"
    }
  }
}
async function getServerBySubdomain(subdomain) {
  const { getModel, redis } = global;

  const Shop = getModel({ model: "Shop" });
  const Server = getModel({ model: "Server" });

  return new Promise(function (resolve, reject) {
    const key = `db_${subdomain}`;
    redis.get(key, async function (err, value) {
      if (value) {
        return resolve({
          success: true,
          target: JSON.parse(value),
        });
      }
      const shopInfo = await Shop.findOne({
        where: { subdomain },
        raw: true,
      });

      if (!shopInfo)
        return resolve({
          success: false,
          message: `${subdomain} is not available`,
          target: null,
        });
      const clusterInfo = await Server.findOne({
        where: { id: shopInfo.serverId },
        raw: true,
      });
      if (!clusterInfo)
        return resolve({
          success: false,
          message: `${subdomain} is not available`,
          target: null,
        });
      const newData = JSON.stringify({
        ip: clusterInfo.ip,
        ip_db: clusterInfo.ip_db,
        posBePort: clusterInfo.posBePort,
        ldBePort: clusterInfo.ldBePort,
        salesBePort: clusterInfo.salesBePort,
      });
      const key = `db_${subdomain}`;
      redis.set(key, newData);
      return resolve({
        success: true,
        target: { ip: clusterInfo.ip, posBePort: clusterInfo.posBePort },
      });
    });
  });
}
const getServerBySuffix = async ({ suffix }) => {
  const dbKey = `sale_${suffix}`
  const dbData = await redis.get(dbKey);
  if (dbData) {
    return {
      success: true,
      target: JSON.parse(dbData),
    };
  }

  try {
    const { getModel, redis } = global;
    const ShopHasSubdomainModel = getModel({ model: "ShopHasSubdomain" });
    const ShopModel = getModel({ model: 'Shop'});
    const Server = getModel({ model: 'Server'});
    const Service = getModel({ model: 'Service'});

    const data = await ShopHasSubdomainModel.findOne({
      where: {
        subdomain: suffix
      },
      include: [{
        model: ShopModel,
        as: 'shop',
        include: {
          model: Server,
          as: 'server'
        },
        
      },
      {
        model: Service,
        as: 'service'
      }
    ],
      raw: true
    })
    if (!data) {
      return {
        success: false,
        message: `${suffix} not found`
      }
    }
    const newData = {
      shop: {
        dbName: data['shop.subdomain'],
        destination: data['shop.server.destination'],
        port: data['shop.server.port'],
      },
      type: data.storeType,
      service: {
        code: data['service.code'],
        destination: data['service.destination'],
        port: data['service.port']
      }
    }
    redis.set(dbKey, JSON.stringify(newData));

    return { success: true, ...newData };
  } catch (err) {
    console.log("🚀 ~ file: redis.service.js:177 ~ getServerBySuffix ~ err:", err)
    return {
      success: false,
      message: `Get sale information failed`
    };
  }
}

module.exports = {
  getServerRedis,
  getServerBySubdomain,
  getServicesByCode,
  getServerBySuffix
};
