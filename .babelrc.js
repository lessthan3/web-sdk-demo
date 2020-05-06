const BABEL_PRESET_ENV_CONFIG = {
  corejs: 3,
  modules: false,
  targets: {
    browsers: [
      'last 2 years',
      'ie 11',
    ],
  },
  useBuiltIns: 'entry',
};

const BABEL_PLUGINS = [
  [
    '@babel/plugin-transform-runtime',
    {
      corejs: false,
      helpers: true,
      regenerator: true,
      useESModules: true,
    },
  ],
  'react-hot-loader/babel',
].filter(plugin => plugin);

module.exports = {
  plugins: BABEL_PLUGINS,
  presets: [
    '@babel/preset-react',
    ['@babel/preset-env', BABEL_PRESET_ENV_CONFIG],
  ],
};
