document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navLinks = document.querySelector('.nav-links');

  // Check for saved theme preference on page load
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    document.body.classList.toggle('dark-mode', currentTheme === 'dark');
    // Optional: Update toggle button state (e.g., if it's a checkbox)
    // if (darkModeToggle.type === 'checkbox') {
    //   darkModeToggle.checked = currentTheme === 'dark';
    // }
  }

  // Dark mode toggle functionality
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');

      let theme = 'light';
      if (document.body.classList.contains('dark-mode')) {
        theme = 'dark';
      }
      localStorage.setItem('theme', theme);

      // Optional: Update toggle button state
      // if (darkModeToggle.type === 'checkbox') {
      //   darkModeToggle.checked = theme === 'dark';
      // }
    });
  }

  // Hamburger menu functionality
  if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener('click', () => {
      hamburgerMenu.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking on nav links
    const navLinksItems = navLinks.querySelectorAll('a');
    navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburgerMenu.contains(e.target) && !navLinks.contains(e.target)) {
        hamburgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }
});
