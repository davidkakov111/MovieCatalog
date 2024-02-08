// Imported packages
"use client"
import React, { useState, useEffect } from 'react';
import { update_user_type } from '../database/dbmethods';

// AdminPanel component, responsible for updating user types
const AdminPanel = () => {
  // Initializing state hooks
  const [users, setUsers] = useState<Array<{ id: number; email: string; type: string }>>([]);

  // useEffect hook running on component mount
  useEffect(() => {
    // Asynchronous data fetching through the backend API
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getAllUsers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const jsres = await response.json();

        // If response is okay, update users state
        if (response.ok) {
          setUsers(jsres.result);
        } else {
          console.error('Error while sending data:', jsres);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    // Fetching data from the API
    fetchData();
  }, []); // Dependency array is empty, so useEffect runs only once, on component mount

  // Update user type
  const TypeUpdate = async (email: string, newType: string) => {
    try {
      // Compiling data required for update
      const result: update_user_type = {
        "email": email,
        "newType": newType,
      };

      // Asynchronous request to the backend API to update user type
      const response = await fetch('/api/updateUserType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      // Response from backend in JSON format
      const responseData = await response.json();

      // If response is okay, update users state and display the new type
      if (response.ok) {
        // Updating state with fresh data
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.email === email ? { ...user, type: newType } : user))
        );

        // Displaying the new type in alert()
        alert(responseData.result);
      } else {
        console.error('Error while fetching users:', responseData.result);
      }
    } catch (error) {
      console.error('Error while fetching users:', error);
    }
  };

  // AdminPanel component
  return (
    <div className="container mx-auto mt-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 mx-auto">Admin Panel</h1>
      </div>
      <table className="min-w-full bg-white border border-gray-300 text-center">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
          </tr>
        </thead>
        <tbody>
          {/* Displaying users */}
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                {/* Updating type through select field */}
                <select
                  value={user.type}
                  onChange={e => TypeUpdate(user.email, e.target.value)}
                  className="border border-gray-300 p-1"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Exporting AdminPanel
export default AdminPanel;
