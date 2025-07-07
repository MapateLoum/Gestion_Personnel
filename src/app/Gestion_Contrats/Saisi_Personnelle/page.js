"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./formulaire.module.css";

export default function FormulairePersonnel() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    STE: "",
    matricule: "",
    nom: "",
    prenom: "",
    poste: "",
    categorie: "",
    codeSAN: "",
    nbreEpouse: "",
    nbreEnfant: "",
    nomPere: "",
    nomMere: "",
    adresse: "",
    statut: "",
    regime: "",
    dateNaissance: "",
    lieuNaissance: "",
    dateEmbauche: "",
    sexe: "",
    nationalite: "",
    situationFamiliale: "",
    confession: "",
    departDivSer: "",
  });

  const [message, setMessage] = useState(""); // <-- nouveau

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const getRensPaieHtml = () => `
    <p>La société <strong>${formData.STE || "[Nom de la société]"}</strong> confirme que l'agent portant le matricule <strong>${formData.matricule || "[matricule]"}</strong>, nommé <strong>${formData.nom || "[nom]"}</strong> ${formData.prenom || "[prénom]"}, occupe le poste de <strong>${formData.poste || "[poste]"}</strong>.</p>
    <p>Il appartient à la catégorie <strong>${formData.categorie || "[catégorie]"}</strong> et est identifié par le code SAN <strong>${formData.codeSAN || "[code SAN]"}</strong>.</p>
  `;

  const getNotifEmbaucheHtml = () => `
    <p>Nous informons que <strong>${formData.nom || "[nom]"}</strong> ${formData.prenom || "[prénom]"}</p>
    <p>a été embauché(e) le <strong>${formData.dateEmbauche || "[date d'embauche]"}</strong>,</p>
    <p>au poste de <strong>${formData.poste || "[poste]"}</strong>,</p>
    <p>au sein du département/division/service <strong>${formData.departDivSer || "[département]"}</strong>.</p>
  `;

  const getContratHtml = () => `
    <p>Le présent contrat atteste que <strong>${formData.nom || "[nom]"}</strong> ${formData.prenom || "[prénom]"}</p>
    <p>occupe le poste de <strong>${formData.poste || "[poste]"}</strong> dans la catégorie <strong>${formData.categorie || "[catégorie]"}</strong>.</p>
    <p>Il/Elle a été embauché(e) le <strong>${formData.dateEmbauche || "[date d'embauche]"}</strong> sous le statut suivant : <strong>${formData.statut || "[statut]"}</strong>.</p>
  `;

  const getAttestationHtml = () => `
    <p>Nous attestons que <strong>${formData.nom || "[nom]"}</strong> ${formData.prenom || "[prénom]"}</p>
    <p>est employé(e) par la société <strong>${formData.STE || "[Nom de la société]"}</strong>,</p>
    <p>occupant le poste de <strong>${formData.poste || "[poste]"}</strong> depuis le <strong>${formData.dateEmbauche || "[date d'embauche]"}</strong>.</p>
    <p>Il/Elle fait partie du département/division/service <strong>${formData.departDivSer || "[département]"}</strong>,</p>
    <p>et son statut est <strong>${formData.statut || "[statut]"}</strong>.</p>
  `;

  const printRensPaie = () => openPrintWindow("Renseignements de paie", getRensPaieHtml());
  const printNotifEmbauche = () => openPrintWindow("Notification d'embauche", getNotifEmbaucheHtml());
  const printContrat = () => openPrintWindow("Contrat de travail", getContratHtml());
  const printAttestation = () => openPrintWindow("Attestation de travail", getAttestationHtml());

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = formData.nom && formData.prenom && formData.matricule;
    if (isValid) {
      setMessage("✅ Données acceptées avec succès !");
    } else {
      setMessage("❌ Échec : veuillez remplir au moins le nom, prénom et matricule.");
    }
  };

  const handleGoBack = () => router.back();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Formulaire Personnel</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {Object.entries(formData).map(([key, value]) => (
          <div className={styles.formGroup} key={key}>
            <label htmlFor={key}>{key.replace(/([A-Z])/g, " $1")}</label>
            <input
              type={key.includes("date") ? "date" : key.includes("nbre") ? "number" : "text"}
              id={key}
              name={key}
              className={styles.input}
              value={value}
              onChange={handleChange}
              min={key.includes("nbre") ? "0" : undefined}
            />
          </div>
        ))}

        <div className={styles.buttons}>
          <button type="submit" className={styles.submitBtn}>Envoyer</button>
          <button type="button" onClick={printRensPaie} className={styles.printBtn}>Rens. Paie</button>
          <button type="button" onClick={printNotifEmbauche} className={styles.printBtn}>Notif Embauche</button>
          <button type="button" onClick={printContrat} className={styles.printBtn}>Contrat</button>
          <button type="button" onClick={printAttestation} className={styles.printBtn}>Attestation</button>
          <button type="button" onClick={handleGoBack} className={styles.buttonRetour}>Retour</button>
        </div>

        {message && <p className={styles.message}>{message}</p>}
      </form>
    </main>
  );
}
