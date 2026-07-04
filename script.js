// Riferimenti elementi DOM
const itemInput = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');
const travelList = document.getElementById('travelList');
const styleButtons = document.querySelectorAll('.style-btn');
const exportTxtBtn = document.getElementById('exportTxtBtn');
const copyBtn = document.getElementById('copyBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const importFile = document.getElementById('importFile');

// Array globale per contenere i dati della lista
let items = JSON.parse(localStorage.getItem('baggageItems')) || [];
let currentStyle = localStorage.getItem('listStyle') || 'square';

// Inizializzazione pagina
document.addEventListener('DOMContentLoaded', () => {
    applyStyle(currentStyle);
    renderList();
});

// Funzione per aggiornare l'interfaccia grafica e salvare i dati
function updateData() {
    localStorage.setItem('baggageItems', JSON.stringify(items));
    renderList();
}

// Renderizza la lista a schermo
function renderList() {
    travelList.innerHTML = '';
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item.text;
        if (item.checked) li.classList.add('checked');

        // Cliccando sull'elemento lo marchi come preso/non preso
        li.addEventListener('click', (e) => {
            if(e.target.classList.contains('delete-item')) return;
            items[index].checked = !items[index].checked;
            updateData();
        });

        // Pulsante cancella singolo elemento
        const delBtn = document.createElement('button');
        delBtn.textContent = '✕';
        delBtn.className = 'delete-item';
        delBtn.addEventListener('click', () => {
            items.splice(index, 1);
            updateData();
        });

        li.appendChild(delBtn);
        travelList.appendChild(li);
    });
}

// Aggiungere un elemento
function addItem() {
    const text = itemInput.value.trim();
    if (text !== "") {
        items.push({ text: text, checked: false });
        itemInput.value = "";
        updateData();
    }
}

addBtn.addEventListener('click', addItem);
itemInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItem(); });

// Gestione Stile (Quadrati o Cerchi)
styleButtons.forEach(button => {
    button.addEventListener('click', function() {
        const style = this.getAttribute('data-style');
        applyStyle(style);
    });
});

function applyStyle(style) {
    currentStyle = style;
    localStorage.setItem('listStyle', style);
    
    styleButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-style') === style);
    });

    travelList.className = style === 'circle' ? 'list-circle' : 'list-square';
}

// Svuota tutto
clearAllBtn.addEventListener('click', () => {
    if(confirm("Sei sicuro di voler svuotare tutta la lista?")) {
        items = [];
        updateData();
    }
});

// Genera testo pulito della lista
function getListAsText() {
    return items.map(item => `${item.checked ? '[X]' : '[ ]'} ${item.text}`).join('\n');
}

// Esporta in file .txt
exportTxtBtn.addEventListener('click', () => {
    if(items.length === 0) return alert("La lista è vuota!");
    const blob = new Blob([getListAsText()], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'cose_da_portare.txt';
    link.click();
});

// Copia negli appunti
copyBtn.addEventListener('click', () => {
    if(items.length === 0) return alert("La lista è vuota!");
    navigator.clipboard.writeText(getListAsText()).then(() => {
        alert("Lista copiata negli appunti!");
    });
});

// Importa da file .txt
importFile.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n');
        lines.forEach(line => {
            let cleanLine = line.trim();
            if(cleanLine !== "") {
                let isChecked = false;
                if(cleanLine.startsWith('[X]') || cleanLine.startsWith('[x]')) {
                    isChecked = true;
                    cleanLine = cleanLine.replace(/^\[[Xx]\]\s*/, '');
                } else if(cleanLine.startsWith('[ ]')) {
                    cleanLine = cleanLine.replace(/^\[\s*\]\s*/, '');
                }
                items.push({ text: cleanLine, checked: isChecked });
            }
        });
        updateData();
        importFile.value = ''; // Reset input
    };
    reader.readAsText(file);
});