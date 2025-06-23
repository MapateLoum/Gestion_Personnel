import Link from 'next/link';
import styles from './edition.module.css';  // importer le module CSS

export default function Editions_LP() {
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
        <Link href="./Editions_LP" className={styles.link}>** 📄 Edition LP **</Link>
        <Link href="#liste_bc" className={styles.link}>🧾 Liste Récap des B.C.</Link>
        <Link href="#liste_bc_section" className={styles.link}>📂 Liste B.C / Section</Link>
        <Link href="#liste_bc_non_pointe" className={styles.link}>⛔ B.C. non pointés</Link>
        <Link href="#liste_relat_dépassement" className={styles.link}>📉 Relqt-Dépassement / CDE</Link>
        <Link href="#pointage_mensuel" className={styles.link}>📊 Pointage Mensuel / Section</Link>
        <Link href="#pointage_global" className={styles.link}>📈 Pointage Global / Section</Link>
        <Link href="/Gestion_Journaliers" className={styles.link}>⬅️ Retour au Menu</Link>
      </section>

      <footer className={styles.footer}>
        <h2>GESTION DU PERSONNEL</h2>
      </footer>
    </main>
  );
}
