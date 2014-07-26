define(function() {
  var Config;
  if (window.Debug) {
    Config = {
      Parse: {
        AppId: "e63IuI48OfY570rwmCXqZdQiKv8u1nUXI5IY71WZ",
        JavaScriptKey: "AnfBQh3fn4GGQS5t7RkqrmcgOOauVbEvtzFgz0kT"
      },
      Facebook: {
        AppId: "263236870540805",
        ChannelUrl: 'http://metadebug.parseapp.com'
      },
      HeartbeatInterval: 30000
    };
  } else {
    Config = {
      Parse: {
        AppId: "dRPW23Cv2H5i4CNWwKnHKhQeVUYSaUL17NyyqMHW",
        JavaScriptKey: "m4FEYKBzAVFnt2JDO8EElO98QTDJ1yvViqhy9O2G"
      },
      Facebook: {
        AppId: "262405373957288",
        ChannelUrl: 'http://meta.parseapp.com'
      },
      HeartbeatInterval: 60000
    };
  }
  
  return Object.freeze(Config);
});