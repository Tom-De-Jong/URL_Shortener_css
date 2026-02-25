document.addEventListener('DOMContentLoaded', function() {
  const root = document.documentElement;
  let rafPending = false;
  let lastX = 0;
  let lastY = 0;

  document.addEventListener('mousemove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        root.style.setProperty('--mouse-x', lastX + 'px');
        root.style.setProperty('--mouse-y', lastY + 'px');
        rafPending = false;
      });
    }
  });
});
