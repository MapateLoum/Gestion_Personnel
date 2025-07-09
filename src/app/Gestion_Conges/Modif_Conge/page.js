"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./modif.module.css";

export default function ModificationConge() {
  const [formData, setFormData] = useState({
    REF: "",
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
  const [message, setMessage] = useState("");

  // ✅ Appel API quand le matricule change
  useEffect(() => {
    const fetchCongeEtPers = async () => {
      if (!formData.matricule) return;

      try {
        const res = await fetch(`/api/modif_conge?matricule=${formData.matricule}`);
        const data = await res.json();

        if (res.ok && data.success) {
          const { conge, pers } = data.data;

          setFormData({
            REF: conge.REF || "",
            matricule: conge.MLE || "",
            anciennete: conge.NJANC || "",
            dateDepart: conge.DDEPART ? conge.DDEPART.split("T")[0] : "",
            dateRetour: conge.DDRETOUR ? conge.DDRETOUR.split("T")[0] : "",
            medaille: conge.NJMEDAILLE || "",
            reliquat: conge.RELIQT || "",
            intercalaire: conge.INTERC || "",
            observations: conge.OBSERVATIONS || "",
            supplFemme: conge.SUPPF || "",
          });

          if (pers) {
            setAgentInfo({
              matricule: pers.MLE,
              nom: pers.NOM,
              prenom: pers.PRENOMS,
              poste: pers.INTITULE_DU_POSE,
              categorie: pers.CATEGORIE,
              date_embauche: pers.DATE_EMB,
              anciennete: conge.NJANC + " ans",
            });
          } else {
            setAgentInfo(null);
          }

          setMessage("");
        } else {
          setAgentInfo(null);
          setMessage("ℹ️ Aucun congé trouvé.");
        }
      } catch (error) {
        console.error("Erreur GET:", error);
        setMessage("❌ Erreur réseau.");
      }
    };

    fetchCongeEtPers();
  }, [formData.matricule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.matricule) {
      setMessage("❌ Matricule obligatoire.");
      return;
    }

    try {
      const res = await fetch("/api/modif_conge", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("✅ Congé modifié !");
      } else {
        setMessage(`❌ ${data.message || "Erreur."}`);
      }
    } catch (error) {
      console.error("Erreur PUT:", error);
      setMessage("❌ Erreur réseau.");
    }
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

        {agentInfo && (
          <div className={styles.agentInfo}>
            <h3>Informations Agent</h3>
            <p><strong>Matricule :</strong> {agentInfo.matricule}</p>
            <p><strong>Nom :</strong> {agentInfo.nom}</p>
            <p><strong>Prénom :</strong> {agentInfo.prenom}</p>
            <p><strong>Poste :</strong> {agentInfo.poste}</p>
            <p><strong>Catégorie :</strong> {agentInfo.categorie}</p>
            <p><strong>Date embauche :</strong> {agentInfo.date_embauche}</p>
            <p><strong>Ancienneté :</strong> {agentInfo.anciennete}</p>
          </div>
        )}

        {/* Reste du formulaire */}
        <label htmlFor="anciennete">Ancienneté (années) :</label>
        <input type="number" id="anciennete" name="anciennete" min="0" value={formData.anciennete} onChange={handleChange} required />

        <label htmlFor="dateDepart">Date départ :</label>
        <input type="date" id="dateDepart" name="dateDepart" value={formData.dateDepart} onChange={handleChange} required />

        <label htmlFor="dateRetour">Date retour :</label>
        <input type="date" id="dateRetour" name="dateRetour" value={formData.dateRetour} onChange={handleChange} required />

        <label htmlFor="medaille">Médaille :</label>
        <input type="text" id="medaille" name="medaille" value={formData.medaille} onChange={handleChange} />

        <label htmlFor="reliquat">Reliquat :</label>
        <input type="text" id="reliquat" name="reliquat" value={formData.reliquat} onChange={handleChange} />

        <label htmlFor="intercalaire">Intercalaire :</label>
        <input type="text" id="intercalaire" name="intercalaire" value={formData.intercalaire} onChange={handleChange} />

        <label htmlFor="observations">Observations :</label>
        <textarea id="observations" name="observations" value={formData.observations} onChange={handleChange} rows={4} />

        <label htmlFor="supplFemme">Supplément femme :</label>
        <input type="text" id="supplFemme" name="supplFemme" value={formData.supplFemme} onChange={handleChange} />

        <div className={styles.buttons}>
          <button type="submit">Modifier</button>
        </div>

        {message && (
          <p style={{ marginTop: 20, fontWeight: "bold", color: message.startsWith("✅") ? "green" : "red" }}>
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
