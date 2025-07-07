"use client";

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Supprimer le cookie isLoggedIn
    document.cookie = 'isLoggedIn=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <button
      style={{
        backgroundColor: '#7b1f2b',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
      }}
      onClick={handleLogout}
    >
      Déconnexion
    </button>
  );
}
