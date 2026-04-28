let currentLang = localStorage.getItem('aurion-lang') || 'en';
let isDarkMode = localStorage.getItem('aurion-theme') === 'dark';

window.onload = function () {
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
    .then(res => {
      if (!res.ok) throw new Error('Dil dosyası bulunamadı');
      return res.json();
    })
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

      // Dil menüsünü güncelle
      const select = document.getElementById('lang-select');
      if (select) select.value = lang;
    })
    .catch(err => {
      console.error(err);
      document.getElementById('description').textContent = "Content loading failed.";
    });
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

// ✅ EKLENDİ: Fonksiyon şimdi var
function saveLangAndReload() {
  const langSelect = document.getElementById('lang-select');
  currentLang = langSelect.value;
  localStorage.setItem('aurion-lang', currentLang);
  location.reload(); // Yeniden yükle
}

function saveTheme() {
  isDarkMode = document.getElementById('theme-toggle').checked;
  localStorage.setItem('aurion-theme', isDarkMode ? 'dark' : 'light');
  applyTheme(isDarkMode); // ✅ Şimdi anında uyguluyor
}

function applyTheme(dark) {
  document.body.classList.remove('light');
  document.body.classList.remove('dark');
  if (dark) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.add('light');
  }
}

function toggleSettings() {
  const panel = document.getElementById('settings-panel');
  panel.classList.toggle('hidden');
  // Panel açıkken tema anında uygulansın
  if (!panel.classList.contains('hidden')) {
    saveTheme(); // Tema güncellemesi
  }
}

function closeSettings() {
  document.getElementById('settings-panel').classList.add('hidden');
}
