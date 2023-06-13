// every time this file change, You may need to clear the bundler cache with the --clear flag for your changes to take effect.
// npx expo start --clear
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
