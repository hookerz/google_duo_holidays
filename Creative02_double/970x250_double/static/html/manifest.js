FT.manifest({
  "filename": "index.html",
  "width":
  /*@exclude*/
    970
  /*@endexclude*/
  //@echo collapsedWidth
  ,
  "height":
  /*@exclude*/
    970
  /*@endexclude*/
  //@echo collapsedHeight
  ,
  "clickTagCount": 2,
  "hideBrowsers": ["ie10"],
  // @if isExpando=true
  "expand": {
    "width":
    /*@exclude*/
      970
    /*@endexclude*/
    //@echo expandedWidth
    ,
    "height":
    /*@exclude*/
      970
    /*@endexclude*/
    //@echo expandedHeight
    ,
    "indentAcross": 0,
    "indentDown": 0
  },
  // @endif
  "richLoads": [{
    "name": "rich",
    "src": "RICH-NAME"
  }],
  "trackingEvents": [
    {"name": "videoPlaying", "type": "standard"},
    {"name": "videoPaused", "type": "standard"},
    {"name": "videoEnded", "type": "standard"},
    {"name": "videoReplay", "type": "standard"},
    {"name": "videoMuted", "type": "standard"},
    {"name": "videoUnmuted", "type": "standard"},
    {"name": "videoPercent0", "type": "standard"},
    {"name": "videoPercent25", "type": "standard"},
    {"name": "videoPercent50", "type": "standard"},
    {"name": "videoPercent75", "type": "standard"},
    {"name": "videoPercent100", "type": "standard"},
    {"name": "pinAutoExpand", "type": "standard"}
  ]
});

