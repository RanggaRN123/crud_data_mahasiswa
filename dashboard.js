console.log('dashboard.js dimuat');

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://tslcvpkyurvmdbqfoucp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbGN2cGt5dXJ2bWRicWZvdWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDU0OTMsImV4cCI6MjA2NDYyMTQ5M30.baQVc3-dmZp42G--NC_vNsLDNta9PK-z_g_by0hrAOc';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Cek login
if (!localStorage.getItem('loggedIn')) {
  window.location.href = 'login.html';
}

// Ambil data user
function getUser() {
  const username = localStorage.getItem('username');
  const loggedIn = localStorage.getItem('loggedIn');

  if (!loggedIn || !username) {
    window.location.href = 'login.html';
    return;
  }

  // Tampilkan username di header dan sapaan
  document.getElementById('username').textContent = username;
  document.getElementById('sapaan').textContent = `Hallo0, ${username}!`;

  loadMahasiswa();
}


async function loadMahasiswa() {
  console.log('Fetching all mahasiswa data');

  const { data, error } = await supabase
    .from('mahasiswa')
    .select('*');

  const tbody = document.querySelector('#mahasiswaTable tbody');
  tbody.innerHTML = '';

  if (error) {
    console.error('Supabase error:', error);
    alert('Gagal memuat data!');
    return;
  }

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Belum ada data mahasiswa.</td></tr>';
    return;
  }

  data.forEach((mhs, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${mhs.nama}</td>
      <td>${mhs.nim}</td>
      <td>${mhs.jurusan}</td>
      <td>${mhs.tanggal_lahir}</td>
      <td>${mhs.tempat_tinggal}</td>
      <td>
        <button onclick="window.location.href='update.html?id=${mhs.id}'">Update</button>
        <button onclick="hapusMahasiswa('${mhs.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Fungsi hapus mahasiswa harus di-assign ke window agar bisa diakses dari onclick inline
window.hapusMahasiswa = async function(id) {
  const konfirmasi = confirm('Yakin ingin menghapus data ini?');
  if (!konfirmasi) return;

  const { error } = await supabase.from('mahasiswa').delete().eq('id', id);
  if (error) {
    alert('Gagal menghapus data!');
  } else {
    getUser();
  }
};

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('username');
  window.location.href = 'index.html';
});

// Tombol tambah data
document.getElementById('tambahBtn').addEventListener('click', () => {
  window.location.href = 'tambah.html';
});

// Inisialisasi awal
window.addEventListener('DOMContentLoaded', getUser);
