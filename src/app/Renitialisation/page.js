"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  // <- import router
import styles from "./renitialisation.module.css";

export default function Reinitialisation() {
  const router = useRouter();
  const [matricule, setMatricule] = useState("");
  const [utilisateur, setUtilisateur] = useState(null);
  const [nouveauMot, setNouveauMot] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [toast, setToast] = useState({ message: "", type: "error" });
  const [motDePasseMisAJour, setMotDePasseMisAJour] = useState(false);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "error" }), 4000);
  };

  const verifierMatricule = async () => {
    try {
      const res = await fetch(`/api/users/${matricule}`);
      if (!res.ok) throw new Error("Matricule introuvable");
      const data = await res.json();
      setUtilisateur(data);
    } catch (e) {
      setUtilisateur(null);
      showToast(e.message, "error");
    }
  };

  const resetMotDePasse = async () => {
    if (nouveauMot.length < 6) return showToast("Mot de passe trop court", "error");
    if (nouveauMot !== confirmation) return showToast("Les mots de passe ne correspondent pas", "error");

    try {
      const res = await fetch(`/api/users/password/${matricule}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nouveauMotDePasse: nouveauMot }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      showToast("Mot de passe mis à jour avec succès", "success");
      setMotDePasseMisAJour(true);
      // On peut aussi vider les champs si besoin
      setMatricule("");
      setNouveauMot("");
      setConfirmation("");
      setUtilisateur(null);
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginHeader}>
        <div className={styles.loginTitleWrapper}>
          <h2 className={styles.loginTitle}>Réinitialisation du mot de passe</h2>
          <p className={styles.loginSubtitle}>Saisis ton matricule pour commencer</p>
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.form}>
          {!motDePasseMisAJour && (
            <>
              <label className={styles.label}>Matricule</label>
              <input
                className={styles.input}
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                type="text"
              />
              <button className={styles.button} onClick={verifierMatricule}>Vérifier</button>

              {utilisateur && (
                <>
                  <label className={styles.label}>Nouveau mot de passe</label>
                  <input
                    className={styles.input}
                    type="password"
                    value={nouveauMot}
                    onChange={(e) => setNouveauMot(e.target.value)}
                  />
                  <label className={styles.label}>Confirmer le mot de passe</label>
                  <input
                    className={styles.input}
                    type="password"
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                  />
                  <button className={styles.button} onClick={resetMotDePasse}>Mettre à jour</button>
                </>
              )}
            </>
          )}

          {motDePasseMisAJour && (
            <button
              className={styles.button}
              onClick={() => router.push('/login')}
            >
              Retour à la connexion
            </button>
          )}
        </div>
      </div>

      {toast.message && (
        <div
          className={styles.toast}
          style={{
            backgroundColor:
              toast.type === "success"
                ? "rgba(10, 143, 10, 0.95)"
                : "rgba(204, 42, 42, 0.95)",
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
