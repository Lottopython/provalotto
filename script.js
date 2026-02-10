// Array dei numeri disponibili (1-90)
const numbers = Array.from({length: 90}, (_, i) => i + 1);

// Ruote disponibili
const ruote = [
    "Bari", "Cagliari", "Firenze", "Genova", "Milano", 
    "Napoli", "Palermo", "Roma", "Torino", "Venezia", "Tutte"
];

// Tipi di scommessa
const betTypes = ["Ambata", "Ambo", "Terno", "Quaterna", "Cinquina"];

// Variabili globali
let selectedNumbers = [];
let selectedRuota = null;
let selectedBetType = null;

// Inizializzazione quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
    createNumbersGrid();
    setupNavigation();
    populateRuoteSelection();
    populateBetTypes();
    setupEventListeners();
});

// Funzione per creare la griglia dei numeri
function createNumbersGrid() {
    const container = document.getElementById('numbers-container');
    container.innerHTML = '';
    
    numbers.forEach(num => {
        const button = document.createElement('button');
        button.className = 'number-btn';
        button.textContent = num.toString().padStart(2, '0');
        button.dataset.number = num;
        
        button.addEventListener('click', () => toggleNumberSelection(num));
        
        container.appendChild(button);
    });
}

// Funzione per gestire la selezione/deselezione di un numero
function toggleNumberSelection(number) {
    const index = selectedNumbers.indexOf(number);
    
    if (index === -1) {
        // Aggiungi il numero se non supera il limite per la scommessa selezionata
        if (canAddNumber()) {
            selectedNumbers.push(number);
        } else {
            alert(`Non puoi selezionare più di ${getMaxNumbersForBetType()} numeri per questa scommessa!`);
            return;
        }
    } else {
        // Rimuovi il numero
        selectedNumbers.splice(index, 1);
    }
    
    updateSelectedNumbersDisplay();
    updateNumberButtons();
}

// Controlla se è possibile aggiungere un altro numero
function canAddNumber() {
    const maxNumbers = getMaxNumbersForBetType();
    return selectedNumbers.length < maxNumbers;
}

// Ottiene il numero massimo di numeri consentiti per la scommessa selezionata
function getMaxNumbersForBetType() {
    if (!selectedBetType) return 10; // valore predefinito
    
    switch(selectedBetType) {
        case "Ambata":
            return 10;
        case "Ambo":
            return 10;
        case "Terno":
            return 10;
        case "Quaterna":
            return 10;
        case "Cinquina":
            return 10;
        default:
            return 10;
    }
}

// Aggiorna la visualizzazione dei numeri selezionati
function updateSelectedNumbersDisplay() {
    const container = document.querySelector('.selected-numbers');
    if (container) {
        container.innerHTML = '<h3>Numeri Selezionati:</h3>';
        
        selectedNumbers.forEach(num => {
            const button = document.createElement('button');
            button.className = 'number-btn selected';
            button.textContent = num.toString().padStart(2, '0');
            button.disabled = true;
            container.appendChild(button);
        });
    }
}

// Aggiorna lo stato visivo dei pulsanti dei numeri
function updateNumberButtons() {
    const buttons = document.querySelectorAll('.number-btn');
    buttons.forEach(button => {
        const num = parseInt(button.dataset.number);
        if (selectedNumbers.includes(num)) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}

// Imposta la navigazione tra le sezioni
function setupNavigation() {
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Nascondi tutte le sezioni
            document.querySelectorAll('main > *').forEach(section => {
                if (section.id !== 'home') {
                    section.style.display = 'none';
                }
            });
            
            // Mostra la sezione richiesta
            if (targetId !== 'home') {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.style.display = 'block';
                }
            } else {
                document.querySelectorAll('main > *').forEach(section => {
                    if (section.id !== 'home') {
                        section.style.display = 'none';
                    }
                });
            }
        });
    });
}

// Popola la selezione delle ruote
function populateRuoteSelection() {
    const container = document.querySelector('.ruote-selection');
    if (container) {
        container.innerHTML = '<h3>Seleziona la Ruota:</h3>';
        
        ruote.forEach(ruota => {
            const div = document.createElement('div');
            div.className = 'ruota-option';
            div.textContent = ruota;
            div.dataset.ruota = ruota;
            
            div.addEventListener('click', () => selectRuota(ruota));
            
            container.appendChild(div);
        });
    }
}

