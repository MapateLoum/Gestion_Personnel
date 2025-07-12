import Link from 'next/link';
import styles from './contrat.module.css';  // CSS module
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';

export default function GestionContrats() {
  return (
    <main className={styles.container}>
      <Header />

      <section className={styles.menu}>
        <Link href="./Gestion_Contrats" className={styles.link}>**Gestion des Contrats **</Link>
        <Link href="./Gestion_Contrats/Saisi_Personnelle" className={styles.link}>Saisie du Personnel</Link>
        <Link href="/Gestion_Contrats/Salaire_Personnel" className={styles.link}>Salaires du Personnel</Link>
        <Link href="/Gestion_Contrats/Echeancier" className={styles.link}>Échéancier des Contrats</Link>
        <Link href="/Gestion_Contrats/Renouv_Contrat" className={styles.link}>Renouvellement CDD2/CDI</Link>
        <Link href="/Gestion_Contrats/Attestation" className={styles.link}>Attestation de Travail</Link>
        <Link href="/Gestion_Contrats/afficher_pers" className={styles.link}>Afficher les Personnel</Link>
        <Link href="../Accueil" className={styles.link}>⬅️ Retour au Menu</Link>
      </section>

      <Footer />
    </main>
  );
}
