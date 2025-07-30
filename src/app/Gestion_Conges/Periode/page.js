"use client";

import { useState } from "react";
import styles from "./periode.module.css"; // adapte ce fichier CSS selon ton besoin
import { useRouter } from "next/navigation";

export default function ListeDesCongesParPeriode() {
  const router = useRouter();

  const [refDebut, setRefDebut] = useState("");
  const [refFin, setRefFin] = useState("");
  const [conges, setConges] = useState([]);
  const [message, setMessage] = useState("");

  const handleRetour = () => {
    router.back(); // fait revenir à la page précédente
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleRecherche = async () => {
    const debut = parseInt(refDebut);
    const fin = parseInt(refFin);

    if (isNaN(debut) || isNaN(fin) || debut >= fin) {
      showMessage("Références invalides ou mal ordonnées !");
      return;
    }

    try {
      const res = await fetch("/api/conges/periode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refDebut: debut, refFin: fin }),
      });

      const data = await res.json();
      if (res.ok) {
        setConges(data.conges);
        if (data.conges.length === 0) showMessage("Aucun congé trouvé.");
      } else {
        showMessage(data.error || "Erreur lors de la recherche.");
      }
    } catch (err) {
      showMessage("Erreur réseau.");
    }
  };

  const openPrintWindow = (title, contentHtml) => {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      alert("Veuillez autoriser les pop-ups pour l'impression.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; font-size: 12px; background: white; color: #000; }
            header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            header div { width: 150px; font-weight: bold; font-size: 14px; }
            header .left { text-transform: uppercase; }
            header .right { text-align: right; }
            header .date { font-size: 10px; margin-top: 10px; }
            .center { text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 10px; }
            .right { text-align: right; font-size: 12px; }
            .left { text-align: left; font-size: 12px; }
            .object { margin-top: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            table, th, td { border: 1px solid black; }
            th, td { padding: 5px; text-align: center; }
            tfoot { margin-top: 20px; }
            tfoot td { border: none; font-weight: normal; font-size: 12px; }
            .footer { margin-top: 40px; width: 100%; display: flex; justify-content: flex-end; font-size: 12px; }
            .footer .left-sign { flex-grow: 1; text-align: left; margin-right: 50px; }
            .footer .right-sign { text-align: right; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${contentHtml}
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleImpression = () => {
    const today = new Date().toLocaleDateString("fr-FR");

    const rowsHtml = conges
      .map((c) => {
        const nbj = parseInt(c.NJANC || 0);
        const njsuppl = parseInt(c.SUPPF || 0);
        const reliq = parseInt(c.RELIQT || 0);
        const njtotal = nbj + njsuppl + reliq;
        return `
          <tr>
            <td>${c.REF}</td>
            <td>${c.MLE}</td>
            <td>${c.PRENOMS || ""}</td>
            <td>${c.NOM || ""}</td>
            <td>${nbj}</td>
            <td>${njsuppl}</td>
            <td>${reliq}</td>
            <td>${njtotal}</td>
            <td>${c.DDEPART?.slice(0, 10) || ""}</td>
            <td>${c.DDRETOUR?.slice(0, 10) || ""}</td>
          </tr>
        `;
      })
      .join("");

    const contentHtml = `
    <div style="font-family: Arial, sans-serif; margin-bottom: 30px;">
      <header style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
        <div style="font-weight: bold; font-size: 28px; color: #003366; text-transform: uppercase;">
          INDORAMA
        </div>
        <div style="text-align: right;">
          <div style="font-weight: bold; font-size: 20px; color: #006699;">ICS</div>
          <div style="font-size: 14px; color: #333; margin-top: 4px;">
            Date : ${today}
          </div>
        </div>
      </header>

      <div style="text-align: center; font-weight: bold; font-size: 24px; color: #cc0000; margin-bottom: 10px;">
        NOTE INTERNE
      </div>

      <div style="text-align: right; font-size: 14px; font-weight: bold; color: #444; margin-bottom: 5px;">
        DE : RH MINE
      </div>

      <div style="text-align: right; font-size: 14px; font-weight: bold; color: #444; margin-bottom: 20px;">
        A : SCE PAIE
      </div>

      <div style="font-size: 14px; font-weight: normal; color: #444; margin-bottom: 30px;">
        N/Réf : 25/RH MINE/AL/KTN/242
      </div>

      <div style="font-size: 14px; margin-bottom: 20px;">
        <strong>Objet :</strong> Départs en congés
      </div>

      <div style="font-size: 14px; margin-bottom: 20px;">
        Veuillez mettre en position de congés payés les agents dont les noms suivent :
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; border: 1px solid black;">
        <thead>
          <tr>
            <th style="border: 1px solid black; padding: 5px;">Ref</th>
            <th style="border: 1px solid black; padding: 5px;">Mle</th>
            <th style="border: 1px solid black; padding: 5px;">Prénoms</th>
            <th style="border: 1px solid black; padding: 5px;">Nom</th>
            <th style="border: 1px solid black; padding: 5px;">NBJ</th>
            <th style="border: 1px solid black; padding: 5px;">NJSUPL</th>
            <th style="border: 1px solid black; padding: 5px;">Relqt</th>
            <th style="border: 1px solid black; padding: 5px;">NJTotal</th>
            <th style="border: 1px solid black; padding: 5px;">Départ</th>
            <th style="border: 1px solid black; padding: 5px;">Reprise</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <footer style="font-family: Arial, sans-serif; margin-top: 60px; display: flex; justify-content: flex-end; font-size: 12px; color: #444;">
        <div style="text-align: right; min-width: 150px;">
          Le Responsable RH
          <div style="height: 30px;"></div> <!-- espace vertical -->
          Alassane Lo
        </div>
      </footer>
    </div>
  `;

    openPrintWindow("Liste des Congés", contentHtml);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Liste des Congés par Période</h2>

      <div className={styles.formGroup}>
        <label>Réf Début :</label>
        <input
          type="number"
          value={refDebut}
          onChange={(e) => setRefDebut(e.target.value)}
          className={styles.input}
        />
        <label>Réf Fin :</label>
        <input
          type="number"
          value={refFin}
          onChange={(e) => setRefFin(e.target.value)}
          className={styles.input}
        />
        <div className={styles.buttons}>
          <button onClick={handleRetour} className={styles.buttonRetour}>
            Retour
          </button>
          <button onClick={handleRecherche} className={styles.buttonEnvoyer}>
            Rechercher
          </button>
          {conges.length > 0 && (
            <button onClick={handleImpression} className={styles.buttonRetour}>
              Imprimer
            </button>
          )}
        </div>
      </div>

      {message && <div className={styles.toast}>{message}</div>}

      {conges.length > 0 && (
        <div className={styles.liste}>
          <div className={styles.entete}>
            <span>Ref</span>
            <span>Mle</span>
            <span>Prénoms</span>
            <span>Nom</span>
            <span>NBJ</span>
            <span>NJSUPL</span>
            <span>Relqt</span>
            <span>NJTotal</span>
            <span>Départ</span>
            <span>Reprise</span>
          </div>
          {conges.map((c) => {
            const nbj = Number(c.NJANC) || 0;
            const njsuppl = Number(c.SUPPF) || 0;
            const reliq = Number(c.RELIQT) || 0;
            const njtotal = nbj + njsuppl + reliq;
            return (
              <div key={c.REF} className={styles.ligne}>
                <span>{c.REF}</span>
                <span>{c.MLE}</span>
                <span>{c.PRENOMS}</span>
                <span>{c.NOM}</span>
                <span>{nbj}</span>
                <span>{njsuppl}</span>
                <span>{reliq}</span>
                <span>{njtotal}</span>
                <span>{c.DDEPART?.slice(0, 10)}</span>
                <span>{c.DDRETOUR?.slice(0, 10)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
