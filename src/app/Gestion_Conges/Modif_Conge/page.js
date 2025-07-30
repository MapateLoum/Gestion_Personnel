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

  function formatDateToYYYYMMDD(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
useEffect(() => {
  if (message) {
    const timer = setTimeout(() => {
      setMessage("");
    }, 5000); // disparaît après 5 secondes

    return () => clearTimeout(timer); // nettoyage
  }
}, [message]);

  // Charger congé + agent par REF
  useEffect(() => {
    async function fetchCongeParRef() {
      const refTrimmed = String(formData.REF || "").trim();
      if (!refTrimmed) {
        setAgentInfo(null);
        setMessage("");
        return;
      }
      try {
        const res = await fetch(
          `/api/modif_conge?ref=${encodeURIComponent(refTrimmed)}`
        );
        const data = await res.json();

        if (res.ok && data.success && data.data) {
          const { conge, pers } = data.data;

          setFormData({
            REF: conge.REF || "",
            matricule: conge.MLE || "",
            anciennete: conge.NJANC || "",
            dateDepart: formatDateToYYYYMMDD(conge.DDEPART),
            dateRetour: formatDateToYYYYMMDD(conge.DDRETOUR),
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
              date_embauche: formatDateToYYYYMMDD(pers.DATE_EMB),
              anciennete: conge.NJANC + " ans",
            });
          } else {
            setAgentInfo(null);
          }

          setMessage("");
        } else {
          setAgentInfo(null);
          setMessage("ℹ️ Référence congé non trouvée.");
        }
      } catch (error) {
        console.error("Erreur fetch par REF:", error);
        setMessage("❌ Erreur réseau.");
        setAgentInfo(null);
      }
    }

    fetchCongeParRef();
  }, [formData.REF]);

  // Charger congé + agent par matricule seulement si REF vide
  useEffect(() => {
    async function fetchCongeParMatricule() {
      const matriculeTrimmed = String(formData.matricule || "").trim();
      const refTrimmed = String(formData.REF || "").trim();

      if (!matriculeTrimmed || refTrimmed) return;

      try {
        const res = await fetch(
          `/api/modif_conge?matricule=${encodeURIComponent(matriculeTrimmed)}`
        );
        const data = await res.json();

        if (res.ok && data.success && data.data) {
          const { conge, pers } = data.data;

          setFormData((prev) => ({
            ...prev,
            anciennete: conge.NJANC || "",
            dateDepart: formatDateToYYYYMMDD(conge.DDEPART),
            dateRetour: formatDateToYYYYMMDD(conge.DDRETOUR),
            medaille: conge.NJMEDAILLE || "",
            reliquat: conge.RELIQT || "",
            intercalaire: conge.INTERC || "",
            observations: conge.OBSERVATIONS || "",
            supplFemme: conge.SUPPF || "",
          }));

          if (pers) {
            setAgentInfo({
              matricule: pers.MLE,
              nom: pers.NOM,
              prenom: pers.PRENOMS,
              poste: pers.INTITULE_DU_POSE,
              categorie: pers.CATEGORIE,
              date_embauche: formatDateToYYYYMMDD(pers.DATE_EMB),
              anciennete: conge.NJANC + " ans",
            });
          } else {
            setAgentInfo(null);
          }

          setMessage("");
        } else {
          setAgentInfo(null);
          setMessage("ℹ️ Aucun congé trouvé pour ce matricule.");
        }
      } catch (error) {
        console.error("Erreur fetch par matricule:", error);
        setAgentInfo(null);
        setMessage("❌ Erreur réseau.");
      }
    }

    fetchCongeParMatricule();
  }, [formData.matricule, formData.REF]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "REF") {
      setAgentInfo(null);
      setMessage("");
      setFormData((prev) => ({ ...prev, REF: value, matricule: "" }));
    } else if (name === "matricule") {
      setAgentInfo(null);
      setMessage("");
      setFormData((prev) => ({ ...prev, matricule: value, REF: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!String(formData.REF || "").trim()) {
      setMessage("❌ La référence du congé est obligatoire.");
      return;
    }

    if (!formData.dateDepart) {
      setMessage("❌ La date de départ est obligatoire.");
      return;
    }

    if (!formData.dateRetour) {
      setMessage("❌ La date de retour est obligatoire.");
      return;
    }

    const depart = new Date(formData.dateDepart);
    const retour = new Date(formData.dateRetour);
    if (retour < depart) {
      setMessage("❌ La date de retour doit être postérieure à la date de départ.");
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
      console.error("Erreur PUT modif_conge:", error);
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
        <label htmlFor="REF">Référence congé :</label>
        <input
          type="text"
          id="REF"
          name="REF"
          value={formData.REF}
          onChange={handleChange}
          required
          placeholder="Ex: REF123"
        />

        {/* <label htmlFor="matricule">Matricule :</label>
        <input
          type="text"
          id="matricule"
          name="matricule"
          value={formData.matricule}
          onChange={handleChange}
          required
        /> */}

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
          type="number"
          id="medaille"
          name="medaille"
          min="0"
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
          type="number"
          id="intercalaire"
          name="intercalaire"
          min="0"
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
          type="number"
          id="supplFemme"
          name="supplFemme"
          min="0"
          value={formData.supplFemme}
          onChange={handleChange}
        />

        <div className={styles.buttons}>
          <button type="submit">Modifier</button>
        </div>
      </form>

      {message && (
        <div
          className={`${styles.fixedMessage} ${
            message.startsWith("✅") ? styles.success : ""
          }`}
          role="alert"
          aria-live="assertive"
        >
          {message}
        </div>
      )}
    </main>
  );
}
