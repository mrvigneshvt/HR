import axios from 'axios';
import bcrypt from 'bcrypt';

// Helper to generate random Indian-style phone numbers
function generateRandomPhone() {
  const prefix = ['7', '8', '9'][Math.floor(Math.random() * 3)];
  let number = prefix;
  for (let i = 0; i < 9; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return `+91${number}`;
}

// Helper to generate random string
function randomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

// Function to test the /register API
async function testRegister() {
  const username = `user_${randomString(5)}`;
  const password = `pass_${randomString(6)}`;
  const email = `${randomString(6)}@example.com`;
  const phone = generateRandomPhone();
  const roles = ['admin', 'builder', 'investor'];
  const role = roles[Math.floor(Math.random() * roles.length)];

  const data = {
    username,
    password,
    email,
    phone,
    role,
  };

  try {
    const res = await axios.post('http://localhost:3000/register', data);
    console.log('✅ Success:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('❌ Error Response:', err.response.data);
    } else {
      console.error('❌ Request Error:', err.message);
    }
  }
}

testRegister();
