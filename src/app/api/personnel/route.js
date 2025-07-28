"use client";

import { useState, useEffect } from "react";
import styles from "./afficher_pers.module.css";

export default function AfficherPersonnel() {
  const [personnels, setPersonnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [matriculeRecherche, setMatriculeRecherche] = useState("");
  const [personnelFiltre, setPersonnelFiltre] = useState(null);

  // Chargement initial de tout le personnel
  useEffect(() => {
    fetchPersonnels();
  }, []);

  const fetchPersonnels = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/personnel/afficher");
      const data = await res.json();
      if (res.success) {
        setPersonnels(data.personnels);
        setPersonnelFiltre(null); // reset filtre
      } else {
        setMessage("❌ Erreur: " + (data.error || "Impossible de charger le personnel"));
      }
    } catch {
      setMessage("❌ Erreur réseau.");
    }
    setLoading(false);
  };

  const rechercherParMatricule = () => {
    setMessage("");
    if (!matriculeRecherche.trim()) {
      setMessage("❌ Veuillez saisir un matricule.");
      return;
    }

    // Recherche dans la liste déjà chargée
    const agent = personnels.find(
      (p) => p.MLE.toString().toLowerCase() === matriculeRecherche.trim().toLowerCase()
    );
    if (agent) {
      setPersonnelFiltre(agent);
      setMessage(`✅ Agent trouvé : ${agent.NOM} ${agent.PRENOMS}`);
    } else {
      setPersonnelFiltre(null);
      setMessage("❌ Aucun agent trouvé avec ce matricule.");
    }
  };

  const handleReset = () => {
    setPersonnelFiltre(null);
    setMatriculeRecherche("");
    setMessage("");
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Liste du Personnel</h1>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Rechercher par matricule"
          value={matriculeRecherche}
          onChange={(e) => setMatriculeRecherche(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={rechercherParMatricule} className={styles.searchBtn}>
          Rechercher
        </button>
        <button onClick={handleReset} className={styles.resetBtn}>
          Afficher tout
        </button>
      </div>

      {loading && <p>Chargement...</p>}
      {message && <p>{message}</p>}

      {!loading && (
        <>
          {(personnelFiltre ? [personnelFiltre] : personnels).length === 0 ? (
            <p>Aucun personnel trouvé.</p>
          ) : (
            <div id="print-zone" style={{ overflowX: "auto" }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>STE</th>
                    <th>CODE_SAN</th>
                    <th>MLE (Matricule)</th>
                    <th>NOM</th>
                    <th>PRENOMS</th>
                    <th>INTITULE_DU_POSE</th>
                    <th>CATEGORIE</th>
                    <th>REG</th>
                    <th>DATE_NAIS</th>
                    <th>DATE_EMB</th>
                    <th>DATE_DEP</th>
                    <th>SEXE</th>
                    <th>NBEP</th>
                    <th>NBENF</th>
                    <th>DEPT_DIV_SERV_SUBD</th>
                    <th>ADRESSE</th>
                    <th>FILIATION_</th>
                    <th>FILIATION_2</th>
                    <th>LIEUNAIS</th>
                  </tr>
                </thead>
                <tbody>
                  {(personnelFiltre ? [personnelFiltre] : personnels).map((p) => (
                    <tr key={p.MLE}>
                      <td>{p.STE || "-"}</td>
                      <td>{p.CODE_SAN || "-"}</td>
                      <td>{p.MLE || "-"}</td>
                      <td>{p.NOM || "-"}</td>
                      <td>{p.PRENOMS || "-"}</td>
                      <td>{p.INTITULE_DU_POSE || "-"}</td>
                      <td>{p.CATEGORIE || "-"}</td>
                      <td>{p.REG || "-"}</td>
                      <td>{p.DATE_NAIS ? new Date(p.DATE_NAIS).toLocaleDateString() : "-"}</td>
                      <td>{p.DATE_EMB ? new Date(p.DATE_EMB).toLocaleDateString() : "-"}</td>
                      <td>{p.DATE_DEP ? new Date(p.DATE_DEP).toLocaleDateString() : "-"}</td>
                      <td>{p.SEXE || "-"}</td>
                      <td>{p.NBEP !== undefined ? p.NBEP : "-"}</td>
                      <td>{p.NBENF !== undefined ? p.NBENF : "-"}</td>
                      <td>{p.DEPT_DIV_SERV_SUBD || "-"}</td>
                      <td>{p.ADRESSE || "-"}</td>
                      <td>{p.FILIATION_ || "-"}</td>
                      <td>{p.FILIATION_2 || "-"}</td>
                      <td>{p.LIEUNAIS || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
}
