// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add additional file extensions that Metro should resolve
defaultConfig.resolver.sourceExts.push('cjs');

// Add any additional asset extensions
defaultConfig.resolver.assetExts.push('db', 'ttf', 'svg', 'otf');

module.exports = defaultConfig; 