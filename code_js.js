let order = [];

function addItem(itemName, pricePerKg) {
    const quantity = prompt(`Enter quantity (in kg) for ${itemName}`, "0.5");
    if (quantity && parseFloat(quantity) <= 15) {
        order.push({ itemName, pricePerKg, quantity: parseFloat(quantity) });
        updateOrderSummary();
    } else {
        alert("Please enter a valid quantity (0.5kg to 15kg).");
    }
}

function updateOrderSummary() {
    const orderItemsDiv = document.getElementById("orderItems");
    orderItemsDiv.innerHTML = order.map(item =>
        `<p>${item.quantity} kg of ${item.itemName} - ₹${item.pricePerKg * item.quantity}</p>`
    ).join("");
    async function calculateTotal() {
        const apiKey = 'YOUR_API_KEY';
        const origin = '17.4960,78.6835'; // Jodimetla, Hyderabad
        const destination = '34.052235,-118.243683'; // Replace with customer's coordinates
        
        const url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
      
        try {
          const response = await fetch(url);
          const data = await response.json();
          const distance = data.rows[0].elements[0].distance.value; // distance in meters
      
          // Add any other logic to calculate total based on distance
          const ratePerMeter = 0.001; // Example rate
          const total = distance * ratePerMeter;
      
          console.log(`Total cost based on distance: $${total.toFixed(2)}`);
          return total;
        } catch (error) {
          console.error('Error:', error);
        }
      }

      async function geocodeAddress(address) {
        const apiKey = "YOUR_API_KEY";
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.results.length > 0) {
                return data.results[0].geometry.location; // { lat, lng }
            } else {
                alert("Invalid address! Please check and try again.");
                return null;
            }
        } catch (error) {
            console.error("Error geocoding address:", error);
        }
    }
}

function calculateTotal() {
    let total = order.reduce((sum, item) => sum + item.pricePerKg * item.quantity, 0);
    const location = prompt("Enter your location (in kilometers):", "1");
    if (location <= 1) {
        alert("Free shipping for your location.");
    } else if (location > 1 && location <= 20) {
        total += 20;
    } else {
        alert("Delivery not available for your location. Visit us instead.");
        return;
    }
    document.getElementById("totalCost").innerText = `Total Cost: ₹${total}`;
}

function proceedToPayment() {
    document.getElementById("payment").style.display = "block";
}

function sendOrder(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const location = document.getElementById("location").value;

    fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": "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"
        },
        body: JSON.stringify({
            to: [
                { email: email }, // Buyer's email
                { email: "malasrisheelam@gmail.com" } // Seller's email
            ],
            sender: { email: "malasrisheelam@gmail.com" },
            subject: "Order Confirmation",
            htmlContent: `
                <p>Thank you for ordering from Amma Chethi Ruchulu!</p>
                <p>Your order details:</p>
                ${order.map(item => `<p>${item.quantity} kg of ${item.itemName} - ₹${item.pricePerKg * item.quantity}</p>`).join("")}
                <p>//Payment method is Cash on delivery//</p>
                <p>Delivery Location: ${location}</p>
            `
        })
    })
    .then(response => {
        if (response.ok) alert("Order confirmation email sent to both buyer and seller!");
    })
    .catch(error => console.error("Error:", error));
}