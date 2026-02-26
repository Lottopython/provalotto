// Funzione per generare numeri casuali per le estrazioni
function generateRandomNumbers(count, min = 1, max = 90) {
    const numbers = [];
    while (numbers.length < count) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }
    return numbers.sort((a, b) => a - b);
}

// Funzione per ottenere la data odierna in formato DD/MM/YYYY
function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
}

// Funzione per visualizzare i risultati dell'estrazione
function displayExtractionResults(elementId, numbers) {
    const container = document.getElementById(elementId);
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

// Inizializzazione quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
    // Imposta la data odierna
    const dateElement = document.getElementById('extraction-date');
    if (dateElement) {
        dateElement.textContent = getCurrentDate();
    }
    
    // Genera e mostra i risultati per ogni ruota
    const ruote = ['bari', 'cagliari', 'firenze', 'genova', 'milano', 'napoli', 'palermo', 'roma', 'torino', 'venezia'];
    
    ruote.forEach(ruota => {
        const numbers = generateRandomNumbers(5);
        displayExtractionResults(`${ruota}-results`, numbers);
    });
    
    // Genera e mostra i risultati dell'estrazione principale
    const mainNumbers = generateRandomNumbers(5);
    displayExtractionResults('extraction-numbers', mainNumbers);
});