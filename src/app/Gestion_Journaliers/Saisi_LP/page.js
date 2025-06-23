import Link from 'next/link';
import styles from './saisi.module.css';  // importer le module CSS

export default function Saisi_LP() {
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
        <Link href="./Saisi_LP" className={styles.link}>** 📝 Saisi des LP **</Link>
        <Link href="#Saisie_bon_cmde" className={styles.link}>📄 Saisie des bons de commande</Link>
        <Link href="#saisie_pointages" className={styles.link}>⏱️ Saisie des pointages</Link>
        <Link href="#modif_bons" className={styles.link}>✏️ Modifier les bons</Link>
        <Link href="#modif_pointages" className={styles.link}>🔧 Modifier les pointages</Link>
        <Link href="/Gestion_Journaliers" className={styles.link}>⬅️ Retour au Menu précédent</Link>
      </section>

      <footer className={styles.footer}>
        <h2>GESTION DU PERSONNEL</h2>
      </footer>
    </main>
  );
}
