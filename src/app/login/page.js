"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function Login() {
  const router = useRouter();
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dummyUser = { matricule: '12345', password: '123456' };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!matricule || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (matricule === dummyUser.matricule && password === dummyUser.password) {
      document.cookie = "isLoggedIn=true; path=/; max-age=3600"; // <-- pose cookie
      router.push('/Accueil');
    } else {
      setError('Matricule ou mot de passe incorrect.');
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
          {error && <p className={styles.error}>{error}</p>}

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
    </main>
  );
}
