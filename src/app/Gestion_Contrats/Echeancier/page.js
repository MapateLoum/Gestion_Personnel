'use client';

import { useState } from 'react';
import styles from './echeancier.module.css';
import { useRouter } from 'next/navigation';

const contratsFictifs = [
  {
    ref: 'CTR001',
    nom: 'Diop',
    prenom: 'Aminata',
    type: 'CDD',
    dateFin: '2025-07-01',
  },
  {
    ref: 'CTR002',
    nom: 'Ba',
    prenom: 'Mamadou',
    type: 'CDI',
    dateFin: '2026-03-15',
  },
  {
    ref: 'CTR003',
    nom: 'Sow',
    prenom: 'Fatou',
    type: 'Stage',
    dateFin: '2025-06-25',
  },
  {
    ref: 'CTR004',
    nom: 'Ndoye',
    prenom: 'Ibrahima',
    type: 'CDD',
    dateFin: '2025-08-05',
  },
];

export default function EcheancierContrats() {
  const router = useRouter();
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [erreur, setErreur] = useState('');
  const [resultats, setResultats] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!dateDebut || !dateFin) {
      setErreur('Veuillez renseigner les deux dates.');
      return;
    }

    if (new Date(dateDebut) > new Date(dateFin)) {
      setErreur('La date de début doit être antérieure à la date de fin.');
      return;
    }

    setErreur('');
    const filtres = contratsFictifs.filter((contrat) => {
      const dateContrat = new Date(contrat.dateFin);
      return dateContrat >= new Date(dateDebut) && dateContrat <= new Date(dateFin);
    });

    setResultats(filtres);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Échéancier des Contrats</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="dateDebut">Date de début :</label>
          <input
            type="date"
            id="dateDebut"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="dateFin">Date de fin :</label>
          <input
            type="date"
            id="dateFin"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>
        {erreur && <p className={styles.error}>{erreur}</p>}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.button}>
            Afficher
          </button>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={() => router.back()}
          >
            Retour
          </button>
        </div>
      </form>

      {resultats.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Type</th>
              <th>Date d'échéance</th>
            </tr>
          </thead>
          <tbody>
            {resultats.map((contrat, index) => {
              const dateFin = new Date(contrat.dateFin);
              const diffJours = Math.ceil((dateFin - new Date()) / (1000 * 60 * 60 * 24));
              const isAlert = diffJours <= 15;
              return (
                <tr key={index} className={isAlert ? styles.alertRow : ''}>
                  <td>{contrat.ref}</td>
                  <td>{contrat.nom}</td>
                  <td>{contrat.prenom}</td>
                  <td>{contrat.type}</td>
                  <td>{contrat.dateFin}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {resultats.length === 0 && dateDebut && dateFin && (
        <p className={styles.noResult}>Aucun contrat trouvé dans cet intervalle.</p>
      )}
    </div>
  );
}
