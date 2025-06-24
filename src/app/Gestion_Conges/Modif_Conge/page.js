"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./modif.module.css";

export default function ModificationConge() {
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

  const [agentInfo, setAgentInfo] = useState(null);

  // Fonction déclenchée quand le matricule est saisi
  useEffect(() => {
    if (formData.matricule === "1234") {
      setAgentInfo({
        matricule: "1234",
        nom: "Sow",
        prenom: "Fatou",
        poste: "Assistante RH",
        categorie: "B2",
        date_embauche: "2015-06-12",
        age: "34 ans",
        anciennete: "9 ans"
      });
    } else {
      setAgentInfo(null);
    }
  }, [formData.matricule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(formData, null, 2));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Modification des congés</h1>
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

        {/* Section affichage automatique des infos */}
        {agentInfo && (
          <div className={styles.agentInfo}>
            <h3>Informations Agent</h3>
            <p><strong>Matricule :</strong> {agentInfo.matricule}</p>
            <p><strong>Nom :</strong> {agentInfo.nom}</p>
            <p><strong>Prénom :</strong> {agentInfo.prenom}</p>
            <p><strong>Poste :</strong> {agentInfo.poste}</p>
            <p><strong>Catégorie :</strong> {agentInfo.categorie}</p>
            <p><strong>Date d'embauche :</strong> {agentInfo.date_embauche}</p>
            <p><strong>Âge :</strong> {agentInfo.age}</p>
            <p><strong>Ancienneté :</strong> {agentInfo.anciennete}</p>
          </div>
        )}

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
          {/* <button type="button" onClick={handlePrint} className={styles.printBtn}>
            Imprimer
          </button> */}
        </div>
      </form>
    </main>
  );
}
