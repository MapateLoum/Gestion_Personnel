"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import styles from './conge.module.css';  // CSS module
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';

export default function GestionConges() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = document.cookie
      .split("; ")
      .find((row) => row.startsWith("isLoggedIn="))
      ?.split("=")[1];

    if (isLoggedIn !== "true") {
      router.replace("/login");
    }

    // Protection supplémentaire contre le retour arrière
    window.onpopstate = () => {
      const loggedIn = document.cookie
        .split("; ")
        .find((row) => row.startsWith("isLoggedIn="))
        ?.split("=")[1];
      if (loggedIn !== "true") {
        router.replace("/login");
      }
    };
  }, [router]);

  return (
    <main className={styles.container}>
      <Header />

      <section className={styles.menu}>
        <Link href="./Gestion_Conges" className={styles.link}>** Gestion des Congés **</Link>
        <Link href="/Gestion_Conges/Saisi_Conge" className={styles.link}>Saisie des congés</Link>
        <Link href="/Gestion_Conges/Modif_Conge" className={styles.link}>Modification des congés</Link>
        <Link href="/Gestion_Conges/Edition_Conge" className={styles.link}>Édition des congés</Link>
        <Link href="/Gestion_Conges/Periode" className={styles.link}>Liste des périodes</Link>
        <Link href="/Gestion_Conges/Consultation" className={styles.link}>Consultation des congés par agent</Link>
        <Link href="../Accueil" className={styles.link}>⬅️ Retour au menu principal</Link>
      </section>

      <Footer />
    </main>
  );
}
