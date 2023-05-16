/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = () => {
  const env = {
    sassOptions: {
      includePaths: [path.join(__dirname, "styles")]
    },
    API_PROTOCOL: process.env.API_PROTOCOL,
    API_HOST: process.env.API_HOST,
    ENVIRONMENT: process.env.ENVIRONMENT || "local"
  };

  return {
    env,
    distDir: "build",
    swcMinify: false
    /* config options for all phases except development here */
  };
};