// Seleziona una ruota
function selectRuota(ruota) {
    selectedRuota = ruota;
    
    // Aggiorna la visualizzazione
    document.querySelectorAll('.ruota-option').forEach(option => {
        if (option.dataset.ruota === ruota) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

// Popola i tipi di scommessa
function populateBetTypes() {
    const container = document.querySelector('.bet-types');
    if (container) {
        container.innerHTML = '<h3>Seleziona il Tipo di Scommessa:</h3>';
        
        betTypes.forEach(type => {
            const div = document.createElement('div');
            div.className = 'bet-type';
            div.textContent = type;
            div.dataset.type = type;
            
            div.addEventListener('click', () => selectBetType(type));
            
            container.appendChild(div);
        });
    }
}

// Seleziona un tipo di scommessa
function selectBetType(betType) {
    selectedBetType = betType;
    
    // Aggiorna la visualizzazione
    document.querySelectorAll('.bet-type').forEach(option => {
        if (option.dataset.type === betType) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    // Aggiorna i numeri selezionati in base al nuovo limite
    if (selectedNumbers.length > getMaxNumbersForBetType()) {
        selectedNumbers = selectedNumbers.slice(0, getMaxNumbersForBetType());
        updateSelectedNumbersDisplay();
        updateNumberButtons();
    }
}

// Imposta gli event listener aggiuntivi
function setupEventListeners() {
    // Pulsante per inviare la scommessa
    const submitBtn = document.querySelector('.submit-bet .btn-primary');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitBet);
    }
    
    // Simula risultati dell'estrazione
    generateRandomResults();
}

// Invia la scommessa
function submitBet() {
    if (selectedNumbers.length === 0) {
        alert('Seleziona almeno un numero!');
        return;
    }
    
    if (!selectedRuota) {
        alert('Seleziona una ruota!');
        return;
    }
    
    if (!selectedBetType) {
        alert('Seleziona un tipo di scommessa!');
        return;
    }
    
    const betAmount = document.querySelector('.bet-amount input').value;
    if (!betAmount || parseFloat(betAmount) <= 0) {
        alert('Inserisci un importo valido per la scommessa!');
        return;
    }
    
    // Simula l'invio della scommessa
    alert(`Scommessa effettuata!\nNumeri: ${selectedNumbers.join(', ')}\nRuota: ${selectedRuota}\nTipo: ${selectedBetType}\nImporto: €${parseFloat(betAmount).toFixed(2)}`);
    
    // Resetta la scommessa
    resetBet();
}

// Resetta la scommessa
function resetBet() {
    selectedNumbers = [];
    selectedRuota = null;
    selectedBetType = null;
    
    updateSelectedNumbersDisplay();
    updateNumberButtons();
    
    // Deseleziona ruote e tipi di scommessa
    document.querySelectorAll('.ruota-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelectorAll('.bet-type').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Resetta l'importo
    const amountInput = document.querySelector('.bet-amount input');
    if (amountInput) {
        amountInput.value = '';
    }
}

// Genera risultati casuali per simulare l'estrazione
function generateRandomResults() {
    const extractionNumbers = [];
    while (extractionNumbers.length < 5) {
        const randomNum = Math.floor(Math.random() * 90) + 1;
        if (!extractionNumbers.includes(randomNum)) {
            extractionNumbers.push(randomNum);
        }
    }
    
    displayResults(extractionNumbers);
}

// Visualizza i risultati dell'estrazione
function displayResults(numbers) {
    const container = document.querySelector('.extraction-numbers');
    if (container) {
        container.innerHTML = '';
        
        numbers.forEach(num => {
            const div = document.createElement('div');
            div.className = 'extraction-number';
            div.textContent = num.toString().padStart(2, '0');
            container.appendChild(div);
        });
    }
}

// Funzione per aggiungere numeri rapidi
function quickPick(count) {
    // Resetta i numeri selezionati
    selectedNumbers = [];
    
    // Genera numeri casuali
    while (selectedNumbers.length < count) {
        const randomNum = Math.floor(Math.random() * 90) + 1;
        if (!selectedNumbers.includes(randomNum)) {
            selectedNumbers.push(randomNum);
        }
    }
    
    updateSelectedNumbersDisplay();
    updateNumberButtons();
}