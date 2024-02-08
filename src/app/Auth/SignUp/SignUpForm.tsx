"use client"
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Sign-up form component
const SignUpForm = () => {
  // Initializing router and state
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Function responsible for registration
  const handleSignUp = async () => {
    // Checking email
    if (!formData.email.includes('@')) {
      alert('The email address is invalid. Please provide a valid email address.');
      return;
    }

    // Checking password length
    if (formData.password.length < 6) {
      alert('The password is too short. It must be at least 6 characters long.');
      return;
    }

    // Checking both fields are filled
    if (!formData.email || !formData.password) {
      alert('Both fields are required to be filled.');
      return;
    }

    // Passing the checks, sending registration request
    const databaseResponse = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    // Logging in the user upon successful registration
    if (databaseResponse.ok) {
      const response = await signIn('credentials', { email: formData.email, password: formData.password, redirect: false });
      if(!response?.error) {
          router.push("/")
          router.refresh()
      } else {
          alert("Registration successful, please try logging in.")
      }
    } else {
      const jsres = await databaseResponse.json()
      if (jsres.message === 'SignIn') {
        alert("The email address is already taken") 
      } else {
        alert(jsres.message)
      }
    };
  };

  // State handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-720">
      <div className="max-w-md mx-auto p-6 mt-14 bg-gray-200 rounded-md shadow-md self-start">
        <h2 className="text-2xl text-gray-600 font-semibold mb-4">Registration</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email address
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
              Password
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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
