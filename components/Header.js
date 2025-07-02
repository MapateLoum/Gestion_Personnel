"use client";

import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <Image
        src="/image.png"
        alt="ICS logo"
        width={80}
        height={80}
        className={styles.logo}
      />
      <div className={styles.entete}>
        <h1 className={styles.title}>INDUSTRIES CHIMIQUES DU SENEGAL</h1>
        <p className={styles.sub}>Direction du Site Minier / DRH mine</p>
        <p className={styles.sub}>Service du Personnel et Adm° Générale-Mine</p>
      </div>
    </header>
  );
}
