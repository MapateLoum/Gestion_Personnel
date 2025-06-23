"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./consultation.module.css";

const fakeAgents = {
  "1234": {
    nom: "DIALLO",
    prenom: "Aminata",
    poste: "Chargée RH",
    categorie: "A",
    reg: "Sénégal",
    dateNaissance: "1985-02-15",
    dateEmbauche: "2010-07-01",
    baseHoraire: "40h",
    conges: [
      {
        ref: "C-2023-001",
        dateDepart: "2023-05-10",
        medaille: "OUI",
        reliquat: 5,
        anciennete: 13,
        observation: "Congé annuel",
        dateReference: "2023-01-01",
        supplFemme: "Oui",
        matricule: "1234",
        intercalaire: "Non",
      },
      {
        ref: "C-2024-002",
        dateDepart: "2024-01-20",
        medaille: "NON",
        reliquat: 2,
        anciennete: 14,
        observation: "Congé maladie",
        dateReference: "2024-01-01",
        supplFemme: "Non",
        matricule: "1234",
        intercalaire: "Oui",
      },
    ],
  },
  "5678": {
    nom: "NDIAYE",
    prenom: "Moussa",
    poste: "Technicien",
    categorie: "B",
    reg: "Sénégal",
    dateNaissance: "1990-10-10",
    dateEmbauche: "2015-03-12",
    baseHoraire: "35h",
    conges: [
      {
        ref: "C-2023-010",
        dateDepart: "2023-06-15",
        medaille: "NON",
        reliquat: 0,
        anciennete: 8,
        observation: "Congé sans solde",
        dateReference: "2023-01-01",
        supplFemme: "Non",
        matricule: "5678",
        intercalaire: "Non",
      },
    ],
  },
};

export default function ConsultationConge() {
  const [matricule, setMatricule] = useState("");
  const [agent, setAgent] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setMatricule(e.target.value);
    setError("");
    setAgent(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (fakeAgents[matricule]) {
      setAgent(fakeAgents[matricule]);
      setError("");
    } else {
      setAgent(null);
      setError("Aucun agent trouvé avec ce matricule.");
    }
  };

  const handleCancel = () => {
    setMatricule("");
    setAgent(null);
    setError("");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Consultation Congé par Agent</h2>

      <form onSubmit={handleSearch} className={styles.form}>
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
          />
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.buttonEnvoyer}>
            Rechercher
          </button>
          <button type="button" onClick={handleCancel} className={styles.buttonAnnuler}>
            Annuler
          </button>
          <button type="button" onClick={handleGoBack} className={styles.buttonRetour}>
            Retour
          </button>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
      </form>

      {agent && (
        <section className={styles.agentInfo}>
          <h3>Informations Agent</h3>
          <p><strong>Nom :</strong> {agent.nom}</p>
          <p><strong>Prénom :</strong> {agent.prenom}</p>
          <p><strong>Intitulé du poste :</strong> {agent.poste}</p>
          <p><strong>Catégorie :</strong> {agent.categorie}</p>
          <p><strong>Région :</strong> {agent.reg}</p>
          <p><strong>Date de naissance :</strong> {agent.dateNaissance}</p>
          <p><strong>Date d'embauche :</strong> {agent.dateEmbauche}</p>
          <p><strong>Base horaire :</strong> {agent.baseHoraire}</p>

          <h3>Historique des congés</h3>
          <div className={styles.tableContainer}>
            <table className={styles.resultTable}>
              <thead>
                <tr>
                  <th>Réf.</th>
                  <th>Date départ</th>
                  <th>Médaille</th>
                  <th>Reliquat</th>
                  <th>Ancienneté</th>
                  <th>Observation</th>
                  <th>Date référence</th>
                  <th>Supplément femme</th>
                  <th>Matricule</th>
                  <th>Intercalaire</th>
                </tr>
              </thead>
              <tbody>
                {agent.conges.map((conge, i) => (
                  <tr key={i}>
                    <td>{conge.ref}</td>
                    <td>{conge.dateDepart}</td>
                    <td>{conge.medaille}</td>
                    <td>{conge.reliquat}</td>
                    <td>{conge.anciennete}</td>
                    <td>{conge.observation}</td>
                    <td>{conge.dateReference}</td>
                    <td>{conge.supplFemme}</td>
                    <td>{conge.matricule}</td>
                    <td>{conge.intercalaire}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
