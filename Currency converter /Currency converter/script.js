const amount = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const result = document.getElementById('result');
const swapButton = document.querySelector('.swap-button');

async function convertCurrency() {
    const amountValue = amount.value;
    
    if (!amountValue || amountValue <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    try {
        result.textContent = 'Converting...';
        
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`);
        const data = await response.json();

        if (data.rates) {
            const rate = data.rates[toCurrency.value];
            const convertedAmount = (amountValue * rate).toFixed(2);
            
            result.innerHTML = `
                <strong>${amountValue} ${fromCurrency.value}</strong> = 
                <strong>${convertedAmount} ${toCurrency.value}</strong>
                <br>
                <small>1 ${fromCurrency.value} = ${rate} ${toCurrency.value}</small>
            `;
        } else {
            throw new Error('Conversion failed');
        }
    } catch (error) {
        console.error('Error:', error);
        result.textContent = 'An error occurred. Please try again later.';
    }
}

swapButton.addEventListener('click', () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    
    if (amount.value) {
        convertCurrency();
    }
});

amount.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        convertCurrency();
    }
});

fromCurrency.addEventListener('change', () => {
    if (amount.value) convertCurrency();
});

toCurrency.addEventListener('change', () => {
    if (amount.value) convertCurrency();
});

amount.addEventListener('input', (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }
    e.target.value = value;
}); 