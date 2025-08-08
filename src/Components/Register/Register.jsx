import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ShieldCheck } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Registration failed');

      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Register</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Name" onChange={handleChange} value={form.name} className="w-full px-4 py-2 border rounded-md" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} value={form.email} className="w-full px-4 py-2 border rounded-md" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} value={form.password} className="w-full px-4 py-2 border rounded-md" />

          <select name="role" onChange={handleChange} value={form.role} className="w-full px-4 py-2 border rounded-md">
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">Register</button>
        </form>
      </div>
    </div>
  );
}