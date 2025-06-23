import Link from 'next/link';
import styles from './conge.module.css';  // CSS module

export default function GestionConges() {
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
  <Link href="./Gestion_Conges" className={styles.link}>🌴 Gestion des Congés</Link>
  <Link href="/Gestion_Conges/Saisi_Conge" className={styles.link}>📝 Saisie des congés</Link>
  <Link href="/Gestion_Conges/Modif_Conge" className={styles.link}>✏️ Modification des congés</Link>
  <Link href="/Gestion_Conges/Edition_Conge" className={styles.link}>📤 Édition des congés</Link>
  <Link href="/Gestion_Conges/Periode" className={styles.link}>📅 Liste des périodes</Link>
  <Link href="/Gestion_Conges/Consultation" className={styles.link}>👁️ Consultation des congés par agent</Link>
  <Link href="/" className={styles.link}>⬅️ Retour au menu principal</Link>
</section>


      <footer className={styles.footer}>
        <h2>GESTION DU PERSONNEL</h2>
      </footer>
    </main>
  );
}
