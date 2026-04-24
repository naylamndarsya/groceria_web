// ============================================================
// GROCERIA — APP.JS
// All features: Shopping List, Stock, Budget, Recommendation,
// Auto List, Mode Hemat, Notifikasi, Analisis
// ============================================================

// ============================================================
// AUTH CHECK
// ============================================================
(async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) window.location.href = 'index.html';
})();

// ============================================================
// PRODUCT DATA
// ============================================================
const products = [
  // 🏠 POKOK
  { name: "Beras", price: 150000, icon: "🌾", category: "pokok" },
  { name: "Telur", price: 30000, icon: "🥚", category: "pokok" },
  { name: "Minyak", price: 57000, icon: "🫙", category: "pokok" },
  { name: "Gula", price: 14000, icon: "🍬", category: "pokok" },
  { name: "Garam", price: 4000, icon: "🧂", category: "pokok" },

  // 🍜 MAKANAN
  { name: "Mie Instan", price: 3000, icon: "🍜", category: "makanan" },
  { name: "Roti", price: 16000, icon: "🍞", category: "makanan" },
  { name: "Selai", price: 23500, icon: "🍓", category: "makanan" },
  { name: "Ceres", price: 16000, icon: "🍫", category: "makanan" },
  { name: "Margarin", price: 10000, icon: "🧈", category: "makanan" },
  { name: "Sereal", price: 40000, icon: "🥣", category: "makanan" },
  { name: "Biskuit", price: 12000, icon: "🍪", category: "makanan" },
  { name: "Keripik", price: 10000, icon: "🍟", category: "makanan" },
  { name: "Nugget", price: 45000, icon: "🍗", category: "makanan" },
  { name: "Sosis", price: 30000, icon: "🌭", category: "makanan" },

  // 🥤 MINUMAN
  { name: "Susu", price: 18000, icon: "🥛", category: "minuman" },
  { name: "Kopi", price: 12000, icon: "☕", category: "minuman" },
  { name: "Teh", price: 8000, icon: "🍵", category: "minuman" },
  { name: "Air Mineral 600ml", price: 3000, icon: "💧", category: "minuman" },
  { name: "Air Mineral 1L", price: 6000, icon: "💧", category: "minuman" },
  { name: "Air Mineral Galon", price: 21500, icon: "💧", category: "minuman" },
  { name: "Minuman Isotonik", price: 8000, icon: "🥤", category: "minuman" },
  { name: "Jus Kemasan", price: 10000, icon: "🧃", category: "minuman" },
  { name: "Soda", price: 9000, icon: "🥤", category: "minuman" },

  // 🧼 KEBERSIHAN
  { name: "Detergen", price: 20000, icon: "🧴", category: "kebersihan" },
  { name: "Sabun", price: 8000, icon: "🧼", category: "kebersihan" },
  { name: "Sampo", price: 37000, icon: "🧴", category: "kebersihan" },
  { name: "Pasta Gigi", price: 15000, icon: "🪥", category: "kebersihan" },
  { name: "Sikat Gigi", price: 12000, icon: "🪥", category: "kebersihan" },
  { name: "Tisu", price: 15000, icon: "🧻", category: "kebersihan" },
  { name: "Pembersih Lantai", price: 18000, icon: "🧼", category: "kebersihan" },
  { name: "Pembersih Kaca", price: 17000, icon: "🪟", category: "kebersihan" },

  // 💆 PERAWATAN
  { name: "Parfum", price: 55000, icon: "🌸", category: "perawatan" },
  { name: "Deodorant", price: 30000, icon: "🧴", category: "perawatan" },
  { name: "Pomade", price: 35000, icon: "💇", category: "perawatan" },
  { name: "Sabun Cuci Muka", price: 50000, icon: "🫧", category: "perawatan" },
  { name: "Sunscreen", price: 48000, icon: "🌞", category: "perawatan" },
  { name: "Hand Body", price: 35000, icon: "🧴", category: "perawatan" },

  // 🍳 BUMBU
  { name: "Kecap", price: 8000, icon: "🫙", category: "bumbu" },
  { name: "Saos", price: 7000, icon: "🍅", category: "bumbu" },
  { name: "Sambal", price: 9000, icon: "🌶️", category: "bumbu" },
  { name: "Kaldu", price: 6000, icon: "🍲", category: "bumbu" },

  // 👶 BAYI
  { name: "Popok Bayi", price: 150000, icon: "👶", category: "bayi" },
  { name: "Susu Bayi", price: 85000, icon: "🍼", category: "bayi" },
  { name: "Minyak Telon", price: 20000, icon: "🧴", category: "bayi" }
];

