import Link from 'next/link';
import styles from './journalier.module.css';  // importer le module CSS

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
        <Link href="./Gestion_Journaliers" className={styles.link}>🛠️ Gestion des Journaliers</Link>
        <Link href="./Gestion_Journaliers/Saisi_LP" className={styles.link}>📝 Menu des saisies et modifications</Link>
        <Link href="./Gestion_Journaliers/Consultations_LP" className={styles.link}>🔍 Menu des consultations</Link>
        <Link href="./Gestion_Journaliers/Editions_LP" className={styles.link}>📤 Menu des éditions</Link>
        <Link href="/" className={styles.link}>⬅️ Retour au Menu principal</Link>
      </section>

      <footer className={styles.footer}>
        <h2>GESTION DU PERSONNEL</h2>
      </footer>
    </main>
  );
}
