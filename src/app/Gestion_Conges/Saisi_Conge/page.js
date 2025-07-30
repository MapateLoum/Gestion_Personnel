"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./saisi.module.css";
import { useRouter } from "next/navigation";

export default function SaisieConges() {
  const router = useRouter();

  // Protection accès : vérifier cookie isLoggedIn
  useEffect(() => {
    const isLoggedIn = document.cookie
      .split("; ")
      .find((row) => row.startsWith("isLoggedIn="))
      ?.split("=")[1];

    if (isLoggedIn !== "true") {
      router.replace("/login");
    }

    // Empêcher retour arrière après déconnexion
    window.onpopstate = () => {
      const loggedIn = document.cookie
        .split("; ")
        .find((row) => row.startsWith("isLoggedIn="))
        ?.split("=")[1];
      if (loggedIn !== "true") {
        router.replace("/login");
      }
    };
  }, [router]);

  const [formData, setFormData] = useState({
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

  // Appelle l'API quand matricule change et n'est pas vide
  useEffect(() => {
    async function fetchAgent() {
      if (!formData.matricule.trim()) {
        setAgentInfo(null);
        setFormData((prev) => ({ ...prev, anciennete: "" }));
        return;
      }

      try {
        const res = await fetch(
          `/api/personnel/infos/${encodeURIComponent(formData.matricule.trim())}`
        );
        const data = await res.json();

        if (res.ok && data.found) {
          const agent = data.agent;

          setAgentInfo({
            matricule: agent.MLE,
            nom: agent.NOM,
            prenoms: agent.PRENOMS,
            poste: agent.INTITULE_DU_POSE,
            categorie: agent.CATEGORIE,
            age: agent.age,
            date_embauche: agent.DATE_EMB,
          });

          // Calcul ancienneté (en années)
          const embaucheDate = new Date(agent.DATE_EMB);
          const now = new Date();
          let diff = now.getFullYear() - embaucheDate.getFullYear();
          const m = now.getMonth() - embaucheDate.getMonth();
          if (m < 0 || (m === 0 && now.getDate() < embaucheDate.getDate())) diff--;

          setFormData((prev) => ({
            ...prev,
            anciennete: diff >= 0 ? diff.toString() : "0",
          }));
          setMessage("");
        } else {
          setAgentInfo(null);
          setFormData((prev) => ({ ...prev, anciennete: "" }));
          setMessage("Aucun agent trouvé avec ce matricule.");
        }
      } catch (err) {
        console.error(err);
        setAgentInfo(null);
        setFormData((prev) => ({ ...prev, anciennete: "" }));
        setMessage("Erreur lors de la récupération des données.");
      }
    }

    fetchAgent();
  }, [formData.matricule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000); // disparaît après 5 secondes

      return () => clearTimeout(timer); // nettoyage
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification basique
    if (!formData.matricule.trim()) {
      setMessage("Le matricule est obligatoire.");
      return;
    }

    if (!formData.dateDepart || !formData.dateRetour) {
      setMessage("Les dates de départ et retour sont obligatoires.");
      return;
    }

    if (new Date(formData.dateDepart) >= new Date(formData.dateRetour)) {
      setMessage("La date de départ doit être avant la date de retour.");
      return;
    }

    try {
      const res = await fetch("/api/conges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("Congé enregistré avec succès !");
        setFormData({
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
        setAgentInfo(null);
      } else {
        setMessage(data.message || "Erreur lors de l'enregistrement.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur réseau, veuillez réessayer.");
    }
  };

  const imprimer = () => {
    const {
      matricule,
      anciennete,
      dateDepart,
      dateRetour,
      medaille,
      reliquat,
      intercalaire,
      observations,
      supplFemme,
    } = formData;

    const content = `
      <h2>Attestation Administrative de Congés</h2>
      <p>Matricule : <strong>${matricule}</strong></p>
      <p>Ancienneté : <strong>${anciennete}</strong> ans</p>
      <p>Du <strong>${dateDepart}</strong> au <strong>${dateRetour}</strong></p>
      <ul>
        <li>Médaille : ${medaille}</li>
        <li>Reliquat : ${reliquat}</li>
        <li>Intercalaire : ${intercalaire}</li>
        <li>Supplément femme : ${supplFemme}</li>
      </ul>
      <p>Observations : ${observations}</p>
      <p>Fait le ${new Date().toLocaleDateString()}</p>
    `;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head><title>Impression Congés</title>
        <style>body { font-family: Arial, sans-serif; padding: 20px; }</style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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
            <p>
              <strong>Nom :</strong> {agentInfo.nom}
            </p>
            <p>
              <strong>Prénoms :</strong> {agentInfo.prenoms}
            </p>
            <p>
              <strong>Poste :</strong> {agentInfo.poste}
            </p>
            <p>
              <strong>Catégorie :</strong> {agentInfo.categorie}
            </p>
            <p>
              <strong>Âge :</strong> {agentInfo.age} ans
            </p>
            <p>
              <strong>Date embauche :</strong> {agentInfo.date_embauche}
            </p>
          </div>
        )}

        <label>Ancienneté (années) :</label>
        <input
          type="number"
          name="anciennete"
          min="1"
          value={formData.anciennete}
          onChange={handleChange}
          required
        />

        <label>Date départ :</label>
        <input
          type="date"
          name="dateDepart"
          value={formData.dateDepart}
          onChange={handleChange}
          required
        />

        <label>Date retour :</label>
        <input
          type="date"
          name="dateRetour"
          value={formData.dateRetour}
          onChange={handleChange}
          required
        />

        <label>Médaille :</label>
        <input
          type="number"
          name="medaille"
          min="0"
          value={formData.medaille}
          onChange={handleChange}
        />

        <label>Reliquat :</label>
        <input
          type="text"
          name="reliquat"
          value={formData.reliquat}
          onChange={handleChange}
        />

        <label>Intercalaire :</label>
        <input
          type="number"
          name="intercalaire"
          min="0"
          value={formData.intercalaire}
          onChange={handleChange}
        />

        <label>Supplément femme :</label>
        <input
          type="number"
          name="supplFemme"
          min="0"
          value={formData.supplFemme}
          onChange={handleChange}
        />

        <label>Observations :</label>
        <textarea
          name="observations"
          rows={3}
          value={formData.observations}
          onChange={handleChange}
        />

        <div className={styles.buttons}>
          <button type="submit">Enregistrer</button>
          <button
            type="button"
            onClick={imprimer}
            className={styles.printBtn}
          >
            Imprimer
          </button>
        </div>

        {message && (
          <div
            className={`${styles.fixedMessage} ${
              message.includes("succès")
                ? styles.acceptMsg
                : styles.rejectMsg
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </main>
  );
}
