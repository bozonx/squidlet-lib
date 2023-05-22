export default {
  files: ['test/**/*.spec.js'],
  require: ['./test/mainHelper.js'],
  typescript: {
    rewritePaths: {
      'lib/': 'distr/',
    },
    compile: false,
  }
}
