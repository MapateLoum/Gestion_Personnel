"use client";

import { useState, useEffect } from "react";
import styles from "./edit.module.css";
import { useRouter } from "next/navigation";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import { saveAs } from "file-saver";
export default function EditCongeForm() {
  const [formData, setFormData] = useState({ matricule: "", refConge: "" });
  const [message, setMessage] = useState("");
  const [agentConge, setAgentConge] = useState(null);
  const router = useRouter();

  // Protection isLoggedIn
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

  const handleRetour = () => {
    router.back();
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAgentConge(null);

    if (!formData.matricule.trim() || !formData.refConge.trim()) {
      showMessage("Merci de renseigner matricule et référence du congé.");
      return;
    }

    try {
      const res = await fetch("/api/conges/verif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricule: formData.matricule.trim(),
          refConge: formData.refConge.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.error || "Erreur lors de la vérification.");
        return;
      }

      setAgentConge(data);
      showMessage("✅ Données récupérées avec succès.");
    } catch {
      showMessage("Erreur réseau.");
    }
  };

  // Formater date au format ISO (yyyy-mm-dd)
  const formatDateISO = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Impression (simple, sans recalcul)
//   const imprimerBulletin = () => {
//     if (!agentConge) return;

//     const { agent, conge, joursAcquis, dernierRetour } = agentConge;

//     // Pour la durée totale, on utilise directement joursAcquis + autres jours déjà dans conge
//     const anciennete = parseInt(conge.NJANC) || 0;
//     const medaille = parseInt(conge.NJMEDAILLE) || 0;
//     const reliquat = parseInt(conge.RELIQT) || 0;
//     const intercalaire = parseInt(conge.INTERC) || 0;
//     const suppFemme = parseInt(conge.SUPPF) || 0;

//     // Durée totale (brute)
//     const dureeTotale =
//       joursAcquis + medaille + reliquat + suppFemme + anciennete - intercalaire;

//     const dateDepart = new Date(conge.DDEPART);
//     const dateReprise = new Date(dateDepart);
//     dateReprise.setDate(dateReprise.getDate() + dureeTotale - 1);

//     const html = `
//       <div style="font-family: Arial, sans-serif; margin: 30px; color: #000;">
//         <header style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
//           <div style="font-weight: bold; font-size: 22px; text-transform: uppercase; color:#003366;">
//             INDORAMA
//           </div>
//           <div style="text-align: right; font-weight: bold; font-size: 22px; color:#006699;">
//             ICS
//           </div>
//         </header>
//         <header style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 30px;">
//           <div style="font-weight: normal; color: #444;">
//             DSMPH-MINE
//           </div>
//           <div style="font-weight: normal; color: #444;">
//             ${new Date().toLocaleDateString("fr-FR")}
//           </div>
//         </header>

//         <div style="font-weight: bold; font-size: 18px; margin-bottom: 20px;">
//           Bulletin de congé
//           <span style="margin-left: 15px;">N° ${conge.REF}</span>
//         </div>

//         <div style="display: flex; gap: 30px; margin-bottom: 8px; flex-wrap: wrap;">
//           <div style="min-width: 45%;">Prénoms : <strong>${agent.PRENOMS}</strong></div>
//           <div style="min-width: 45%;">Nom : <strong>${agent.NOM}</strong></div>
//         </div>
//         <div style="display: flex; gap: 30px; margin-bottom: 8px; flex-wrap: wrap;">
//           <div style="min-width: 45%;">Emploi : <strong>${agent.INTITULE_DU_POSE}</strong></div>
//           <div style="min-width: 45%;">Catégorie : <strong>${agent.CATEGORIE}</strong></div>
//         </div>
//         <div style="display: flex; gap: 30px; margin-bottom: 8px; flex-wrap: wrap;">
//           <div style="min-width: 45%;">Date d'embauche : <strong>${formatDateISO(
//             agent.DATE_EMB
//           )}</strong></div>
//           <div style="min-width: 45%;">Ancienneté : <strong>${anciennete} ans</strong></div>
//         </div>

