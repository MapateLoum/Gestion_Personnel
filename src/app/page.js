import Link from 'next/link';
import './globals.css'
import styles from './page.module.css';

export default function Accueil() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <img src="/image.png" alt="ICS logo" className={styles.logo} />
        <div className={styles.entete}>
          <h1 className={styles.title}>INDUSTRIES CHIMIQUES DU SENEGAL</h1>
          <p className={styles.sub}>Direction du Site Minier / DRH mine</p>
          <p className={styles.sub}>Service du Personnel et Adm° Générale-Mine</p>
        </div>
      </header>

      <section className={styles.menu}>
        <Link href="/" className={styles.link}>🏠 ** MENU GENERAL **</Link>
        <Link href="./Gestion_Conges" className={styles.link}>🌴 GESTION DES CONGES</Link>
        <Link href="./Gestion_Contrats" className={styles.link}>📁 GESTION DES CONTRATS</Link>
        <Link href="#logout" className={styles.link}>❌ QUITTER L’APPLICATION</Link>
      </section>

      <footer className={styles.footer}>
        <h2>GESTION DU PERSONNEL</h2>
      </footer>
    </main>
  );
}
