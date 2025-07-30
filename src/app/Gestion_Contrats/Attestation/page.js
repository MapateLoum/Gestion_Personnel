"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./attestation.module.css";

export default function Attestation() {
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

  const [matricule, setMatricule] = useState("");
  const [attestationType, setAttestationType] = useState("travail");
  const [agent, setAgent] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const rechercherAgent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setAgent(null);

    try {
      const res = await fetch(
        `/api/attestation/${encodeURIComponent(matricule.trim())}`
      );
      const data = await res.json();

      if (res.ok && data.success) {
        setAgent(data.agent);
      } else {
        setErrorMsg(data.error || "Matricule non trouvé.");
      }
    } catch {
      setErrorMsg("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetour = () => {
    setMatricule("");
    setAgent(null);
    setErrorMsg("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const generateHeader = (today) => `
    <header>
      <div class="left-logo">INDORAMA</div>
      <div class="right-logo">ICS</div>
    </header>
    <div class="date-right">Taiba, le ${today}</div>
  `;

  const generateFooter = () => `
    <footer class="footer">
      <p><strong>Industries Chimiques du Sénégal</strong> KM 18, Route de Rufisque BP 3835, Dakar | SOCIÉTÉ ANONYME AU CAPITAL DE 94 235 610 000 F CFA | RC DAKAR N° 77/B/13 NINEA 00229552G3 | T+ 221 33 879 10 00 | www.ics.sn</p>
    </footer>
  `;

  const imprimerAttestationTravail = () => {
    const today = new Date().toLocaleDateString("fr-FR");

    const content = `
      <html>
        <head>
          <title>Attestation de travail</title>
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              padding: 40px 60px;
              color: #000;
            }
            header {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              margin-bottom: 30px;
            }
            .date-right {
              text-align: right;
              margin-bottom: 40px;
              font-size: 14px;
            }
            h2 {
              text-align: center;
              font-size: 22px;
              text-transform: uppercase;
              margin-bottom: 30px;
            }
            p {
              font-size: 16px;
              line-height: 1.6;
            }
            .responsable {
              margin-top: 60px;
              text-align: right;
              font-weight: 600;
            }
            .responsable-name {
              margin-top: 40px;
              text-align: right;
              font-style: italic;
            }
            .footer {
              border-top: 1px solid #ccc;
              margin-top: 50px;
              padding-top: 15px;
              text-align: center;
              font-size: 13px;
              color: #555;
            }
          </style>
        </head>
        <body>
          ${generateHeader(today)}
          <h2>Attestation de travail</h2>
          <p>Nous soussignés, <strong>INDUSTRIES CHIMIQUES DU SÉNÉGAL (Direction du site Minier)</strong>, attestons que Mr/Mme <strong>${agent.PRENOMS} ${agent.NOM}</strong>, titulaire du matricule <strong>${agent.MLE}</strong>, est employé(e) dans notre société depuis le <strong>${formatDate(
      agent.DATE_EMB
    )}</strong>.</p>
          <p>Il/Elle occupe actuellement le poste de <strong>${
            agent.INTITULE_DU_POSE || agent.POSTE || "-"
          }</strong>.</p>
          <p>Il/Elle est classé(e) à la catégorie <strong>${
            agent.CATEGORIE || "-"
          }</strong> de la Convention Collective des Industries Extractives et de la Prospection Minière.</p>
          <p>En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit.</p>
          <div class="responsable">Responsable R.H Mine</div>
          <div class="responsable-name">Alassane Lo</div>
          ${generateFooter()}
        </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const imprimerAttestationRetraite = () => {
  const today = new Date().toLocaleDateString("fr-FR");

  const content = `
    <html>
      <head>
        <title>Attestation de retraite</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            padding: 40px 60px;
            color: #000;
          }
          header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 30px;
          }
          .date-right {
            text-align: right;
            margin-bottom: 40px;
            font-size: 14px;
          }
          h2 {
            text-align: center;
            font-size: 22px;
            text-transform: uppercase;
            margin-bottom: 30px;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
          }
          .responsable {
            margin-top: 60px;
            text-align: right;
            font-weight: 600;
          }
          .responsable-name {
            margin-top: 40px;
            text-align: right;
            font-style: italic;
          }
          .footer {
            border-top: 1px solid #ccc;
            margin-top: 50px;
            padding-top: 15px;
            text-align: center;
            font-size: 13px;
            color: #555;
          }
        </style>
      </head>
      <body>
        ${generateHeader(today)}
        <h2>Attestation de retraite</h2>
        <p>Nous soussignés, <strong>INDUSTRIES CHIMIQUES DU SÉNÉGAL</strong>, attestons que Mr/Mme <strong>${agent.PRENOMS} ${agent.NOM}</strong>, Mle <strong>${agent.MLE}</strong>, né(e) le <strong>${formatDate(agent.DATE_NAIS)}</strong>, est employé(e) dans notre société depuis le <strong>${formatDate(agent.DATE_EMB)}</strong>.</p>
        <p>Son départ à la retraite est prévu le <strong>${formatDate(agent.DATE_DEP)}</strong>.</p>
        <p>En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit.</p>
        <div class="responsable">Responsable R.H Mine</div>
        <div class="responsable-name">Alassane Lo</div>
        ${generateFooter()}
      </body>
    </html>
  `;

  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Génération d'attestation</h1>

      {!agent && (
        <form onSubmit={rechercherAgent} className={styles.form}>
          <label className={styles.label}>Matricule :</label>
          <input
            type="text"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            className={styles.input}
            required
            disabled={loading}
          />

          <label className={styles.label}>Type d’attestation :</label>
          <select
            className={styles.select}
            value={attestationType}
            onChange={(e) => setAttestationType(e.target.value)}
          >
            <option value="travail">Attestation de travail</option>
            <option value="retraite">Attestation de retraite</option>
          </select>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Recherche..." : "Rechercher"}
          </button>

          <button
            type="button"
            className={`${styles.button} ${styles.buttonAnnuler}`}
            onClick={() => router.back()}
          >
            Retour
          </button>

          {errorMsg && (
            <div
              className={styles.popupMessage}
              role="alert"
              aria-live="assertive"
            >
              {errorMsg}
            </div>
          )}
        </form>
      )}

      {agent && (
        <div className={styles.attestationContent}>
          <h2>Informations de l’agent</h2>
          <p>
            <strong>Nom :</strong> {agent.NOM}
          </p>
          <p>
            <strong>Prénom :</strong> {agent.PRENOMS}
          </p>
          <p>
            <strong>Matricule :</strong> {agent.MLE}
          </p>
          <p>
            <strong>Poste :</strong> {agent.INTITULE_DU_POSE || agent.POSTE || "-"}
          </p>
          <p>
            <strong>Catégorie :</strong> {agent.CATEGORIE || "-"}
          </p>
          <p>
            <strong>Date d’embauche :</strong> {formatDate(agent.DATE_EMB)}
          </p>
          <p>
            <strong>Date de naissance :</strong> {formatDate(agent.DATE_NAIS)}
          </p>
          <p>
            <strong>Date prévue de départ :</strong> {formatDate(agent.DATE_DEP)}
          </p>

          <div className={styles.buttons}>
            <button
              className={styles.button}
              onClick={
                attestationType === "travail"
                  ? imprimerAttestationTravail
                  : imprimerAttestationRetraite
              }
            >
              Imprimer
            </button>
            <button
              className={`${styles.button} ${styles.buttonAnnuler}`}
              onClick={handleRetour}
            >
              Retour
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
