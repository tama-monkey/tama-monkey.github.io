document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');

  // Check for saved theme preference on page load
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    document.body.classList.toggle('dark-mode', currentTheme === 'dark');
    // Optional: Update toggle button state (e.g., if it's a checkbox)
    // if (darkModeToggle.type === 'checkbox') {
    //   darkModeToggle.checked = currentTheme === 'dark';
    // }
  }

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
});
