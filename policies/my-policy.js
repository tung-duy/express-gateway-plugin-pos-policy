module.exports = {
  name: 'my-policy',
  schema: {
    $id: 'http://express-gateway.io/schemas/policies/my-policy.json',
    type: 'object'
  },
  policy: (actionParams) => {
    return (req, res, next) => {
      // TODO: Implement me
      console.log('hello world');
      next();
    };
  }
};
