let currentLang = localStorage.getItem('aurion-lang') || 'en';
let isDarkMode = localStorage.getItem('aurion-theme') === 'dark';

window.onload = function () {
  // Otomatik tema algılama (ilk kez)
  if (!localStorage.getItem('aurion-theme')) {
    isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.setItem('aurion-theme', isDarkMode ? 'dark' : 'light');
  } else {
    isDarkMode = localStorage.getItem('aurion-theme') === 'dark';
  }

  applyTheme(isDarkMode);
  loadLanguage(currentLang);
  setupSettingsMenu();
};

function loadLanguage(lang) {
  fetch(`config/lang-${lang}.json`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('title').textContent = data.title;
      document.getElementById('description').textContent = data.description + " " + data.subtext;

      const projectsDiv = document.getElementById('projects');
      projectsDiv.innerHTML = '';
      data.projects.forEach(p => {
        const a = document.createElement('a');
        a.href = p.url;
        a.textContent = p.name.toUpperCase();
        a.target = "_blank";
        projectsDiv.appendChild(a);
      });

      document.getElementById('author').textContent = data.author;
      document.getElementById('year').textContent = new Date().getFullYear();

      // Dil menüsü güncelle
      const select = document.getElementById('lang-select');
      select.value = lang;
    })
    .catch(() => alert("Dil dosyası yüklenemedi."));
}

function setupSettingsMenu() {
  const select = document.getElementById('lang-select');
  select.innerHTML = '';
  const langs = { 'en': 'English', 'az': 'Azərbaycanca', 'ru': 'Русский' };
  Object.keys(langs).forEach(code => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = langs[code];
    if (code === currentLang) opt.selected = true;
    select.appendChild(opt);
  });

  document.getElementById('theme-toggle').checked = isDarkMode;
}

function saveLangAndReload() {
  currentLang = document.getElementById('lang-select').value;
  localStorage.setItem('aurion-lang', currentLang);
  location.reload();
}

function saveTheme() {
  isDarkMode = document.getElementById('theme-toggle').checked;
  localStorage.setItem('aurion-theme', isDarkMode ? 'dark' : 'light');
  applyTheme(isDarkMode);
}

function applyTheme(dark) {
  document.body.classList.toggle('light', !dark);
  document.body.style.transition = 'none';
  if (dark) {
    document.body.style.background = '#000';
    document.body.style.color = '#0f0';
  } else {
    document.body.style.background = '#f0f0f0';
    document.body.style.color = '#000';
  }
  setTimeout(() => document.body.style.transition = 'all 0.4s'), 50;
}

function toggleSettings() {
  const panel = document.getElementById('settings-panel');
  panel.classList.toggle('hidden');
  panel.classList.toggle('visible');
}

function closeSettings() {
  document.getElementById('settings-panel').classList.remove('visible');
  document.getElementById('settings-panel').classList.add('hidden');
  saveTheme();
}
