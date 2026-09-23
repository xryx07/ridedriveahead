const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable package exports to allow internal react-native and react imports
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
