const products = [
  {
    id: 1,
    name: "Smartphone",
    condition: "bekas",
    location: "Jakarta",
    price: 2000000,
    image: "/assets/images/smartphone.jpg",
  },
  {
    id: 2,
    name: "Laptop",
    condition: "refurbished",
    location: "Bandung",
    price: 4500000,
    image: "/assets/images/laptop.jpg",
  },
  {
    id: 3,
    name: "Smartwatch",
    condition: "baru",
    location: "Surabaya",
    price: 1000000,
    image: "/assets/images/smartwatch.jpg",
  },
  {
    id: 4,
    name: "Headphone",
    condition: "bekas",
    location: "Jakarta",
    price: 500000,
    image: "/assets/images/headphone.jpg",
  },
  {
    id: 5,
    name: "Tablet",
    condition: "refurbished",
    location: "Bandung",
    price: 3000000,
    image: "/assets/images/tablet.jpg",
  },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Fungsi untuk menangani pencarian dan filter
function filterProducts() {
  const searchQuery = document.getElementById("search").value.toLowerCase();
  const conditionFilter = document.getElementById("condition-filter").value;

  // Filter produk berdasarkan pencarian dan kondisi
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery);
    const matchesCondition =
      conditionFilter === "" || product.condition === conditionFilter;

    return matchesSearch && matchesCondition;
  });

  renderProducts(filteredProducts);
}

// Render Produk ke Halaman
function renderProducts(productList) {
  const productContainer = document.getElementById("product-list");
  productContainer.innerHTML = "";

  if (productList.length === 0) {
    productContainer.innerHTML = "<p>Produk tidak ditemukan.</p>"; // Tampilkan pesan jika tidak ada produk yang cocok
    return;
  }

  productList.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product");
    productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Kondisi: ${product.condition}</p>
        <p>Lokasi: ${product.location}</p>
        <p>Harga: Rp ${product.price.toLocaleString()}</p>
        <button onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
      `;
    productContainer.appendChild(productElement);
  });
}

// Render Keranjang Belanja
function renderCart() {
  const cartContainer = document.getElementById("cart-list");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Keranjang kosong</p>"; // Tampilkan teks jika keranjang kosong
  } else {
    cart.forEach((item, index) => {
      const cartElement = document.createElement("div");
      cartElement.classList.add("cart-item");
      cartElement.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>Kondisi: ${item.condition}</p>
          <p>Lokasi: ${item.location}</p>
          <p>Harga: Rp ${item.price.toLocaleString()}</p>
          <button onclick="confirmRemoveFromCart(${index})">Hapus</button>
        `;
      cartContainer.appendChild(cartElement);
    });
  }

  // Update jumlah barang di ikon keranjang
  document.getElementById("cart-count").textContent = cart.length;
  saveCartToLocalStorage();
}

// Tambah Produk ke Keranjang
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (product) {
    cart.push(product);
    renderCart();
    // Tampilkan dialog box saat barang ditambahkan ke keranjang
    Swal.fire({
      title: "Berhasil!",
      text: `${product.name} telah ditambahkan ke keranjang!`,
      icon: "success",
      confirmButtonText: "OK",
    });
  }
}

// Konfirmasi Penghapusan Produk dari Keranjang
function confirmRemoveFromCart(index) {
  const removedItem = cart[index];

  // Menggunakan SweetAlert2 untuk konfirmasi penghapusan
  Swal.fire({
    title: "Apakah Anda yakin?",
    text: `Anda akan menghapus ${removedItem.name} dari keranjang.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Tidak, batalkan",
  }).then((result) => {
    if (result.isConfirmed) {
      // Jika pengguna menekan tombol "Ya", hapus item
      removeFromCart(index);
      Swal.fire(
        "Dihapus!",
        `${removedItem.name} telah dihapus dari keranjang.`,
        "success"
      );
    }
  });
}

// Hapus Produk dari Keranjang
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// Simpan Keranjang ke LocalStorage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Tampilkan Modal Keranjang
function openCart() {
  document.getElementById("cart-modal").style.display = "block";
}

// Tutup Modal Keranjang
function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

// Event listener untuk pencarian dan filter
document.getElementById("search").addEventListener("input", filterProducts);
document
  .getElementById("condition-filter")
  .addEventListener("change", filterProducts);

// Load Produk dan Keranjang
window.onload = function () {
  renderProducts(products);
  renderCart();
};