// ============================================================
// HELPER — GET USER
// ============================================================
async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ============================================================
// HELPER — TOAST
// ============================================================
function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================================
// FORMAT CURRENCY
// ============================================================
function fmt(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

// ============================================================
// RENDER PRODUCTS
// ============================================================
function renderProducts(filter = '') {
  const container = document.getElementById('products');
  if (!container) return;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="es-icon">🔍</div><p>Produk tidak ditemukan</p></div>';
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="p-icon">${p.icon}</div>
      <h4>${p.name}</h4>
      <div class="p-price">${fmt(p.price)}</div>
      <button class="btn-add" onclick="addToCart('${p.name}', ${p.price})">+ Keranjang</button>
    </div>
  `).join('');
}

// ============================================================
// FETCH & RENDER SHOPPING LIST
// ============================================================
async function fetchItems() {
  const user = await getUser();
  const { data } = await supabase
    .from('shopping_list')
    .select('*')
    .eq('user_id', user.id);

  const container = document.getElementById('shoppingList');
  const totalEl   = document.getElementById('totalBelanja');
  const countEl   = document.getElementById('cartCount');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="es-icon">🛒</div><p>Keranjang masih kosong</p></div>`;
    if (totalEl) totalEl.textContent = 'Rp 0';
    if (countEl) countEl.textContent = '0';
    updateBudget(0);
    return;
  }

  let total = 0;
  container.innerHTML = data.map(item => {
    const qty = item.quantity || 1;
    const sub = item.price * qty;
    total += sub;
    return `
      <div class="cart-item">
        <span class="cart-item-name">${item.name}</span>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="decrease('${item.id}')">−</button>
          <span class="qty-display">${qty}</span>
          <button class="qty-btn" onclick="increase('${item.id}')">+</button>
          <button class="del-btn" onclick="deleteItem('${item.id}')">✕</button>
        </div>
        <span class="cart-item-price">${fmt(sub)}</span>
      </div>
    `;
  }).join('');

  if (totalEl) totalEl.textContent = fmt(total);
  if (countEl) countEl.textContent = data.length;
  updateBudget(total);
  loadSmartRecommendation(data);
  loadAnalisis();
}

// ============================================================
// CART ACTIONS
// ============================================================
async function addToCart(name, price) {
  const user = await getUser();

  const { data: existing } = await supabase
    .from('shopping_list')
    .select('*')
    .eq('user_id', user.id)
    .eq('name', name);

  if (existing && existing.length > 0) {
    const item = existing[0];
    await supabase.from('shopping_list')
      .update({ quantity: (item.quantity || 1) + 1 })
      .eq('id', item.id);
    showToast(`✅ ${name} +1 ditambahkan`, 'success');
  } else {
    await supabase.from('shopping_list')
      .insert([{ name, price, quantity: 1, user_id: user.id }]);
    showToast(`✅ ${name} ditambahkan ke keranjang`, 'success');
  }

  fetchItems();
}

async function increase(id) {
  const { data } = await supabase.from('shopping_list').select('*').eq('id', id).single();
  await supabase.from('shopping_list').update({ quantity: data.quantity + 1 }).eq('id', id);
  fetchItems();
}

async function decrease(id) {
  const { data } = await supabase.from('shopping_list').select('*').eq('id', id).single();
  if (data.quantity <= 1) {
    await deleteItem(id);
  } else {
    await supabase.from('shopping_list').update({ quantity: data.quantity - 1 }).eq('id', id);
    fetchItems();
  }
}

async function deleteItem(id) {
  await supabase.from('shopping_list').delete().eq('id', id);
  showToast('🗑️ Item dihapus dari keranjang', 'warning');
  fetchItems();
}

// ============================================================
// BUDGET TRACKER
// ============================================================
function setBudget() {
  const val = parseInt(document.getElementById('budgetInput').value);
  if (!val || val <= 0) {
    showToast('⚠️ Masukkan jumlah budget yang valid!', 'warning');
    return;
  }
  localStorage.setItem('groceria_budget', val);
  showToast('💰 Budget berhasil disimpan!', 'success');
  fetchItems();
}

