/** @type {import("lint-staged").Config} */

const config = {
  '*': ['yarn prettier:fix:no-glob', 'yarn eslint:fix:no-glob']
};

export default config;
