export default {
  files: ['test/**/*.spec.js'],
  require: ['./test/mainHelper.js'],
  // extensions: {
  //   "ts": "module"
  // },
  typescript: {
    rewritePaths: {
      '../../lib/': '../../distr/',
    },
    compile: false,
    // extensions: [
    //   'ts'
    // ]
  }
};
