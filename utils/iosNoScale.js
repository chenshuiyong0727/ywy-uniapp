
// #ifdef H5
!(function() {
  // ios10+ 禁止用户放大缩小页面（meta失效）
  document.addEventListener("touchstart", function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  });
  let lastTouchEnd = 0;
  document.addEventListener("touchend", function (event) {
      let now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  document.addEventListener("gesturestart", function (event) {
    event.preventDefault();
  });
})()
!(function() {
  if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
    handleFontSize();
  } else {
    if (document.addEventListener) {
      document.addEventListener("WeixinJSBridgeReady", handleFontSize, false)
    } else if (document.attachEvent) {
      document.attachEvent("WeixinJSBridgeReady", handleFontSize)
      document.attachEvent("onWeixinJSBridgeReady", handleFontSize)
    }
  }
  function handleFontSize() {
    // 设置网页字体为默认大小
    WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 })
    // 重写设置网页字体大小的事件
    WeixinJSBridge.on('menu:setfont', function() {
      WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 0 })
    })
  }
})()
!(function() {
  // 处理uniapp路由bug，load，popstate，reload短时间内依次触发时，忽略这次reload
  var reloadHackRecord = {};  
  window.addEventListener('load', function(e) {  
    reloadHackRecord.load = new Date().getTime();  
  });  
  var onPopState = function() {  
    reloadHackRecord.popstate = new Date().getTime();  
    window.removeEventListener('popstate', onPopState);  
  }  
  window.addEventListener('popstate', onPopState);  
  var oldReload = window.location.reload;  
  window.location.reload = function() {  
    var load = reloadHackRecord.load;  
    var popstate = reloadHackRecord.popstate;  
    var reload = new Date().getTime();  
    var margin = 100;
    if (load && popstate && reload && reload > popstate && popstate > load && reload - popstate < margin && popstate - load < margin) {  
      window.location.reload = oldReload;  
      return;  
    }  
  }
})()
// #endif


