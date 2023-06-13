import "dotenv/config";

const myValue = "mobile-2";

// module.exports = {
//   name: myValue,
//   version: "1.0.0",
//   // All values in extra will be passed to your app.
//   extra: {},
// };

module.exports = ({ config }) => {
  const env = {
    deployAPI: process.env.REACT_APP_API_KEY,
    devAPI: process.env.REACT_APP_API_KEY_LOCAL,
  };

  Object.assign(config.extra, env);

  return {
    ...config,
  };
};
