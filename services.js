

function loadJSON(callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.overrideMimeType("application/json");
  xhttp.open('GET', 'services.json', true); 
  xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
          callback(JSON.parse(xhttp.responseText));
      }
  };
  xhttp.send(null);
}

function addItemToCart(itemName, itemPrice) {
  var cartItem = document.createElement("tr");
  cartItem.innerHTML = `
      <td>${itemName}</td>
      <td class="price">${itemPrice.toFixed(2)}</td>
      <td><button class="button" onclick="removeFromCart(this)">Remove</button></td>
  `;

  var cartContainer = document.getElementById("cart-container");
  cartContainer.appendChild(cartItem);

  calculateTotal();
}


function addServiceToCart(serviceIndex) {
  loadJSON(function(data) {
      var service = data.servicesList[serviceIndex];
      if (service) {
          addItemToCart(service.sname, service.price);
      }
  });
}

function removeFromCart(button) {
  var cartItem = button.parentNode.parentNode;
  cartItem.remove();
  calculateTotal();
}

function calculateTotal() {
  var cartItems = document.getElementsByClassName("price");
  var total = 0;

  for (var i = 0; i < cartItems.length; i++) {
      var itemPrice = parseInt(cartItems[i].innerText);
      if (!isNaN(itemPrice)) {
          total += itemPrice;
      }

  }

  document.getElementById("total-price").innerHTML = "Total: AED" + (total.toFixed(2)-320);

  localStorage.setItem("totalPrice", (total - 320).toFixed(2));

  // Redirect to the checkout page
  // window.location.href = "checkout.html";
}

loadJSON(function(data) {
  var servicesContainer = document.getElementById("services-container");

  for (var i = 0; i < data.servicesList.length; i++) {
      var service = data.servicesList[i];
      var row = document.createElement("tr");
      row.innerHTML = `
          <td>${service.sname}</td>
          <td class="price">${service.price.toFixed(2)}</td>
          <td><button class="button" onclick="addServiceToCart(${i})">Add</button></td>
      `;
      servicesContainer.appendChild(row);
  }
});