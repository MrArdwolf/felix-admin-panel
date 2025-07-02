export const customerEmail = (customer) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .email-container { 
                    width: 90%; 
                    font-family: Arial, sans-serif; 
                    color: #2F2E2E; 
                }
                .greeting { font-size: 17px; }
            </style>
        </head>
        <body class="email-container">
            <h2>Hejsan ${customer.name},</h2>
            <p class="greeting">Tack för att du anförtror din cykel med beskrivningen: ${customer.bikeDescription} till oss.</p>
            <p class="greeting">Vi hör av oss så fort vi kan med ett prisförslag.</p>
            <br>
            <div>
                <p class="greeting">Mvh,</p>
                <p class="greeting">Felix Cykelmeck</p>
            </div>
        </body>
        </html>
    `;
}

export const adminEmail = (customer) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .email-container { 
                    width: 90%; 
                    font-family: Arial, sans-serif; 
                    color: #2F2E2E; 
                }
                .greeting { font-size: 17px; }
            </style>
        </head>
        <body class="email-container">
            <h2>Ny inlämnad cykel</h2>
            <p class="greeting">En cykel har lämnats in med beskrivningen: ${customer.bikeDescription}</p>
        </body>
        </html>
    `;
}

export const receiptEmail = (receipt) => {
    const partsList = receipt.parts.map(part => `<li>${part.name} - ${part.price} kr</li>`).join('');
    const totalCost = receipt.parts.reduce((total, part) => total + part.price, 0);


    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .email-container { 
                    width: 90%; 
                    font-family: Arial, sans-serif; 
                    color: #2F2E2E; 
                }
                .receipt-details { margin-top: 20px; }
            </style>
        </head>
        <body class="email-container">
            <h2>Kvitto för cykelreparation</h2>
            <div class="receipt-details">
                <p><strong>Kundnamn:</strong> ${receipt.name}</p>
                <p><strong>Cykelbeskrivning:</strong> ${receipt.bikeDescription}</p>
                <p><strong>Delar:</strong></p>
                <ul>
                    ${partsList}
                </ul>
                <p><strong>Total kostnad:</strong> ${totalCost} kr</p>
            </div>
        </body>
        </html>
    `;
}