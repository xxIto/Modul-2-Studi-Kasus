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
// Array 'products' menyimpan data produk, termasuk id, nama, kondisi, lokasi, harga, dan gambar produk.

let cart = JSON.parse(localStorage.getItem("cart")) || [];
// Mengambil data keranjang dari localStorage (jika ada). Jika tidak ada data tersimpan, keranjang diinisialisasi sebagai array kosong.

function filterProducts() {
  const searchQuery = document.getElementById("search").value.toLowerCase();
  const conditionFilter = document.getElementById("condition-filter").value;
  // Mengambil nilai dari input pencarian dan filter kondisi yang dimasukkan oleh pengguna.

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery);
    const matchesCondition =
      conditionFilter === "" || product.condition === conditionFilter;
    // Melakukan pencarian berdasarkan nama produk dan filter berdasarkan kondisi (bekas, refurbished, baru).

    return matchesSearch && matchesCondition;
  });

  renderProducts(filteredProducts);
  // Memanggil fungsi renderProducts untuk menampilkan hasil produk yang sudah difilter.
}

function renderProducts(productList) {
  const productContainer = document.getElementById("product-list");
  productContainer.innerHTML = "";
  // Membersihkan elemen HTML sebelum menampilkan produk baru.

  if (productList.length === 0) {
    productContainer.innerHTML = "<p>Produk tidak ditemukan.</p>";
    // Menampilkan pesan jika tidak ada produk yang sesuai dengan hasil pencarian atau filter.
    return;
  }

  productList.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product");
    // Membuat elemen div baru untuk setiap produk.

    productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Kondisi: ${product.condition}</p>
        <p>Lokasi: ${product.location}</p>
        <p>Harga: Rp ${product.price.toLocaleString()}</p>
        <button onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
      `;
    // Menambahkan konten HTML untuk menampilkan gambar produk, nama, kondisi, lokasi, harga, dan tombol untuk menambahkan ke keranjang.

    productContainer.appendChild(productElement);
    // Menambahkan elemen produk ke dalam kontainer produk di halaman.
  });
}

function renderCart() {
  const cartContainer = document.getElementById("cart-list");
  cartContainer.innerHTML = "";
  // Membersihkan elemen HTML sebelum menampilkan item keranjang.

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Keranjang kosong</p>";
    // Menampilkan pesan jika keranjang kosong.
  } else {
    cart.forEach((item, index) => {
      const cartElement = document.createElement("div");
      cartElement.classList.add("cart-item");
      // Membuat elemen div untuk setiap item di keranjang.

      cartElement.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>Kondisi: ${item.condition}</p>
          <p>Lokasi: ${item.location}</p>
          <p>Harga: Rp ${item.price.toLocaleString()}</p>
          <button onclick="confirmRemoveFromCart(${index})">Hapus</button>
        `;
      // Menambahkan konten HTML untuk menampilkan gambar, nama, kondisi, lokasi, harga produk di keranjang, dan tombol hapus.

      cartContainer.appendChild(cartElement);
      // Menambahkan elemen item keranjang ke dalam kontainer keranjang di halaman.
    });
  }

  document.getElementById("cart-count").textContent = cart.length;
  // Memperbarui jumlah item di ikon keranjang.

  saveCartToLocalStorage();
  // Menyimpan data keranjang ke localStorage setelah perubahan.
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  // Mencari produk berdasarkan id dari daftar produk.

  if (product) {
    cart.push(product);
    renderCart();
    // Menambahkan produk ke dalam keranjang dan merender ulang keranjang.

    Swal.fire({
      title: "Berhasil!",
      text: `${product.name} telah ditambahkan ke keranjang!`,
      icon: "success",
      confirmButtonText: "OK",
    });
    // Menampilkan dialog box menggunakan SweetAlert2 saat produk berhasil ditambahkan ke keranjang.
  }
}

function confirmRemoveFromCart(index) {
  const removedItem = cart[index];
  // Mendapatkan item dari keranjang berdasarkan index.

  Swal.fire({
    title: "Apakah Anda yakin?",
    text: `Anda akan menghapus ${removedItem.name} dari keranjang.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Tidak, batalkan",
  }).then((result) => {
    if (result.isConfirmed) {
      // Jika pengguna mengonfirmasi, panggil fungsi untuk menghapus item dari keranjang.
      removeFromCart(index);
      Swal.fire(
        "Dihapus!",
        `${removedItem.name} telah dihapus dari keranjang.`,
        "success"
      );
    }
  });
  // Menampilkan konfirmasi untuk menghapus item dari keranjang menggunakan SweetAlert2.
}

function removeFromCart(index) {
  cart.splice(index, 1);
  // Menghapus item dari keranjang berdasarkan index.

  renderCart();
  // Merender ulang keranjang setelah item dihapus.
}

function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
  // Menyimpan data keranjang ke dalam localStorage untuk keperluan nanti.
}

function openCart() {
  document.getElementById("cart-modal").style.display = "block";
  // Menampilkan modal keranjang di halaman.
}

function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
  // Menutup modal keranjang.
}

document.getElementById("search").addEventListener("input", filterProducts);
document
  .getElementById("condition-filter")
  .addEventListener("change", filterProducts);
// Menambahkan event listener untuk melakukan pencarian dan filter produk berdasarkan input pengguna.

window.onload = function () {
  renderProducts(products);
  renderCart();
  // Saat halaman dimuat, tampilkan produk dan keranjang yang ada.
};
