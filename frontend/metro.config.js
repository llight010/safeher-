const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = config.resolver;

config.resolver.assetExts = [...assetExts, 'json'];
config.resolver.sourceExts = [...sourceExts, 'js', 'jsx', 'ts', 'tsx'];

module.exports = config;
