"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './register.module.css'; // Assure-toi que le fichier CSS s'appelle bien ainsi

export default function Register() {
  const [matricule, setMatricule] = useState('');
  const [mail, setMail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!matricule || !mail || !nom || !prenom || !password || !confirm) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      setError('Veuillez entrer un email valide.');
      return;
    }

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    setMatricule('');
    setMail('');
    setNom('');
    setPrenom('');
    setPassword('');
    setConfirm('');
  };

  return (
    <main className={styles.container}>
      <header className={styles.registerHeader}>
        <img
          src="/image.png"
          alt="Photo Entreprise"
          className={styles.companyPhoto}
        />
        <div className={styles.registerTitleWrapper}>
          <h1 className={styles.registerTitle}>Création d'un compte</h1>
          <p className={styles.registerSubtitle}>Rejoignez notre équipe</p>
        </div>
      </header>

      <section className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

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

          <label htmlFor="mail" className={styles.label}>Email</label>
          <input
            type="email"
            id="mail"
            name="mail"
            className={styles.input}
            placeholder="Entrez votre email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
          />

          <label htmlFor="nom" className={styles.label}>Nom</label>
          <input
            type="text"
            id="nom"
            name="nom"
            className={styles.input}
            placeholder="Entrez votre nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />

          <label htmlFor="prenom" className={styles.label}>Prénom</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            className={styles.input}
            placeholder="Entrez votre prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
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

          <label htmlFor="confirm" className={styles.label}>Confirmez le mot de passe</label>
          <input
            type="password"
            id="confirm"
            name="confirm"
            className={styles.input}
            placeholder="Confirmez votre mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit" className={styles.button}>S'inscrire</button>
        </form>

        <p className={styles.switchText}>
          Déjà un compte ?{' '}
          <Link href="/login" className={styles.switchLink}>Connectez-vous ici</Link>
        </p>
      </section>

      <footer className={styles.registerFooter}>
        <p>© 2025 Industries Chimiques du Sénégal</p>
        <p>Tous droits réservés</p>
      </footer>
    </main>
  );
}
