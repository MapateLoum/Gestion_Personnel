"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./afficher_pers.module.css";

export default function AfficherPersonnel() {
  const router = useRouter();

  const [personnels, setPersonnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPersonnels = async () => {
      try {
        const res = await fetch("/api/personnel/afficher");
        const data = await res.json();
        if (res.ok && data.success) {
          setPersonnels(data.personnels);
        } else {
          setMessage(`❌ Erreur : ${data.error || "Impossible de charger"}`);
        }
      } catch (err) {
        setMessage("❌ Erreur réseau.");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnels();
  }, []);

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

      {loading && <p>Chargement...</p>}
      {message && <p>{message}</p>}

      {!loading && personnels.length > 0 && (
        <>
          <div id="print-zone" style={{ overflowX: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>STE</th>
                  <th>CODE_SAN</th>
                  <th>MLE (Matricule)</th>
                  <th>CODE</th>
                  <th>NOM</th>
                  <th>PRENOMS</th>
                  <th>INTITULE_DU_POSE</th>
                  <th>CODEPOSTE</th>
                  <th>STAT</th>
                  <th>CODSTAT</th>
                  <th>CATEGORIE</th>
                  <th>REG</th>
                  <th>DATE_NAIS</th>
                  <th>DATE_EMB</th>
                  <th>DATE_DEP</th>
                  <th>SEXE</th>
                  <th>NATION</th>
                  <th>SF</th>
                  <th>CONFESSION</th>
                  <th>PELERINAGE</th>
                  <th>NBEP</th>
                  <th>NBENF</th>
                  <th>BASE_HORAIRE</th>
                  <th>DEPT_DIV_SERV_SUBD</th>
                  <th>ADRESSE</th>
                  <th>FILIATION_</th>
                  <th>FILIATION_2</th>
                  <th>LIEUNAIS</th>
                  <th>LIEUTRAVAIL</th>
                  <th>PHOTO</th>
                </tr>
              </thead>
              <tbody>
                {personnels.map((p) => (
                  <tr key={p.MLE}>
                    <td>{p.STE || "-"}</td>
                    <td>{p.CODE_SAN || "-"}</td>
                    <td>{p.MLE || "-"}</td>
                    <td>{p.CODE || "-"}</td>
                    <td>{p.NOM || "-"}</td>
                    <td>{p.PRENOMS || "-"}</td>
                    <td>{p.INTITULE_DU_POSE || "-"}</td>
                    <td>{p.CODEPOSTE || "-"}</td>
                    <td>{p.STAT || "-"}</td>
                    <td>{p.CODSTAT || "-"}</td>
                    <td>{p.CATEGORIE || "-"}</td>
                    <td>{p.REG || "-"}</td>
                    <td>{p.DATE_NAIS ? new Date(p.DATE_NAIS).toLocaleDateString() : "-"}</td>
                    <td>{p.DATE_EMB ? new Date(p.DATE_EMB).toLocaleDateString() : "-"}</td>
                    <td>{p.DATE_DEP ? new Date(p.DATE_DEP).toLocaleDateString() : "-"}</td>
                    <td>{p.SEXE || "-"}</td>
                    <td>{p.NATION || "-"}</td>
                    <td>{p.SF || "-"}</td>
                    <td>{p.CONFESSION || "-"}</td>
                    <td>{p.PELERINAGE || "-"}</td>
                    <td>{p.NBEP !== undefined ? p.NBEP : "-"}</td>
                    <td>{p.NBENF !== undefined ? p.NBENF : "-"}</td>
                    <td>{p.BASE_HORAIRE || "-"}</td>
                    <td>{p.DEPT_DIV_SERV_SUBD || "-"}</td>
                    <td>{p.ADRESSE || "-"}</td>
                    <td>{p.FILIATION_ || "-"}</td>
                    <td>{p.FILIATION_2 || "-"}</td>
                    <td>{p.LIEUNAIS || "-"}</td>
                    <td>{p.LIEUTRAVAIL || "-"}</td>
                    <td>{p.PHOTO || "-"}</td>
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

      {!loading && personnels.length === 0 && <p>Aucun personnel trouvé.</p>}
    </main>
  );
}
