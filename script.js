/* ===========================
   DADOS
=========================== */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maqzpepr';

const thermoData = [
  ['Tradicional','Moderna'],['Séria','Divertida'],['Acessível','Exclusiva'],
  ['Feminina','Masculina'],['Jovem','Madura'],['Discreta','Ousada'],
  ['Técnica','Intuitiva'],['Corporativa','Descontraída'],['Luxuosa','Popular'],
  ['Artesanal','Industrial'],['Delicada','Robusta'],['Rebelde','Disciplinada']
];

const colorSwatches = [
  { label: 'Terracotas & ocres',    colors: ['#C4703A','#D4956A','#E8C9A0'] },
  { label: 'Verdes natureza',        colors: ['#2D6A4F','#52B788','#B7E4C7'] },
  { label: 'Azuis frios',            colors: ['#1D3557','#457B9D','#A8DADC'] },
  { label: 'Neutros & off-whites',   colors: ['#6B6560','#B5AFA8','#F0ECE6'] },
  { label: 'Preto & grafites',       colors: ['#1C1C1E','#3D3D3F','#737378'] },
  { label: 'Vibrantes & neons',      colors: ['#A4FF4F','#FF5CE0','#FFE040'] },
  { label: 'Pastéis suaves',         colors: ['#F4C0C0','#C0D8F4','#C0F4D4'] },
  { label: 'Roxos & lilás',          colors: ['#6A0572','#9C6BFF','#D4B8FF'] },
  { label: 'Rosas & pinks',          colors: ['#C9184A','#E87CA0','#FDCFE8'] },
  { label: 'Dourados & metálicos',   colors: ['#B8860B','#D4A843','#F0D080'] },
];

const scopeItems = [
  'Logotipo','Símbolo / ícone','Paleta de cores','Tipografia',
  'Papelaria (cartão, papel carta...)','Embalagem','Rótulo / etiqueta',
  'Redes sociais (templates)','Apresentação / pitch deck',
  'Fachada / sinalização','Cardápio / catálogo','Manual de marca',
  'Identidade para evento','Uniforme / vestuário','Site / landing page',
];

/* ===========================
   ESTADO
=========================== */
const thermoValues = {}; // { pairIndex: dotIndex }
const top3 = [];         // até 3 nomes de atributos
const selectedColors = new Set();
const scopeChecked = new Set();

/* ===========================
   TERMÔMETRO
=========================== */
function buildThermo() {
  const card = document.getElementById('thermo-card');
  thermoData.forEach(([left, right], i) => {
    const pair = document.createElement('div');
    pair.className = 'bb-thermo-pair';

    const lEl = document.createElement('div');
    lEl.className = 'bb-thermo-left';
    lEl.textContent = left;
    lEl.addEventListener('click', () => toggleTop3(left));

    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'bb-dots';
    for (let d = 0; d < 7; d++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'bb-dot';
      dot.setAttribute('aria-label', `${left} → ${right}: posição ${d + 1} de 7`);
      dot.dataset.pair = i;
      dot.dataset.val = d;
      dot.addEventListener('click', () => selectDot(i, d));
      dotsWrap.appendChild(dot);
    }

    const rEl = document.createElement('div');
    rEl.className = 'bb-thermo-right';
    rEl.textContent = right;
    rEl.addEventListener('click', () => toggleTop3(right));

    pair.appendChild(lEl);
    pair.appendChild(dotsWrap);
    pair.appendChild(rEl);
    card.appendChild(pair);
  });
}

function selectDot(pairIdx, val) {
  document.querySelectorAll(`.bb-dot[data-pair="${pairIdx}"]`)
    .forEach((d, i) => d.classList.toggle('selected', i === val));
  thermoValues[pairIdx] = val;
}

function toggleTop3(word) {
  const idx = top3.indexOf(word);
  if (idx > -1) {
    top3.splice(idx, 1);
  } else {
    if (top3.length >= 3) return;
    top3.push(word);
  }
  renderTop3();
}

function renderTop3() {
  for (let i = 0; i < 3; i++) {
    const slot = document.getElementById('slot-' + i);
    const labels = ['1ª escolha', '2ª escolha', '3ª escolha'];
    if (top3[i]) {
      slot.textContent = top3[i];
      slot.classList.add('filled');
      slot.onclick = () => toggleTop3(top3[i]);
    } else {
      slot.textContent = labels[i];
      slot.classList.remove('filled');
      slot.onclick = null;
    }
  }
  document.querySelectorAll('.bb-thermo-left, .bb-thermo-right').forEach(el => {
    el.classList.toggle('top3', top3.includes(el.textContent.trim()));
  });
}

/* ===========================
   CORES INTUITIVAS
=========================== */
function buildColors() {
  const grid = document.getElementById('color-grid');
  colorSwatches.forEach((sw, i) => {
    const el = document.createElement('div');
    el.className = 'bb-color-swatch';
    el.innerHTML = `
      <div class="bb-swatch-block" style="background:linear-gradient(90deg,${sw.colors[0]},${sw.colors[1]},${sw.colors[2]})"></div>
      <div class="bb-swatch-label">${sw.label}</div>
    `;
    el.addEventListener('click', () => {
      if (selectedColors.has(i)) {
        selectedColors.delete(i);
        el.classList.remove('selected');
      } else {
        selectedColors.add(i);
        el.classList.add('selected');
      }
    });
    grid.appendChild(el);
  });
}

