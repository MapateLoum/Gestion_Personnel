"use client";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./formulaire.module.css";

export default function FormulairePersonnel() {
  const router = useRouter();
  // 🔒 Protection par cookie et blocage retour
  useEffect(() => {
    const isLoggedIn = document.cookie
      .split("; ")
      .find((row) => row.startsWith("isLoggedIn="))
      ?.split("=")[1];

    if (isLoggedIn !== "true") {
      router.replace("/login");
    }

    window.onpopstate = () => {
      const stillLoggedIn = document.cookie
        .split("; ")
        .find((row) => row.startsWith("isLoggedIn="))
        ?.split("=")[1];

      if (stillLoggedIn !== "true") {
        router.replace("/login");
      }
    };
  }, [router]);

  const [formData, setFormData] = useState({
    mle: "",
    STE: "",
    nom: "",
    prenoms: "",
    intituleDuPoste: "", // correspond à INTITULE_DU_POSE en base
    categorie: "",
    codeSan: "", // correspond à CODE_SAN
    nbreEpouse: "",
    nbreEnfant: "",
    filiation_: "", // prénom du père
    filiation_2: "", // nom complet de la mère
    adresse: "",
    statut: "",
    reg: "",
    dateNaissance: "",
    lieuNaissance: "",
    dateEmbauche: "",
    sexe: "",
    nationalite: "",
    sf: "",
    confession: "",
    deptDivServSubd: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const openPrintWindow = (title, contentHtml) => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 30px 40px;
              color: #333;
              line-height: 1.6;
            }
            h1 {
              color: #076969;
              text-align: center;
              margin-bottom: 30px;
              text-transform: uppercase;
              letter-spacing: 1.5px;
            }
            p {
              margin-bottom: 20px;
              font-size: 16px;
            }
            strong {
              color: #076969;
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${contentHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // -- FONCTION PDF RENS PAIE supprimée --

 const getNotifEmbaucheHtml = () => {
  const nom = formData.nom || "[NOM]";
  const prenoms = formData.prenoms || "[PRÉNOMS]";
  const dateEmbauche = formData.dateEmbauche
    ? new Date(formData.dateEmbauche).toLocaleDateString("fr-FR")
    : "[DATE]";
  const mle = formData.mle || "[MATRIUCLE]";
  const intituleDuPoste = formData.intituleDuPoste || "[POSTE]";
  const deptDivServSubd = formData.deptDivServSubd || "[DIV/SERV]";
  const section = formData.section || "[SECTION]";
  const categorie = formData.categorie || "[CATEGORIE]";

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 14px; color: #000;">
      <p style="font-size: 18px; font-weight: bold; text-transform: uppercase;">Industries Chimiques du Sénégal</p>
      <p style="font-size: 15px; font-weight: bold; margin-top: -10px;">Direction du Site Minier</p>

      <br /><br />

      <p style="text-align: center; font-size: 20px; font-weight: bold; text-decoration: underline;">Notification d'embauche</p>
      <p style="text-align: center; font-size: 16px; font-weight: bold;">1<sup>er</sup> Contrat</p>

      <br /><br />

      <table style="width: 100%; font-size: 14px;">
        <tr>
          <td><strong>DE :</strong> D.G.P.A</td>
          <td style="text-align: right;"><strong>A :</strong> DRH</td>
        </tr>
        <tr>
          <td></td>
          <td style="text-align: right;">S FGPP Mine</td>
        </tr>
        <tr>
          <td></td>
          <td style="text-align: right;">SCE SÉCURITÉ</td>
        </tr>
        <tr>
          <td></td>
          <td style="text-align: right;">SCE MÉDICAL</td>
        </tr>
        <tr>
          <td></td>
          <td style="text-align: right;">SCE PAIE</td>
        </tr>
        <tr>
          <td></td>
          <td style="text-align: right;">HIÉRARCHIE AGENT</td>
        </tr>
        <tr>
          <td></td>
          <td style="text-align: right;">I P M</td>
        </tr>
      </table>

      <br /><br />

      <p><strong>Veuillez noter que ${nom} ${prenoms}</strong> est embauché(e) pour compter du <strong>${dateEmbauche}</strong> pour <strong>4 (quatre) mois renouvelables</strong>.</p>

      <p><strong>Matricule :</strong> ${mle}</p>
      <p><strong>Emploi occupé :</strong> ${intituleDuPoste}</p>
      <p><strong>Div/Serv :</strong> ${deptDivServSubd}</p>
      <p><strong>Section :</strong> ${section}</p>
      <p><strong>Catégorie :</strong> ${categorie}</p>

      <br /><br />

      <p style="text-align: right;"><strong><u>Le Chef Sce du Personnel</u></strong></p>
    </div>
  `;
};


  const getContratHtml = () => `
    <p>Le présent contrat atteste que <strong>${formData.nom || "[nom]"}</strong> ${formData.prenoms || "[prénom]"}</p>
    <p>occupe le poste de <strong>${formData.intituleDuPoste || "[poste]"}</strong> dans la catégorie <strong>${formData.categorie || "[catégorie]"}</strong>.</p>
    <p>Il/Elle a été embauché(e) le <strong>${formData.dateEmbauche || "[date d'embauche]"}</strong> sous le statut suivant : <strong>${formData.statut || "[statut]"}</strong>.</p>
  `;

  const generateRensPaieWord = () => {
    const doc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "titre",
            name: "Titre",
            basedOn: "Normal",
            next: "Normal",
            run: {
              size: 32,
              bold: true,
              color: "0e3d49",
              font: "Segoe UI",
              allCaps: true,
              spacing: { after: 300 },
            },
            paragraph: {
              alignment: "center",
              spacing: { after: 300 },
            },
          },
          {
  id: "headerLarge",
  name: "Header Large",
  basedOn: "Normal",
  next: "Normal",
  run: {
    size: 50, // 36pt
    color: "003e5e",
    font: "Segoe UI",
    bold: true,
  },
  paragraph: {
    alignment: "center",
    spacing: { after: 200 },
  },
},

          {
            id: "header",
            name: "Header",
            basedOn: "Normal",
            next: "Normal",
            run: {
              size: 20,
              color: "003e5e",
              font: "Segoe UI",
            },
            paragraph: {
              alignment: "center",
              spacing: { after: 150 },
            },
          },
          {
            id: "label",
            name: "Label",
            basedOn: "Normal",
            run: {
              size: 24,
              bold: true,
              color: "003e5e",
              font: "Segoe UI",
            },
            paragraph: {
              spacing: { after: 100 },
            },
          },
          {
            id: "value",
            name: "Value",
            basedOn: "Normal",
            run: {
              size: 24,
              font: "Segoe UI",
              color: "000000",
            },
            paragraph: {
              spacing: { after: 200 },
            },
          },
          {
            id: "signature",
            name: "Signature",
            basedOn: "Normal",
            run: {
              size: 24,
              bold: true,
              font: "Segoe UI",
              color: "0e3d49",
            },
            paragraph: {
              alignment: "right",
              spacing: { before: 500, after: 100 },
            },
          },
        ],
      },

      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
  text: "INDUSTRIES CHIMIQUES DU SÉNÉGAL",
  style: "headerLarge",
}),
new Paragraph({
  text:
    "SOCIÉTÉ ANONYME AU CAPITAL DE 115 000 000 FCFA\n" +
    "RC DAKAR N° 77-8-13\n" +
    "SIÈGE SOCIAL : KM 18 ROUTE DE RUFISQUE - MBAO - ZONE INDUSTRIELLE",
  style: "header",
}),

            ...[
              ["Matricule :", formData.mle || ""],
              ["Prénom(s) :", formData.prenoms || ""],
              ["Nom :", formData.nom || ""],
              ["Date de naissance :", formData.dateNaissance || ""],
              ["Lieu de naissance :", formData.lieuNaissance || ""],
              ["Adresse :", formData.adresse || ""],
              ["Nationalité :", formData.nationalite || ""],
              ["Poste :", formData.intituleDuPoste || ""],
              ["Catégorie :", formData.categorie || ""],
              ["Code SAN :", formData.codeSan || ""],
              ["Nombre d’épouse(s) :", formData.nbreEpouse || ""],
              ["Nombre d’enfants -14 ans non scolarisés :", formData.nbreEnfant || ""],
              ["Numéro IPRES :", "____________"],
              ["Numéro CSS :", "____________"],
              ["Numéro bancaire :", "____________"],
            ].flatMap(([label, value]) => [
              new Paragraph({ text: label, style: "label" }),
              new Paragraph({ text: value, style: "value" }),
            ]),
            new Paragraph({ text: "Le Responsable RH", style: "signature" }),
            new Paragraph({ text: "Alassane Lo", style: "signature" }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "Renseignements_Paie.docx");
    });
  };

  const printNotifEmbauche = () => openPrintWindow("Notification d'embauche", getNotifEmbaucheHtml());
  const printContrat = () => openPrintWindow("Contrat de travail", getContratHtml());

  const handleGoBack = () => router.back();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nom || !formData.prenoms || !formData.mle) {
      setMessage("❌ Veuillez remplir au moins le nom, prénom et matricule.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        mle: formData.mle,
        STE: formData.STE,
        nom: formData.nom,
        prenoms: formData.prenoms,
        intitule_du_poste: formData.intituleDuPoste,
        categorie: formData.categorie,
        code_san: formData.codeSan,
        nbreEpouse: formData.nbreEpouse,
        nbreEnfant: formData.nbreEnfant,
        filiation_: formData.filiation_,
        filiation_2: formData.filiation_2,
        adresse: formData.adresse,
        statut: formData.statut,
        reg: formData.reg,
        date_naissance: formData.dateNaissance,
        lieu_naissance: formData.lieuNaissance,
        date_embauche: formData.dateEmbauche,
        sexe: formData.sexe,
        nationalite: formData.nationalite,
        sf: formData.sf,
        confession: formData.confession,
        dept_div_serv_subd: formData.deptDivServSubd,
      };

      const res = await fetch("/api/personnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("✅ Personnel enregistré avec succès !");
      } else {
        setMessage(`❌ Erreur : ${data.error || "Échec de l'enregistrement."}`);
      }
    } catch (err) {
      setMessage("❌ Erreur réseau, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Formulaire Personnel</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {Object.entries(formData).map(([key, value]) => (
          <div className={styles.formGroup} key={key}>
            <label htmlFor={key}>
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/_/g, " ")
                .toUpperCase()}
            </label>
            <input
              type={
                key.toLowerCase().includes("date")
                  ? "date"
                  : key.toLowerCase().includes("nbre") || key.toLowerCase().includes("nb")
                  ? "number"
                  : "text"
              }
              id={key}
              name={key}
              className={styles.input}
              value={value}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        ))}

        <div className={styles.buttons}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Enregistrement..." : "Envoyer"}
          </button>

          <button
            type="button"
            onClick={generateRensPaieWord}
            className={styles.printBtn}
            disabled={loading}
          >
            Rens. Paie
          </button>

          <button
            type="button"
            onClick={printNotifEmbauche}
            className={styles.printBtn}
            disabled={loading}
          >
            Notif. Embauche
          </button>
          {/* <button
            type="button"
            onClick={printContrat}
            className={styles.printBtn}
            disabled={loading}
          >
            Contrat de travail
          </button> */}
          <button type="button" onClick={handleGoBack} className={styles.buttonRetour}>
            Retour
          </button>
        </div>

        {message && (
          <div
            className={`${styles.messagePopup} ${
              message.startsWith("✅") ? styles.successMsg : styles.errorMsg
            }`}
            role="alert"
            aria-live="assertive"
          >
            {message}
          </div>
        )}
      </form>
    </main>
  );
}
