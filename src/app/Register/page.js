"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './register.module.css';

function Toast({ message, type = "error", onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`${styles.toast} ${type === 'success' ? styles.toastSuccess : styles.toastError}`}>
      {message}
    </div>
  );
}

export default function Register() {
  const [matricule, setMatricule] = useState('');
  const [mail, setMail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('error'); // 'error' ou 'success'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToastMsg('');

    if (!matricule || !mail || !nom || !prenom || !password || !confirm) {
      setToastType('error');
      setToastMsg('Veuillez remplir tous les champs.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      setToastType('error');
      setToastMsg('Veuillez entrer un email valide.');
      return;
    }

    if (password !== confirm) {
      setToastType('error');
      setToastMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricule, email: mail, nom, prenom, password }),
      });

      const data = await res.json();

      if (data.success) {
        setToastType('success');
        setToastMsg('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setMatricule('');
        setMail('');
        setNom('');
        setPrenom('');
        setPassword('');
        setConfirm('');
      } else {
        setToastType('error');
        setToastMsg(data.message || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      setToastType('error');
      setToastMsg('Erreur serveur, veuillez réessayer plus tard.');
    }
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

      {/* Toast message */}
      <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
    </main>
  );
}
