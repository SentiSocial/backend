module.exports = {
    "extends": [
      "standard",
      "plugin:jasmine/recommended"
    ],
    "rules": {
      "arrow-parens": ["error", "as-needed"],
      "prefer-arrow-callback": "error"
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
