// portfolio.js - fixed and extended
document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const toastEl = $('#toast');
  function toast(msg, t = 2000) {
    if (!toastEl) return console.log('TOAST:', msg);
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    toastEl.style.transform = 'translateY(0)';
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => { toastEl.style.opacity = '0'; toastEl.style.transform = 'translateY(8px)'; }, t);
  }
  function safe(id) { const el = $(id); if (!el) console.warn('Missing', id); return el; }

  const STORAGE_KEY = 'skillvault_portfolio_v1';
  let state = {
    name:'', headline:'', summary:'', profileImage:'', skills:[], education:[], projects:[],
    contact:{email:'',phone:'',website:'',socials:''}, template:'modern', accent:'#0066ff', resumeFile:null
  };
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) Object.assign(state, JSON.parse(raw)); } catch(e){ console.warn('load failed', e); }

  // refs
  const leftPanel = safe('#leftPanel');
  const shards = $$('.shard');
  let pvName = safe('#pvName'), pvHeadline = safe('#pvHeadline'), pvSkills = safe('#pvSkills'), pvProjects = safe('#pvProjects'), pvContact = safe('#pvContact');
  const profileImg = safe('#profilePreviewImg');

  const nameInput = safe('#name'), headlineInput = safe('#headline'), summaryInput = safe('#summary'), profileImageInput = safe('#profileImage');
  const skillInput = safe('#skillInput'), addSkillBtn = safe('#addSkillBtn'), skillsChips = safe('#skillsChips');
  const addEducationBtn = safe('#addEducationBtn'), manageEducationBtn = safe('#manageEducationBtn'), educationList = safe('#educationList');
  const addProjectBtn = safe('#addProjectBtn'), manageProjectsBtn = safe('#manageProjectsBtn'), projectModal = safe('#projectModal'), projectsManager = safe('#projectsManager'), closeProjectModal = safe('#closeProjectModal'), addNewProjectBtn = safe('#addNewProjectBtn');
  const emailInput = safe('#email'), phoneInput = safe('#phone'), websiteInput = safe('#website'), socialsInput = safe('#socials');
  const tplEls = $$('.tpl'), accentColorInput = safe('#accentColor');
  const resumeUploadInput = safe('#resumeUpload'), generateResumeBtn = safe('#generateResumeBtn');
  const saveBtn = safe('#saveBtn'), exportBtn = safe('#exportBtn'), clearBtn = safe('#clearBtn'), publishBtn = safe('#publishBtn');
  const previewPublicBtn = safe('#previewPublicBtn'), downloadResumeBtn = safe('#downloadResume');
  const themeToggleBtn = safe('#themeToggleBtn');

  // theme toggle initialization + handler
  const THEME_KEY = 'skillvault_theme';
  (function initThemeToggle(){
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark') document.documentElement.classList.add('dark-theme');
      else document.documentElement.classList.remove('dark-theme');
    } catch(e){ /* ignore storage errors */ }

    function updateThemeButton(){
      if (!themeToggleBtn) return;
      const isDark = document.documentElement.classList.contains('dark-theme');
      themeToggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      themeToggleBtn.title = isDark ? 'Switch to light' : 'Switch to dark';
    }

    if (themeToggleBtn) {
      updateThemeButton();
      themeToggleBtn.addEventListener('click', () => {
        const isNowDark = document.documentElement.classList.toggle('dark-theme');
        try { localStorage.setItem(THEME_KEY, isNowDark ? 'dark' : 'light'); } catch(e){}
        updateThemeButton();
        renderPreview();
        toast(isNowDark ? 'Dark mode' : 'Light mode');
      });
    }
  })();

  // Ensure preview skills container exists (HTML template may omit it)
  if (!pvSkills) {
    const preview = $('#livePreview');
    if (preview) {
      const el = document.createElement('div');
      el.id = 'pvSkills';
      el.className = 'skills';
      // place before projects list or at end
      const projectsEl = preview.querySelector('.projects-list');
      if (projectsEl) preview.insertBefore(el, projectsEl);
      else preview.appendChild(el);
      pvSkills = el;
    }
  }

  // Ensure preview projects container exists as well
  if (!pvProjects) {
    const preview = $('#livePreview');
    if (preview) {
      const el = document.createElement('div');
      el.id = 'pvProjects';
      el.className = 'projects-list';
      // place after skills or at end
      const skillsEl = preview.querySelector('#pvSkills') || preview.querySelector('.skills');
      if (skillsEl && skillsEl.nextSibling) preview.insertBefore(el, skillsEl.nextSibling);
      else preview.appendChild(el);
      pvProjects = el;
    }
  }

  // Ensure projects manager container exists inside the project modal (for Manage projects flow)
  (function ensureProjectsManager(){
    const pm = $('#projectsManager');
    const projectModalEl = $('#projectModal');
    const projectFormEl = $('#projectForm');
    if (!pm && projectModalEl) {
      const mgr = document.createElement('div');
      mgr.id = 'projectsManager';
      mgr.className = 'project-grid';
      // insert manager above the form so list + form can coexist
      if (projectFormEl) projectModalEl.querySelector('.modal').insertBefore(mgr, projectFormEl);
      else projectModalEl.querySelector('.modal').appendChild(mgr);
    }
  })();

  // wire close button for project modal
  if (closeProjectModal) {
    closeProjectModal.addEventListener('click', () => { $('#projectModal').classList.remove('open'); $('#projectModal').setAttribute('aria-hidden','true'); });
  }

  // wire optional "New project" button (if present) to open editor
  if (addNewProjectBtn) addNewProjectBtn.addEventListener('click', () => openProjectEditor());

  if (!pvName || !pvHeadline) {
    toast('Initialization failed: missing UI elements (check console)');
    console.error('Missing required DOM nodes. Aborting init.');
    return;
  }

  // helpers
  const genId = () => 'p_' + Math.random().toString(36).slice(2,9);
  const randomColor = () => ['#4fc3f7','#7bd389','#ffb86l','#a78bfa','#ff7ab6','#6ec6ff'][Math.floor(Math.random()*6)];
  const shadeHex = (hex, pct) => {
    try {
      hex = (hex||'#0066ff').replace('#','');
      let r = parseInt(hex.substring(0,2),16), g = parseInt(hex.substring(2,4),16), b = parseInt(hex.substring(4,6),16);
      r = Math.min(255, Math.round(r + (255-r)*(pct/100)));
      g = Math.min(255, Math.round(g + (255-g)*(pct/100)));
      b = Math.min(255, Math.round(b + (255-b)*(pct/100)));
      return '#' + ((1<<24) + (r<<16) + (g<<8) + b).toString(16).slice(1);
    } catch(e) { return '#00b7ff'; }
  };
  const escapeHtml = s => String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // skill icons mapping (uses simpleicons CDN)
  const SKILL_ICONS = {
    'html': { slug: 'html5', color: 'E34F26' }, 'html5': { slug: 'html5', color: 'E34F26' },
    'css': { slug: 'css3', color: '1572B6' }, 'css3': { slug: 'css3', color: '1572B6' },
    'javascript': { slug: 'javascript', color: 'F7DF1E' }, 'js': { slug: 'javascript', color: 'F7DF1E' },
    'typescript': { slug: 'typescript', color: '3178C6' },
    'react': { slug: 'react', color: '61DAFB' }, 'reactjs': { slug: 'react', color: '61DAFB' },
    'vue': { slug: 'vue.js', color: '4FC08D' }, 'vuejs': { slug: 'vue.js', color: '4FC08D' },
    'angular': { slug: 'angular', color: 'DD0031' },
    'svelte': { slug: 'svelte', color: 'FF3E00' }, 'next': { slug: 'nextdotjs', color: '000000' }, 'nextjs': { slug: 'nextdotjs', color: '000000' },
    'nuxt': { slug: 'nuxtdotjs', color: '00DC82' }, 'gatsby': { slug: 'gatsby', color: '663399' },
    'node': { slug: 'nodedotjs', color: '339933' }, 'nodejs': { slug: 'nodedotjs', color: '339933' }, 'node.js': { slug: 'nodedotjs', color: '339933' },
    'python': { slug: 'python', color: '3776AB' }, 'django': { slug: 'django', color: '092E20' }, 'flask': { slug: 'flask', color: '000000' },
    'java': { slug: 'java', color: '007396' }, 'kotlin': { slug: 'kotlin', color: '0095D5' }, 'swift': { slug: 'swift', color: 'FA7343' },
    'csharp': { slug: 'csharp', color: '239120' }, 'c#': { slug: 'csharp', color: '239120' }, 'cpp': { slug: 'cplusplus', color: '00599C' }, 'c++': { slug: 'cplusplus', color: '00599C' },
    'go': { slug: 'go', color: '00ADD8' }, 'golang': { slug: 'go', color: '00ADD8' }, 'rust': { slug: 'rust', color: '000000' },
    'php': { slug: 'php', color: '777BB4' }, 'laravel': { slug: 'laravel', color: 'FF2D20' },
    'mysql': { slug: 'mysql', color: '4479A1' }, 'postgresql': { slug: 'postgresql', color: '336791' }, 'mongodb': { slug: 'mongodb', color: '47A248' }, 'redis': { slug: 'redis', color: 'DC382D' },
    'docker': { slug: 'docker', color: '2496ED' }, 'kubernetes': { slug: 'kubernetes', color: '326CE5' },
    'aws': { slug: 'amazonaws', color: 'FF9900' }, 'azure': { slug: 'microsoftazure', color: '0089D6' }, 'gcp': { slug: 'googlecloud', color: '4285F4' }, 'firebase': { slug: 'firebase', color: 'FFCA28' },
    'git': { slug: 'git', color: 'F05032' }, 'github': { slug: 'github', color: '181717' }, 'gitlab': { slug: 'gitlab', color: 'FC6D26' },
    'docker': { slug: 'docker', color: '2496ED' }, 'terraform': { slug: 'terraform', color: '7B42BC' },
    'figma': { slug: 'figma', color: 'F24E1E' }, 'sketch': { slug: 'sketch', color: 'F7B500' }, 'adobe': { slug: 'adobexd', color: 'FF61F6' },
    'tailwind': { slug: 'tailwindcss', color: '38B2AC' }, 'tailwindcss': { slug: 'tailwindcss', color: '38B2AC' }, 'bootstrap': { slug: 'bootstrap', color: '7952B3' },
    'graphql': { slug: 'graphql', color: 'E535AB' }, 'apollo': { slug: 'apollographql', color: '311C87' },
    'npm': { slug: 'npm', color: 'CB3837' }, 'yarn': { slug: 'yarn', color: '2C8EBB' },
    'jest': { slug: 'jest', color: 'C21325' }, 'mocha': { slug: 'mocha', color: '8D6748' },
    'tensorflow': { slug: 'tensorflow', color: 'FF6F00' }, 'pytorch': { slug: 'pytorch', color: 'EE4C2C' },
    'linux': { slug: 'linux', color: 'FCC624' }, 'android': { slug: 'android', color: '3DDC84' }, 'ios': { slug: 'apple', color: '000000' }
  };

  function slugifySkill(key){
    return String(key||'').toLowerCase().trim()
      .replace(/\+/g,'plus')
      .replace(/#/g,'sharp')
      .replace(/\s+/g,'')
      .replace(/[^a-z0-9.-]/g,'')
      .replace(/\.+$/,'');
  }

  function getSkillIconUrl(skill){
    if (!skill) return null;
    const raw = String(skill).toLowerCase().trim();
    // try direct map
    if (SKILL_ICONS[raw]) return `https://cdn.simpleicons.org/${SKILL_ICONS[raw].slug}/${SKILL_ICONS[raw].color}`;
    // try normalized keys (no spaces)
    const nospace = raw.replace(/\s+/g,'');
    if (SKILL_ICONS[nospace]) return `https://cdn.simpleicons.org/${SKILL_ICONS[nospace].slug}/${SKILL_ICONS[nospace].color}`;
    // try basic slug fallback (best-effort)
    const slug = slugifySkill(raw);
    if (!slug) return null;
    // use a neutral color (white) so simpleicons will render default color
    return `https://cdn.simpleicons.org/${slug}`;
  }

  // renderers
  function renderPreview(){
    pvName.textContent = state.name || 'Your Name';
    pvHeadline.textContent = state.headline || 'Professional headline';
    pvContact.textContent = (state.contact.email || 'email@example.com') + (state.contact.phone ? ' • ' + state.contact.phone : '');
    // profile image
    if (profileImg) {
      if (state.profileImage) profileImg.src = state.profileImage;
      else {
        // fallback avatar with initials generated as SVG data url
        const initials = (state.name || 'JD').split(' ').map(s=>s[0]).slice(0,2).join('');
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='100%' height='100%' fill='#e6eef9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='36' fill='#0f1724' font-family='Arial'>${escapeHtml(initials)}</text></svg>`;
        profileImg.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
      }
    }

    // skills (with icons)
    pvSkills.innerHTML = '';
    (state.skills || []).slice(0,12).forEach(s => {
      const sp = document.createElement('span'); sp.className = 'skill';
      const iconUrl = getSkillIconUrl(s);
      if (iconUrl) {
        const img = document.createElement('img'); img.className = 'skill-icon'; img.src = iconUrl; img.alt = s + ' logo';
        sp.appendChild(img);
      }
      const txt = document.createElement('span'); txt.textContent = s; sp.appendChild(txt);
      pvSkills.appendChild(sp);
    });

    // projects thumbnails
    pvProjects.innerHTML = '';
    (state.projects || []).slice(0,6).forEach(p => {
      const d = document.createElement('div'); d.className = 'thumb';
      d.style.background = p.thumbColor || `linear-gradient(135deg,${state.accent||'#0066ff'},${shadeHex(state.accent||'#0066ff',18)})`;
      d.textContent = (p.title || 'P').split(' ').map(x=>x[0]).slice(0,2).join('');
      pvProjects.appendChild(d);
    });

    // apply template preview class
    const preview = $('#livePreview');
    if (preview) {
      preview.dataset.template = state.template || 'modern';
      preview.classList.remove('tpl-modern','tpl-classic','tpl-showcase');
      preview.classList.add('tpl-' + (state.template || 'modern'));
    }
  }

  // inputs wiring (defensive)
  if (nameInput) { nameInput.value = state.name || ''; nameInput.addEventListener('input', e => { state.name = e.target.value; renderPreview(); }); }
  if (headlineInput) { headlineInput.value = state.headline || ''; headlineInput.addEventListener('input', e => { state.headline = e.target.value; renderPreview(); }); }
  if (summaryInput) { summaryInput.value = state.summary || ''; summaryInput.addEventListener('input', e => state.summary = e.target.value); }

  if (profileImageInput) {
    profileImageInput.addEventListener('change', e => {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = ev => { state.profileImage = ev.target.result; renderPreview(); saveState(); toast('Profile image loaded'); };
      r.readAsDataURL(f);
    });
  }

  // skills
  function renderSkills(){
    if (!skillsChips) return;
    skillsChips.innerHTML = '';
    (state.skills||[]).forEach((s,i) => {
      const el = document.createElement('div'); el.className = 'chip'; el.textContent = s;
      el.title = 'Click to remove';
      el.addEventListener('click', () => { state.skills.splice(i,1); renderSkills(); renderPreview(); saveState(); });
      skillsChips.appendChild(el);
    });
  }
  renderSkills();
  const addSkill = () => {
    if (!skillInput) return;
    const v = skillInput.value.trim(); if (!v) return;
    if (!state.skills.includes(v)) state.skills.unshift(v);
    skillInput.value = '';
    renderSkills(); renderPreview(); saveState();
  };
  if (addSkillBtn) addSkillBtn.addEventListener('click', addSkill);
  if (skillInput) skillInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } });

  // education
  function renderEducation(){
    if (!educationList) return;
    educationList.innerHTML = '';
    (state.education || []).forEach((ed, idx) => {
      const row = document.createElement('div'); row.style.display = 'flex'; row.style.justifyContent = 'space-between'; row.style.alignItems='center'; row.style.padding='6px 0';
      const left = document.createElement('div'); left.innerHTML = `<strong>${escapeHtml(ed.degree)}</strong> — ${escapeHtml(ed.institution)} <div class="muted">${escapeHtml(ed.years)}</div>`;
      const actions = document.createElement('div'); actions.style.display='flex'; actions.style.gap='6px';
      const edit = document.createElement('button'); edit.className='btn ghost'; edit.innerHTML = '<i class="fas fa-pen"></i>'; edit.addEventListener('click', () => openEducationEditor(idx));
      const del = document.createElement('button'); del.className='btn ghost'; del.innerHTML = '<i class="fas fa-trash"></i>'; del.addEventListener('click', () => { if (!confirm('Delete this education entry?')) return; state.education.splice(idx,1); saveState(); renderEducation(); renderPreview(); });
      actions.appendChild(edit); actions.appendChild(del);
      row.appendChild(left); row.appendChild(actions);
      educationList.appendChild(row);
    });
  }

  function openEducationEditor(idx){
    const ed = state.education[idx];
    $('#eduId').value = ed ? ed.id : '';
    $('#eduDegree').value = ed ? ed.degree : '';
    $('#eduInstitution').value = ed ? ed.institution : '';
    $('#eduYears').value = ed ? ed.years : '';
    $('#educationDeleteBtn').style.display = ed ? 'inline-block' : 'none';
    $('#educationModal').classList.add('open'); $('#educationModal').setAttribute('aria-hidden','false');
  }

  if (addEducationBtn) addEducationBtn.addEventListener('click', () => {
    $('#eduId').value = ''; $('#eduDegree').value=''; $('#eduInstitution').value=''; $('#eduYears').value=''; $('#educationDeleteBtn').style.display='none';
    $('#educationModal').classList.add('open'); $('#educationModal').setAttribute('aria-hidden','false');
  });

  if (manageEducationBtn) manageEducationBtn.addEventListener('click', () => { $('#educationModal').classList.add('open'); $('#educationModal').setAttribute('aria-hidden','false'); renderEducation(); });

  // education form submit
  const educationForm = $('#educationForm');
  if (educationForm) {
    educationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = $('#eduId').value || genId();
      const degree = $('#eduDegree').value.trim();
      const institution = $('#eduInstitution').value.trim();
      const years = $('#eduYears').value.trim();
      if (!degree) { toast('Degree is required'); return; }
      const existing = state.education.find(x => x.id === id);
      if (existing) {
        existing.degree = degree; existing.institution = institution; existing.years = years;
      } else {
        state.education.unshift({ id, degree, institution, years });
      }
      saveState(); renderEducation(); renderPreview();
      $('#educationModal').classList.remove('open'); $('#educationModal').setAttribute('aria-hidden','true');
    });
  }
  // delete education
  const educationDeleteBtn = $('#educationDeleteBtn');
  if (educationDeleteBtn) {
    educationDeleteBtn.addEventListener('click', () => {
      const id = $('#eduId').value;
      if (!id) return;
      if (!confirm('Delete this education entry?')) return;
      state.education = state.education.filter(x => x.id !== id);
      saveState(); renderEducation(); renderPreview();
      $('#educationModal').classList.remove('open'); $('#educationModal').setAttribute('aria-hidden','true');
    });
  }
  // close education modal
  const closeEducationModal = $('#closeEducationModal');
  if (closeEducationModal) closeEducationModal.addEventListener('click', () => { $('#educationModal').classList.remove('open'); $('#educationModal').setAttribute('aria-hidden','true'); });

  // projects modal form handling
  function openProjectEditor(idx){
    const p = state.projects[idx];
    $('#projId').value = p ? p.id : '';
    $('#projTitle').value = p ? p.title : '';
    $('#projDesc').value = p ? p.description : '';
    $('#projTech').value = p ? (p.tech||[]).join(', ') : '';
    $('#projLink').value = p ? p.link : '';
    $('#projRepo').value = p ? p.repo : '';
    $('#projThumb').value = p ? (p.thumbColor || '#4fc3f7') : '#4fc3f7';
    $('#projectDeleteBtn').style.display = p ? 'inline-block' : 'none';
    $('#projectModalTitle').textContent = p ? 'Edit project' : 'Add project';
    $('#projectModal').classList.add('open'); $('#projectModal').setAttribute('aria-hidden','false');
  }

  const projectForm = $('#projectForm');
  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = $('#projId').value || genId();
      const title = $('#projTitle').value.trim();
      const description = $('#projDesc').value.trim();
      const tech = $('#projTech').value.split(',').map(s=>s.trim()).filter(Boolean);
      const link = $('#projLink').value.trim();
      const repo = $('#projRepo').value.trim();
      const thumbColor = $('#projThumb').value || randomColor();
      if (!title) { toast('Title required'); return; }
      const existing = state.projects.find(x => x.id === id);
      if (existing) {
        Object.assign(existing, { title, description, tech, link, repo, thumbColor });
      } else {
        state.projects.unshift({ id, title, description, tech, link, repo, thumbColor, created: Date.now() });
      }
      saveState(); renderPreview(); $('#projectModal').classList.remove('open'); $('#projectModal').setAttribute('aria-hidden','true'); renderProjectsManager();
    });
  }

  const projectDeleteBtn = $('#projectDeleteBtn');
  if (projectDeleteBtn) {
    projectDeleteBtn.addEventListener('click', () => {
      const id = $('#projId').value;
      if (!id) return;
      if (!confirm('Delete project?')) return;
      state.projects = state.projects.filter(x => x.id !== id);
      saveState(); renderPreview(); $('#projectModal').classList.remove('open'); $('#projectModal').setAttribute('aria-hidden','true'); renderProjectsManager();
    });
  }

  if (addProjectBtn) addProjectBtn.addEventListener('click', () => openProjectEditor());
  if (manageProjectsBtn) manageProjectsBtn.addEventListener('click', () => { renderProjectsManager(); $('#projectModal').classList.add('open'); $('#projectModal').setAttribute('aria-hidden','false'); });

  function renderProjectsManager(){
    // always query DOM so newly-created container will be found (don't rely on the earlier cached const)
    const pm = document.getElementById('projectsManager');
    if (!pm) return;
    pm.innerHTML = '';
    (state.projects || []).forEach((p, i) => {
      const card = document.createElement('div'); card.style.padding='8px'; card.style.border='1px solid rgba(0,0,0,0.05)'; card.style.borderRadius='8px';
      card.innerHTML = `<strong>${escapeHtml(p.title)}</strong><div class="muted">${escapeHtml((p.tech||[]).slice(0,3).join(', '))}</div>`;
      const actions = document.createElement('div'); actions.style.display='flex'; actions.style.gap='6px'; actions.style.marginTop='8px';
      const edit = document.createElement('button'); edit.className='btn ghost'; edit.innerHTML = '<i class="fas fa-pen"></i>'; edit.addEventListener('click', () => openProjectEditor(i));
      const del = document.createElement('button'); del.className='btn ghost'; del.innerHTML = '<i class="fas fa-trash"></i>'; del.addEventListener('click', () => { if (!confirm('Delete project?')) return; state.projects.splice(i,1); saveState(); renderProjectsManager(); renderPreview(); });
      actions.appendChild(edit); actions.appendChild(del);
      card.appendChild(actions);
      pm.appendChild(card);
    });
  }

  // wire generate resume button (in settings area)
  if (generateResumeBtn) {
    generateResumeBtn.addEventListener('click', () => {
      const html = buildResumeHtml();
      const b = new Blob([html], { type:'text/html' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = (state.name||'resume') + '.html'; a.click(); URL.revokeObjectURL(a.href);
      toast('Resume generated');
    });
  }

  // ensure publish triggers a save first
  if (publishBtn) {
    publishBtn.addEventListener('click', () => {
      saveState();
      const html = buildPublicPageHtml();
      const b = new Blob([html], { type:'text/html' });
      const url = URL.createObjectURL(b);
      window.open(url, '_blank');
      toast('Public preview opened');
    });
  }

  // contact fields
  if (emailInput) { emailInput.value = state.contact.email || ''; emailInput.addEventListener('input', e => { state.contact.email = e.target.value; renderPreview(); }); }
  if (phoneInput) { phoneInput.value = state.contact.phone || ''; phoneInput.addEventListener('input', e => state.contact.phone = e.target.value); }
  if (websiteInput) { websiteInput.value = state.contact.website || ''; websiteInput.addEventListener('input', e => state.contact.website = e.target.value); }
  if (socialsInput) { socialsInput.value = state.contact.socials || ''; socialsInput.addEventListener('input', e => state.contact.socials = e.target.value); }

  // templates
  tplEls.forEach(el => {
    el.addEventListener('click', () => {
      tplEls.forEach(t => t.classList.remove('selected'));
      el.classList.add('selected');
      state.template = el.dataset.tpl;
      saveState();
      renderPreview();
      toast('Template set to ' + state.template);
    });
  });

  if (accentColorInput) { accentColorInput.value = state.accent || '#0066ff'; accentColorInput.addEventListener('input', e => { state.accent = e.target.value; document.documentElement.style.setProperty('--accent-primary', state.accent); document.documentElement.style.setProperty('--accent-secondary', shadeHex(state.accent, 18)); saveState(); renderPreview(); }); }

  // resume & preview builders
  function buildResumeHtml(){
    const skillsHtml = (state.skills||[]).map(s=>'<li>'+escapeHtml(s)+'</li>').join('');
    const projectsHtml = (state.projects||[]).map(p=>'<li><strong>'+escapeHtml(p.title)+'</strong><div>'+escapeHtml(p.description||'')+'</div></li>').join('');
    const educationHtml = (state.education||[]).map(e=>'<li><strong>'+escapeHtml(e.degree)+'</strong> — '+escapeHtml(e.institution)+' <div class="muted">'+escapeHtml(e.years)+'</div></li>').join('');
    const socialsHtml = (state.contact.socials||'').split(',').map(s=>s.trim()).filter(Boolean).map(s=>'<li>'+escapeHtml(s)+'</li>').join('');
    return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escapeHtml(state.name||'Resume')+'</title><style>body{font-family:Inter,Arial,sans-serif;padding:24px;color:#0f1724}h1{margin:0}h2{margin:.5rem 0}.muted{color:#64748b;font-size:13px}</style></head><body><h1>'+escapeHtml(state.name||'Your Name')+'</h1><h2>'+escapeHtml(state.headline||'Headline')+'</h2><p>'+escapeHtml(state.summary||'Summary')+'</p><h3>Education</h3><ul>'+educationHtml+'</ul><h3>Skills</h3><ul>'+skillsHtml+'</ul><h3>Projects</h3><ul>'+projectsHtml+'</ul><h3>Contact</h3><ul><li>'+escapeHtml(state.contact.email||'')+'</li><li>'+escapeHtml(state.contact.phone||'')+'</li>'+socialsHtml+'</ul></body></html>';
  }

  function buildPublicPageHtml(){
    const accent = escapeHtml(state.accent || '#0066ff');

    const skillsHtml = (state.skills||[]).map(s => {
      const icon = getSkillIconUrl(s);
      const img = icon ? `<img class="pv-skill-icon" src="${icon}" alt="${escapeHtml(s)}"/>` : '';
      return `<span class="pv-chip">${img}<span>${escapeHtml(s)}</span></span>`;
    }).join('');

    const educationHtml = (state.education||[]).map(e => `
      <li class=\"edu-item\">\n        <strong>${escapeHtml(e.degree)}</strong>\n        <div class=\"muted\">${escapeHtml(e.institution)} • ${escapeHtml(e.years)}</div>\n      </li>`).join('');

    const projectsHtml = (state.projects||[]).map((p,i) => {
      const initials = (p.title||'P').split(' ').map(x=>x[0]).slice(0,2).join('');
      const bg = p.thumbColor || `linear-gradient(135deg,${accent},${shadeHex(accent,18)})`;
      const links = [];
      if (p.link) links.push(`<a class=\"pv-link\" href=\"${escapeHtml(p.link)}\" target=\"_blank\">Live</a>`);
      if (p.repo) links.push(`<a class=\"pv-link\" href=\"${escapeHtml(p.repo)}\" target=\"_blank\">Repo</a>`);
      return `\n      <article class=\"pv-project\" style=\"animation-delay:${i*70}ms\">\n        <div class=\"pv-thumb\" style=\"background:${bg}\">${escapeHtml(initials)}</div>\n        <div class=\"pv-project-meta\">\n          <h3>${escapeHtml(p.title)}</h3>\n          <p>${escapeHtml(p.description||'')}</p>\n          <div class=\"pv-tech\">${escapeHtml((p.tech||[]).join(', '))}</div>\n          <div class=\"pv-links\">${links.join('')}</div>\n        </div>\n      </article>`;
    }).join('');

    const imgHtml = state.profileImage ? `<img class=\"pv-avatar\" src=\"${state.profileImage}\" alt=\"${escapeHtml(state.name||'')}\"/>` : `<div class=\"pv-avatar pv-avatar-fallback\">${escapeHtml((state.name||'').split(' ').map(x=>x[0]).slice(0,2).join(''))}</div>`;

    const resumeDataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(buildResumeHtml());

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(state.name||'Portfolio')}</title>
  <style>
    :root{--accent:${accent};--text:#0f1724;--muted:#64748b;--bg:#ffffff}
    .dark-theme{--text:#e6eef9;--muted:#9fb0c8;--bg:#071226}
    html,body{height:100%;margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased}
    .wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:36px;background:radial-gradient(circle at 10% 20%, rgba(0,102,255,0.06), transparent 10%), radial-gradient(circle at 90% 80%, rgba(100,160,255,0.04), transparent 10%)}
    .card{width:min(980px,96%);border-radius:14px;padding:28px;background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent);box-shadow:0 30px 80px rgba(2,6,23,0.12);position:relative;overflow:hidden}
    .bg-3d{position:absolute;inset:0;pointer-events:none;opacity:0.95}
    .bg-3d .shard{position:absolute;border-radius:12px;mix-blend-mode:screen;filter:blur(22px);opacity:0.9;transform-origin:center}
    .s1{width:260px;height:260px;background:linear-gradient(135deg,var(--accent),rgba(255,255,255,0.06));left:-12%;top:-12%;animation:floatA 9s ease-in-out infinite}
    .s2{width:140px;height:140px;background:linear-gradient(135deg,rgba(0,0,0,0.06),var(--accent));right:-8%;top:10%;animation:floatB 7s ease-in-out infinite}
    .s3{width:180px;height:120px;background:linear-gradient(135deg,var(--accent),rgba(255,255,255,0.04));left=18%;bottom:-8%;animation:floatC 8.5s ease-in-out infinite}
    @keyframes floatA{0%{transform:translateY(0) rotate(0)}50%{transform:translateY(-18px) rotate(6deg)}100%{transform:translateY(0) rotate(0)}}
    @keyframes floatB{0%{transform:translateY(0) rotate(0)}50%{transform:translateY(-12px) rotate(-6deg)}100%{transform:translateY(0) rotate(0)}}
    @keyframes floatC{0%{transform:translateY(0) rotate(0)}50%{transform:translateY(-10px) rotate(4deg)}100%{transform:translateY(0) rotate(0)}}

    header{display:flex;align-items:center;gap:18px;z-index:4;position:relative}
    .pv-avatar{width:120px;height:120px;border-radius:18px;object-fit:cover;border:6px solid rgba(255,255,255,0.06);box-shadow:0 12px 30px rgba(2,6,23,0.12)}
    .pv-avatar-fallback{width:120px;height:120px;border-radius:18px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--accent),${shadeHex(accent,18)});color:white;font-weight:800;font-size:28px}
    .pv-hero h1{margin:0;font-size:28px}
    .pv-hero p{margin:8px 0;color:var(--muted)}
    .top-actions{position:absolute;right:18px;top:18px;display:flex;gap:8px;z-index:6}
    .btn{padding:8px 12px;border-radius:8px;border:none;cursor:pointer;background:rgba(255,255,255,0.06);color:var(--text)}
    .btn.primary{background:var(--accent);color:white}

    .layout{display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-top:20px;position:relative;z-index:4}
    .summary{font-size:15px;line-height:1.6}
    .skills{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
    .pv-chip{display:inline-flex;align-items:center;gap:8px;padding:8px 10px;border-radius:999px;background:rgba(255,255,255,0.03);font-weight:700}
    .pv-skill-icon{width:18px;height:18px;object-fit:contain;border-radius:4px}

    .pv-projects{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:12px}
    .pv-project{display:flex;gap:12px;align-items:flex-start;padding:12px;border-radius:12px;background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent);box-shadow:0 8px 26px rgba(2,6,23,0.06);}
    .pv-thumb{width:64px;height:64px;border-radius:10px;color:white;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px}

    aside h3{margin-top:0}
    .edu-list{list-style:none;padding:0;margin:0}
    .edu-item{padding:8px 0;border-bottom:1px dashed rgba(0,0,0,0.04)}

    /* responsive */
    @media (max-width:880px){.layout{grid-template-columns:1fr}.pv-avatar{width:96px;height:96px}}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="bg-3d">
        <div class="shard s1"></div>
        <div class="shard s2"></div>
        <div class="shard s3"></div>
      </div>
      <div class="top-actions">
        <button id="themeToggleBtn" class="btn">Toggle theme</button>
        <a class="btn primary" id="downloadResume" href="${resumeDataUrl}" download="${escapeHtml((state.name||'resume'))}.html">Download Resume</a>
      </div>
      <header>
        ${imgHtml}
        <div class="pv-hero">
          <h1>${escapeHtml(state.name||'Your Name')}</h1>
          <p class="pv-headline">${escapeHtml(state.headline||'Professional headline')}</p>
          <div class="pv-contact">${escapeHtml(state.contact.email||'')} ${state.contact.phone ? '• ' + escapeHtml(state.contact.phone) : ''}</div>
        </div>
      </header>
      <div class="layout">
        <main>
          <div class="summary">${escapeHtml(state.summary||'')}</div>
          <div class="skills">${skillsHtml}</div>
          <h2 style="margin-top:18px">Projects</h2>
          <section class="pv-projects">${projectsHtml}</section>
        </main>
        <aside>
          <h3>Education</h3>
          <ul class="edu-list">${educationHtml}</ul>
          <h3 style="margin-top:18px">Contact & Links</h3>
          <div class="pv-contact">${escapeHtml(state.contact.website||'')}<div style="margin-top:6px;color:var(--muted)">${escapeHtml(state.contact.socials||'')}</div></div>
        </aside>
      </div>
    </div>
  </div>

  <script>
    (function(){
      const THEME_KEY = 'skillvault_theme';
      const root = document.documentElement;
      const btn = document.getElementById('themeToggleBtn');
      function applySaved(){ try{ const s = localStorage.getItem(THEME_KEY); if(s==='dark') root.classList.add('dark-theme'); else root.classList.remove('dark-theme'); }catch(e){}
      }
      applySaved();
      if(btn){ btn.addEventListener('click', ()=>{ const isDark = root.classList.toggle('dark-theme'); try{ localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light'); }catch(e){} }); }

      // simple parallax for shards
      const card = document.querySelector('.card');
      const shards = document.querySelectorAll('.bg-3d .shard');
      if(card && shards.length){ card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect(); const cx = r.left + r.width/2; const cy = r.top + r.height/2;
        const dx = (e.clientX - cx) / (r.width/2); const dy = (e.clientY - cy) / (r.height/2);
        shards.forEach(function(s,i){ const tx = dx*(10 + i*6); const ty = dy*(8 + i*4); s.style.transform = 'translate3d(' + tx + 'px, ' + ty + 'px, 0) rotate(' + (dx*6) + 'deg)'; });
      });
      card.addEventListener('mouseleave', ()=> shards.forEach(s=> s.style.transform=''));
      }
    })();
  </script>
</body>
</html>`;
  }

  function saveState(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){ console.warn('save failed', e); }
  }

  // wire top-level actions: Save, Export, Preview, Publish, Resume generation/download
  if (saveBtn) {
    saveBtn.addEventListener('click', () => { saveState(); renderPreview(); toast('Saved'); });
  }
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      try {
        const data = JSON.stringify(state, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = (state.name || 'portfolio') + '.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        toast('Exported JSON');
      } catch ( e) { console.warn(e); toast('Export failed'); }
    });
  }

  if (previewPublicBtn) {
    previewPublicBtn.addEventListener('click', () => {
      const html = buildPublicPageHtml();
      const w = window.open('about:blank', '_blank');
      if (w) { w.document.open(); w.document.write(html); w.document.close(); toast('Public preview opened'); }
      else toast('Popup blocked: allow popups for this site');
    });
  }

  if (publishBtn) {
    publishBtn.addEventListener('click', () => {
      const html = buildPublicPageHtml();
      const w = window.open('about:blank', '_blank');
      if (w) { w.document.open(); w.document.write(html); w.document.close(); toast('Published (preview opened)'); }
      else toast('Popup blocked: allow popups for this site');
    });
  }

  if (generateResumeBtn) {
    generateResumeBtn.addEventListener('click', () => {
      try {
        const blob = new Blob([buildResumeHtml()], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = (state.name || 'resume') + '.html'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        toast('Resume generated');
      } catch ( e) { console.warn(e); toast('Generate failed'); }
    });
  }

  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
      try {
        const blob = new Blob([buildResumeHtml()], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = (state.name || 'resume') + '.html'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch ( e) { console.warn(e); }
    });
  }

  // initial render
  renderPreview();
});
