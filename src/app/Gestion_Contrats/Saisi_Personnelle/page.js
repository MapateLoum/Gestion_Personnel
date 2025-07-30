"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./formulaire.module.css";

export default function FormulairePersonnel() {
  const router = useRouter();

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
    filiation_: "",       // prénom du père
    filiation_2: "",      // nom complet de la mère
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

  const getRensPaieHtml = () => `
    <p>La société <strong>${formData.STE || "[Nom de la société]"}</strong> confirme que l'agent portant le matricule <strong>${formData.mle || "[matricule]"}</strong>, nommé <strong>${formData.nom || "[nom]"}</strong> ${formData.prenoms || "[prénom]"}, occupe le poste de <strong>${formData.intituleDuPoste || "[poste]"}</strong>.</p>
    <p>Il appartient à la catégorie <strong>${formData.categorie || "[catégorie]"}</strong> et est identifié par le code SAN <strong>${formData.codeSan || "[code SAN]"}</strong>.</p>
  `;

  const getNotifEmbaucheHtml = () => `
    <p>Nous informons que <strong>${formData.nom || "[nom]"}</strong> ${formData.prenoms || "[prénom]"}</p>
    <p>a été embauché(e) le <strong>${formData.dateEmbauche || "[date d'embauche]"}</strong>,</p>
    <p>au poste de <strong>${formData.intituleDuPoste || "[poste]"}</strong>,</p>
    <p>au sein du département/division/service <strong>${formData.deptDivServSubd || "[département]"}</strong>.</p>
  `;

  const getContratHtml = () => `
    <p>Le présent contrat atteste que <strong>${formData.nom || "[nom]"}</strong> ${formData.prenoms || "[prénom]"}</p>
    <p>occupe le poste de <strong>${formData.intituleDuPoste || "[poste]"}</strong> dans la catégorie <strong>${formData.categorie || "[catégorie]"}</strong>.</p>
    <p>Il/Elle a été embauché(e) le <strong>${formData.dateEmbauche || "[date d'embauche]"}</strong> sous le statut suivant : <strong>${formData.statut || "[statut]"}</strong>.</p>
  `;


  const printRensPaie = () => openPrintWindow("Renseignements de paie", getRensPaieHtml());
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
          <button type="button" onClick={printRensPaie} className={styles.printBtn} disabled={loading}>
            Rens. Paie
          </button>
          <button type="button" onClick={printNotifEmbauche} className={styles.printBtn} disabled={loading}>
            Notif. Embauche
          </button>
          <button type="button" onClick={printContrat} className={styles.printBtn} disabled={loading}>
            Contrat de travail
          </button>
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
