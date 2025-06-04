import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://tslcvpkyurvmdbqfoucp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbGN2cGt5dXJ2bWRicWZvdWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDU0OTMsImV4cCI6MjA2NDYyMTQ5M30.baQVc3-dmZp42G--NC_vNsLDNta9PK-z_g_by0hrAOc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Cek login
if (!localStorage.getItem('loggedIn')) {
  window.location.href = 'login.html';
}

const form = document.getElementById('formUpdate');
const pesan = document.getElementById('pesan');
const kembaliBtn = document.getElementById('btnKembali');

// Ambil id dari query params
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

if (!id) {
  alert('ID data tidak ditemukan');
  window.location.href = 'dashboard.html';
}

// Fungsi validasi nama dan jurusan tidak boleh angka
function validasiNamaJurusan(value) {
  return /^[A-Za-z\s]+$/.test(value);
}

// Ambil data mahasiswa berdasarkan id dan isi ke form
async function loadData() {
  const { data, error } = await supabase
    .from('mahasiswa')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    alert('Gagal mengambil data: ' + error.message);
    window.location.href = 'dashboard.html';
    return;
  }

  form.nama.value = data.nama;
  form.nim.value = data.nim;
  form.jurusan.value = data.jurusan;
  form.tanggal_lahir.value = data.tanggal_lahir;
  form.tempat_tinggal.value = data.tempat_tinggal;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  pesan.textContent = '';
  pesan.style.color = 'red';

  const nama = form.nama.value.trim();
  const nim = form.nim.value.trim();
  const jurusan = form.jurusan.value.trim();
  const tanggal_lahir = form.tanggal_lahir.value;
  const tempat_tinggal = form.tempat_tinggal.value.trim();

  // Validasi wajib isi
  if (!nama || !nim || !jurusan || !tanggal_lahir || !tempat_tinggal) {
    pesan.textContent = 'Semua field wajib diisi.';
    return;
  }

  // Validasi nama dan jurusan hanya huruf dan spasi
  if (!validasiNamaJurusan(nama)) {
    pesan.textContent = 'Nama hanya boleh berisi huruf dan spasi.';
    return;
  }

  if (!validasiNamaJurusan(jurusan)) {
    pesan.textContent = 'Jurusan hanya boleh berisi huruf dan spasi.';
    return;
  }

  // Validasi NIM harus angka
  if (!/^\d+$/.test(nim)) {
    pesan.textContent = 'NIM harus berupa angka.';
    return;
  }

  // Cek NIM unik, tapi abaikan jika NIM sama dengan NIM asli (jika tidak diubah)
  const { data: existing, error: cekError } = await supabase
    .from('mahasiswa')
    .select('nim')
    .eq('nim', nim)
    .maybeSingle();

  if (cekError) {
    pesan.textContent = 'Terjadi kesalahan saat memeriksa NIM.';
    return;
  }

  if (existing && existing.nim !== form.nim.defaultValue) {
    pesan.textContent = 'NIM sudah digunakan. Silakan gunakan NIM lain.';
    return;
  }

  // Update data
  const { error } = await supabase
    .from('mahasiswa')
    .update({ nama, nim, jurusan, tanggal_lahir, tempat_tinggal })
    .eq('id', id);

  if (error) {
    pesan.textContent = 'Gagal mengupdate data: ' + error.message;
  } else {
    alert('Data berhasil diperbarui!');
    window.location.href = 'dashboard.html';
  }
});

// Tombol kembali
kembaliBtn.addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});

// Load data on page load
loadData();
