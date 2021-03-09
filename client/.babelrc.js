module.exports = {
  "presets": [
    "@babel/preset-env",
    "@babel/preset-typescript",
    ["env", {
      "modules": false
    }]
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties"
  ]
}