/* ===========================
   ESCOPO
=========================== */
function buildScope() {
  const grid = document.getElementById('scope-grid');
  scopeItems.forEach((item) => {
    const label = document.createElement('label');
    label.className = 'bb-scope-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = item;

    const check = document.createElement('div');
    check.className = 'bb-scope-check';
    check.innerHTML = '<div class="bb-scope-check-inner"></div>';

    const span = document.createElement('span');
    span.textContent = item;

    checkbox.addEventListener('change', () => {
      label.classList.toggle('checked', checkbox.checked);
      if (checkbox.checked) scopeChecked.add(item);
      else scopeChecked.delete(item);
    });

    label.appendChild(checkbox);
    label.appendChild(check);
    label.appendChild(span);
    grid.appendChild(label);
  });
}

/* ===========================
   CONTATO TOGGLE
=========================== */
function initContactToggle() {
  document.querySelectorAll('.bb-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bb-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const showId = btn.dataset.show;
      ['cf-email','cf-whats','cf-both'].forEach(id => {
        document.getElementById(id).style.display = id === showId ? 'block' : 'none';
      });
    });
  });
}

/* ===========================
   UPLOAD — PREVIEW DE NOMES
=========================== */
function initUploads() {
  [['ref-upload','ref-files'],['anti-upload','anti-files']].forEach(([inputId, listId]) => {
    const input = document.getElementById(inputId);
    const list  = document.getElementById(listId);
    if (!input || !list) return;
    input.addEventListener('change', () => {
      const names = Array.from(input.files).map(f => '✓ ' + f.name);
      list.innerHTML = names.map(n => `<div>${n}</div>`).join('');
    });
  });
}

/* ===========================
   COLETA DE DADOS
=========================== */
function collectFormData() {
  const val  = id => (document.getElementById(id) || {}).value || '';
  const activeContact = document.querySelector('.bb-toggle-btn.active')?.dataset?.show;

  let contato = '';
  if (activeContact === 'cf-email')  contato = val('f-email');
  if (activeContact === 'cf-whats')  contato = val('f-whats');
  if (activeContact === 'cf-both')   contato = `${val('f-email-b')} / ${val('f-whats-b')}`;

  const thermoSummary = thermoData.map(([left, right], i) => {
    const v = thermoValues[i];
    if (v === undefined) return `${left} ↔ ${right}: não respondido`;
    const label = v <= 1 ? left : v >= 5 ? right : v === 3 ? 'centro' : v === 2 ? `leve ${left}` : `leve ${right}`;
    return `${left} ↔ ${right}: ${label} (posição ${v + 1}/7)`;
  }).join('\n');

  const freeAttrs = Array.from(
    document.querySelectorAll('.bb-free-attr-inputs input')
  ).map(i => i.value).filter(Boolean).join(', ');

  const coloresSel = Array.from(selectedColors).map(i => colorSwatches[i].label).join(', ');

  return {
    nome:         val('f-nome'),
    negocio:      val('f-negocio'),
    segmento:     val('f-segmento'),
    contato,
    origem:       val('f-origem'),
    frase_marca:  val('f-frase'),
    nao_quer:     val('f-naoquero'),
    termometro:   thermoSummary,
    top3_atributos: top3.join(', ') || 'não selecionado',
    atributos_livres: freeAttrs || 'nenhum',
    ref_links:    val('f-reflinks'),
    ref_obs:      val('f-refobs'),
    anti_texto:   val('f-antitexto'),
    cores:        coloresSel || 'nenhuma selecionada',
    sensorial_cheiro:  val('s-cheiro'),
    sensorial_textura: val('s-textura'),
    sensorial_musica:  val('s-musica'),
    sensorial_sabor:   val('s-sabor'),
    sensorial_lugar:   val('s-lugar'),
    escopo: Array.from(scopeChecked).join(', ') || 'nenhum marcado',
  };
}

/* ===========================
   ENVIO
=========================== */
async function handleSubmit() {
  const btn = document.getElementById('submit-btn');

  // validação mínima
  const nome = document.getElementById('f-nome').value.trim();
  if (!nome) {
    alert('Por favor, preencha pelo menos o seu nome antes de enviar.');
    document.getElementById('f-nome').focus();
    return;
  }

  btn.textContent = 'Enviando...';
  btn.disabled = true;

  const data = collectFormData();

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(data),
    });

    if (res.ok) {
      showThankyou();
    } else {
      throw new Error('Resposta não ok: ' + res.status);
    }
  } catch (err) {
    console.error(err);
    alert('Ocorreu um erro ao enviar. Por favor, tente novamente ou entre em contato diretamente.');
    btn.textContent = 'Enviar briefing';
    btn.disabled = false;
  }
}

function showThankyou() {
  document.getElementById('bb-form-content').style.display = 'none';
  const ty = document.getElementById('bb-thankyou');
  ty.classList.add('visible');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===========================
   INIT
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  buildThermo();
  buildColors();
  buildScope();
  initContactToggle();
  initUploads();
  document.getElementById('submit-btn').addEventListener('click', handleSubmit);
});
