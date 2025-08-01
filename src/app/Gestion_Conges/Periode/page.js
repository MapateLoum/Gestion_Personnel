"use client";

import { useState, useEffect } from "react";
import styles from "./periode.module.css"; // adapte ce fichier CSS selon ton besoin
import { useRouter } from "next/navigation";
import {
  Document,
  Paragraph,
  Packer,
  TextRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  AlignmentType,
  WidthType,
  HeadingLevel,
  TabStopType,
} from "docx";

import { saveAs } from "file-saver";

export default function ListeDesCongesParPeriode() {
  const router = useRouter();

  // Protection accès : vérifier cookie isLoggedIn
  useEffect(() => {
    const isLoggedIn = document.cookie
      .split("; ")
      .find((row) => row.startsWith("isLoggedIn="))
      ?.split("=")[1];

    if (isLoggedIn !== "true") {
      router.replace("/login");
    }

    // Protection contre retour arrière après déconnexion
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

  const genererListeCongeWord = async (conges) => {
  if (!conges || conges.length === 0) return;

  const today = new Date().toLocaleDateString("fr-FR");

  // Construire les lignes du tableau
  const rows = conges.map((c) => {
    const nbj = Number(c.NJANC) || 0;
    const njsuppl = Number(c.SUPPF) || 0;
    const reliq = Number(c.RELIQT) || 0;
    const njtotal = nbj + njsuppl + reliq;

    return new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(String(c.REF))], borders: { top: {style: BorderStyle.SINGLE, size: 1, color: "000000" }, bottom: {style: BorderStyle.SINGLE, size: 1, color: "000000" }, left: {style: BorderStyle.SINGLE, size: 1, color: "000000" }, right: {style: BorderStyle.SINGLE, size: 1, color: "000000" }} }),
        new TableCell({ children: [new Paragraph(String(c.MLE))], borders: { /* idem */ } }),
        new TableCell({ children: [new Paragraph(c.PRENOMS || "")], borders: { /* idem */ } }),
        new TableCell({ children: [new Paragraph(c.NOM || "")], borders: { /* idem */ } }),
        new TableCell({ children: [new Paragraph(String(nbj))], borders: { /* idem */ } }),
        new TableCell({ children: [new Paragraph(String(njsuppl))], borders: { /* idem */ } }),
        new TableCell({ children: [new Paragraph(String(reliq))], borders: { /* idem */ } }),
        new TableCell({ children: [new Paragraph(String(njtotal))], borders: { /* idem */ } }),
        new TableCell({ children: [new Paragraph(c.DDEPART?.slice(0, 10) || "")], borders: { /* idem */ } }),
        new TableCell({ children: [new Paragraph(c.DDRETOUR?.slice(0, 10) || "")], borders: { /* idem */ } }),
      ],
    });
  });

  // En-tête tableau
  const headerRow = new TableRow({
    children: [
      "Ref", "Mle", "Prénoms", "Nom", "NBJ", "NJSUPL", "Relqt", "NJTotal", "Départ", "Reprise"
    ].map(text =>
      new TableCell({
        children: [new Paragraph({
          text,
          bold: true,
          alignment: AlignmentType.CENTER,
        })],
        shading: { fill: "cccccc" },
        borders: {
  top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
}

      })
    ),
  });

  const table = new Table({
    rows: [headerRow, ...rows],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });

  const doc = new Document({
    sections: [{
      children: [
        // En-tête flex simulé avec 2 Paragraphs alignés
      new Paragraph({
  children: [
    new TextRun({ text: "INDORAMA", bold: true, color: "003366", size: 32 }),
    new TextRun({
      text: "\tICS",
      bold: true,
      color: "006699",
      size: 32,
    }),
  ],
  tabStops: [
    {
      type: TabStopType.RIGHT,
      position: 9000, // position haute vers la droite (valeur en twips, 1 twip = 1/20 pt)
    },
  ],
}),


// Paragraphe Date (taille plus petite, couleur gris foncé, aligné à droite)
new Paragraph({
  text: `Date : ${today}`,
  size: 16,
  color: "333333",
  alignment: AlignmentType.RIGHT,
  spacing: { after: 200 },
}),


        // Titre "NOTE INTERNE"
        new Paragraph({
          text: "NOTE INTERNE",
          alignment: AlignmentType.CENTER,
          bold: true,
          color: "cc0000",
          spacing: { after: 200 },
          heading: HeadingLevel.HEADING_2,
        }),

        // Ligne droite "DE : RH MINE"
        new Paragraph({
          text: "DE : RH MINE",
          alignment: AlignmentType.RIGHT,
          bold: true,
          color: "444444",
          spacing: { after: 100 },
        }),

        // Ligne droite "A : SCE PAIE"
        new Paragraph({
          text: "A : SCE PAIE",
          alignment: AlignmentType.RIGHT,
          bold: true,
          color: "444444",
          spacing: { after: 200 },
        }),

        // N/Réf
        new Paragraph({
          text: "N/Réf : 25/RH MINE/AL/KTN/242",
          spacing: { after: 200 },
          color: "444444",
          size: 20,
        }),

        // Objet
        new Paragraph({
          children: [
            new TextRun({ text: "Objet : ", bold: true, }),
            new TextRun("Départs en congés"),
          ],
          spacing: { after: 200 },
          size: 28,
        }),

        // Instruction
        new Paragraph({
          text: "Veuillez mettre en position de congés payés les agents dont les noms suivent :",
          spacing: { after: 200 },
          size: 20,
        }),

        // Table des congés
        table,

        // Pied de page avec signature à droite
        new Paragraph({
          text: "\n\n", // espace avant signature
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Le Responsable RH", bold: false }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          text: "\n\n", // espace
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Alassane Lo", bold: false }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `liste_conges_${today.replace(/\//g, "-")}.docx`);
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
  <button onClick={() => genererListeCongeWord(conges)} className={styles.buttonRetour}>
    Télécharger en Word
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
