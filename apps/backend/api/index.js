const { getVercelHandler } = require('../dist/src/vercel-handler');

module.exports = async function handler(req, res) {
  const appHandler = await getVercelHandler();
  return appHandler(req, res);
};
