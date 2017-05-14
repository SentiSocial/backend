module.exports = {
    "extends": [
      "standard",
      "plugin:jasmine/recommended"
    ],
    "rules": {
      "arrow-parens": ["error", "as-needed"]
    },
    "plugins": [
        "standard",
        "promise",
        "jasmine"
    ],
    "env": {
      jasmine: true
    }
};
