"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./salaire.module.css";

export default function SalaireForm() {
  const router = useRouter();

  const [matricule, setMatricule] = useState("");
  const [agent, setAgent] = useState(null);
  const [erreur, setErreur] = useState("");

  const handleChange = (e) => {
    setMatricule(e.target.value);
    setErreur("");
    setAgent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!matricule.trim()) {
      setErreur("Veuillez saisir un matricule.");
      return;
    }

    try {
      const res = await fetch(`/api/salaire?matricule=${encodeURIComponent(matricule)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErreur(data.message || "Erreur lors de la récupération des données.");
        setAgent(null);
      } else {
        setAgent(data);
        setErreur("");
      }
    } catch (err) {
      setErreur("Erreur réseau ou serveur.");
      setAgent(null);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Consultation du Salaire</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="matricule">Matricule :</label>
          <input
            type="text"
            id="matricule"
            name="matricule"
            value={matricule}
            onChange={handleChange}
            className={styles.input}
            required
            placeholder="Exemple : P5"
          />
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.buttonEnvoyer}>
            Afficher
          </button>
          <button type="button" onClick={handleBack} className={styles.buttonRetour}>
            Retour
          </button>
        </div>
      </form>

      {erreur && <p className={styles.error}>{erreur}</p>}

     {agent && agent.success && (
  <div className={styles.result}>
    <div>
      <h3>👤 Informations Agent</h3>
      <p><strong>Matricule :</strong> {agent.matricule}</p>
      <p><strong>Nom :</strong> {agent.nom}</p>
      <p><strong>Prénom :</strong> {agent.prenom}</p>
      <p><strong>Poste :</strong> {agent.poste}</p>
      <p><strong>Catégorie :</strong> {agent.categorie}</p>
      <p><strong>Région :</strong> {agent.reg}</p>
      <p><strong>Base Horaire :</strong> {agent.baseHoraire}</p>
      <p><strong>Code SAN :</strong> {agent.codeSan}</p>
    </div>

    <div>
      <h3>📝 Contrat Actuel</h3>
      <p><strong>Type :</strong> {agent.typeContrat ?? "N/A"}</p>
<p><strong>Date Début :</strong> {agent.dateDebut ? new Date(agent.dateDebut).toLocaleDateString() : "N/A"}</p>
      <p><strong>Date Fin :</strong> {agent.dateFin ? new Date(agent.dateFin).toLocaleDateString() : "N/A"}</p>
    </div>

    <div>
      <h3>💰 Salaire</h3>
      <p><strong>Salaire Contrat :</strong> {agent.salaireContrat ?? "N/A"} FCFA</p>
    </div>
  </div>
)}
    </div>
  );
}
