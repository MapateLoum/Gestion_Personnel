"use client";

import { useState } from "react";
import styles from "./edit.module.css";
import { useRouter } from "next/navigation";

export default function EditCongeForm() {
  const [formData, setFormData] = useState({ matricule: "", refConge: "" });
  const [message, setMessage] = useState("");
  const [agentConge, setAgentConge] = useState(null);
const router = useRouter();
const handleRetour = () => {
  router.back();
};

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAgentConge(null);

    if (!formData.matricule.trim() || !formData.refConge.trim()) {
      showMessage("Merci de renseigner matricule et référence du congé.");
      return;
    }

    try {
      const res = await fetch("/api/conges/verif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricule: formData.matricule.trim(),
          refConge: formData.refConge.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.error || "Erreur lors de la vérification.");
        return;
      }

      setAgentConge(data);
    } catch {
      showMessage("Erreur réseau.");
    }
  };

  // Calcul ancienneté en années
  const calcAnciennete = (dateEmbauche) => {
    if (!dateEmbauche) return 0;
    const emb = new Date(dateEmbauche);
    const now = new Date();
    let years = now.getFullYear() - emb.getFullYear();
    const m = now.getMonth() - emb.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < emb.getDate())) years--;
    return years;
  };

  // Différence jours entre deux dates (inclusif)
  const diffJours = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diffTime = date2 - date1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Jours supplémentaires pour ancienneté (1 jour tous les 5 ans)
  const joursSupplAnciennete = (anciennete) => Math.floor(anciennete / 5);

  // Formater date jj mois aaaa
  const formatDateISO = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

  // Imprimer bulletin
  const imprimerBulletin = () => {
  if (!agentConge) return;

  const { agent, conge } = agentConge;

  const anciennete = calcAnciennete(agent.DATE_EMB);
  const nbjAnciennete = joursSupplAnciennete(anciennete);
  const medaille = parseInt(conge.NJMEDAILLE) || 0;
  const reliquat = parseInt(conge.RELIQT) || 0;
  const intercalaire = parseInt(conge.INTERC) || 0;
  const suppFemme = parseInt(conge.SUPPF) || 0;
  const nbjConges = diffJours(conge.DDEPART, conge.DDRETOUR);

  const dureeTotale = nbjConges + nbjAnciennete + medaille + reliquat + intercalaire + suppFemme;

  // Date reprise = date départ + durée totale - 1 jour
  const dateDepart = new Date(conge.DDEPART);
  const dateReprise = new Date(dateDepart);
  dateReprise.setDate(dateReprise.getDate() + dureeTotale - 1);

  const html = `
  <div style="font-family: Arial, sans-serif; margin: 30px; color: #000;">
    <header style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
      <div style="font-weight: bold; font-size: 22px; text-transform: uppercase; color:#003366;">
        INDORAMA
      </div>
      <div style="text-align: right; font-weight: bold; font-size: 22px; color:#006699;">
        ICS
      </div>
    </header>
    <header style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 30px;">
      <div style="font-weight: normal; color: #444;">
        DSMPH-MINE
      </div>
      <div style="font-weight: normal; color: #444;">
        ${new Date().toLocaleDateString('fr-FR')}
      </div>
    </header>

    <div style="font-weight: bold; font-size: 18px; margin-bottom: 20px;">
      Bulletin de congé
      <span style="margin-left: 15px;">N° ${conge.REF}</span>
    </div>

    <!-- Deux éléments par ligne, bien alignés -->
    <div style="display: flex; gap: 30px; margin-bottom: 8px; flex-wrap: wrap;">
      <div style="min-width: 45%;">Prénoms : <strong>${agent.PRENOMS}</strong></div>
      <div style="min-width: 45%;">Nom : <strong>${agent.NOM}</strong></div>
    </div>
    <div style="display: flex; gap: 30px; margin-bottom: 8px; flex-wrap: wrap;">
      <div style="min-width: 45%;">Emploi : <strong>${agent.INTITULE_DU_POSE}</strong></div>
      <div style="min-width: 45%;">Catégorie : <strong>${agent.CATEGORIE}</strong></div>
    </div>
    <div style="display: flex; gap: 30px; margin-bottom: 8px; flex-wrap: wrap;">
      <div style="min-width: 45%;">Date d'embauche : <strong>${formatDateISO(agent.DATE_EMB)}</strong></div>
      <div style="min-width: 45%;">Ancienneté : <strong>${anciennete} ans</strong></div>
    </div>

    <!-- Bordure commence ici -->
    <div style="border: 1px solid #444; padding: 15px; line-height: 1.5; margin-top: 20px; margin-bottom: 25px;">
      <div>Matricule : <strong>${agent.MLE}</strong></div>
      <div>Période de référence du <strong>${formatDateISO(conge.DDEPART)}</strong> au <strong>${formatDateISO(conge.DDRETOUR)}</strong>, soit <strong>${nbjConges} jours</strong> de congé ordinaire.</div>
      <br/>
      <div>
        <strong style="text-decoration: underline; font-weight: bold;">
          Congé supplémentaire rémunérés :
        </strong>
      </div>
      <div>
        ${nbjAnciennete} jour(s) pour ancienneté,
        ${medaille} jour(s) pour la médaille d'honneur du travail,
        ${reliquat} jour(s) pour reliquat sur congés antérieurs,
        ${intercalaire} jour(s) pour congé intercalaire,
        ${suppFemme} jour(s) pour supplément femme salariée.
      </div>
      <br/>
      <div>
        Durée totale du congé : <strong>${dureeTotale} jours</strong>
      </div>
      <br/>
      <div style="display: flex; gap: 30px; flex-wrap: wrap;">
        <div style="min-width: 45%;">Date de départ : <strong>${formatDateISO(conge.DDEPART)}</strong></div>
        <div style="min-width: 45%;">Date de reprise prévue : <strong>${formatDateISO(dateReprise.toISOString())}</strong></div>
      </div>
      <br/>
      <div>
        Observations : <em>${conge.OBSERVATIONS || "Aucune"}</em>
      </div>
    </div>

    <!-- Hors bordure -->
    <div style="text-align: center; font-weight: bold; font-size: 20px; margin-bottom: 15px;">
      Attestation de congés
    </div>

    <div style="font-size: 16px; line-height: 1.5;">
      Nous soussignés INDUSTRIES CHIMIQUES DU SENEGAL, Direction du Site Minier (DSM) attestons que l'agent <strong>${agent.PRENOMS} ${agent.NOM}</strong> qui occupe le poste de <strong>${agent.INTITULE_DU_POSE}</strong> est bénéficiaire d'un congé annuel pour la période du <strong>${formatDateISO(conge.DDEPART)}</strong> au <strong>${formatDateISO(dateReprise.toISOString())}</strong>.
    </div>

    <div style="margin-top: 20px;">
      La date de retour est prévue le <strong>${formatDateISO(dateReprise.toISOString())}</strong>.
    </div>

    <div style="margin-top: 20px;">
      En foi de quoi, nous lui délivrons le présent pour servir et valoir ce que de droit.
    </div>

    <div style="text-align: right; margin-top: 80px; font-weight: bold;">
      Le responsable RH<br/><br/>
      Alassane Lo
    </div>
  </div>
`;


  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    alert("Veuillez autoriser les popups pour imprimer.");
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  // printWindow.close();
};

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Édition de congé</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="matricule" className={styles.label}>Matricule</label>
          <input
            id="matricule"
            name="matricule"
            type="text"
            value={formData.matricule}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="refConge" className={styles.label}>Référence congé</label>
          <input
            id="refConge"
            name="refConge"
            type="text"
            value={formData.refConge}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
 <>
        <button type="submit" className={styles.btnSubmit}>
          Vérifier & afficher bulletin
        </button>
         <button onClick={handleRetour} className={styles.btnRetour}>
      Retour
    </button>
  </>
      </form>

      {message && <div className={styles.message}>{message}</div>}

      {agentConge && (
 
    <button onClick={imprimerBulletin} className={styles.btnPrint}>
      Imprimer le bulletin de congé
    </button>
   
)}

    </div>
    
  );
}
