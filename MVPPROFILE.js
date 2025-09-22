// Minimal interactivity: dropdowns, mobile menu, collapsible job descriptions, edit toggles.

document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Profile menu dropdown
  const profileBtn = document.getElementById('profileBtn');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  profileBtn && profileBtn.addEventListener('click', (e) => {
    const expanded = profileBtn.getAttribute('aria-expanded') === 'true';
    profileBtn.setAttribute('aria-expanded', String(!expanded));
    dropdownMenu.style.display = expanded ? 'none' : 'block';
  });

  // Mobile nav toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const open = mobileNav.getAttribute('aria-hidden') === 'false';
      mobileNav.style.display = open ? 'none' : 'flex';
      mobileNav.setAttribute('aria-hidden', String(!open));
    });
  }

  // Collapsible job descriptions
  document.querySelectorAll('[data-action="toggleCollapse"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const job = e.target.closest('.job-card');
      if (!job) return;
      const desc = job.querySelector('[data-collapsible]');
      const collapsed = desc.getAttribute('data-collapsed') === 'true';
      if (collapsed) {
        desc.style.maxHeight = '';
        desc.setAttribute('data-collapsed','false');
        e.target.textContent = 'Collapse';
      } else {
        desc.style.maxHeight = '3.6em';
        desc.style.overflow = 'hidden';
        desc.setAttribute('data-collapsed','true');
        e.target.textContent = 'Expand';
      }
    });
  });

  // Edit about / education toggles (inline editing)
  document.querySelectorAll('.small-btn[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetSelector = btn.dataset.target;
      if (!targetSelector) return;
      const target = document.querySelector(targetSelector);
      if (!target) return;
      const editable = target.isContentEditable;
      target.contentEditable = (!editable).toString();
      target.classList.toggle('editing', !editable);
      btn.textContent = editable ? 'Edit' : 'Save';
      if (editable) {
        // saved - could send to server
        target.blur();
      } else {
        target.focus();
      }
    });
  });

  // Simple edit on job cards: toggles contentEditable on description
  document.querySelectorAll('[data-action="editJob"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const job = e.target.closest('.job-card');
      const desc = job.querySelector('[data-collapsible]');
      if (!desc) return;
      const editable = desc.isContentEditable;
      desc.contentEditable = (!editable).toString();
      desc.classList.toggle('editing', !editable);
      btn.textContent = editable ? 'Edit' : 'Save';
      if (!editable) desc.focus();
    });
  });

  // Add skill (simple prompt, appends tag)
  const addSkillBtn = document.getElementById('addSkillBtn');
  if (addSkillBtn) {
    addSkillBtn.addEventListener('click', () => {
      const name = prompt('Add a new skill (e.g., React):');
      if (!name) return;
      const li = document.createElement('li');
      li.className = 'skill';
      li.textContent = name;
      document.getElementById('skillList').appendChild(li);
    });
  }

  // Add experience: opens a quick prompt to add a job card (very minimal)
  const addExpBtn = document.getElementById('addExpBtn');
  if (addExpBtn) {
    addExpBtn.addEventListener('click', () => {
      const title = prompt('Role title (e.g., Frontend Developer):');
      if (!title) return;
      const time = prompt('Time period (e.g., Mar 2020 - Dec 2021):') || '';
      const desc = prompt('Short description:') || '';
      const html = `
        <article class="job-card">
          <div class="job-left">
            <img class="company-logo" src="https://via.placeholder.com/64?text=Org" alt="company" />
          </div>
          <div class="job-main">
            <div class="job-top">
              <h3>${escapeHtml(title)}</h3>
              <span class="job-time">${escapeHtml(time)}</span>
            </div>
            <p class="job-desc" data-collapsible>${escapeHtml(desc)}</p>
            <div class="job-actions">
              <button class="small-btn" data-action="toggleCollapse">Collapse</button>
              <button class="small-btn" data-action="editJob">Edit</button>
            </div>
          </div>
        </article>
      `;
      const container = document.querySelector('.experience .card-body');
      container.insertAdjacentHTML('beforeend', html);
      // Re-bind events for the newly added elements
      rebindJobButtons();
    });
  }

  // Utility: bind handlers for dynamically added job buttons
  function rebindJobButtons() {
    document.querySelectorAll('[data-action="toggleCollapse"]').forEach(btn => {
      if (btn.__bound) return;
      btn.addEventListener('click', (e) => {
        const job = e.target.closest('.job-card');
        const desc = job.querySelector('[data-collapsible]');
        const collapsed = desc.getAttribute('data-collapsed') === 'true';
        if (collapsed) {
          desc.style.maxHeight = '';
          desc.setAttribute('data-collapsed','false');
          e.target.textContent = 'Collapse';
        } else {
          desc.style.maxHeight = '3.6em';
          desc.style.overflow = 'hidden';
          desc.setAttribute('data-collapsed','true');
          e.target.textContent = 'Expand';
        }
      });
      btn.__bound = true;
    });

    document.querySelectorAll('[data-action="editJob"]').forEach(btn => {
      if (btn.__bound) return;
      btn.addEventListener('click', (e) => {
        const job = e.target.closest('.job-card');
        const desc = job.querySelector('[data-collapsible]');
        const editable = desc.isContentEditable;
        desc.contentEditable = (!editable).toString();
        desc.classList.toggle('editing', !editable);
        btn.textContent = editable ? 'Edit' : 'Save';
        if (!editable) desc.focus();
      });
      btn.__bound = true;
    });
  }

  // escapeHtml for safe insertion
  function escapeHtml(text) {
    return text.replace(/[&<>"'`=\/]/g, function (s) {
      return {
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":'&#39;',
        '/':'&#x2F;',
        '`':'&#x60;',
        '=':'&#x3D;'
      }[s];
    });
  }

  // initial bind
  rebindJobButtons();
});
