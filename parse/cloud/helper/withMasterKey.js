function withMasterKey(f) {
  Parse.Cloud.useMasterKey();
  return f();
  // TODO: Un-use master key
}

module.exports = withMasterKey;
