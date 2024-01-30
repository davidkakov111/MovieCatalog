"use client"
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignUpForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSignUp = async () => {
    // Email ellenőrzése
    if (!formData.email.includes('@')) {
      alert('Az email cím érvénytelen. Kérjük, adjon meg egy érvényes email címet.');
      return;
    }

    // Jelszó hosszúságának ellenőrzése
    if (formData.password.length < 6) {
      alert('A jelszó túl rövid. Legalább 6 karakter hosszúnak kell lennie.');
      return;
    }

    // Mindkét mező kitöltöttségének ellenőrzése
    if (!formData.email || !formData.password) {
      alert('Mindkét mező kitöltése kötelező.');
      return;
    }

    // Az ellenőrzéseket sikeresen átmentve, elküldöm a regisztrációs kérést
    const databaseResponse = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    if (databaseResponse.ok) {
      const response = await signIn('credentials', { email: formData.email, password: formData.password, redirect: false });
      if(!response?.error) {
          router.push("/")
          router.refresh()
      } else {
          alert("A regisztrácio megtörtént, probálj meg bejelentkezni")
      }
    } else {
      const jsres = await databaseResponse.json()
      if (jsres.message === 'SignIn') {
        alert("Az email cím már foglalt") 
      } else {
        alert(jsres.message)
      }
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-720">
      <div className="max-w-md mx-auto p-6 mt-14 bg-gray-200 rounded-md shadow-md self-start">
        <h2 className="text-2xl text-gray-600 font-semibold mb-4">Regisztráció</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email cím
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full bg-white border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Jelszó
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full bg-white border rounded-md"
            />
          </div>
          <button
            type="button"
            onClick={handleSignUp}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Regisztráció
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;