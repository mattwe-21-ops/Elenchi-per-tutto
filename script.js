// Memoria locale degli elementi e dello stile scelto
let items = JSON.parse(localStorage.getItem('proListItems')) || [];
let listStyle = localStorage.getItem('proListStyle') || 'square';

// Collegamenti agli elementi della pagina
const itemInput = document.getElementById('itemInput');
const btnAdd = document.getElementById('btnAdd');
const listContainer = document.getElementById('listContainer');
const btnSquare = document.getElementById('btnSquare');
const btnCircle = document.getElementById('btnCircle');
const btnWord = document.getElementById('btnWord');
const btnPrint = document.getElementById('btnPrint');
const btnClear = document.getElementById('btnClear');
const statsText = document.getElementById('statsText');
const currentDate = document.getElementById('currentDate');

// Funzione di avvio
function init() {
    const now = new Date();
    currentDate.textContent = "Data creazione: " + now.toLocaleDateString('it-IT');
    setStyle(listStyle);
    render();
    
    // Eventi di ascolto click e tastiera
    btnAdd.addEventListener('click', addItem);
    itemInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItem(); });
    btnSquare.addEventListener('click', () => setStyle('square'));
    btnCircle.addEventListener('click', () => setStyle('circle'));
    btnClear.addEventListener('click', clearList);
    btnPrint.addEventListener('click', () => window.print());
    btnWord.addEventListener('click', exportToWord);
}

// Aggiungere un elemento alla lista
function addItem() {
    const val = itemInput.value.trim();
    if(val) {
        items.push({ id: Date.now(), text: val, checked: false });
        itemInput.value = '';
        saveAndRender();
    }
}

// Invertire lo stato (vuoto / completato)
function toggleItem(id) {
    items = items.map(item => item.id === id ? {...item, checked: !item.checked} : item);
    saveAndRender();
}

// Cancellare un singolo elemento
function deleteItem(id) {
    items = items.filter(item => item.id !== id);
    saveAndRender();
}

// Cambiare lo stile visivo tra quadrati e cerchi
function setStyle(style) {
    listStyle = style;
    localStorage.setItem('proListStyle', style);
    listContainer.className = 'list-' + style;
    btnSquare.classList.toggle('active', style === 'square');
    btnCircle.classList.toggle('active', style === 'circle');
}

// Reset totale della lista
function clearList() {
    if(confirm("Vuoi cancellare definitivamente tutta la lista?")) {
        items = [];
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem('proListItems', JSON.stringify(items));
    render();
}

// Mostra gli elementi a schermo ed aggiorna l'indice
function render() {
    listContainer.innerHTML = '';
    let checkedCount = 0;

    items.forEach(item => {
        if(item.checked) checkedCount++;

        const li = document.createElement('li');
        li.className = `item ${item.checked ? 'checked' : ''}`;
        
        // Struttura interna dell'elemento con i listener
        li.innerHTML = `
            <div class="checkbox">
                ${item.checked ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="text">${item.text}</div>
            <div class="delete-btn"><i class="fas fa-times"></i></div>
        `;

        // Click sulla casella o sul testo per riempirlo/svuotarlo
        li.querySelector('.checkbox').addEventListener('click', () => toggleItem(item.id));
        li.querySelector('.text').addEventListener('click', () => toggleItem(item.id));
        
        // Tasto per eliminare la riga
        li.querySelector('.delete-btn').addEventListener('click', () => deleteItem(item.id));

        listContainer.appendChild(li);
    });

    // Aggiornamento testuale dell'indice/statistiche
    statsText.textContent = `${items.length} elementi totali - ${checkedCount} completati`;
}

// ESPORTAZIONE DIRETTA IN COMPATIBILITÀ WORD (.doc)
function exportToWord() {
    if(items.length === 0) return alert("La lista è vuota!");

    const htmlHeader = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
    "xmlns:w='urn:schemas-microsoft-com:office:word' "+
    "xmlns='http://www.w3.org/TR/REC-html40'>"+
    "<head><meta charset='utf-8'><title>Lista Viaggio</title><style>"+
    "body { font-family: 'Arial', sans-serif; padding: 20px; }"+
    "h1 { color: #2c3e50; border-bottom: 2px solid #2c3e50; padding-bottom: 5px; }"+
    "ul { list-style: none; padding: 0; }"+
    "li { padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14pt; }"+
    "</style></head><body>";
    
    let htmlContent = `<h1>Lista Cose da Portare</h1><p>Data Documento: ${new Date().toLocaleDateString('it-IT')}</p><ul>`;
    
    items.forEach(item => {
        const marker = listStyle === 'square' ? "□" : "○";
        const status = item.checked ? " [PRESO]" : " [DA PORTARE]";
        htmlContent += `<li>${marker} ${item.text} <i>${status}</i></li>`;
    });
    
    htmlContent += "</ul></body></html>";

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(htmlHeader + htmlContent);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'lista_cose_da_portare.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
}

// Avvia lo script all'apertura
init();