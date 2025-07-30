"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./afficher_pers.module.css";
export default function AfficherPersonnel() {
  const router = useRouter();

  const [personnels, setPersonnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchMatricule, setSearchMatricule] = useState("");
  const [filteredPersonnels, setFilteredPersonnels] = useState([]);
useEffect(() => {
  if (message) {
    const timer = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timer);
  }
}, [message]);
  // Chargement initial de tout le personnel
  const fetchPersonnels = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/personnel/afficher");
      const data = await res.json();
      if (res.ok && data.success) {
        setPersonnels(data.personnels);
        setFilteredPersonnels(data.personnels);
      } else {
        setMessage(`❌ Erreur : ${data.error || "Impossible de charger"}`);
        setPersonnels([]);
        setFilteredPersonnels([]);
      }
    } catch (err) {
      setMessage("❌ Erreur réseau.");
      setPersonnels([]);
      setFilteredPersonnels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnels();
  }, []);

  // Rechercher un agent par matricule
  const handleSearch = () => {
    if (!searchMatricule.trim()) {
      setMessage("❌ Veuillez saisir un matricule pour la recherche.");
      return;
    }
    setMessage("");
    const found = personnels.filter(
      (p) => p.MLE.toString().toLowerCase() === searchMatricule.trim().toLowerCase()
    );
    if (found.length === 0) {
      setMessage("❌ Aucun agent trouvé avec ce matricule.");
      setFilteredPersonnels([]);
    } else {
      setFilteredPersonnels(found);
    }
  };

  // Afficher tout le personnel (réinitialiser filtre)
  const handleReset = () => {
    setFilteredPersonnels(personnels);
    setMessage("");
    setSearchMatricule("");
  };

  const handlePrint = () => {
    const printContent = document.getElementById("print-zone").innerHTML;
    const printWindow = window.open("", "", "width=1200,height=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Liste du Personnel</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
            th { background: #076969; color: white; }
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; color: #076969; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h2>Liste du Personnel</h2>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Liste du Personnel</h1>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Rechercher par matricule"
          value={searchMatricule}
          onChange={(e) => setSearchMatricule(e.target.value)}
          style={{
            padding: "6px 10px",
            fontSize: "14px",
            width: "220px",
            marginRight: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button onClick={handleSearch} className={styles.printBtn}>
          Rechercher
        </button>
        <button
          onClick={handleReset}
          className={styles.buttonRetour}
          style={{ marginLeft: "10px" }}
        >
          Afficher tout
        </button>
      </div>

      {loading && <p>Chargement...</p>}
      {message && (
  <div className={styles.toast}>{message}</div>
)}

      {!loading && filteredPersonnels.length > 0 && (
        <>
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
                {filteredPersonnels.map((p) => (
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

          <button className={styles.printBtn} onClick={handlePrint}>
            Imprimer la liste
          </button>
          <button
            className={styles.buttonRetour}
            onClick={handleGoBack}
            style={{ marginLeft: "10px" }}
          >
            Retour
          </button>
        </>
      )}

      {!loading && filteredPersonnels.length === 0 && !message && (
        <p>Aucun personnel trouvé.</p>
      )}
    </main>
  );
}
