const webpack = require("webpack");

const keys = ["COMMIT_TIME"];

function getClientEnvironment() {
  const envVars = {};
  for (const key in keys) {
    envVars[key] = process.env[key];
  }

  return {
    "process.env": JSON.stringify(envVars),
  };
}

module.exports = (config, options, context) => {
  // Overwrite the mode set by Angular if the NODE_ENV is set
  config.mode = process.env.NODE_ENV || config.mode;
  config.plugins.push(new webpack.DefinePlugin(getClientEnvironment()));
  return config;
};
