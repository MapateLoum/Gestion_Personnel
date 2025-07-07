"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./saisi.module.css";

export default function SaisieConges() {
  const [formData, setFormData] = useState({
    matricule: "",
    anciennete: "",
    dateDepart: "",
    dateRetour: "",
    medaille: "",
    reliquat: "",
    intercalaire: "",
    observations: "",
    supplFemme: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification que tous les champs sont remplis
    const allFilled = Object.values(formData).every((val) => val.trim() !== "");
    if (!allFilled) {
      setMessage("Tous les champs doivent être remplis avant d'envoyer.");
      return;
    }

    // Vérifier que dateDepart < dateRetour
    const dateDepart = new Date(formData.dateDepart);
    const dateRetour = new Date(formData.dateRetour);
    if (dateDepart >= dateRetour) {
      setMessage("La date de départ doit être antérieure à la date de retour.");
      return;
    }

    setMessage("Données envoyées avec succès !");
  };

  const imprimer = () => {
    const {
      matricule,
      anciennete,
      dateDepart,
      dateRetour,
      medaille,
      reliquat,
      intercalaire,
      observations,
      supplFemme,
    } = formData;

    const content = `
      <h2>Attestation Administrative de Congés</h2>
      <p>Par la présente, il est certifié que l'agent portant le matricule <strong>${matricule || "[non renseigné]"}</strong>, ayant une ancienneté de <strong>${anciennete || "[non renseigné]"}</strong> années,</p>
      <p>a bénéficié d'un congé dont la période s'étend du <strong>${dateDepart || "[non renseigné]"}</strong> au <strong>${dateRetour || "[non renseigné]"}</strong>.</p>
      <p>Durant cette période, les éléments suivants sont à noter :</p>
      <ul>
        <li><strong>Médaille :</strong> ${medaille || "Aucune"}</li>
        <li><strong>Reliquat :</strong> ${reliquat || "Aucun"}</li>
        <li><strong>Intercalaire :</strong> ${intercalaire || "Non applicable"}</li>
        <li><strong>Supplément femme :</strong> ${supplFemme || "Non applicable"}</li>
      </ul>
      <p><strong>Observations :</strong> ${observations || "Aucune observation particulière."}</p>
      <p>Cette attestation est délivrée pour servir et valoir ce que de droit.</p>
      <p>Fait à [Lieu], le ${new Date().toLocaleDateString()}.</p>
      <p>Signature de l'autorité compétente</p>
    `;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Attestation de congés</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 30px;
              color: #333;
              line-height: 1.5;
            }
            h2 {
              color: #076969;
              text-align: center;
              margin-bottom: 20px;
              text-transform: uppercase;
              letter-spacing: 1.2px;
            }
            p {
              font-size: 16px;
              margin: 12px 0;
            }
            ul {
              margin-left: 20px;
              margin-bottom: 20px;
            }
            li {
              font-size: 16px;
              margin: 6px 0;
            }
            strong {
              color: #076969;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Saisie des congés</h1>
        <Link href="/Gestion_Conges" className={styles.backLink}>
          ← Retour
        </Link>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="matricule">Matricule :</label>
        <input
          type="text"
          id="matricule"
          name="matricule"
          value={formData.matricule}
          onChange={handleChange}
          required
        />

        <label htmlFor="anciennete">Ancienneté (années) :</label>
        <input
          type="number"
          id="anciennete"
          name="anciennete"
          min="0"
          value={formData.anciennete}
          onChange={handleChange}
          required
        />

        <label htmlFor="dateDepart">Date départ :</label>
        <input
          type="date"
          id="dateDepart"
          name="dateDepart"
          value={formData.dateDepart}
          onChange={handleChange}
          required
        />

        <label htmlFor="dateRetour">Date retour :</label>
        <input
          type="date"
          id="dateRetour"
          name="dateRetour"
          value={formData.dateRetour}
          onChange={handleChange}
          required
        />

        <label htmlFor="medaille">Médaille :</label>
        <input
          type="text"
          id="medaille"
          name="medaille"
          value={formData.medaille}
          onChange={handleChange}
        />

        <label htmlFor="reliquat">Reliquat :</label>
        <input
          type="text"
          id="reliquat"
          name="reliquat"
          value={formData.reliquat}
          onChange={handleChange}
        />

        <label htmlFor="intercalaire">Intercalaire :</label>
        <input
          type="text"
          id="intercalaire"
          name="intercalaire"
          value={formData.intercalaire}
          onChange={handleChange}
        />

        <label htmlFor="observations">Observations :</label>
        <textarea
          id="observations"
          name="observations"
          value={formData.observations}
          onChange={handleChange}
          rows={4}
        />

        <label htmlFor="supplFemme">Supplément femme :</label>
        <input
          type="text"
          id="supplFemme"
          name="supplFemme"
          value={formData.supplFemme}
          onChange={handleChange}
        />

        <div className={styles.buttons}>
          <button type="submit">Envoyer</button>
          <button type="button" onClick={imprimer} className={styles.printBtn}>
            Imprimer
          </button>
        </div>

        {message && (
          <p
            className={
              message.includes("succès") ? styles.acceptMsg : styles.rejectMsg
            }
            style={{ marginTop: "15px", fontWeight: "bold" }}
          >
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
