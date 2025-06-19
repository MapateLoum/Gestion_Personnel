import Link from 'next/link';
import styles from './consultation.module.css';  // importer le module CSS

export default function Consultation_LP() {
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
        <Link href="./Consultation_LP" className={styles.link}>📖 Consultation LP</Link>
        <Link href="#consultations_bons" className={styles.link}>📄 Bons de commande</Link>
        <Link href="#facturation_mensuelle" className={styles.link}>💰 Facturation mensuelle</Link>
        <Link href="#facturation_section" className={styles.link}>📊 Facturation / Section</Link>
        <Link href="#detail_pointage" className={styles.link}>🔍 Pointage / Cde</Link>
        <Link href="#detail_pointage" className={styles.link}>📑 Pointage / Cde / Section</Link>
        <Link href="/Gestion_Journaliers" className={styles.link}>⬅️ Retour au Menu</Link>
      </section>

      <footer className={styles.footer}>
        <h2>GESTION DU PERSONNEL</h2>
      </footer>
    </main>
  );
}
