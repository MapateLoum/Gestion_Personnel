"use client";

import { useState } from "react";
import styles from "./periode.module.css";
import jsPDF from "jspdf";

export default function ListeDesCongesParPeriode() {
  const [refDebut, setRefDebut] = useState("");
  const [refFin, setRefFin] = useState("");
  const [conges, setConges] = useState([]);
  const [message, setMessage] = useState("");

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleRecherche = async () => {
    const debut = parseInt(refDebut);
    const fin = parseInt(refFin);

    if (isNaN(debut) || isNaN(fin) || debut >= fin) {
      showMessage("Références invalides ou mal ordonnées !");
      return;
    }

    try {
      const res = await fetch("/api/conges/periode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refDebut: debut, refFin: fin }),
      });

      const data = await res.json();
      if (res.ok) {
        setConges(data.conges);
        if (data.conges.length === 0) showMessage("Aucun congé trouvé.");
      } else {
        showMessage(data.error || "Erreur lors de la recherche.");
      }
    } catch (err) {
      showMessage("Erreur réseau.");
    }
  };

  const handleImpression = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "A4" });

    doc.setFontSize(12);
    doc.text("NOTE INTERNE - Liste des Congés", 60, 15);
    doc.setFontSize(10);

    let y = 30;
    doc.text("Ref  Mle   Prénoms         Nom         NBJ NJSUPL Relqt NJTotal Départ     Reprise", 10, y);
    y += 5;

    conges.forEach((c) => {
      const ref = c.REF?.toString().padEnd(5);
      const mle = c.MLE?.toString().padEnd(6);
      const prenoms = (c.PRENOMS || "").slice(0, 13).padEnd(14);
      const nom = (c.NOM || "").slice(0, 11).padEnd(12);
      const nbj = (c.NJANC || 0).toString().padStart(3);
      const njsupl = (parseInt(c.SUPPF || 0)).toString().padStart(6);
      const relqt = (parseInt(c.RELIQT || 0)).toString().padStart(5);
      const njtotal = (
        (parseInt(c.NJANC || 0) || 0) +
        (parseInt(c.SUPPF || 0) || 0) +
        (parseInt(c.RELIQT || 0) || 0)
      )
        .toString()
        .padStart(7);
      const ddepart = (c.DDEPART || "").slice(0, 10).padEnd(12);
      const ddretour = (c.DDRETOUR || "").slice(0, 10);

      doc.text(
        `${ref} ${mle} ${prenoms} ${nom} ${nbj} ${njsupl} ${relqt} ${njtotal} ${ddepart} ${ddretour}`,
        10,
        y
      );
      y += 6;

      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("conges_par_periode.pdf");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Liste des Congés par Période</h2>

      <div className={styles.formGroup}>
        <label>Réf Début :</label>
        <input
          type="number"
          value={refDebut}
          onChange={(e) => setRefDebut(e.target.value)}
          className={styles.input}
        />
        <label>Réf Fin :</label>
        <input
          type="number"
          value={refFin}
          onChange={(e) => setRefFin(e.target.value)}
          className={styles.input}
        />
        <div className={styles.buttons}>
          <button onClick={handleRecherche} className={styles.buttonEnvoyer}>
            Rechercher
          </button>
          {conges.length > 0 && (
            <button onClick={handleImpression} className={styles.buttonRetour}>
              Imprimer PDF
            </button>
          )}
        </div>
      </div>

      {message && <div className={styles.toast}>{message}</div>}

      {conges.length > 0 && (
        <div className={styles.liste}>
          <div className={styles.entete}>
            <span>Ref</span>
            <span>Mle</span>
            <span>Prénoms</span>
            <span>Nom</span>
            <span>NBJ</span>
            <span>NJSUPL</span>
            <span>Relqt</span>
            <span>NJTotal</span>
            <span>Départ</span>
            <span>Reprise</span>
          </div>
          {conges.map((c) => {
            const NJTotal =
              (parseInt(c.NJANC || 0) || 0) +
              (parseInt(c.SUPPF || 0) || 0) +
              (parseInt(c.RELIQT || 0) || 0);
            return (
              <div key={c.REF} className={styles.ligne}>
                <span>{c.REF}</span>
                <span>{c.MLE}</span>
                <span>{c.PRENOMS}</span>
                <span>{c.NOM}</span>
                <span>{c.NJANC || 0}</span>
                <span>{c.SUPPF || 0}</span>
                <span>{c.RELIQT || 0}</span>
                <span>{NJTotal}</span>
                <span>{c.DDEPART?.slice(0, 10)}</span>
                <span>{c.DDRETOUR?.slice(0, 10)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
