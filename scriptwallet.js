document.addEventListener('DOMContentLoaded', function() {
    const paymentMethodElement = document.getElementById('payment-method');
    if (paymentMethodElement) {
        paymentMethodElement.addEventListener('change', function() {
            const method = this.value;
            document.getElementById('e-wallet-section').style.display = method === 'e-wallet' ? 'block' : 'none';
            document.getElementById('crypto-section').style.display = method === 'crypto' ? 'block' : 'none';
        });
    }

    const payButton = document.getElementById('pay-button');
    if (payButton) {
        payButton.addEventListener('click', function() {
            const paymentMethod = document.getElementById('payment-method').value;
            const recipient = document.getElementById('recipient').value;
            const amount = parseFloat(document.getElementById('ticket-price').value);
            const currency = document.getElementById('currency').value;
            const date = document.getElementById('transaction-date').value || new Date().toISOString().split('T')[0];
            const description = document.getElementById('description').value;
            let paymentDetails = {};

            if (paymentMethod === 'e-wallet') {
                paymentDetails = {
                    eWallet: document.getElementById('e-wallet').value
                };
                if (!deductSgd(amount)) {
                    displayMessage('Insufficient SGD balance');
                    return;
                }
            } else if (paymentMethod === 'crypto') {
                paymentDetails = {
                    cryptoAddress: document.getElementById('crypto-address').value,
                    cryptoType: document.getElementById('crypto-type').value
                };
                if (!deductCrypto(amount, paymentDetails.cryptoType)) {
                    displayMessage('Insufficient crypto balance');
                    return;
                }
            }

            simulatePayment(paymentMethod, paymentDetails, recipient, amount, currency, date, description);
        });
    }

    const depositSgdButton = document.getElementById('deposit-sgd-button');
    if (depositSgdButton) {
        depositSgdButton.addEventListener('click', function() {
            const amount = parseFloat(document.getElementById('sgd-deposit-amount').value);
            depositSgd(amount);
        });
    }

    const depositButton = document.getElementById('deposit-button');
    if (depositButton) {
        depositButton.addEventListener('click', function() {
            const amount = parseFloat(document.getElementById('crypto-deposit-amount').value);
            const cryptoType = document.getElementById('crypto-deposit-type').value;
            depositCrypto(amount, cryptoType);
        });
    }

    updateBalances();
    updateTransactions();
});

function updateBalances() {
    const balance = localStorage.getItem('sgd-balance') || '0';
    const cryptoBalance = localStorage.getItem('crypto-balance') || '0 BTC';
    const balanceElement = document.getElementById('balance-amount');
    const cryptoBalanceElement = document.getElementById('crypto-balance');
    if (balanceElement) {
        balanceElement.textContent = `${balance} SGD`;
    }
    if (cryptoBalanceElement) {
        cryptoBalanceElement.textContent = cryptoBalance;
    }
}

function depositSgd(amount) {
    setTimeout(() => {
        const currentBalance = parseFloat(localStorage.getItem('sgd-balance') || '0');
        const newBalance = currentBalance + amount;
        localStorage.setItem('sgd-balance', newBalance);
        addTransaction('e-wallet', { amount, currency: 'SGD' }, 'Self', amount, 'SGD', new Date().toISOString().split('T')[0], 'Deposit');
        updateBalances();
    }, 2000);
}

function depositCrypto(amount, cryptoType) {
    setTimeout(() => {
        const currentBalance = parseFloat(localStorage.getItem('crypto-balance').split(' ')[0] || '0');
        const newBalance = currentBalance + amount;
        localStorage.setItem('crypto-balance', `${newBalance} ${cryptoType}`);
        addTransaction('crypto', { amount, cryptoType }, 'Self', amount, cryptoType, new Date().toISOString().split('T')[0], 'Deposit');
        updateBalances();
    }, 2000);
}

function deductSgd(amount) {
    const currentBalance = parseFloat(localStorage.getItem('sgd-balance') || '0');
    if (currentBalance < amount) {
        return false;
    }
    const newBalance = currentBalance - amount;
    localStorage.setItem('sgd-balance', newBalance);
    updateBalances();
    return true;
}

function deductCrypto(amount, cryptoType) {
    const currentBalance = parseFloat(localStorage.getItem('crypto-balance').split(' ')[0] || '0');
    if (currentBalance < amount) {
        return false;
    }
    const newBalance = currentBalance - amount;
    localStorage.setItem('crypto-balance', `${newBalance} ${cryptoType}`);
    updateBalances();
    return true;
}

function simulatePayment(method, details, recipient, amount, currency, date, description) {
    setTimeout(() => {
        let message = `Payment of ${amount} ${currency} to ${recipient} using ${method}`;
        if (method === 'e-wallet') {
            message += ` via e-wallet ${details.eWallet}`;
        } else if (method === 'crypto') {
            message += ` to crypto address ${details.cryptoAddress} (${details.cryptoType})`;
        }
        displayMessage(message);
        addTransaction(method, details, recipient, amount, currency, date, description);
    }, 2000);
}

function addTransaction(method, details, recipient, amount, currency, date, description) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transactionAddress = generateRandomAddress(); // Generate a random address
    console.log("Generated Transaction Address:", transactionAddress); // Debugging line
    transactions.push({ method, details, recipient, amount, currency, date, description, transactionAddress });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactions();
}

function updateTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transactionContainer = document.querySelector('.Transactions');

    if (transactionContainer) {
        transactionContainer.innerHTML = '';

        transactions.forEach((transaction, index) => {
            const transactionElement = document.createElement('div');
            transactionElement.className = 'transaction';
            transactionElement.innerHTML = `
                <h3>Transaction: ${index + 1}</h3>
                <h3>Stable-coin: ${index * 0.2435}
                <h4>Transaction address: ${index * 69878394}</h4>
                <p><strong>Amount:</strong> ${transaction.amount} ${transaction.currency}</p>
                <p><strong>Recipient:</strong> ${transaction.recipient}</p>
                <p><strong>Payment Method:</strong> ${transaction.method}</p>
                ${transaction.method === 'e-wallet' ? `<p><strong>E-Wallet:</strong> ${transaction.details.eWallet}</p>` : ''}
                ${transaction.method === 'crypto' ? `<p><strong>Crypto Address:</strong> ${transaction.details.cryptoAddress}</p><p><strong>Crypto Type:</strong> ${transaction.details.cryptoType}</p>` : ''}
                <p><strong>Date:</strong> ${transaction.date}</p>
                <p><strong>Description:</strong> ${transaction.description}</p>
                <button class="btn btn-danger delete-button" data-index="${index}">Delete</button>
            `;
            transactionContainer.appendChild(transactionElement);
        });

        // Add event listener for delete buttons
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteTransaction(index);
            });
        });
    }
}

function deleteTransaction(index) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactions();
}

// Initial call to updateTransactions to display any existing transactions
updateTransactions();

function displayMessage(message) {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.innerHTML = `<div class="alert alert-info" role="alert">${message}</div>`;
    }
}


