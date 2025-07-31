module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@services': './src/services',
            '@navigation': './src/navigation',
            '@contexts': './src/contexts',
            '@assets': './assets'
          }
        }
      ],
      'react-native-reanimated/plugin' // ⚠️ must always be last
    ]
  };
};
