// ============================================================
// HISTORY.JS — Riwayat & Analisis Belanja
// ============================================================

// Auth check
(async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) window.location.href = 'index.html';
})();

// ============================================================
// LOAD HISTORY
// ============================================================
async function loadHistory() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    window.location.href = 'index.html';
    return;
  }

  const userId = userData.user.id;

  const { data, error } = await supabase
    .from('transaction_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const list = document.getElementById('historyList');
  const summary = document.getElementById('summarySection');

  if (error || !data || data.length === 0) {
    if (list) list.innerHTML = `<div class="empty-state"><div class="es-icon">📜</div><p>Belum ada riwayat transaksi</p></div>`;
    if (summary) summary.innerHTML = `<div class="empty-state"><div class="es-icon">📊</div><p>Belum ada data untuk dianalisis</p></div>`;
    return;
  }

  // ============================================================
  // SUMMARY / ANALISIS
  // ============================================================
  const totalSpent = data.reduce((s, i) => s + (i.price * (i.quantity || 1)), 0);
  const totalItems = data.reduce((s, i) => s + (i.quantity || 1), 0);
  const uniqueItems = [...new Set(data.map(i => i.name))].length;

  // Frequency map
  const freq = {};
  data.forEach(i => { freq[i.name] = (freq[i.name] || 0) + (i.quantity || 1); });
  const topItems = Object.entries(freq).sort(([,a],[,b]) => b-a).slice(0, 3);

  // Group by transaction
  const grouped = {};
  data.forEach(item => {
    const key = item.transaction_id || item.created_at;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });
  const totalTrx = Object.keys(grouped).length;

  if (summary) {
    summary.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin-bottom:16px;">
        <div style="background:var(--green-pale);border-radius:var(--radius-sm);padding:14px;text-align:center;">
          <div style="font-size:18px;font-weight:700;color:var(--green-primary);">Rp ${totalSpent.toLocaleString('id-ID')}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">Total Pengeluaran</div>
        </div>
        <div style="background:var(--peach-light);border-radius:var(--radius-sm);padding:14px;text-align:center;">
          <div style="font-size:18px;font-weight:700;color:#b5541a;">${totalTrx}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">Total Transaksi</div>
        </div>
        <div style="background:#e8f4e8;border-radius:var(--radius-sm);padding:14px;text-align:center;">
          <div style="font-size:18px;font-weight:700;color:#3a6b3a;">${totalItems}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">Item Dibeli</div>
        </div>
        <div style="background:#f0ecfa;border-radius:var(--radius-sm);padding:14px;text-align:center;">
          <div style="font-size:18px;font-weight:700;color:#5e4a8a;">${uniqueItems}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">Jenis Produk</div>
        </div>
      </div>
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:4px;font-weight:600;">Paling Sering Dibeli:</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${topItems.map(([name, count]) => `
          <span style="background:var(--green-pale);color:var(--green-primary);padding:5px 12px;border-radius:100px;font-size:13px;font-weight:500;">
            ${name} (${count}x)
          </span>
        `).join('')}
      </div>
    `;
  }

  // ============================================================
  // RENDER TRANSAKSI
  // ============================================================
  if (list) {
    list.innerHTML = '';

    Object.keys(grouped).forEach(trxId => {
      const items = grouped[trxId];
      let total = 0;

      // Format date (WIB)
      let dateStr = '-';
      if (items[0].created_at) {
        const utc = new Date(items[0].created_at);
        const wib = new Date(utc.getTime() + 7 * 60 * 60 * 1000);
        dateStr = wib.toLocaleString('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }) + ' WIB';
      }

      const div = document.createElement('div');
      div.className = 'history-card';

      const itemsHTML = items.map(i => {
        const qty = i.quantity || 1;
        const sub = i.price * qty;
        total += sub;
        return `<li>${i.name} (${qty}x) — Rp ${sub.toLocaleString('id-ID')}</li>`;
      }).join('');

      div.innerHTML = `
        <h4>🛒 Transaksi #${trxId.slice(-6)}</h4>
        <div class="h-date">📅 ${dateStr}</div>
        <ul>${itemsHTML}</ul>
        <div class="history-total">Total: Rp ${total.toLocaleString('id-ID')}</div>
      `;

      list.appendChild(div);
    });
  }
}

// ============================================================
// INIT
// ============================================================
loadHistory();
