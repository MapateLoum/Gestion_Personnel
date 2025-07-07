"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./periode.module.css";

export default function EditCongeForm() {
  const [formData, setFormData] = useState({
    referenceDebut: "",
    referenceFin: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données envoyées :", formData);
    // traitement ou envoi
  };

  const handleCancel = () => {
    setFormData({
      referenceDebut: "",
      referenceFin: "",
    });
  };

  const handleGoBack = () => {
    router.back(); // 👈 revient à la page précédente
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Édition de Congé</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="referenceDebut">Référence début</label>
          <input
            type="text"
            id="referenceDebut"
            name="referenceDebut"
            value={formData.referenceDebut}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="referenceFin">Référence fin</label>
          <input
            type="text"
            id="referenceFin"
            name="referenceFin"
            value={formData.referenceFin}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.buttonEnvoyer}>
            Envoyer
          </button>
          <button type="button" onClick={handleCancel} className={styles.buttonAnnuler}>
            Annuler
          </button>
          <button type="button" onClick={handleGoBack} className={styles.buttonRetour}>
            Retour
          </button>
        </div>
      </form>
    </div>
  );
}
