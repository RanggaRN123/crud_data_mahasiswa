import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://tslcvpkyurvmdbqfoucp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbGN2cGt5dXJ2bWRicWZvdWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDU0OTMsImV4cCI6MjA2NDYyMTQ5M30.baQVc3-dmZp42G--NC_vNsLDNta9PK-z_g_by0hrAOc';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Cek login
if (!localStorage.getItem('loggedIn')) {
  window.location.href = 'login.html';
}

const form = document.getElementById('formTambah');
const pesan = document.getElementById('pesan');
const kembaliBtn = document.getElementById('btnKembali');

// Fungsi validasi nama dan jurusan tidak boleh ada angka
function validasiNamaJurusan(value) {
  return /^[A-Za-z\s]+$/.test(value);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Reset pesan error dan style
  pesan.textContent = '';
  pesan.style.color = 'red';

  // Bersihkan pesan error per input dulu (kalau mau, nanti buat di html)
  // Kita buat validasi error per input di sini dengan buat elemen error di bawah input
  // Karena di html belum ada tempat khusus error per input, kita simpan di #pesan saja.

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

  // Cek NIM unik
  const { data: existing, error: cekError } = await supabase
    .from('mahasiswa')
    .select('nim')
    .eq('nim', nim)
    .maybeSingle();

  if (cekError) {
    pesan.textContent = 'Terjadi kesalahan saat memeriksa NIM.';
    return;
  }

  if (existing) {
    pesan.textContent = 'NIM sudah digunakan. Silakan gunakan NIM lain.';
    return;
  }

  // Insert data ke supabase
  const { error } = await supabase.from('mahasiswa').insert([
    { nama, nim, jurusan, tanggal_lahir, tempat_tinggal }
  ]);

  if (error) {
    pesan.textContent = 'Gagal menambahkan data: ' + error.message;
  } else {
    alert('Data berhasil ditambahkan!');
    window.location.href = 'dashboard.html';
  }
});

// Tombol kembali
kembaliBtn.addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});
