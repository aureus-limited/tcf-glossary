(function () {
  const cfg = window.SITE || {};
  const owner = cfg.owner || 'YOUR_GH_USERNAME_OR_ORG';
  const repo = cfg.repo || 'tcf-glossary';
  const branch = cfg.branch || 'main';
  const editUrl = `https://github.com/${owner}/${repo}/edit/${branch}/data/glossary.json`;
  const repoUrl = `https://github.com/${owner}/${repo}`;

  const $ = (sel, el = document) => el.querySelector(sel);
  const content = $('#content'), counts = $('#counts'), alphabet = $('#alphabet'), q = $('#q');
  $('#editLink').href = editUrl; $('#viewSource').href = repoUrl;

  let DATA = [], VIEW = [];
  const slugify = s => s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9\s\-()+./]/g,'').trim().replace(/\s+/g,'-');
  const groupByAlpha = items => items.reduce((acc, it) => { const k = /^[A-Z]/i.test(it.term[0]) ? it.term[0].toUpperCase() : '#'; (acc[k]=acc[k]||[]).push(it); return acc; }, {});
  const highlight = (t, n) => !n ? t : t.replace(new RegExp('(' + n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')','ig'), '<mark>$1</mark>');

  function renderAlphabet(active=null){
    const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split(''); alphabet.innerHTML='';
    letters.forEach(L=>{ const a=document.createElement('a'); a.href=`#group-${L}`; a.textContent=L; if(active===L)a.classList.add('active'); alphabet.appendChild(a); });
  }

  function render(items, needle=''){
    const groups = groupByAlpha(items); content.innerHTML='';
    Object.keys(groups).sort().forEach(k=>{
      const box=document.createElement('div'); box.className='group'; box.id=`group-${k}`;
      const h2=document.createElement('h2'); h2.textContent=k; box.appendChild(h2);
      groups[k].sort((a,b)=>a.term.localeCompare(b.term)).forEach(item=>{
        const card=document.createElement('article'); card.className='term'; card.id=`term-${slugify(item.term)}`;
        const head=document.createElement('div'); head.className='head';
        const h=document.createElement('h3'); h.className='t'; h.innerHTML=highlight(item.term, needle);
        const actions=document.createElement('div'); actions.className='actions';
        const copy=document.createElement('button'); copy.className='icon-btn'; copy.textContent='Copy link';
        copy.addEventListener('click', ()=>{ const url=`${location.origin}${location.pathname}#${card.id}`; navigator.clipboard.writeText(url).then(()=>{ copy.textContent='Copied!'; setTimeout(()=>copy.textContent='Copy link',1200); }); });
        const edit=document.createElement('a'); edit.className='icon-btn'; edit.href=editUrl; edit.target='_blank'; edit.rel='noopener'; edit.textContent='Suggest edit';
        actions.appendChild(copy); actions.appendChild(edit); head.appendChild(h); head.appendChild(actions);
        const p=document.createElement('p'); p.className='body'; p.innerHTML=highlight(item.def, needle);
        const meta=document.createElement('div'); meta.className='meta';
        const tags=(item.tags||[]).slice(0,6).map(t=>`<span class="tag">${t}</span>`).join(' ');
        const see=(item.see&&item.see.length)?` See also: ${item.see.map(s=>`<a href="#term-${slugify(s)}">${s}</a>`).join(', ')}.`:'';
        meta.innerHTML = `${tags}${see}`;
        card.appendChild(head); card.appendChild(p); if(tags||see) card.appendChild(meta); box.appendChild(card);
      });
      content.appendChild(box);
    });
    counts.textContent = `${items.length} term${items.length===1?'':'s'}${needle?` match “${needle}”`:''}.`;
    if (location.hash){ const t=document.getElementById(location.hash.slice(1)); if(t) t.scrollIntoView({behavior:'smooth', block:'start'}); }
  }

  let timer; q.addEventListener('input', ()=>{ clearTimeout(timer); timer=setTimeout(()=>{
    const needle=q.value.trim(); VIEW=!needle?DATA.slice(0):DATA.filter(it=>(it.term+' '+it.def+' '+(it.tags||[]).join(' ')).toLowerCase().includes(needle.toLowerCase()));
    render(VIEW, needle);
  }, 120); });

  renderAlphabet();
  fetch('data/glossary.json', { cache: 'no-store' })
    .then(r=>r.json())
    .then(j=>{ DATA=(j||[]).filter(Boolean); VIEW=DATA.slice(0); render(VIEW); })
    .catch(err=>{ content.innerHTML = `<div class="loading">Failed to load glossary.json. (${String(err)})</div>`; });
})();