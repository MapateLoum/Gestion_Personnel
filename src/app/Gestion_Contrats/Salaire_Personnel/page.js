"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./salaire.module.css";

export default function SalaireForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    poste: "",
    dept: "",
    codeSan: "",
  });

  const [salaire, setSalaire] = useState(null);
  const [erreur, setErreur] = useState("");

  const agentsTest = [
    {
      matricule: "AG123",
      nom: "DIALLO",
      prenom: "Aïssatou",
      poste: "Assistante administrative",
      dept: "Service RH",
      codeSan: "SAN001",
      salaire: "450 000 FCFA",
    },
    {
      matricule: "AG456",
      nom: "BA",
      prenom: "Mamadou",
      poste: "Technicien IT",
      dept: "Division Informatique",
      codeSan: "SAN002",
      salaire: "550 000 FCFA",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErreur("");
    setSalaire(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const match = agentsTest.find(
      (agent) =>
        agent.matricule === formData.matricule &&
        agent.nom.toLowerCase() === formData.nom.toLowerCase() &&
        agent.prenom.toLowerCase() === formData.prenom.toLowerCase() &&
        agent.poste.toLowerCase() === formData.poste.toLowerCase() &&
        agent.codeSan === formData.codeSan
    );

    if (match) {
      setSalaire(match.salaire);
      setErreur("");
    } else {
      setSalaire(null);
      setErreur("Aucune correspondance trouvée. Vérifiez les informations saisies.");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Consultation du Salaire</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {["matricule", "nom", "prenom", "poste", "dept", "codeSan"].map((field) => (
          <div className={styles.formGroup} key={field}>
            <label htmlFor={field}>
              {field === "codeSan" ? "Code SAN" : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        ))}

        <div className={styles.buttons}>
          <button type="submit" className={styles.buttonEnvoyer}>Afficher</button>
          <button type="button" onClick={handleBack} className={styles.buttonRetour}>Retour</button>
        </div>
      </form>

      {salaire && (
        <div className={styles.result}>
          <h3>Salaire : <span className={styles.salaire}>{salaire}</span></h3>
        </div>
      )}

      {erreur && <p className={styles.error}>{erreur}</p>}
    </div>
  );
}
