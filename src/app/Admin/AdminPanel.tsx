// Az importált csomagok
"use client"
import React, { useState, useEffect } from 'react';

// AdminPanel komponens, amely kezeli a felhasználók típusának frissítését
const AdminPanel = () => {
  // State hook-ok inicializálása
  const [users, setUsers] = useState<Array<{ id: number; email: string; type: string }>>([]);

  // Komponens mount-jakor lefutó useEffect hook
  useEffect(() => {
    // Aszinkron adatlekérés a backend API-n keresztül
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getAllUsers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const jsres = await response.json();

        // Ha a válasz rendben van, frissíti a felhasználók állapotát
        if (response.ok) {
          setUsers(jsres.result);
        } else {
          console.error('Hiba az adatküldés során:', jsres.result);
        }
      } catch (error) {
        console.error('Hiba történt:', error);
      }
    };

    // Adatok lekérése az API-ról
    fetchData();
  }, []); // A dependency tömb üres, így a useEffect csak egyszer fut le, a komponens mount-jakor

  // Felhasználó típusának frissítése
  const TypeUpdate = async (email: any, newType: any) => {
    try {
      // A frissítéshez szükséges adatok összeállítása
      const result = {
        "email": email,
        "newType": newType,
      };

      // Aszinkron kérés a backend API-hoz a felhasználó típusának frissítésére
      const response = await fetch('/api/updateUserType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      // A válasz a backend-től JSON formátumban
      const responseData = await response.json();

      // Ha a válasz rendben van, frissítem a felhasználók állapotát és megjelenítem az új típust
      if (response.ok) {
        // Az állapot frissítése a friss adatokkal
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.email === email ? { ...user, type: newType } : user))
        );

        // Az új típust alert()-ben jelenítem meg
        alert(responseData.result);
      } else {
        console.error('Hiba történt a felhasználók lekérése közben:', responseData.result);
      }
    } catch (error) {
      console.error('Hiba történt a felhasználók lekérése közben:', error);
    }
  };

  // JSX kód, amely megjeleníti az AdminPanel komponenst
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
          {/* Felhasználók megjelenítése */}
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                {/* Típus frissítése a select mezőn keresztül */}
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

// AdminPanel exportálása
export default AdminPanel;
