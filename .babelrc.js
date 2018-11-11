module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      'module-resolver', {
        resolvePath(sourcePath) {
          if ((/^\//g).test(sourcePath)) {
            return `${process.cwd()}/src${sourcePath}`;
          }
          return sourcePath;
        }
      }
    ]
  ],
  presets: [
    '@babel/preset-env'
  ]
};
