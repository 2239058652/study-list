default-passive-events  库会解决浏览器控制台监听事件的警告信息，使用方法为main中引入即可

这个库可能会和antdesign等UI库有冲突，建议使用IIFE自执行函数解决控制台警告，

// 在文件顶部添加

;(function(){

  constoriginalAddEventListener= EventTarget.prototype.addEventListener

  EventTarget.prototype.addEventListener=function(type, listener, options){

    if(type==='wheel'&&typeofoptions!=='object'){

    options={passive:true}

    }elseif(type==='wheel'&&options&&typeofoptions==='object'){

    options.passive=true

    }

    originalAddEventListener.call(this,type,listener,{passive:true})

  }

})()

但是这样修改了全局，下面以vue为例子，要在页面卸载时恢复全局的初始状态


// 更安全的实现方式
let originalAddEventListener: typeof EventTarget.prototype.addEventListener | null = null;

onMounted(() => {
  originalAddEventListener = EventTarget.prototype.addEventListener;

  EventTarget.prototype.addEventListener = function(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    if (type === 'wheel') {
      const opts = typeof options === 'object' ?
        { ...options, passive: true } :
        { passive: true };
      return originalAddEventListener!.call(this, type, listener, opts);
    }
    return originalAddEventListener!.call(this, type, listener, options);
  };
});

onUnmounted(() => {
  if (originalAddEventListener) {
    EventTarget.prototype.addEventListener = originalAddEventListener;
  }
});
