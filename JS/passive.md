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


【上面的方法好像有点问题，改为下面的代码：】

// 修改你的 onMounted 钩子
onMounted(() => {
  // 保存原生的 addEventListener
  const originalAddEventListener = EventTarget.prototype.addEventListener
  
  // 覆盖原生方法
  EventTarget.prototype.addEventListener = function (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    // 为滚轮相关事件强制添加 passive
    const passiveEvents = ['wheel', 'mousewheel', 'touchstart', 'touchmove']
    if (passiveEvents.includes(type)) {
      const opts = typeof options === 'object' ? 
        { ...options, passive: true } : 
        { passive: true }
      return originalAddEventListener.call(this, type, listener, opts)
    }
    return originalAddEventListener.call(this, type, listener, options)
  }

  initCharts()

  // 恢复原生方法
  EventTarget.prototype.addEventListener = originalAddEventListener
})

// 修改 resize 监听器
const handleResize = debounce(() => {
  myChart?.resize({ silent: true })  // 添加 silent 参数
  myPieChart?.resize({ silent: true })
}, 100)

// 初始化图表时添加 passive 配置
const initCharts = () => {
  try {
    chartDom = document.getElementById('main')
    chartPieDom = document.getElementById('pie')

    if (chartDom) {
      myChart = echarts.init(chartDom, null, {
        renderer: 'canvas',
        useCoarsePointer: true,    // 优化指针检测
        pointerSize: 8,            // 增大热区
        useDirtyRect: true         // 启用脏矩形优化
      })
      option && myChart.setOption(option)
    }

    if (chartPieDom) {
      myPieChart = echarts.init(chartPieDom, null, {
        renderer: 'canvas',
        useCoarsePointer: true,
        pointerSize: 8,
        useDirtyRect: true
      })
      pieOption && myPieChart.setOption(pieOption)
    }

    // 修改 resize 监听方式
    const resizeObserver = new ResizeObserver(handleResize)
    if (chartDom) resizeObserver.observe(chartDom)
    if (chartPieDom) resizeObserver.observe(chartPieDom)
  } catch (error) {
    console.error('Error initializing charts:', error)
  }
}

// 移除之前的 resize 监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})