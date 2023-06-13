import Constants from "expo-constants";

const deployApi = Constants.expoConfig.extra.deployAPI;
const devApi = Constants.expoConfig.extra.devAPI;

console.log(deployApi);
console.log(devApi);

export { deployApi, devApi };
