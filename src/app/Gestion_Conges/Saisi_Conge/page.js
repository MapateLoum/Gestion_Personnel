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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Vérifier que tous les champs sont remplis
    const allFilled = Object.values(formData).every(
      (val) => val !== null && val.toString().trim() !== ""
    );
    if (!allFilled) {
      setMessage("Tous les champs doivent être remplis avant d'envoyer.");
      return;
    }

    // Vérifier dates côté client (optionnel)
    const dateDepart = new Date(formData.dateDepart);
    const dateRetour = new Date(formData.dateRetour);
    if (dateDepart >= dateRetour) {
      setMessage("La date de départ doit être antérieure à la date de retour.");
      return;
    }

    try {
      const res = await fetch("/api/conges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Congé enregistré avec succès !");
        // Optionnel : reset form
        // setFormData({ matricule: "", anciennete: "", dateDepart: "", dateRetour: "", medaille: "", reliquat: "", intercalaire: "", observations: "", supplFemme: "" });
      } else if (res.status === 409) {
        // Conflit chevauchement dates
        setMessage(data.message || "Erreur : chevauchement de congé.");
      } else {
        setMessage(data.message || "Erreur serveur, veuillez réessayer.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur réseau, veuillez réessayer.");
    }
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
      <p>Matricule: <strong>${matricule}</strong></p>
      <p>Ancienneté: <strong>${anciennete}</strong> ans</p>
      <p>Du <strong>${dateDepart}</strong> au <strong>${dateRetour}</strong></p>
      <ul>
        <li>Médaille: ${medaille}</li>
        <li>Reliquat: ${reliquat}</li>
        <li>Intercalaire: ${intercalaire}</li>
        <li>Supplément femme: ${supplFemme}</li>
      </ul>
      <p>Observations: ${observations}</p>
      <p>Fait le ${new Date().toLocaleDateString()}</p>
    `;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Impression Congés</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
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
        <label>Matricule :</label>
        <input
          type="text"
          name="matricule"
          value={formData.matricule}
          onChange={handleChange}
          required
        />

        <label>Ancienneté (années) :</label>
        <input
          type="number"
          name="anciennete"
          min="0"
          value={formData.anciennete}
          onChange={handleChange}
          required
        />

        <label>Date départ :</label>
        <input
          type="date"
          name="dateDepart"
          value={formData.dateDepart}
          onChange={handleChange}
          required
        />

        <label>Date retour :</label>
        <input
          type="date"
          name="dateRetour"
          value={formData.dateRetour}
          onChange={handleChange}
          required
        />

        <label>Médaille :</label>
        <input
          type="number"
          name="medaille"
          min="0"
          value={formData.medaille}
          onChange={handleChange}
          required
        />

        <label>Reliquat :</label>
        <input
          type="text"
          name="reliquat"
          value={formData.reliquat}
          onChange={handleChange}
          required
        />

        <label>Intercalaire :</label>
        <input
          type="number"
          name="intercalaire"
          min="0"
          value={formData.intercalaire}
          onChange={handleChange}
          required
        />

        <label>Supp. Femme :</label>
        <input
          type="number"
          name="supplFemme"
          min="0"
          value={formData.supplFemme}
          onChange={handleChange}
          required
        />

        <label>Observations :</label>
        <textarea
          name="observations"
          value={formData.observations}
          onChange={handleChange}
          rows={3}
          required
        />

        <div className={styles.buttons}>
          <button type="submit">Enregistrer</button>
          <button
            type="button"
            onClick={imprimer}
            className={styles.printBtn}
          >
            Imprimer
          </button>
        </div>

        {message && (
          <p
            className={
              message.toLowerCase().includes("succès")
                ? styles.acceptMsg
                : styles.rejectMsg
            }
          >
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
