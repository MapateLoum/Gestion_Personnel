"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import styles from './page.module.css';

export default function Accueil() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = document.cookie
      .split("; ")
      .find((row) => row.startsWith("isLoggedIn="))
      ?.split("=")[1];

    if (isLoggedIn !== "true") {
      router.replace("/login");
    }
  }, [router]);
  

  return (
    <main className={styles.container}>
      <Header />

      <section className={styles.menu}>
        <Link href="/" className={styles.link}>** MENU GENERAL **</Link>
        <Link href="./Gestion_Conges" className={styles.link}>GESTION DES CONGES</Link>
        <Link href="./Gestion_Contrats" className={styles.link}>GESTION DES CONTRATS</Link>
        <button onClick={() => {
          document.cookie = "isLoggedIn=; path=/; max-age=0";
          router.replace("/login");
        }} className={styles.link}>
          ❌ QUITTER L’APPLICATION
        </button>
      </section>

      <Footer />
    </main>
  );
}