//         <div
//           style="
//             border: 1px solid #444;
//             padding: 15px;
//             line-height: 1.5;
//             margin-top: 20px;
//             margin-bottom: 25px;
//           "
//         >
//           <div>Matricule : <strong>${agent.MLE}</strong></div>
//           <div>
//             Période de référence du <strong>${formatDateISO(
//               dernierRetour
//             ) || "N/A"}</strong> au
//             <strong>${formatDateISO(conge.DDEPART)}</strong>, soit
//             <strong>${joursAcquis} jours</strong> de congé ordinaire.
//           </div>
//           <br />
//           <div>
//             <strong style="text-decoration: underline; font-weight: bold;">
//               Congé supplémentaire rémunérés :
//             </strong>
//           </div>
//           <div>
//             ${anciennete} jour(s) pour ancienneté,
//             ${medaille} jour(s) pour la médaille d'honneur du travail,
//             ${reliquat} jour(s) pour reliquat sur congés antérieurs,
//             ${intercalaire} jour(s) pour congé intercalaire,
//             ${suppFemme} jour(s) pour supplément femme salariée.
//           </div>
//           <br />
//           <div>Durée totale du congé : <strong>${dureeTotale} jours</strong></div>
//           <br />
//           <div style="display: flex; gap: 30px; flex-wrap: wrap;">
//             <div style="min-width: 45%;">Date de départ : <strong>${formatDateISO(
//               conge.DDEPART
//             )}</strong></div>
//             <div style="min-width: 45%;">
//               Date de reprise prévue : <strong>${formatDateISO(
//                 dateReprise.toISOString()
//               )}</strong>
//             </div>
//           </div>
//           <br />
//           <div>Observations : <em>${conge.OBSERVATIONS || "Aucune"}</em></div>
//         </div>

//         <div style="text-align: center; font-weight: bold; font-size: 20px; margin-bottom: 15px;">
//           Attestation de congés
//         </div>

//         <div style="font-size: 16px; line-height: 1.5;">
//           Nous soussignés INDUSTRIES CHIMIQUES DU SENEGAL, attestons que
//           l'agent <strong>${agent.PRENOMS} ${agent.NOM}</strong> qui occupe le poste de
//           <strong>${agent.INTITULE_DU_POSE}</strong> est bénéficiaire d'un congé annuel pour la période
//           du <strong>${formatDateISO(conge.DDEPART)}</strong> au
//           <strong>${formatDateISO(dateReprise.toISOString())}</strong>.
//         </div>

//         <div style="margin-top: 20px;">
//           La date de retour est prévue le <strong>${formatDateISO(dateReprise.toISOString())}</strong>.
//         </div>

//         <div style="margin-top: 20px;">
//           En foi de quoi, nous lui délivrons le présent pour servir et valoir ce que de droit.
//         </div>

//         <div style="text-align: right; margin-top: 80px; font-weight: bold;">
//   Le responsable RH
//   <br />
//   <br />
//   <br />
//   <div style="text-align: right; margin-right: 22px;">
//     Alassane Lo
//   </div>
// </div>
//     `;

