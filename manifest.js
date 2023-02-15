const express = require('express');
const logger = require('morgan');

module.exports = {
  version: '1.2.0',
  init: function (pluginContext) {
    pluginContext.registerCondition(require('./conditions/url-match'));
    pluginContext.registerPolicy(require('./policies/my-policy'));
    pluginContext.registerGatewayRoute((app) => {
      const middlewares = [
        express.json(),
        express.urlencoded({ extended: true })
      ];
      app.use(logger('dev'));
      // app.use([health]);
      app.use('/api-gateway', middlewares, require('./routes'));
      app.use(function (output, req, res, next) {
        const { result, tracing } = req;

        const { success, error, code } = output;

        const statusCode =
          success || result
            ? HttpStatus.OK
            : output.code
            ? output.code
            : output.status
            ? output.status
            : output.response
            ? output.response.status
            : 400;

        if (success || result) {
          return res.json({ ...output, result: result });
        }

        const message = output.response
          ? output.response.data.message
          : output.message;
        const errors =
          output instanceof Error
            ? output.message
            : output.error
            ? output.error
            : output.response
            ? output.response.data.errors
            : output.errors
            ? output.errors
            : output.stack;

        if (tracing) {
          const { span } = tracing;

          if (statusCode >= 400) {
            // span.setTag(Tags.ERROR, true);
            span.log({ outputs: { errors, message, stack: output.stack } });
          }
          // span.setTag(Tags.HTTP_STATUS_CODE, statusCode);
          span.finish();
        }

        return res.status(statusCode).json({
          success: false,
          message,
          errors
        });
      });
    });
    pluginContext.registerAdminRoute(require('./routes/hello-admin'));

    pluginContext.eventBus.on('hot-reload', function ({ type, newConfig }) {
      console.log('hot-reload', type, newConfig);
    });
    pluginContext.eventBus.on('http-ready', function ({ httpServer }) {
      console.log('http ready');
    });
    pluginContext.eventBus.on('https-ready', function ({ httpsServer }) {
      console.log('https ready');
    });
    pluginContext.eventBus.on('admin-ready', function ({ adminServer }) {
      console.log('admin ready');
    });
  },
  policies: ['my-policy'], // this is for CLI to automatically add to "policies" whitelist in gateway.config
  options: {
    // This is for CLI to ask about params 'eg plugin configure example'
    baseUrl: {
      title: 'Base Url',
      description: 'the base url to initialize',
      type: 'string',
      required: true
    },
    maxRequestsPerSecond: {
      title: 'Max Requests per second',
      description: 'the max rps value',
      type: 'number'
    }
  }
};
