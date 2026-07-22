document.addEventListener('DOMContentLoaded', () => {

  const printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const cvPage = document.querySelector('.cv-page');
  
  function adjustScale() {
    if (!cvPage) return;
    
    const width = window.innerWidth;
    
    // We only scale down if screen is smaller than A4 container width (approx 830px)
    if (width < 830) {
      const scale = (width - 24) / 794;
      cvPage.style.zoom = scale;
      cvPage.style.transform = '';
      cvPage.style.transformOrigin = '';
      cvPage.style.marginBottom = '';
    } else {
      cvPage.style.zoom = '';
      cvPage.style.transform = '';
      cvPage.style.transformOrigin = '';
      cvPage.style.marginBottom = '';
    }
  }

  // Run on load and resize
  window.addEventListener('resize', adjustScale);
  // Small delay to ensure clientWidth/offsetHeight are fully rendered
  setTimeout(adjustScale, 100);
});
