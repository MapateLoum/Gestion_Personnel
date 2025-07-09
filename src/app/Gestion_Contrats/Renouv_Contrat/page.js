"use client";

import { useState } from "react";
import styles from "./renouv.module.css";
import { useRouter } from "next/navigation";

export default function RenouvContrat() {
  const [matricule, setMatricule] = useState("");
  const [agent, setAgent] = useState(null);
  const [contrat, setContrat] = useState(null);
  const [formData, setFormData] = useState({
    typeContrat: "",
    dateDebut: "",
    dateFin: "",
    salaire: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
const router = useRouter();
  // Rechercher agent + contrat
  const handleRecherche = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setAgent(null);
    setContrat(null);
    setLoading(true);

    if (!matricule.trim()) {
      setErrorMsg("Veuillez saisir un matricule.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/contrats?matricule=${encodeURIComponent(matricule)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Agent non trouvé");
        setLoading(false);
        return;
      }

      setAgent(data.agent);

      if (data.contrat) {
        setContrat(data.contrat);
        setFormData({
          typeContrat: data.contrat.type_contrat,
          dateDebut: data.contrat.date_debut ? data.contrat.date_debut.slice(0, 10) : "",
          dateFin: data.contrat.date_fin ? data.contrat.date_fin.slice(0, 10) : "",
          salaire: data.contrat.salaire ? data.contrat.salaire.toString() : "",
        });
      } else {
        // Pas de contrat existant
        setContrat(null);
        setFormData({
          typeContrat: "",
          dateDebut: "",
          dateFin: "",
          salaire: "",
        });
      }
    } catch (err) {
      setErrorMsg("Erreur réseau ou serveur.");
    } finally {
      setLoading(false);
    }
  };

  // Mise à jour des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Enregistrement du contrat (création ou mise à jour)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const { typeContrat, dateDebut, salaire } = formData;

    if (!typeContrat || !dateDebut || !salaire) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires (Type contrat, Date début, Salaire).");
      return;
    }

    try {
      const res = await fetch("/api/contrats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricule,
          typeContrat,
          dateDebut,
          dateFin: formData.dateFin || null,
          salaire: parseFloat(salaire),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Erreur lors de l'enregistrement.");
        return;
      }

      setSuccessMsg(data.message || "Contrat enregistré avec succès.");
      // Rafraîchir contrat (recharge depuis API)
      handleRecherche(e);
    } catch (err) {
      setErrorMsg("Erreur réseau ou serveur.");
    }
  };

  const handleRetour = () => {
    setAgent(null);
    setContrat(null);
    setMatricule("");
    setFormData({
      typeContrat: "",
      dateDebut: "",
      dateFin: "",
      salaire: "",
    });
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recherche / Renouvellement Contrat</h1>
<button onClick={() => router.back()} className={styles.buttonRetour}>
  ⬅️ Retour à la page précédente
</button>
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
            disabled={loading}
          />
          <div className={styles.buttons}>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Recherche..." : "Rechercher"}
            </button>
          </div>
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        </form>
      )}

      {agent && (
        <>
          <div className={styles.agentInfo}>
            <h2>
              Situation de l'agent {agent.NOM} {agent.PRENOMS}
            </h2>
            <p>
              <strong>Matricule :</strong> {agent.MLE}
            </p>
            <p>
              <strong>Poste :</strong> {agent.INTITULE_DU_POSE || "N/A"}
            </p>
            <p>
              <strong>Département / Division / Service :</strong> {agent.DEPT_DIV_SERV_SUBD || "N/A"}
            </p>
            <p>
              <strong>Code SAN :</strong> {agent.CODE_SAN || "N/A"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.formRenouvellement}>
            <label htmlFor="typeContrat" className={styles.label}>
              Type de contrat : *
            </label>
            <select
              id="typeContrat"
              name="typeContrat"
              className={styles.select}
              value={formData.typeContrat}
              onChange={handleChange}
              required
            >
              <option value="">-- Sélectionner --</option>
              <option value="Stage">Stage</option>
              <option value="CDD">CDD</option>
              <option value="CDI">CDI</option>
            </select>

            <label htmlFor="dateDebut" className={styles.label}>
              Date de début : *
            </label>
            <input
              type="date"
              id="dateDebut"
              name="dateDebut"
              className={styles.input}
              value={formData.dateDebut}
              onChange={handleChange}
              required
            />

            <label htmlFor="dateFin" className={styles.label}>
              Date de fin :
            </label>
            <input
              type="date"
              id="dateFin"
              name="dateFin"
              className={styles.input}
              value={formData.dateFin}
              onChange={handleChange}
            />

            <label htmlFor="salaire" className={styles.label}>
              Salaire (FCFA) : *
            </label>
            <input
              type="number"
              id="salaire"
              name="salaire"
              className={styles.input}
              value={formData.salaire}
              onChange={handleChange}
              min="0"
              required
            />

            <div className={styles.buttons}>
              <button type="submit" className={styles.button}>
                Enregistrer
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonAnnuler}`}
                onClick={handleRetour}
              >
                Retour
              </button>
            </div>
            {errorMsg && <p className={styles.error}>{errorMsg}</p>}
            {successMsg && <p className={styles.success}>{successMsg}</p>}
          </form>
        </>
      )}
    </div>
  );
}
