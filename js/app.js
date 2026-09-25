import { kpiData } from './kpiData.js';
import { appsData } from './appsData.js';
import { documentsData } from './documentsData.js';
import { atmosphereData } from './atmosphereData.js';
import { promptsData } from './promptsData.js';
import { mediaData } from './mediaData.js';
import { peopleData } from './peopleData.js';

// Application State
let currentTab = 'overview';
let appSearchQuery = '';
let appCategoryFilter = 'all';
let docSearchQuery = '';
let docCategoryFilter = 'all';
let promptCategoryFilter = 'all';
let currentLightboxIndex = 0;
let currentLightboxType = 'atmosphere'; // 'atmosphere' or 'prompts'

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  renderHeroBLUF();
  renderLiveApps();
  renderDocuments();
  renderAtmosphere();
  renderPrompts();
  renderMediaCenter();
  renderPeopleDirectory();
  setupSearchAndFilters();
  setupLightbox();
  setupLivePreviewModal();
  setupPrintButton();
});

// Navigation Controller
function setupNavigation() {
  const tabButtons = document.querySelectorAll('.nav-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Check URL hash if any
  const hash = window.location.hash.replace('#', '');
  if (hash && ['overview', 'apps', 'docs', 'prompts', 'atmosphere', 'media', 'people', 'report'].includes(hash)) {
    switchTab(hash);
  }
}

function switchTab(tabId) {
  currentTab = tabId;
  window.location.hash = tabId;

  // Update Buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('tab-active', 'text-blue-900', 'border-blue-900');
      btn.classList.remove('text-slate-600', 'border-transparent');
    } else {
      btn.classList.remove('tab-active', 'text-blue-900', 'border-blue-900');
      btn.classList.add('text-slate-600', 'border-transparent');
    }
  });

  // Update Sections
  const sections = ['overview', 'apps', 'docs', 'prompts', 'atmosphere', 'media', 'people', 'report'];
  sections.forEach(sec => {
    const el = document.getElementById('section-' + sec);
    if (el) {
      if (sec === tabId) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 1. Render Hero & BLUF Metrics
function renderHeroBLUF() {
  const container = document.getElementById('kpi-metrics-container');
  if (!container) return;

  container.innerHTML = kpiData.topMetrics.map(metric => `
    <div class="executive-card rounded-xl p-5 border border-slate-200 bg-white relative overflow-hidden group">
      <div class="absolute top-0 right-0 h-1.5 w-full bg-slate-100 group-hover:bg-blue-800 transition-colors"></div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${
          metric.badge.includes('100%') ? 'badge-success' : 'badge-navy'
        }">${metric.badge}</span>
      </div>
      <div class="text-3xl font-bold tracking-tight text-slate-900 mb-1">${metric.value}</div>
      <div class="text-sm font-semibold text-slate-800 mb-1.5">${metric.label}</div>
      <div class="text-xs text-slate-500 leading-relaxed">${metric.desc}</div>
    </div>
  `).join('');
}

// 2. Render Live Apps (GitHub Repository Hub Style)
function renderLiveApps() {
  const container = document.getElementById('apps-grid-container');
  const countBadge = document.getElementById('apps-count-badge');
  if (!container) return;

  let filtered = appsData.filter(app => {
    const matchSearch = app.title.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
                        app.developer.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
                        app.description.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
                        app.tags.some(t => t.toLowerCase().includes(appSearchQuery.toLowerCase()));
    const matchCategory = appCategoryFilter === 'all' || app.deptCategory === appCategoryFilter;
    return matchSearch && matchCategory;
  });

  if (countBadge) countBadge.innerText = `${filtered.length} Applications`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-16 bg-white rounded-xl border border-slate-200">
        <svg class="mx-auto h-12 w-12 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-slate-600 font-medium">ไม่พบแอปพลิเคชันที่ตรงกับคำค้นหาหรือตัวกรอง</p>
        <button id="reset-app-filters" class="mt-3 text-sm text-blue-700 font-semibold hover:underline">รีเซ็ตการค้นหา</button>
      </div>
    `;
    const resetBtn = document.getElementById('reset-app-filters');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      appSearchQuery = '';
      appCategoryFilter = 'all';
      document.getElementById('app-search-input').value = '';
      renderLiveApps();
    });
    return;
  }

  container.innerHTML = filtered.map(app => `
    <div class="executive-card rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between relative group">
      <div>
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-slate-500 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8V1.5z"/>
            </svg>
            <h3 class="font-bold text-slate-900 text-base group-hover:text-blue-900 transition-colors line-clamp-1" title="${app.title}">
              ${app.title}
            </h3>
          </div>
          <span class="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
            app.isLead ? 'badge-gold' : 'badge-navy'
          }">
            ${app.isLead ? '★ Core Platform' : 'Verified'}
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 mb-3">
          <span class="font-medium text-slate-800 flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            ${app.developer}
          </span>
          <span class="text-slate-300">•</span>
          <span class="text-slate-500">${app.department}</span>
        </div>

        <p class="text-xs text-slate-600 mb-4 line-clamp-3 leading-relaxed">
          ${app.description}
        </p>

        <div class="flex flex-wrap gap-1.5 mb-5">
          ${app.tags.map(t => `<span class="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-mono">${t}</span>`).join('')}
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div class="flex items-center text-xs text-slate-500 gap-1.5">
          <svg class="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>${app.stars} stars</span>
        </div>
        <div class="flex items-center gap-2">
          ${app.isLocalZip ? `
            <a href="${app.url}" download class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium rounded-lg transition-colors shadow-sm">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              ดาวน์โหลด ZIP
            </a>
          ` : `
            <button onclick="window.openAppPreview('${app.url}', '${escapeHtml(app.title)}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              พรีวิว
            </button>
            <a href="${app.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-medium rounded-lg transition-colors shadow-sm">
              <span>เปิดใช้งานจริง</span>
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          `}
        </div>
      </div>
    </div>
  `).join('');
}

// 3. Render Documents Hub (58 Strategic Files)
function renderDocuments() {
  const container = document.getElementById('docs-table-container');
  const countBadge = document.getElementById('docs-count-badge');
  if (!container) return;

  let filtered = documentsData.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
                        doc.category.toLowerCase().includes(docSearchQuery.toLowerCase());
    const matchCategory = docCategoryFilter === 'all' || doc.categoryId === docCategoryFilter;
    return matchSearch && matchCategory;
  });

  if (countBadge) countBadge.innerText = `${filtered.length} เอกสารวิชาการ`;

  container.innerHTML = filtered.map(doc => `
    <div class="executive-card p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-4 group">
      <div class="flex items-center gap-3.5 min-w-0">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs ${
          doc.extension === 'PDF' ? 'bg-red-50 text-red-700 border border-red-200' :
          doc.extension === 'DOCX' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
          doc.extension === 'ZIP' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
          'bg-slate-100 text-slate-700 border border-slate-200'
        }">
          ${doc.extension}
        </div>
        <div class="min-w-0">
          <h4 class="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-900 transition-colors" title="${doc.title}">
            ${doc.title}
          </h4>
          <div class="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span class="text-slate-600 font-medium">${doc.category}</span>
            <span>•</span>
            <span>${doc.size}</span>
            <span>•</span>
            <span class="px-1.5 py-0.2 rounded text-[10px] font-medium ${
              doc.badge.includes('ค.ศ.4') ? 'badge-gold' : 'badge-navy'
            }">${doc.badge}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <a href="${doc.path}" target="_blank" class="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          เปิดอ่าน
        </a>
        <a href="${doc.path}" download class="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors" title="ดาวน์โหลดไฟล์">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
      </div>
    </div>
  `).join('');
}

// 4. Render Atmosphere Photos (Real Room Workshop Only)
function renderAtmosphere() {
  const container = document.getElementById('atmosphere-grid-container');
  if (!container) return;

  container.innerHTML = atmosphereData.map((item, index) => `
    <div class="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 cursor-pointer shadow-sm executive-card" onclick="window.openLightbox('atmosphere', ${index})">
      <div class="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img src="${item.path}" alt="${item.title}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
      </div>
      <div class="p-3.5 bg-white border-t border-slate-100">
        <div class="text-xs font-semibold text-slate-900 line-clamp-1 mb-1">${item.title}</div>
        <div class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">${item.caption}</div>
      </div>
    </div>
  `).join('');
}

// 5. Render Prompts & Architecture Slides
function renderPrompts() {
  const container = document.getElementById('prompts-grid-container');
  if (!container) return;

  let filtered = promptsData.filter(item => {
    return promptCategoryFilter === 'all' || item.category === promptCategoryFilter;
  });

  container.innerHTML = filtered.map((item, index) => `
    <div class="executive-card rounded-xl overflow-hidden border border-slate-200 bg-white group cursor-pointer" onclick="window.openLightbox('prompts', ${index})">
      <div class="aspect-[16/9] w-full overflow-hidden bg-slate-50 border-b border-slate-100 relative">
        <img src="${item.path}" alt="${item.title}" loading="lazy" class="w-full h-full object-contain p-2 group-hover:scale-102 transition-transform">
        <span class="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-sm">
          ${item.category}
        </span>
      </div>
      <div class="p-3.5">
        <div class="text-xs font-bold text-slate-900 line-clamp-1 mb-1">${item.title}</div>
        <div class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">${item.description}</div>
      </div>
    </div>
  `).join('');
}

// 6. Render Media & Podcast Center
function renderMediaCenter() {
  const podcast = mediaData.find(m => m.type === 'audio');
  const video = mediaData.find(m => m.type === 'video');

  const podcastEl = document.getElementById('podcast-player-container');
  const videoEl = document.getElementById('video-player-container');

  if (podcastEl && podcast) {
    podcastEl.innerHTML = `
      <div class="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div class="flex items-center justify-between mb-4">
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Executive AI Podcast Episode
          </span>
          <span class="text-xs text-slate-400">${podcast.duration} • ${podcast.size}</span>
        </div>
        <h3 class="text-xl font-bold mb-2">${podcast.title}</h3>
        <p class="text-xs text-slate-300 mb-6 leading-relaxed">${podcast.description}</p>
        
        <div class="bg-slate-800/80 backdrop-blur rounded-xl p-3 border border-slate-700 mb-6">
          <audio controls class="w-full">
            <source src="${podcast.path}" type="audio/mp4">
            เบราว์เซอร์ของคุณไม่รองรับการเล่นเสียง HTML5
          </audio>
        </div>

        <div class="border-t border-slate-800 pt-4">
          <h4 class="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2.5">ประเด็นสำคัญในพอดแคสต์ (Key Insights):</h4>
          <ul class="space-y-1.5 text-xs text-slate-300">
            ${podcast.keyTakeaways.map(t => `<li class="flex items-start gap-2"><span class="text-amber-400 font-bold">•</span><span>${t}</span></li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  if (videoEl && video) {
    videoEl.innerHTML = `
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm executive-card">
        <div class="flex items-center justify-between mb-3">
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold badge-navy">
            Video Evidence Demonstration
          </span>
          <span class="text-xs text-slate-500">${video.duration} • ${video.size}</span>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">${video.title}</h3>
        <p class="text-xs text-slate-600 mb-4 leading-relaxed">${video.description}</p>
        
        <div class="rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner mb-4">
          <video controls class="w-full aspect-video object-contain bg-black">
            <source src="${video.path}" type="video/mp4">
            เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ HTML5
          </video>
        </div>

        <div class="border-t border-slate-100 pt-3">
          <ul class="space-y-1 text-xs text-slate-600">
            ${video.keyTakeaways.map(t => `<li class="flex items-center gap-2"><svg class="w-3.5 h-3.5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg><span>${t}</span></li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }
}

// 7. Render People Directory
function renderPeopleDirectory() {
  const container = document.getElementById('people-grid-container');
  if (!container) return;

  container.innerHTML = peopleData.map(person => `
    <div class="executive-card p-5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
      <div>
        <div class="flex items-center gap-3 mb-3">
          <div class="w-11 h-11 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
            ${person.name.substring(0, 2)}
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-sm">${person.name}</h4>
            <div class="text-xs text-slate-500">${person.department}</div>
          </div>
        </div>
        <div class="text-xs font-medium text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md mb-3 inline-block">
          ${person.role}
        </div>
        <div class="text-xs text-slate-600 mb-3">
          <strong class="text-slate-800">ผลงานหลัก:</strong> ${person.appContribution}
        </div>
      </div>
      <div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">ทักษะ AI ที่เชี่ยวชาญ:</div>
        <div class="flex flex-wrap gap-1">
          ${person.aiSkills.map(s => `<span class="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">${s}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// 8. Search & Filters Setup
function setupSearchAndFilters() {
  const appSearch = document.getElementById('app-search-input');
  if (appSearch) {
    appSearch.addEventListener('input', (e) => {
      appSearchQuery = e.target.value;
      renderLiveApps();
    });
  }

  const appFilterPills = document.querySelectorAll('.app-filter-pill');
  appFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      appFilterPills.forEach(p => p.classList.remove('bg-blue-900', 'text-white'));
      appFilterPills.forEach(p => p.classList.add('bg-slate-100', 'text-slate-700'));
      pill.classList.remove('bg-slate-100', 'text-slate-700');
      pill.classList.add('bg-blue-900', 'text-white');
      appCategoryFilter = pill.getAttribute('data-dept');
      renderLiveApps();
    });
  });

  const docSearch = document.getElementById('doc-search-input');
  if (docSearch) {
    docSearch.addEventListener('input', (e) => {
      docSearchQuery = e.target.value;
      renderDocuments();
    });
  }

  const docFilterPills = document.querySelectorAll('.doc-filter-pill');
  docFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      docFilterPills.forEach(p => p.classList.remove('bg-blue-900', 'text-white'));
      docFilterPills.forEach(p => p.classList.add('bg-slate-100', 'text-slate-700'));
      pill.classList.remove('bg-slate-100', 'text-slate-700');
      pill.classList.add('bg-blue-900', 'text-white');
      docCategoryFilter = pill.getAttribute('data-cat');
      renderDocuments();
    });
  });

  const promptFilterPills = document.querySelectorAll('.prompt-filter-pill');
  promptFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      promptFilterPills.forEach(p => p.classList.remove('bg-blue-900', 'text-white'));
      promptFilterPills.forEach(p => p.classList.add('bg-slate-100', 'text-slate-700'));
      pill.classList.remove('bg-slate-100', 'text-slate-700');
      pill.classList.add('bg-blue-900', 'text-white');
      promptCategoryFilter = pill.getAttribute('data-prompt-cat');
      renderPrompts();
    });
  });
}

// 9. Lightbox Engine
function setupLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!modal) return;

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigateLightbox(-1));
  nextBtn.addEventListener('click', () => navigateLightbox(1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

window.openLightbox = function(type, index) {
  currentLightboxType = type;
  currentLightboxIndex = index;
  updateLightboxContent();
  document.getElementById('lightbox-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

function closeLightbox() {
  document.getElementById('lightbox-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  const data = currentLightboxType === 'atmosphere' ? atmosphereData : promptsData;
  currentLightboxIndex = (currentLightboxIndex + dir + data.length) % data.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const data = currentLightboxType === 'atmosphere' ? atmosphereData : promptsData;
  const item = data[currentLightboxIndex];
  if (!item) return;

  const imgEl = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const captionEl = document.getElementById('lightbox-caption');
  const countEl = document.getElementById('lightbox-count');

  imgEl.src = item.path;
  titleEl.innerText = item.title;
  captionEl.innerText = item.caption || item.description || '';
  countEl.innerText = `${currentLightboxIndex + 1} / ${data.length}`;
}

// 10. Live Preview Modal
function setupLivePreviewModal() {
  const modal = document.getElementById('preview-modal');
  const closeBtn = document.getElementById('preview-close');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    document.getElementById('preview-iframe').src = 'about:blank';
    document.body.style.overflow = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      document.getElementById('preview-iframe').src = 'about:blank';
      document.body.style.overflow = '';
    }
  });
}

window.openAppPreview = function(url, title) {
  const modal = document.getElementById('preview-modal');
  const iframe = document.getElementById('preview-iframe');
  const titleEl = document.getElementById('preview-title');
  const openExternalBtn = document.getElementById('preview-external-link');

  titleEl.innerText = title;
  openExternalBtn.href = url;
  iframe.src = url;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

// 11. Print Setup
function setupPrintButton() {
  const printBtns = document.querySelectorAll('.trigger-print-btn');
  printBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab('report');
      setTimeout(() => {
        window.print();
      }, 350);
    });
  });
}

function escapeHtml(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
