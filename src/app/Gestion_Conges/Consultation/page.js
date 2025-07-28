"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./consultation.module.css";

export default function ConsultationConge() {
  const [matricule, setMatricule] = useState("");
  const [agent, setAgent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setMatricule(e.target.value);
    setError("");
    setAgent(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!matricule.trim()) {
      setError("Veuillez saisir un matricule.");
      return;
    }

    setLoading(true);
    setError("");
    setAgent(null);

    try {
      const res = await fetch(`/api/consultation_conge?matricule=${encodeURIComponent(matricule.trim())}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setAgent(data.agent);
      } else {
        setError(data.message || "Erreur lors de la recherche.");
      }
    } catch (err) {
      setError("Erreur réseau, veuillez réessayer.");
    } finally {
      setLoading(false);
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
          <button type="submit" className={styles.buttonEnvoyer} disabled={loading}>
            {loading ? "Recherche..." : "Rechercher"}
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
                  <th>Date retour</th>
                  <th>Médaille</th>
                  <th>Reliquat</th>
                  <th>Ancienneté</th>
                  <th>Observation</th>
                  <th>Supplément femme</th>
                  <th>Intercalaire</th>
                </tr>
              </thead>
              <tbody>
                {agent.conges.map((conge, i) => (
                  <tr key={i}>
                    <td>{conge.ref}</td>
                    <td>{conge.dateDepart}</td>
                    <td>{conge.dateRetour}</td>
                    <td>{conge.medaille}</td>
                    <td>{conge.reliquat}</td>
                    <td>{conge.anciennete}</td>
                    <td>{conge.observation}</td>
                    <td>{conge.supplFemme}</td>
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