async function updateBudget(used = 0) {
  const budget  = Number(localStorage.getItem('groceria_budget')) || 0;
  const left    = budget - used;
  const safe    = Math.round(budget * 0.8);
  const percent = budget ? Math.min((used / budget) * 100, 100) : 0;

  const ids = ['budgetTotal', 'budgetUsed', 'budgetLeft', 'budgetSafe'];
  const vals = [budget, used, left, safe];
  ids.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.textContent = Number(vals[i]).toLocaleString('id-ID');
  });

  const bar = document.getElementById('progressBar');
  if (bar) {
    bar.style.width = percent + '%';
    bar.classList.remove('warn', 'danger');
    if (percent >= 100) bar.classList.add('danger');
    else if (percent >= 80) bar.classList.add('warn');
  }

  const pct = document.getElementById('budgetPercentText');
  if (pct) pct.textContent = `${Math.round(percent)}% dari budget terpakai`;

  // Mode hemat detection
  const banner = document.getElementById('modeHematBanner');
  if (banner) {
    if (budget > 0 && percent >= 80) {
      banner.style.display = 'flex';
      const msg = document.getElementById('modeHematMsg');
      if (msg) {
        if (percent >= 100) {
          msg.textContent = `Budget sudah habis! Kamu telah melampaui budget sebesar ${fmt(Math.abs(left))}.`;
        } else {
          msg.textContent = `Kamu sudah menggunakan ${Math.round(percent)}% budget. Sisa ${fmt(left)} — pertimbangkan untuk berhemat.`;
        }
      }
    } else {
      banner.style.display = 'none';
    }
  }
}

// ============================================================
// STOCK MANAGEMENT
// ============================================================
async function loadUserStock() {
  const user = await getUser();
  const { data } = await supabase
    .from('user_stock')
    .select('*')
    .eq('user_id', user.id);

  const list = document.getElementById('userStockList');
  if (!list) return;

  const activeItems = (data || []).filter(item => item.stock > 0);
  const lowItems    = activeItems.filter(item => item.stock <= 2);

  // Notifikasi stok rendah
  const notifBanner = document.getElementById('notifStokBanner');
  if (notifBanner && lowItems.length > 0) {
    notifBanner.style.display = 'flex';
    const notifMsg = document.getElementById('notifStokMsg');
    if (notifMsg) {
      notifMsg.textContent = `Stok hampir habis: ${lowItems.map(i => i.name).join(', ')}. Segera tambahkan ke keranjang!`;
    }
  } else if (notifBanner) {
    notifBanner.style.display = 'none';
  }

  if (activeItems.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="es-icon">📦</div><p>Belum ada data stok</p></div>`;
    return;
  }

  list.innerHTML = activeItems.map(item => `
    <div class="stock-item">
      <span class="stock-name">${item.name}</span>
      <span class="stock-count ${item.stock <= 2 ? 'low' : ''}">${item.stock} pcs</span>
      <button class="app-btn app-btn-sm app-btn-outline" style="margin-left:8px;" onclick="useStockItem('${item.id}')">- Pakai</button>
    </div>
  `).join('');
}

async function useStockItem(id) {
  const { data } = await supabase.from('user_stock').select('*').eq('id', id).single();
  if (!data || data.stock <= 0) return;

  await supabase.from('user_stock').update({ stock: data.stock - 1 }).eq('id', id);
  showToast(`📦 Stok ${data.name} dikurangi`, 'success');
  loadUserStock();
}

// ============================================================
// AUTO SHOPPING LIST
// ============================================================
async function generateAutoList() {
  const user = await getUser();

  // Get low stock items
  const { data: stockData } = await supabase
    .from('user_stock')
    .select('*')
    .eq('user_id', user.id);

  const lowStock = (stockData || []).filter(item => item.stock <= 2);

  if (lowStock.length === 0) {
    showToast('✅ Semua stok masih mencukupi!', 'success');
    return;
  }

  // Add low stock items to cart
  let added = 0;
  for (const item of lowStock) {
    const product = products.find(p => p.name.toLowerCase() === item.name.toLowerCase());
    if (product) {
      await addToCart(product.name, product.price);
      added++;
    }
  }

  showToast(`🔄 Auto List: ${added} item ditambahkan berdasarkan stok rendah!`, 'success');
}

// ============================================================
// SMART RECOMMENDATION
// ============================================================
async function loadSmartRecommendation(cartItems = []) {
  const user = await getUser();
  const { data: history } = await supabase
    .from('transaction_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30);

  const container = document.getElementById('rekomendasiList');
  if (!container) return;

  const cartNames  = (cartItems || []).map(i => i.name.toLowerCase());
  const histNames  = {};

  (history || []).forEach(item => {
    const n = item.name.toLowerCase();
    histNames[n] = (histNames[n] || 0) + (item.quantity || 1);
  });

  // Rule-based recommendation
  const recommendations = [];

  // 1. Most bought items not in cart
  const sorted = Object.entries(histNames)
    .sort(([,a],[,b]) => b - a)
    .slice(0, 5);

  sorted.forEach(([name, count]) => {
    if (!cartNames.includes(name)) {
      const product = products.find(p => p.name.toLowerCase() === name);
      if (product) {
        recommendations.push({
          name: product.name,
          icon: product.icon,
          reason: `Sering dibeli (${count}x)`,
        });
      }
    }
  });

  // 2. Essential items not in cart
  const essentials = ['Beras', 'Telur', 'Minyak', 'Gula', 'Garam'];
  essentials.forEach(name => {
    if (!cartNames.includes(name.toLowerCase()) &&
        !recommendations.find(r => r.name === name)) {
      const product = products.find(p => p.name === name);
      if (product) {
        recommendations.push({
          name: product.name,
          icon: product.icon,
          reason: 'Kebutuhan pokok harian',
        });
      }
    }
  });

  const shown = recommendations.slice(0, 5);

  if (shown.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="es-icon">🤖</div><p>Tidak ada rekomendasi saat ini</p></div>`;
    return;
  }

  container.innerHTML = shown.map(r => `
    <div class="rekom-item">
      <div class="ri-icon">${r.icon}</div>
      <div class="ri-text">
        <div class="ri-name">${r.name}</div>
        <div class="ri-reason">${r.reason}</div>
      </div>
      <button class="app-btn app-btn-sm app-btn-primary" onclick="addToCart('${r.name}', ${products.find(p=>p.name===r.name)?.price || 0})">+ Tambah</button>
    </div>
  `).join('');
}

