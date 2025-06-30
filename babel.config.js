module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      'babel-plugin-inline-import',
      ['@babel/plugin-transform-runtime', {
        "helpers": true,
        "regenerator": true,
        "absoluteRuntime": false
      }],
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
        "blacklist": null,
        "whitelist": null,
        "safe": false,
        "allowUndefined": true
      }],
      ["module-resolver", {
        "root": ["./"],
        "extensions": [
          ".ios.ts",
          ".android.ts",
          ".ts",
          ".ios.tsx",
          ".android.tsx",
          ".tsx",
          ".jsx",
          ".js",
          ".json"
        ],
        "alias": {
          "@app": "./app",
          "@components": "./components",
          "@screens": "./screens",
          "@services": "./services",
          "@utils": "./utils",
          "@contexts": "./contexts",
          "@navigation": "./navigation",
          "@types": "./types",
          "@constants": "./constants",
          "@babel/runtime": "./node_modules/@babel/runtime"
        }
      }]
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel']
      }
    }
  };
}; 