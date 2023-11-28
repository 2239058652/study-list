

import { ref, onMounted, onUnmounted } from 'vue';

export function useWindowResize() {
    const width = ref(window.innerWidth);
    const height = ref(window.innerHeight);
    const handleResize = () => {
        width.value = window.innerWidth;
        height.value = window.innerHeight;
    }

    onMounted(() => {
        window.addEventListener('resize', handleResize)
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
    })

    return {
        width,
        height
    }
}

// 使用
setup() {
    const { width, height } = useWindowResize();
}



<!-- 在第一个自定义hook中，我们构建了useWindowRezie，它可以帮助我们查看窗口的当前宽度和高度。 

我认为这对于那些想要构建适用于多种屏幕尺寸的东西的人很有帮助。 

在我处理过的案例中，我们经常使用宽度来检测当前用户设备。 它可以帮助我们在他们的设备上安装一些东西。 

在此hook中，我将使用 useWindowResize 构建相同的内容，但它返回设备名称而不是宽度和高度值。 

这是这个hook的代码。 -->

import { ref, onMounted, onUnmounted } from 'vue';

export const MOBILE = 'MOBILE'
export const TABLET = 'TABLET'
export const DESKTOP = 'DESKTOP'

export const useViewport = (config = {}) => {
  const { mobile = null, tablet = null } = config;
  let mobileWidth = mobile ? mobile : 768;
  let tabletWidth = tablet ? tablet : 922;
  let device = ref(getDevice(window.innerWidth));
  function getDevice(width) {
    if (width < mobileWidth) {
      return MOBILE;
    } else if (width < tabletWidth) {
      return TABLET;
    }
    return DESKTOP;
  }

  const handleResize = () => {
    device.value = getDevice(window.innerWidth);
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return {
    device
  }
}


const { device } = useViewport({ mobile: 700, table: 900 });