//     const printWindow = window.open("", "_blank", "width=900,height=700");
//     if (!printWindow) {
//       alert("Veuillez autoriser les popups pour imprimer.");
//       return;
//     }
//     printWindow.document.write(html);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//   };
const genererBulletinWord = async () => {
  if (!agentConge) return;

  const { agent, conge, joursAcquis, dernierRetour } = agentConge;

  const anciennete = parseInt(conge.NJANC) || 0;
  const medaille = parseInt(conge.NJMEDAILLE) || 0;
  const reliquat = parseInt(conge.RELIQT) || 0;
  const intercalaire = parseInt(conge.INTERC) || 0;
  const suppFemme = parseInt(conge.SUPPF) || 0;

  const dureeTotale = joursAcquis + medaille + reliquat + suppFemme + anciennete - intercalaire;

  const dateDepart = new Date(conge.DDEPART);
  const dateReprise = new Date(dateDepart);
  dateReprise.setDate(dateReprise.getDate() + dureeTotale - 1);

  const format = (d) => {
    const dt = new Date(d);
    if (isNaN(dt)) return "";
    return dt.toISOString().split("T")[0];
  };

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Entête : INDORAMA à gauche
        // 1ère ligne : INDORAMA à gauche
new Paragraph({
  alignment: AlignmentType.LEFT,
  children: [
    new TextRun({
      text: "INDORAMA",
      bold: true,
      color: "003366",
      size: 32,
    }),
  ],
}),
// 1ère ligne : ICS à droite
new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [
    new TextRun({
      text: "ICS",
      bold: true,
      color: "006699",
      size: 32,
    }),
  ],
}),
// 2ème ligne : DSMPH-MINE à gauche (plus petite police, interligne réduit)
new Paragraph({
  alignment: AlignmentType.LEFT,
  spacing: { before: 0, after: 100, line: 200 }, // line: valeur en twips (~200 = 10pt)
  children: [
    new TextRun({
      text: "DSMPH-MINE",
      color: "444444",
      size: 18, // plus petit que 24
    }),
  ],
}),
// 2ème ligne : date à droite (plus petite police, interligne réduit)
new Paragraph({
  alignment: AlignmentType.RIGHT,
  spacing: { before: 0, after: 100, line: 200 },
  children: [
    new TextRun({
      text: new Date().toLocaleDateString("fr-FR"),
      color: "444444",
      size: 18,
    }),
  ],
}),


          new Paragraph({ text: "", spacing: { after: 200 } }),

          // Titre
          new Paragraph({
            text: `Bulletin de congé - N° ${conge.REF}`,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          // Bloc encadré avec bordure
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                      bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                      left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                      right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
                    },
                    children: [
                      new Paragraph({ text: `Matricule : ${agent.MLE || "N/A"}`, spacing: { after: 100 } }),
                      new Paragraph({
                        text: `Période de référence du ${format(dernierRetour) || "N/A"} au ${format(conge.DDEPART)}, soit ${joursAcquis} jours de congé ordinaire.`,
                        spacing: { after: 100 },
                      }),
                      new Paragraph({
                        text: "Congé supplémentaire rémunéré :",
                        bold: true,
                        spacing: { after: 100 },
                      }),
                      new Paragraph({
                        text: `${anciennete} jour(s) pour ancienneté, ${medaille} jour(s) médaille, ${reliquat} jour(s) reliquat, ${intercalaire} jour(s) intercalaire, ${suppFemme} jour(s) femme salariée.`,
                        spacing: { after: 100 },
                      }),
                      new Paragraph({
                        text: `Durée totale du congé : ${dureeTotale} jours`,
                        spacing: { after: 100 },
                      }),
                      new Paragraph({
                        text: `Date de départ : ${format(conge.DDEPART)}    Date de reprise prévue : ${format(dateReprise)}`,
                        spacing: { after: 100 },
                      }),
                      new Paragraph({
                        text: `Observations : ${conge.OBSERVATIONS || "Aucune"}`,
                        italics: true,
                        spacing: { after: 100 },
                      }),
                    ],
                  }),
                ],
              }),
            ],
            width: {
              size: 100,
              type: "pct",
            },
          }),

          // Attestation (reste inchangé)
          new Paragraph({
            text: "Attestation de congé",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: `Nous soussignés INDUSTRIES CHIMIQUES DU SENEGAL, attestons que l'agent ${agent.PRENOMS} ${agent.NOM}, poste ${agent.INTITULE_DU_POSE}, est bénéficiaire d'un congé annuel du ${format(
              conge.DDEPART
            )} au ${format(dateReprise)}.`,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `La date de retour est prévue le ${format(dateReprise)}.`,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "En foi de quoi, nous lui délivrons le présent pour servir et valoir ce que de droit.",
            spacing: { after: 300 },
          }),

          // Signature
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: "Le Responsable RH", bold: true }),
              new TextRun({ text: "\n\n\nAlassane Lo", bold: true }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `bulletin_conge_${conge.REF}.docx`);
};


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Édition de congé</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="matricule" className={styles.label}>
            Matricule
          </label>
          <input
            id="matricule"
            name="matricule"
            type="text"
            value={formData.matricule}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="refConge" className={styles.label}>
            Référence congé
          </label>
          <input
            id="refConge"
            name="refConge"
            type="text"
            value={formData.refConge}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.btnGroup}>
          <button type="submit" className={styles.btnSubmit}>
            Vérifier & afficher bulletin
          </button>
          <button onClick={handleRetour} className={styles.btnRetour} type="button">
            Retour
          </button>
        </div>
      </form>

      {message && <div className={styles.message}>{message}</div>}

      {/* {agentConge && (
        <button onClick={imprimerBulletin} className={styles.btnPrint}>
          Imprimer le bulletin de congé
        </button>
      )} */}
      {agentConge && (
  <button onClick={genererBulletinWord} className={styles.btnPrint}>
    Télécharger le bulletin (Word)
  </button>
)}


    </div>
  );
}
