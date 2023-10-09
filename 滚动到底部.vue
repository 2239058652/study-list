import { onMounted, onUnmounted } from 'vue';

export const useScrollToBottom = (callback = () => { }) => {
  const handleScrolling = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      callback();
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScrolling);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScrolling);
  });
}

useScrollToBottom(() => { console.log('Scrolled to bottom') })