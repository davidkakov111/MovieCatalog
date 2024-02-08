"use client"
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Sign-in form component
const SignInForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSignIn = async () => {
    // Checking if email contains @ character
    if (!formData.email.includes('@')) {
      alert('Invalid email address. Please provide a valid email address.');
      return;
    }

    // Checking both fields for completion
    if (!formData.email || !formData.password) {
      alert('Both fields are mandatory.');
      return;
    }

    // If validation succeeds, proceed with sign-in
    const response = await signIn('credentials', { email: formData.email, password: formData.password, redirect: false });
    if(!response?.error) {
      router.push("/")
      router.refresh()
    } else {
      alert("Incorrect login credentials")
    }
  };

  // State handler
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-720">
      <div className="max-w-md mx-auto p-6 mt-14 bg-gray-200 rounded-md shadow-md self-start">
        <h2 className="text-2xl text-gray-600 font-semibold mb-4">Login</h2>
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
              className="mt-1 p-2 w-full border rounded-md bg-white"
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
              className="mt-1 p-2 w-full border rounded-md bg-white"
            />
          </div>
          <button
            type="button"
            onClick={handleSignIn}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
