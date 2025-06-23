"use client";

import { useState } from "react";
import styles from "./formulaire.module.css";

export default function FormulairePersonnel() {
  const [formData, setFormData] = useState({
    STE: "",
    matricule: "",
    nom: "",
    prenom: "",
    poste: "",
    categorie: "",
    codeSAN: "",
    nbreEpouse: "",
    nbreEnfant: "",
    nomPere: "",
    nomMere: "",
    adresse: "",
    statut: "",
    regime: "",
    dateNaissance: "",
    lieuNaissance: "",
    dateEmbauche: "",
    sexe: "",
    nationalite: "",
    situationFamiliale: "",
    confession: "",
    departDivSer: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Données envoyées :\n" + JSON.stringify(formData, null, 2));
  };

  const printSection = (title) => {
  const printContents = document.getElementById("formToPrint").innerHTML;
  const newWin = window.open("", "", "width=800,height=600");
  newWin.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
          }
          h1 {
            color: #076969;
            margin-bottom: 25px;
          }
          /* Masquer tous les boutons dans la fenêtre d'impression */
          button, .buttons {
            display: none !important;
          }
          /* Masquer tous les champs input */
          input {
            display: none !important;
          }
          /* Labels en lignes pointillées */
          label {
            display: inline-block;
            width: 250px;
            border-bottom: 1px dotted black;
            margin-bottom: 15px;
            padding-left: 5px;
            color: black;
            font-weight: normal;
          }
          /* Espacement des divs */
          div {
            margin-bottom: 25px;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${printContents}
      </body>
    </html>
  `);
  newWin.document.close();
  newWin.focus();
  newWin.print();
  newWin.close();
};


  const printRensPaie = () => printSection("Renseignements de paie");
  const printNotifEmbauche = () => printSection("Notification d'embauche");
  const printContrat = () => printSection("Contrat de travail");
  const printTout = () => window.print();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Formulaire Personnel</h1>

      <div id="formToPrint">
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="STE">STE :</label>
            <input
              type="text"
              id="STE"
              name="STE"
              className={styles.input}
              value={formData.STE}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="matricule">Matricule :</label>
            <input
              type="text"
              id="matricule"
              name="matricule"
              className={styles.input}
              value={formData.matricule}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nom">Nom :</label>
            <input
              type="text"
              id="nom"
              name="nom"
              className={styles.input}
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="prenom">Prénom :</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              className={styles.input}
              value={formData.prenom}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="poste">Poste :</label>
            <input
              type="text"
              id="poste"
              name="poste"
              className={styles.input}
              value={formData.poste}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="categorie">Catégorie :</label>
            <input
              type="text"
              id="categorie"
              name="categorie"
              className={styles.input}
              value={formData.categorie}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="codeSAN">Code SAN :</label>
            <input
              type="text"
              id="codeSAN"
              name="codeSAN"
              className={styles.input}
              value={formData.codeSAN}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nbreEpouse">Nombre d'épouses :</label>
            <input
              type="number"
              id="nbreEpouse"
              name="nbreEpouse"
              className={styles.input}
              min="0"
              value={formData.nbreEpouse}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nbreEnfant">Nombre d'enfants :</label>
            <input
              type="number"
              id="nbreEnfant"
              name="nbreEnfant"
              className={styles.input}
              min="0"
              value={formData.nbreEnfant}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nomPere">Nom du père :</label>
            <input
              type="text"
              id="nomPere"
              name="nomPere"
              className={styles.input}
              value={formData.nomPere}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nomMere">Nom de la mère :</label>
            <input
              type="text"
              id="nomMere"
              name="nomMere"
              className={styles.input}
              value={formData.nomMere}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="adresse">Adresse :</label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              className={styles.input}
              value={formData.adresse}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="statut">Statut :</label>
            <input
              type="text"
              id="statut"
              name="statut"
              className={styles.input}
              value={formData.statut}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="regime">Régime :</label>
            <input
              type="text"
              id="regime"
              name="regime"
              className={styles.input}
              value={formData.regime}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dateNaissance">Date de naissance :</label>
            <input
              type="date"
              id="dateNaissance"
              name="dateNaissance"
              className={styles.input}
              value={formData.dateNaissance}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lieuNaissance">Lieu de naissance :</label>
            <input
              type="text"
              id="lieuNaissance"
              name="lieuNaissance"
              className={styles.input}
              value={formData.lieuNaissance}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dateEmbauche">Date d'embauche :</label>
            <input
              type="date"
              id="dateEmbauche"
              name="dateEmbauche"
              className={styles.input}
              value={formData.dateEmbauche}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="sexe">Sexe :</label>
            <input
              type="text"
              id="sexe"
              name="sexe"
              className={styles.input}
              value={formData.sexe}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nationalite">Nationalité :</label>
            <input
              type="text"
              id="nationalite"
              name="nationalite"
              className={styles.input}
              value={formData.nationalite}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="situationFamiliale">Situation familiale :</label>
            <input
              type="text"
              id="situationFamiliale"
              name="situationFamiliale"
              className={styles.input}
              value={formData.situationFamiliale}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confession">Confession :</label>
            <input
              type="text"
              id="confession"
              name="confession"
              className={styles.input}
              value={formData.confession}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="departDivSer">Département / Division / Service :</label>
            <input
              type="text"
              id="departDivSer"
              name="departDivSer"
              className={styles.input}
              value={formData.departDivSer}
              onChange={handleChange}
            />
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.submitBtn}>Envoyer</button>
            <button type="button" onClick={printRensPaie} className={styles.printBtn}>Rens. Paie</button>
            <button type="button" onClick={printNotifEmbauche} className={styles.printBtn}>Notif Embauche</button>
            <button type="button" onClick={printContrat} className={styles.printBtn}>Contrat</button>
            <button type="button" onClick={printTout} className={styles.printBtn}>Imprimer</button>
          </div>
        </form>
      </div>
    </main>
  );
}
