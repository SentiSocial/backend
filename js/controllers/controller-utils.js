/**
 * Contains utility functions used by controllers.
 */
const controllerUtils = {
  isNumeric: function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}

module.exports = controllerUtils
