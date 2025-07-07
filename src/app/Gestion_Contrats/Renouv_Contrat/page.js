"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./renouv.module.css";

const agentsFictifs = [
  {
    matricule: "A001",
    nom: "DIOP",
    prenom: "Mamadou",
    poste: "Technicien",
    departDivSer: "Informatique",
    subDivision: "Développement",
    codeSAN: "SAN123",
    contrat: {
      typeContrat: "CDD",
      debutCDD1: "2023-01-01",
      finCDD1: "2023-12-31",
      debutCDD2: "2024-01-01",
      finCDD2: "2024-12-31",
      debutCDI: "2025-01-01",
      salaire: 500000,
    },
  },
  {
    matricule: "B002",
    nom: "SOW",
    prenom: "Awa",
    poste: "Secrétaire",
    departDivSer: "Administration",
    subDivision: "Accueil",
    codeSAN: "SAN456",
    contrat: {
      typeContrat: "CDI",
      debutCDD1: null,
      finCDD1: null,
      debutCDD2: null,
      finCDD2: null,
      debutCDI: "2022-05-15",
      salaire: 400000,
    },
  },
];

export default function RenouvContrat() {
  const router = useRouter();
  const [matricule, setMatricule] = useState("");
  const [agent, setAgent] = useState(null);
  const [formData, setFormData] = useState({
    typeContrat: "",
    debutCDD1: "",
    finCDD1: "",
    debutCDD2: "",
    finCDD2: "",
    debutCDI: "",
    salaire: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleRecherche = (e) => {
    e.preventDefault();
    const found = agentsFictifs.find(
      (a) => a.matricule.toLowerCase() === matricule.toLowerCase()
    );
    if (found) {
      setAgent(found);
      setFormData({ ...found.contrat });
      setErrorMsg("");
    } else {
      setAgent(null);
      setErrorMsg("Matricule non trouvé.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Contrat mis à jour (simulation) :\n" + JSON.stringify(formData, null, 2));
  };

  const handleRetourRecherche = () => {
    router.back(); // Retour à la page précédente (hors composant)
  };

  const handleRetourForm = () => {
    // Pour revenir à la recherche si on est dans le formulaire
    setAgent(null);
    setMatricule("");
    setFormData({
      typeContrat: "",
      debutCDD1: "",
      finCDD1: "",
      debutCDD2: "",
      finCDD2: "",
      debutCDI: "",
      salaire: "",
    });
    setErrorMsg("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recherche / Renouvellement Contrat</h1>

      {!agent && (
        <form onSubmit={handleRecherche} className={styles.formRecherche}>
          <label htmlFor="matricule" className={styles.label}>
            Matricule :
          </label>
          <input
            type="text"
            id="matricule"
            name="matricule"
            className={styles.input}
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            required
          />
          <div className={styles.buttons}>
            <button type="submit" className={styles.button}>
              Rechercher
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonAnnuler}`}
              onClick={handleRetourRecherche}
            >
              Retour
            </button>
          </div>
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        </form>
      )}

      {agent && (
        <>
          <div className={styles.agentInfo}>
            <h2>
              Situation de l'agent {agent.nom} {agent.prenom}
            </h2>
            <p>
              <strong>Matricule:</strong> {agent.matricule}
            </p>
            <p>
              <strong>Poste:</strong> {agent.poste}
            </p>
            <p>
              <strong>Département / Division / Service:</strong> {agent.departDivSer}
            </p>
            <p>
              <strong>Subdivision:</strong> {agent.subDivision}
            </p>
            <p>
              <strong>Code SAN:</strong> {agent.codeSAN}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.formRenouvellement}>
            <label htmlFor="typeContrat" className={styles.label}>
              Type de contrat :
            </label>
            <select
              id="typeContrat"
              name="typeContrat"
              value={formData.typeContrat}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">-- Sélectionner --</option>
              <option value="CDD">CDD</option>
              <option value="CDI">CDI</option>
              <option value="Stage">Stage</option>
            </select>

            <label htmlFor="debutCDD1" className={styles.label}>
              Début CDD1 :
            </label>
            <input
              type="date"
              id="debutCDD1"
              name="debutCDD1"
              className={styles.input}
              value={formData.debutCDD1 || ""}
              onChange={handleChange}
            />

            <label htmlFor="finCDD1" className={styles.label}>
              Fin CDD1 :
            </label>
            <input
              type="date"
              id="finCDD1"
              name="finCDD1"
              className={styles.input}
              value={formData.finCDD1 || ""}
              onChange={handleChange}
            />

            <label htmlFor="debutCDD2" className={styles.label}>
              Début CDD2 :
            </label>
            <input
              type="date"
              id="debutCDD2"
              name="debutCDD2"
              className={styles.input}
              value={formData.debutCDD2 || ""}
              onChange={handleChange}
            />

            <label htmlFor="finCDD2" className={styles.label}>
              Fin CDD2 :
            </label>
            <input
              type="date"
              id="finCDD2"
              name="finCDD2"
              className={styles.input}
              value={formData.finCDD2 || ""}
              onChange={handleChange}
            />

            <label htmlFor="debutCDI" className={styles.label}>
              Début CDI :
            </label>
            <input
              type="date"
              id="debutCDI"
              name="debutCDI"
              className={styles.input}
              value={formData.debutCDI || ""}
              onChange={handleChange}
            />

            <label htmlFor="salaire" className={styles.label}>
              Salaire :
            </label>
            <input
              type="number"
              id="salaire"
              name="salaire"
              className={styles.input}
              value={formData.salaire || ""}
              onChange={handleChange}
              min="0"
            />

            <div className={styles.buttons}>
              <button type="submit" className={styles.button}>
                Enregistrer
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonAnnuler}`}
                onClick={handleRetourForm}
              >
                Retour
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
