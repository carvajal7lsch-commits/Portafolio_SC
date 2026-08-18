document.addEventListener('DOMContentLoaded', () => {

  // 0. Language Switcher Logic
  let currentLang = localStorage.getItem('portfolio-lang') || 'es';

  function setLanguage(lang) {
      currentLang = lang;
      localStorage.setItem('portfolio-lang', lang);
      
      // Update elements with data-i18n
      document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          if (translations[lang] && translations[lang][key]) {
              if (el.tagName === 'TITLE') {
                  document.title = translations[lang][key];
              } else {
                  el.innerHTML = translations[lang][key];
              }
          }
      });

      // Update active class on buttons
      document.querySelectorAll('.lang-switcher .lang-btn').forEach(btn => {
          if (btn.getAttribute('data-lang') === lang) {
              btn.classList.add('active');
          } else {
              btn.classList.remove('active');
          }
      });
      
      // Update html lang attribute
      document.documentElement.lang = lang;
  }

  // Bind event listeners to language switcher buttons
  document.querySelectorAll('.lang-switcher .lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
          const lang = btn.getAttribute('data-lang');
          setLanguage(lang);
      });
  });

  // Initialize default language
  setLanguage(currentLang);

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
