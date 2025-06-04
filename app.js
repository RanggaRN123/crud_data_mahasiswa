import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://tslcvpkyurvmdbqfoucp.supabase.co'; // ganti dengan URL kamu
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbGN2cGt5dXJ2bWRicWZvdWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDU0OTMsImV4cCI6MjA2NDYyMTQ5M30.baQVc3-dmZp42G--NC_vNsLDNta9PK-z_g_by0hrAOc';   // ganti dengan key kamu
const supabase = createClient(supabaseUrl, supabaseKey);

export async function registerUser(username, password) {
  const usernameLower = username.toLowerCase();

  // Cek apakah sudah ada
  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('id')
    .eq('username', usernameLower)
    .single();

  if (existingUser) return 'exists';
  if (checkError && checkError.code !== 'PGRST116') return 'error';

  // Insert user baru
  const { data, error } = await supabase
    .from('users')
    .insert([{ username: usernameLower, password }]);

  if (error) return 'error';
  return 'success';
}

export async function loginUser(username, password) {
  const usernameLower = username.toLowerCase();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', usernameLower)
    .eq('password', password)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error login:', error.message);
    return 'error';
  }

  if (!data) return 'invalid';

  // Simpan status login di localStorage
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', data.username);


  return 'success';
}