// ============================================================
// ANALISIS RIWAYAT BELANJA
// ============================================================
async function loadAnalisis() {
  const user = await getUser();
  const { data } = await supabase
    .from('transaction_history')
    .select('*')
    .eq('user_id', user.id);

  const container = document.getElementById('analisisSection');
  if (!container || !data) return;

  if (data.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="es-icon">📊</div><p>Belum ada data untuk dianalisis</p></div>`;
    return;
  }

  const totalSpent  = data.reduce((s, i) => s + (i.price * (i.quantity || 1)), 0);
  const totalItems  = data.reduce((s, i) => s + (i.quantity || 1), 0);
  const uniqueItems = [...new Set(data.map(i => i.name))].length;

  // Most bought
  const freq = {};
  data.forEach(i => { freq[i.name] = (freq[i.name] || 0) + (i.quantity || 1); });
  const topItem = Object.entries(freq).sort(([,a],[,b]) => b-a)[0];

  container.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="background:var(--green-pale);border-radius:var(--radius-sm);padding:14px;text-align:center;">
        <div style="font-size:22px;font-weight:700;color:var(--green-primary);">${fmt(totalSpent)}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">Total Pengeluaran</div>
      </div>
      <div style="background:var(--peach-light);border-radius:var(--radius-sm);padding:14px;text-align:center;">
        <div style="font-size:22px;font-weight:700;color:#b5541a;">${totalItems}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">Total Item Dibeli</div>
      </div>
      <div style="background:#e8f4e8;border-radius:var(--radius-sm);padding:14px;text-align:center;">
        <div style="font-size:22px;font-weight:700;color:#3a6b3a;">${uniqueItems}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">Jenis Produk</div>
      </div>
      <div style="background:#f0ecfa;border-radius:var(--radius-sm);padding:14px;text-align:center;">
        <div style="font-size:16px;font-weight:700;color:#5e4a8a;">${topItem ? topItem[0] : '-'}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">Paling Sering Dibeli</div>
      </div>
    </div>
    <button class="app-btn app-btn-outline app-btn-full" onclick="goHistory()">📜 Lihat Riwayat Lengkap</button>
  `;
}

// ============================================================
// NAVIGATION
// ============================================================
function goCheckout() {
  window.location.href = 'checkout.html';
}

function goHistory() {
  window.location.href = 'history.html';
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

// ============================================================
// SEARCH
// ============================================================
const searchInput = document.getElementById('search');
if (searchInput) {
  searchInput.addEventListener('input', e => renderProducts(e.target.value));
}

// ============================================================
// INIT
// ============================================================
renderProducts();
fetchItems();
loadUserStock();
