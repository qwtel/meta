function Enum(values, methods) {
  values = values || {};
  methods = methods || {};

  Object.keys(values).map(function (k) {
    this[k] = values[k];
  }, this);

  Object.keys(methods).map(function (name) {
    Object.defineProperty(this, name, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: methods[name]
    });
  }, this);

  Object.freeze(this);
}

Enum.prototype.keys = function () {
  return Object.keys(this)
};

Enum.prototype.values = function () {
  return Object.keys(this).map(function (k) {
    return this[k];
  }, this);
};

module.exports = Enum;
