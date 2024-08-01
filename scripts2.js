document.getElementById('pay-button').addEventListener('click', function() {
    const eWallet = document.getElementById('e-wallet').value;
    const ticketPrice = document.getElementById('ticket-price').value;

    alert(`Redirecting to ${eWallet} for payment of ${ticketPrice}`);

    // Here, you would normally redirect to the e-wallet's payment page.
    // This is just a simulation.
    simulateEwalletPayment(eWallet, ticketPrice);
});

function simulateEwalletPayment(eWallet, amount) {
    // Simulate payment processing delay
    setTimeout(() => {
        alert(`Payment of ${amount} using ${eWallet} was successful!`);
        // Update UI, send confirmation, etc.
    }, 2000);
}
