// Varsayılan ayarlar
let currentLang = localStorage.getItem('aurion-lang') || 'en';
let isDarkMode = localStorage.getItem('aurion-theme') === 'dark';

// Sayfa yüklendiğinde
window.onload = function () {
  loadLanguage(currentLang);
  setupSettingsMenu();
  applyTheme(isDarkMode);
};

// Dil dosyasını yükle
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
        a.textContent = p.name;
        a.target = "_blank";
        projectsDiv.appendChild(a);
      });

      document.getElementById('author').textContent = data.author;
      document.getElementById('year').textContent = new Date().getFullYear();
    });
}

// Ayarlar menüsünü doldur
function setupSettingsMenu() {
  const select = document.getElementById('lang-select');
  select.innerHTML = '';
  ['en', 'az', 'ru'].forEach(code => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = code.toUpperCase();
    if (code === currentLang) opt.selected = true;
    select.appendChild(opt);
  });

  document.getElementById('theme-toggle').checked = isDarkMode;
}

// Dil seçimi kaydet ve yeniden yükle
function saveLangAndReload() {
  currentLang = document.getElementById('lang-select').value;
  localStorage.setItem('aurion-lang', currentLang);
  location.reload();
}

// Tema kaydet
function saveTheme() {
  isDarkMode = document.getElementById('theme-toggle').checked;
  localStorage.setItem('aurion-theme', isDarkMode ? 'dark' : 'light');
  applyTheme(isDarkMode);
}

// Temayı uygula
function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  document.body.classList.toggle('light', !dark);
}

// Ayarlar menüsü aç/kapa
function toggleSettings() {
  document.getElementById('settings-panel').classList.toggle('hidden');
}
function closeSettings() {
  document.getElementById('settings-panel').classList.add('hidden');
}
