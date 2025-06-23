"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./attestation.module.css";

const agentsFictifs = [
  {
    matricule: "A001",
    nom: "DIOP",
    prenom: "Mamadou",
    poste: "Technicien",
    departement: "Informatique",
    dateEmbauche: "2019-04-15",
  },
  {
    matricule: "B002",
    nom: "SOW",
    prenom: "Awa",
    poste: "Secrétaire",
    departement: "Administration",
    dateEmbauche: "2021-01-10",
  },
];

export default function AttestationTravail() {
  const router = useRouter();

  const [matricule, setMatricule] = useState("");
  const [agent, setAgent] = useState(null);
  const [attestationType, setAttestationType] = useState("simple");
  const [errorMsg, setErrorMsg] = useState("");

  const rechercherAgent = (e) => {
    e.preventDefault();
    const found = agentsFictifs.find(
      (a) => a.matricule.toLowerCase() === matricule.trim().toLowerCase()
    );
    if (found) {
      setAgent(found);
      setErrorMsg("");
    } else {
      setAgent(null);
      setErrorMsg("Matricule non trouvé.");
    }
  };

  const imprimerAttestation = () => {
    const content = document.getElementById("attestation-content").innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Attestation de travail</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; }
            h2 { color: #076969; }
            p { font-size: 16px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleRetour = () => {
    setAgent(null);
    setMatricule("");
    setErrorMsg("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Génération d'attestation de travail</h1>

      {!agent && (
        <form onSubmit={rechercherAgent} className={styles.form}>
          <label htmlFor="matricule" className={styles.label}>
            Matricule :
          </label>
          <input
            id="matricule"
            name="matricule"
            type="text"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            Rechercher
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonAnnuler}`}
            onClick={() => router.back()}
          >
            Retour
          </button>
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        </form>
      )}

      {agent && (
        <section className={styles.attestationSection}>
          <label htmlFor="attestationType" className={styles.label}>
            Type d'attestation :
          </label>
          <select
            id="attestationType"
            value={attestationType}
            onChange={(e) => setAttestationType(e.target.value)}
            className={styles.select}
          >
            <option value="simple">Attestation simple</option>
            <option value="banque">Attestation pour banque</option>
            <option value="visa">Attestation pour visa</option>
          </select>

          <div id="attestation-content" className={styles.attestationContent}>
            <h2>Attestation de Travail</h2>
            <p>
              Je soussigné(e), responsable des ressources humaines de la société,
              certifie que <strong>{agent.prenom} {agent.nom}</strong>, titulaire du matricule <strong>{agent.matricule}</strong>,
              occupe le poste de <strong>{agent.poste}</strong> au sein du département <strong>{agent.departement}</strong>.
            </p>
            <p>
              Date d'embauche : <strong>{new Date(agent.dateEmbauche).toLocaleDateString()}</strong>.
            </p>
            {attestationType === "banque" && (
              <p>
                Cette attestation est délivrée pour justifier de la situation professionnelle auprès des établissements bancaires.
              </p>
            )}
            {attestationType === "visa" && (
              <p>
                Cette attestation est délivrée pour appuyer une demande de visa à l'étranger.
              </p>
            )}
            <p>Fait à [Lieu], le {new Date().toLocaleDateString()}.</p>
            <p>Signature de l'employeur</p>
          </div>

          <div className={styles.buttons}>
            <button className={styles.button} onClick={imprimerAttestation}>
              Imprimer
            </button>
            <button
              className={`${styles.button} ${styles.buttonAnnuler}`}
              onClick={handleRetour}
            >
              Retour
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
