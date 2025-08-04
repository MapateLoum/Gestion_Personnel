"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // 4 secondes visibles
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={styles.toast}>
      {message}
    </div>
  );
}

export default function Login() {
  const router = useRouter();
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToastMsg('');

    if (!matricule || !password) {
      setToastMsg('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricule, password }),
      });

      const data = await res.json();

      if (data.success) {
        document.cookie = "isLoggedIn=true; path=/; max-age=3600";
        router.push('/Accueil');
      } else {
        setToastMsg(data.message);
      }
    } catch (err) {
      setToastMsg('Erreur serveur, veuillez réessayer plus tard.');
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.loginHeader}>
        <img src="/image.png" alt="Photo Entreprise" className={styles.companyPhoto} />
        <div className={styles.loginTitleWrapper}>
          <h1 className={styles.loginTitle}>Bienvenue aux ICS</h1>
          <p className={styles.loginSubtitle}>Espace de connexion sécurisé</p>
        </div>
      </header>

      <section className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <label htmlFor="matricule" className={styles.label}>Matricule</label>
          <input
            type="text"
            id="matricule"
            name="matricule"
            className={styles.input}
            placeholder="Entrez votre matricule"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            required
          />

          <label htmlFor="password" className={styles.label}>Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            className={styles.input}
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
<p className={styles.switchText}><Link href="/Renitialisation" className={styles.switchLink}>Mot de passe oublié</Link></p>
          <button type="submit" className={styles.button}>Se connecter</button>
        </form>

        <p className={styles.switchText}>
          Pas de compte ?{' '}
          <Link href="/Register" className={styles.switchLink}>Inscrivez-vous ici</Link>
        </p>
      </section>

      <footer className={styles.loginFooter}>
        <p>© 2025 Industries Chimiques du Sénégal - Tous droits réservés</p>
      </footer>

      {/* Toast message */}
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </main>
  );
}
