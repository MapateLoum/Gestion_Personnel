"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import styles from './contrat.module.css';  // CSS module
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';

export default function GestionContrats() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = document.cookie
      .split("; ")
      .find((row) => row.startsWith("isLoggedIn="))
      ?.split("=")[1];

    if (isLoggedIn !== "true") {
      router.replace("/login");
    }

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
        <Link href="./Gestion_Contrats" className={styles.link}>**Gestion des Contrats **</Link>
        <Link href="./Gestion_Contrats/Saisi_Personnelle" className={styles.link}>Saisie du Personnel</Link>
        <Link href="./Gestion_Contrats/Modif_Personnel" className={styles.link}>Modifier Personnel</Link>
        <Link href="/Gestion_Contrats/Attestation" className={styles.link}>Attestation (Travail/Retraite)</Link>
        <Link href="/Gestion_Contrats/afficher_pers" className={styles.link}>Afficher le Personnel</Link>
        <Link href="../Accueil" className={styles.link}>⬅️ Retour au Menu</Link>
      </section>

      <Footer />
    </main>
  );
}
