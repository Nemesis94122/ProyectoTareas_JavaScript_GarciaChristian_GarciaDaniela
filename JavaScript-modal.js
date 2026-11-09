const API_URL = 'https://typicode.com';
const STORAGE_KEY = 'app_tareas_data';

class TodoApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.tareas = this.cargar();
    this.filtro = 'todas';
    this.busqueda = '';
    this.editandoId = null;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <input type="text" id="bus" placeholder="Buscar..."><select id="flt"><option value="todas">Todas</option><option value="completadas">Completadas</option><option value="pendientes">Pendientes</option></select>
      <button id="nva">Nueva</button><button id="imp">Importar API</button><button id="mar">Marcar todas</button><button id="vac">Vaciar</button>
      <ul id="lst"></ul>
      <dialog id="mdl-f"><form id="frm"><h3>Tarea</h3><input type="text" id="ttl" required><label><input type="checkbox" id="cmp">Completado</label><button type="submit">Guardar</button><button type="button" onclick="this.closest('dialog').close()">Cerrar</button></form></dialog>
      <dialog id="mdl-i"><h3>Selecciona tareas</h3><ul id="api-lst" style="max-height:200px; overflow-y:auto"></ul><button id="cnf">Importar</button><button type="button" onclick="this.closest('dialog').close()">Cerrar</button></dialog>
    `;
    this.setup();
  }

  cargar() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
  
  guardar() { 
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tareas)); } catch(e) { console.error(e); }
    this.render(); 
  }

  setup() {
    const s = this.shadowRoot;
    s.getElementById('nva').onclick = () => { this.editandoId = null; s.getElementById('frm').reset(); s.getElementById('mdl-f').showModal(); };
    s.getElementById('imp').onclick = () => this.cargarAPI();
    s.getElementById('mar').onclick = () => { this.tareas.forEach(t => t.completado = true); this.guardar(); };
    s.getElementById('vac').onclick = () => { if(confirm('¿Vaciar?')) { this.tareas = []; this.guardar(); } };
    s.getElementById('flt').onchange = (e) => { this.filtro = e.target.value; this.render(); };
    s.getElementById('bus').oninput = (e) => { this.busqueda = e.target.value.toLowerCase().trim(); this.render(); };
    s.getElementById('cnf').onclick = () => this.confirmarImportar();
    
    s.getElementById('frm').onsubmit = (e) => {
      e.preventDefault();
      const titulo = s.getElementById('ttl').value, completado = s.getElementById('cmp').checked;
      if (this.editandoId) {
        this.tareas = this.tareas.map(t => t.id === this.editandoId ? { ...t, titulo, completado } : t);
      } else {
        this.tareas.push({ id: 'm_' + Date.now(), titulo, completado, importada: false });
      }
      s.getElementById('mdl-f').close();
      this.guardar();
    };

    // Delegación de eventos para clics (Eliminar / Editar)
    s.getElementById('lst').onclick = (e) => {
      const id = e.target.dataset.id;
      if (!id) return;
      if (e.target.classList.contains('del')) { this.tareas = this.tareas.filter(t => t.id !== id); this.guardar(); }
      if (e.target.classList.contains('edi')) {
        const t = this.tareas.find(x => x.id === id);
        this.editandoId = id;
        s.getElementById('ttl').value = t.titulo;
        s.getElementById('cmp').checked = t.completado;
        s.getElementById('mdl-f').showModal();
      }
    };
    
    // Delegación de eventos corregida para cambios de estado (Preserva la propiedad 'importada')
    s.getElementById('lst').onchange = (e) => {
      if (e.target.classList.contains('chk')) {
        const id = e.target.dataset.id;
        this.tareas = this.tareas.map(t => t.id === id ? { ...t, completado: e.target.checked } : t);
        this.guardar();
      }
    };

    this.render();
  }

  async cargarAPI() {
    const s = this.shadowRoot, ul = s.getElementById('api-lst');
    ul.innerHTML = 'Cargando...';
    s.getElementById('mdl-i').showModal();
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error();
      const datos = await res.json();
      ul.innerHTML = datos.slice(0, 15).map(t => `
        <li><label><input type="checkbox" class="api-chk" data-ttl="${t.title}" ${t.completed ? 'data-cmp="1"' : ''}> ${t.title}</label></li>
      `).join('');
    } catch (err) {
      ul.innerHTML = '<span style="color:red">Error al cargar datos de la API</span>';
    }
  }

  confirmarImportar() {
    this.shadowRoot.querySelectorAll('.api-chk:checked').forEach(c => {
      const idRand = 'a_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      this.tareas.push({ id: idRand, titulo: c.dataset.ttl, completado: !!c.dataset.cmp, importada: true });
    });
    this.shadowRoot.getElementById('mdl-i').close();
    this.guardar();
  }

  // NUEVA FUNCIÓN RENDER: Lee la estructura e inyecta nodos desde la plantilla externa en el HTML
  render() {
    const ul = this.shadowRoot.getElementById('lst');
    ul.innerHTML = ''; 

    const plantillaItem = document.getElementById('tarea-item-template');
    if (!plantillaItem) return;

    const filtradas = this.tareas.filter(t => {
      const coincideFiltro = this.filtro === 'todas' || 
        (this.filtro === 'completadas' && t.completado) || 
        (this.filtro === 'pendientes' && !t.completado);
      const coincideBusqueda = t.titulo.toLowerCase().includes(this.busqueda);
      return coincideFiltro && coincideBusqueda;
    });

    if (filtradas.length === 0) {
      ul.innerHTML = `<li style="padding: 25px; color: #777; text-align: center; list-style: none;">No hay tareas en esta sección.</li>`;
      return;
    }

    filtradas.forEach(t => {
      const clon = plantillaItem.content.cloneNode(true);
      const li = clon.querySelector('li');
      const chk = clon.querySelector('.chk');
      const tituloDiv = clon.querySelector('.titulo');
      const etiquetaSmall = clon.querySelector('.categoria small');
      const btnEdi = clon.querySelector('.edi');
      const btnDel = clon.querySelector('.del');

      chk.dataset.id = t.id;
      chk.checked = t.completado;
      if (btnEdi) btnEdi.dataset.id = t.id;
      if (btnDel) btnDel.dataset.id = t.id;

      if (tituloDiv) tituloDiv.textContent = t.titulo;
      if (etiquetaSmall) etiquetaSmall.textContent = t.importada ? 'Importada (API)' : 'Creada Local';

      if (t.completado) {
        if (li) li.classList.add('completada');
        if (tituloDiv) {
          tituloDiv.style.textDecoration = 'line-through';
          tituloDiv.style.color = '#777';
        }
      }

      if (t.importada && btnEdi) {
        btnEdi.style.display = 'none';
      }

      ul.appendChild(clon);
    });
  }
}

if (!customElements.get('todo-app')) customElements.define('todo-app', TodoApp);
