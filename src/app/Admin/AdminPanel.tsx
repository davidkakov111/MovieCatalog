// Az importált csomagok
"use client"
import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [users, setUsers] = useState<Array<{ id: number; email: string; type: string }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getAllUsers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const jsres = await response.json();

        if (response.ok) {
          setUsers(jsres.result);
        } else {
          console.error('Hiba az adatküldés során:', jsres.result);
        }
      } catch (error) {
        console.error('Hiba történt:', error);
      }
    };

    fetchData();
  }, []);;

  const TypeUpdate = async (email:any, newType:any) => {
    try {
      const result = {
        "email": email,
        "newType": newType,
      }

      const response = await fetch('/api/updateUserType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        // Az állapot frissítése a friss adatokkal
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.email === email ? { ...user, type: newType } : user))
        );

        // Az új típust alert()-ben jelenítjük meg
        alert(responseData.result);
      } else {
        console.error('Hiba történt a felhasználók lekérése közben:', responseData.result);
      }
    } catch (error) {
      console.error('Hiba történt a felhasználók lekérése közben:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 mx-auto">Admin Panel</h1>
      </div>
      <table className="min-w-full bg-white border border-gray-300 text-center">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Szerepkör</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
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

export default AdminPanel;