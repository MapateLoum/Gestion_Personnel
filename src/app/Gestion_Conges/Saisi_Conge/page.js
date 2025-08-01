"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./saisi.module.css";
import { useRouter } from "next/navigation";

export default function SaisieConges() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = document.cookie
      .split("; ")
      .find((row) => row.startsWith("isLoggedIn="))
      ?.split("=")[1];
    if (isLoggedIn !== "true") router.replace("/login");

    window.onpopstate = () => {
      const loggedIn = document.cookie
        .split("; ")
        .find((row) => row.startsWith("isLoggedIn="))
        ?.split("=")[1];
      if (loggedIn !== "true") router.replace("/login");
    };
  }, [router]);

  const [formData, setFormData] = useState({
    matricule: "",
    anciennete: "",
    dateDepart: "",
    dateDernierRetour: "",
    dateRetour: "",
    dateRetourPrevue: "",
    medaille: "0",
    reliquat: "0",
    intercalaire: "0",
    supplFemme: "0",
    observations: "",
  });

  const [agentInfo, setAgentInfo] = useState(null);
  const [message, setMessage] = useState(null);
  const [joursOrdinaires, setJoursOrdinaires] = useState(0);
  const [joursTotal, setJoursTotal] = useState(0);

  function diffMois(date1, date2) {
    return (
      (date2.getFullYear() - date1.getFullYear()) * 12 +
      (date2.getMonth() - date1.getMonth())
    );
  }

  useEffect(() => {
    async function fetchAgent() {
      if (!formData.matricule.trim()) {
        setAgentInfo(null);
        setFormData((prev) => ({
          ...prev,
          anciennete: "",
          dateDernierRetour: "",
        }));
        return;
      }

      try {
        const resAgent = await fetch(
          `/api/personnel/infos/${encodeURIComponent(formData.matricule.trim())}`
        );
        const dataAgent = await resAgent.json();

        if (resAgent.ok && dataAgent.found) {
          const agent = dataAgent.agent;
          setAgentInfo({
            matricule: agent.MLE,
            nom: agent.NOM,
            prenoms: agent.PRENOMS,
            poste: agent.INTITULE_DU_POSE,
            categorie: agent.CATEGORIE,
            age: agent.age,
            date_embauche: agent.DATE_EMB,
          });

          const embaucheDate = new Date(agent.DATE_EMB);
          const now = new Date();
          let diff = now.getFullYear() - embaucheDate.getFullYear();
          const m = now.getMonth() - embaucheDate.getMonth();
          if (m < 0 || (m === 0 && now.getDate() < embaucheDate.getDate())) diff--;

          setFormData((prev) => ({
            ...prev,
            anciennete: diff >= 0 ? diff.toString() : "0",
          }));

          const resDernierRetour = await fetch(
            `/api/conges/dernierRetour/${encodeURIComponent(formData.matricule.trim())}`
          );
          const dataDernierRetour = await resDernierRetour.json();

          const dernierRetour = resDernierRetour.ok && dataDernierRetour.dateDernierRetour
            ? dataDernierRetour.dateDernierRetour
            : agent.DATE_EMB;

          setFormData((prev) => ({
            ...prev,
            dateDernierRetour: dernierRetour,
          }));
          setMessage(null);
        } else {
          setAgentInfo(null);
          setFormData((prev) => ({
            ...prev,
            anciennete: "",
            dateDernierRetour: "",
          }));
          setMessage({ type: "error", text: "Aucun agent trouvé avec ce matricule." });
        }
      } catch (err) {
        console.error(err);
        setAgentInfo(null);
        setFormData((prev) => ({
          ...prev,
          anciennete: "",
          dateDernierRetour: "",
        }));
        setMessage({ type: "error", text: "Erreur lors de la récupération des données." });
      }
    }

    fetchAgent();
  }, [formData.matricule]);

  useEffect(() => {
    if (!formData.dateDernierRetour || !formData.dateDepart) {
      setJoursOrdinaires(0);
      setJoursTotal(0);
      setFormData((prev) => ({ ...prev, dateRetourPrevue: "", dateRetour: "" }));
      return;
    }

    const dateDernierRetour = new Date(formData.dateDernierRetour);
    const dateDepart = new Date(formData.dateDepart);

    if (dateDepart <= dateDernierRetour) {
      setMessage({ type: "error", text: "La date de départ doit être postérieure à la date dernier retour." });
      setJoursOrdinaires(0);
      setJoursTotal(0);
      setFormData((prev) => ({ ...prev, dateRetourPrevue: "", dateRetour: "" }));
      return;
    } else {
      setMessage(null);
    }

    let mois = diffMois(dateDernierRetour, dateDepart);
    const resteJours = dateDepart.getDate() - dateDernierRetour.getDate();
    if (resteJours > 15) mois += 1;

    const joursOrdi = mois * 2;
    const anciennete = Number(formData.anciennete) || 0;
    const medaille = Number(formData.medaille) || 0;
    const reliquat = Number(formData.reliquat) || 0;
    const intercalaire = Number(formData.intercalaire) || 0;
    const supplFemme = Number(formData.supplFemme) || 0;

    const total = joursOrdi + anciennete + medaille + reliquat - intercalaire + supplFemme;
    setJoursOrdinaires(joursOrdi);
    setJoursTotal(total);

    const dateRetourCalculee = new Date(dateDepart);
    dateRetourCalculee.setDate(dateRetourCalculee.getDate() + total - 1);

    const yyyy = dateRetourCalculee.getFullYear();
    const mm = String(dateRetourCalculee.getMonth() + 1).padStart(2, "0");
    const dd = String(dateRetourCalculee.getDate()).padStart(2, "0");

    const retourStr = `${yyyy}-${mm}-${dd}`;
    setFormData((prev) => ({
      ...prev,
      dateRetourPrevue: retourStr,
      dateRetour: retourStr,
    }));
  }, [
    formData.dateDernierRetour,
    formData.dateDepart,
    formData.anciennete,
    formData.medaille,
    formData.reliquat,
    formData.intercalaire,
    formData.supplFemme,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dateDernierRetour") return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      matricule,
      anciennete,
      dateDepart,
      dateRetour,
      dateRetourPrevue,
      medaille,
      reliquat,
      intercalaire,
      supplFemme,
      observations,
    } = formData;

    if (
      !matricule ||
      anciennete === "" ||
      !dateDepart ||
      !dateRetour ||
      !dateRetourPrevue ||
      medaille === "" ||
      reliquat === "" ||
      intercalaire === "" ||
      supplFemme === "" ||
      !observations
    ) {
      setMessage({ type: "error", text: "Veuillez remplir tous les champs obligatoires." });
      return;
    }

    try {
      const response = await fetch("/api/conges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricule: matricule.trim(),
          anciennete: Number(anciennete),
          dateDepart,
          dateRetour,
          dateRetourPrevue,
          medaille: Number(medaille),
          reliquat: Number(reliquat),
          intercalaire: Number(intercalaire),
          supplFemme: Number(supplFemme),
          observations: observations.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Congé enregistré avec succès." });
        setFormData((prev) => ({
          ...prev,
          dateDepart: "",
          dateRetour: "",
          dateRetourPrevue: "",
          observations: "",
        }));
      } else {
        setMessage({ type: "error", text: result.message || "Erreur lors de l'enregistrement." });
      }
    } catch (error) {
      console.error("Erreur front-end :", error);
      setMessage({ type: "error", text: "Erreur serveur ou réseau." });
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Saisie des congés</h1>
        <Link href="/Gestion_Conges" className={styles.backLink}>
          ← Retour
        </Link>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Matricule :</label>
        <input
          type="text"
          name="matricule"
          value={formData.matricule}
          onChange={handleChange}
          required
        />

        {agentInfo && (
          <div className={styles.agentInfo}>
            <p><strong>Nom :</strong> {agentInfo.nom}</p>
            <p><strong>Prénoms :</strong> {agentInfo.prenoms}</p>
            <p><strong>Poste :</strong> {agentInfo.poste}</p>
            <p><strong>Catégorie :</strong> {agentInfo.categorie}</p>
            <p><strong>Âge :</strong> {agentInfo.age} ans</p>
            <p><strong>Date embauche :</strong> {agentInfo.date_embauche}</p>
          </div>
        )}

        <label>Ancienneté (années) :</label>
        <input
          type="number"
          name="anciennete"
          value={formData.anciennete}
          onChange={handleChange}
          min="0"
        />

        <label>Date dernier retour :</label>
        <input
          type="date"
          name="dateDernierRetour"
          value={formData.dateDernierRetour}
          readOnly
          style={{ backgroundColor: "#eee" }}
        />

        <label>Date départ :</label>
        <input
          type="date"
          name="dateDepart"
          value={formData.dateDepart}
          onChange={handleChange}
          required
        />

        <label>Médaille :</label>
        <input
          type="number"
          name="medaille"
          value={formData.medaille}
          onChange={handleChange}
          min="0"
        />

        <label>Reliquat :</label>
        <input
          type="number"
          name="reliquat"
          value={formData.reliquat}
          onChange={handleChange}
          min="0"
        />

        <label>Intercalaire :</label>
        <input
          type="number"
          name="intercalaire"
          value={formData.intercalaire}
          onChange={handleChange}
          min="0"
        />

        <label>Supplément femme :</label>
        <input
          type="number"
          name="supplFemme"
          value={formData.supplFemme}
          onChange={handleChange}
          min="0"
        />

        <label>Observations :</label>
        <textarea
          name="observations"
          value={formData.observations}
          onChange={handleChange}
          rows={3}
          required
        />

        <label><strong>Jours de congé ordinaires calculés :</strong> {joursOrdinaires}</label>
        <label><strong>Total jours de congé :</strong> {joursTotal}</label>

        <label>Date retour prévue :</label>
        <input
          type="date"
          name="dateRetourPrevue"
          value={formData.dateRetourPrevue}
          readOnly
          style={{ backgroundColor: "#eee" }}
        />

        <div className={styles.buttons}>
          <button type="submit">Enregistrer</button>
        </div>
      </form>

      {message && (
        <div
          className={`${styles.fixedMessage} ${
            message.type === "success" ? styles.success : styles.rejectMsg
          }`}
        >
          {message.text}
        </div>
      )}
    </main>
  );
}
