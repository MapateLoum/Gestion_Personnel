import Link from 'next/link';
// import './globals.css'
// import LogoutButton from '../../components/LogoutButton';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import styles from './page.module.css';

export default function Accueil() {
  return (
    <main className={styles.container}>
      <Header />

      <section className={styles.menu}>
        <Link href="/" className={styles.link}>** MENU GENERAL **</Link>
        <Link href="./Gestion_Conges" className={styles.link}>GESTION DES CONGES</Link>
        <Link href="./Gestion_Contrats" className={styles.link}>GESTION DES CONTRATS</Link>
        <Link href="./login" className={styles.link}>❌ QUITTER L’APPLICATION</Link>
        {/* <LogoutButton /> */}
      </section>

        <Footer />
    </main>
  );
}
