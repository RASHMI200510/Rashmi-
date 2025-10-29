const nameInput = document.getElementById("name");
const brandInput = document.getElementById("brand");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const tableBody = document.querySelector("#inventoryTable tbody");
const searchInput = document.getElementById("search");
const clearAllBtn = document.getElementById("clearAll");

let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let editIndex = null;

// Display table initially
renderTable();

// Add Product
addBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const brand = brandInput.value.trim();
  const quantity = quantityInput.value;
  const price = priceInput.value;

  if (!name || !brand || !quantity || !price) {
    alert("Please fill all fields!");
    return;
  }

  const product = { name, brand, quantity, price };
  inventory.push(product);
  saveData();
  renderTable();
  clearForm();
});

// Render Table
function renderTable(filtered = inventory) {
  tableBody.innerHTML = "";
  filtered.forEach((item, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.brand}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editItem(${index})">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteItem(${index})">Delete</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// Delete Item
function deleteItem(index) {
  if (confirm("Are you sure you want to delete this product?")) {
    inventory.splice(index, 1);
    saveData();
    renderTable();
  }
}

// Edit Item
function editItem(index) {
  const item = inventory[index];
  nameInput.value = item.name;
  brandInput.value = item.brand;
  quantityInput.value = item.quantity;
  priceInput.value = item.price;

  addBtn.style.display = "none";
  updateBtn.style.display = "inline-block";
  editIndex = index;
}

// Update Product
updateBtn.addEventListener("click", () => {
  inventory[editIndex] = {
    name: nameInput.value,
    brand: brandInput.value,
    quantity: quantityInput.value,
    price: priceInput.value,
  };
  saveData();
  renderTable();
  clearForm();
  updateBtn.style.display = "none";
  addBtn.style.display = "inline-block";
});

// Search Filter
searchInput.addEventListener("keyup", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = inventory.filter(item => item.name.toLowerCase().includes(keyword));
  renderTable(filtered);
});

// Clear All
clearAllBtn.addEventListener("click", () => {
  if (confirm("Clear all inventory items?")) {
    inventory = [];
    saveData();
    renderTable();
  }
});

// Save to Local Storage
function saveData() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

// Clear Form
function clearForm() {
  nameInput.value = "";
  brandInput.value = "";
  quantityInput.value = "";
  priceInput.value = "";
}
