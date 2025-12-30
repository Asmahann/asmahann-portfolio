const grid = document.getElementById('projects-grid');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');

let projects = [];

async function loadProjects(){
  try{
    const res = await fetch('projects.json');
    projects = await res.json();
    renderProjects(projects);
  }catch(err){
    grid.innerHTML = '<p style="color:#f88">Failed to load projects.json — check the file is present.</p>';
    console.error(err);
  }
}

function renderProjects(list){
  grid.innerHTML = '';
  if(!list.length){
    grid.innerHTML = '<p style="color:var(--muted)">No projects found.</p>';
    return;
  }
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div>
        <div class="title">${p.title}</div>
        <div class="desc">${p.short}</div>
      </div>
      <div class="tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <div class="actions">
        <button class="btn" data-slug="${p.slug}" aria-label="Details">Details</button>
        <a class="btn primary" href="${p.url}" target="_blank" rel="noreferrer">Repo</a>
      </div>
    `;
    card.querySelector('.btn').addEventListener('click', ()=> openModal(p));
    grid.appendChild(card);
  });
}

function openModal(p){
  modalContent.innerHTML = `
    <h2>${p.title}</h2>
    <p style="color:var(--muted)">${p.long}</p>
    <p><strong>Tags:</strong> ${p.tags.join(', ')}</p>
    <p style="margin-top:12px">
      <a class="btn primary" href="${p.url}" target="_blank" rel="noreferrer">View Repo</a>
      ${p.demo ? `<a class="btn" href="${p.demo}" target="_blank" rel="noreferrer">Live Demo</a>` : ''}
    </p>
  `;
  modal.setAttribute('aria-hidden','false');
}

modalClose.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
modal.addEventListener('click', (e)=> { if(e.target===modal) modal.setAttribute('aria-hidden','true') });

searchInput.addEventListener('input', (e)=>{
  const q = e.target.value.toLowerCase().trim();
  const filtered = projects.filter(p => p.title.toLowerCase().includes(q) || p.short.toLowerCase().includes(q) || p.tags.join(' ').toLowerCase().includes(q));
  renderProjects(filtered);
});

filterSelect.addEventListener('change', (e)=>{
  const v = e.target.value;
  if(!v) renderProjects(projects);
  else renderProjects(projects.filter(p=>p.tags.includes(v)));
});

// initialize
loadProjects();