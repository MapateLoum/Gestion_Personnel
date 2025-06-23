import Link from 'next/link';
import styles from './contrat.module.css';  // CSS module

export default function GestionContrats() {
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
        <Link href="./Gestion_Contrats" className={styles.link}>** 📁 Gestion des Contrats **</Link>
        <Link href="./Gestion_Contrats/Saisi_Personnelle" className={styles.link}>📝 Saisie du Personnel</Link>
        <Link href="/Gestion_Contrats/Salaire_Personnel" className={styles.link}>💵 Salaires du Personnel</Link>
        <Link href="/Gestion_Contrats/Echeancier" className={styles.link}>📅 Échéancier des Contrats</Link>
        <Link href="/Gestion_Contrats/Renouv_Contrat" className={styles.link}>🔄 Renouvellement CDD2/CDI</Link>
        <Link href="/Gestion_Contrats/Attestation" className={styles.link}>📄 Attestation de Travail</Link>
        <Link href="#Edition" className={styles.link}>🧩 Édition de l'Organigramme</Link>
        <Link href="/" className={styles.link}>⬅️ Retour au Menu</Link>
      </section>

      <footer className={styles.footer}>
        <h2>GESTION DU PERSONNEL</h2>
      </footer>
    </main>
  );
}
