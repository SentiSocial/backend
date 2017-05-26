module.exports = {
    "extends": [
      "standard",
      "plugin:jasmine/recommended"
    ],
    "rules": {
      "arrow-parens": ["error", "as-needed"],
      "prefer-const": "error",
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
