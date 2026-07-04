// Seleziona gli elementi del DOM
const itemInput = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');
const travelList = document.getElementById('travelList');
const styleButtons = document.querySelectorAll('.style-btn');

// Funzione per aggiungere un elemento alla lista
function addItem() {
    const text = itemInput.value.trim();
    
    if (text !== "") {
        const li = document.createElement('li');
        li.textContent = text;
        travelList.appendChild(li);
        itemInput.value = ""; // Svuota l'input
    }
}

// Ascolta il click sul pulsante Aggiungi
addBtn.addEventListener('click', addItem);

// Ascolta la pressione del tasto Invio nella barra di input
itemInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addItem();
    }
});

// Gestione del cambio stile (Quadrati / Cerchi)
styleButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Rimuove la classe attiva da tutti i pulsanti e la mette a quello cliccato
        styleButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Controlla quale stile è stato scelto
        const style = this.getAttribute('data-style');
        
        if (style === 'circle') {
            travelList.className = 'list-circle';
        } else {
            travelList.className = 'list-square';
        }
    });
});