"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./attestation.module.css";

export default function AttestationTravail() {
  const router = useRouter();

  const [matricule, setMatricule] = useState("");
  const [agent, setAgent] = useState(null);
  const [attestationType, setAttestationType] = useState("simple");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const rechercherAgent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setAgent(null);

    try {
const res = await fetch(`/api/attestation/${encodeURIComponent(matricule.trim())}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setAgent(data.agent);
        setErrorMsg("");
      } else {
        setErrorMsg(data.error || "Matricule non trouvé.");
      }
    } catch (err) {
      setErrorMsg("Erreur réseau.");
    } finally {
      setLoading(false);
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
            disabled={loading}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Recherche..." : "Rechercher"}
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonAnnuler}`}
            onClick={() => router.back()}
            disabled={loading}
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
              certifie que <strong>{agent.PRENOMS} {agent.NOM}</strong>, titulaire du matricule <strong>{agent.MLE}</strong>,
              occupe le poste de <strong>{agent.INTITULE_DU_POSE || agent.POSTE || "-"}</strong> au sein du département <strong>{agent.DEPT_DIV_SERV_SUBD || "-"}</strong>.
            </p>
            <p>
              Date d'embauche : <strong>{agent.DATE_EMB ? new Date(agent.DATE_EMB).toLocaleDateString() : "-"}</strong>.
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
