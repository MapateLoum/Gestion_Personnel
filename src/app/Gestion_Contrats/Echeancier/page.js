"use client";

import { useState, useEffect } from "react";
import styles from "./echeancier.module.css";
import { useRouter } from "next/navigation";

export default function EcheancierContrats() {
  const router = useRouter();
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [erreur, setErreur] = useState("");
  const [resultats, setResultats] = useState([]);

  // Vérification cookie isLoggedIn pour protection accès
  useEffect(() => {
    const isLoggedIn = document.cookie
      .split("; ")
      .find((row) => row.startsWith("isLoggedIn="))
      ?.split("=")[1];

    if (isLoggedIn !== "true") {
      router.replace("/login");
    }

    // Empêcher retour arrière après déconnexion
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dateDebut || !dateFin) {
      setErreur("Veuillez renseigner les deux dates.");
      return;
    }

    if (new Date(dateDebut) > new Date(dateFin)) {
      setErreur("La date de début doit être antérieure à la date de fin.");
      return;
    }

    setErreur("");

    try {
      const res = await fetch(
        `/api/echeancier?dateDebut=${dateDebut}&dateFin=${dateFin}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErreur(data.message || "Erreur lors de la récupération.");
        return;
      }

      setResultats(data.contrats || []);
    } catch (err) {
      setErreur("Erreur réseau ou serveur.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Échéancier des Contrats</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="dateDebut">Date de début :</label>
          <input
            type="date"
            id="dateDebut"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="dateFin">Date de fin :</label>
          <input
            type="date"
            id="dateFin"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>
        {erreur && <p className={styles.error}>{erreur}</p>}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.button}>
            Afficher
          </button>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={() => router.back()}
          >
            Retour
          </button>
        </div>
      </form>

      {resultats.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Type</th>
              <th>Date d'échéance</th>
            </tr>
          </thead>
          <tbody>
            {resultats.map((contrat, index) => {
              const dateFinContrat = new Date(contrat.date_fin);
              const diffJours = Math.ceil(
                (dateFinContrat - new Date()) / (1000 * 60 * 60 * 24)
              );
              const isAlert = diffJours <= 15;
              return (
                <tr key={index} className={isAlert ? styles.alertRow : ""}>
                  <td>{contrat.id}</td>
                  <td>{contrat.nom}</td>
                  <td>{contrat.prenom}</td>
                  <td>{contrat.type_contrat}</td>
                  <td>{contrat.date_fin.slice(0, 10)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {resultats.length === 0 && dateDebut && dateFin && !erreur && (
        <p className={styles.noResult}>Aucun contrat trouvé dans cet intervalle.</p>
      )}
    </div>
  );
}
