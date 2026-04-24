// ============================================================
// CHECKOUT.JS
// ============================================================

// Auth check
(async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) window.location.href = 'index.html';
})();

function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================================
// LOAD CHECKOUT
// ============================================================
async function loadCheckout() {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const { data, error } = await supabase
    .from('shopping_list')
    .select('*')
    .eq('user_id', user.id);

  const bill = document.getElementById('bill');

  if (!data || data.length === 0) {
    bill.innerHTML = `<div class="empty-state"><div class="es-icon">🛒</div><p>Keranjang kosong</p></div>`;
    document.getElementById('payCard').style.display = 'none';
    return;
  }

  let total = 0;
  bill.innerHTML = data.map(item => {
    const qty    = item.quantity || 1;
    const subtotal = item.price * qty;
    total += subtotal;
    return `
      <div class="checkout-bill-item">
        <span>${item.name} <span style="color:var(--text-muted);">(${qty}x)</span></span>
        <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
      </div>
    `;
  }).join('');

  document.getElementById('totalBill').textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// ============================================================
// PAY
// ============================================================
async function pay() {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const { data: cart } = await supabase
    .from('shopping_list')
    .select('*')
    .eq('user_id', user.id);

  if (!cart || cart.length === 0) {
    showToast('⚠️ Keranjang kosong!', 'warning');
    return;
  }

  const payBtn = document.querySelector('.app-btn-primary');
  if (payBtn) {
    payBtn.disabled = true;
    payBtn.textContent = '⏳ Memproses...';
  }

  const transactionId = 'TRX-' + Date.now();

  for (let item of cart) {
    const qty = item.quantity || 1;

    // Save to transaction history
    const { error } = await supabase.from('transaction_history').insert([{
      name: item.name,
      price: item.price,
      quantity: qty,
      user_id: user.id,
      transaction_id: transactionId,
    }]);

    if (error) {
      showToast('❌ Gagal menyimpan history: ' + error.message, 'warning');
      return;
    }

    // Update user stock
    const { data: existingStock } = await supabase
      .from('user_stock')
      .select('*')
      .eq('user_id', user.id)
      .eq('name', item.name);

    if (existingStock && existingStock.length > 0) {
      await supabase.from('user_stock')
        .update({ stock: existingStock[0].stock + qty })
        .eq('id', existingStock[0].id);
    } else {
      await supabase.from('user_stock')
        .insert([{ name: item.name, stock: qty, user_id: user.id }]);
    }
  }

  // Clear cart
  await supabase.from('shopping_list').delete().eq('user_id', user.id);

  // Show success
  document.getElementById('payCard').style.display = 'none';
  document.getElementById('struk').style.display = 'block';

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 2500);
}

// ============================================================
// INIT
// ============================================================
loadCheckout();
