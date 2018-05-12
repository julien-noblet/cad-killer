/** @format */

module.exports = {
  //parser: "sugarss",
  plugins: {
    "postcss-import": {},
    "postcss-cssnext": {},
    autoprefixer: {
      add: true,
      browsers: ["last 2 versions", "android 4", "opera 12"]
    },
    cssnano: {}
  }
};
