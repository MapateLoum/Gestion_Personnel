"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./modif.module.css";
import { useEffect } from "react";

export default function ModifierPersonnel() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    mle: "",
    STE: "",
    nom: "",
    prenoms: "",
    intituleDuPoste: "",
    categorie: "",
    codeSan: "",
    nbreEpouse: "",
    nbreEnfant: "",
    filiation_: "",
    filiation_2: "",
    adresse: "",
    stat: "",
    reg: "",
    dateNaissance: "",
    lieuNaissance: "",
    dateEmbauche: "",
    sexe: "",
    nationalite: "",
    sf: "",
    confession: "",
    deptDivServSubd: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [message, setMessage] = useState("");
  const [fetchError, setFetchError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  useEffect(() => {
  if (message) {
    const timer = setTimeout(() => {
      setMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [message]);

  const handleSearch = async () => {
    if (!formData.mle) {
      setFetchError("⚠️ Veuillez saisir un matricule pour rechercher.");
      return;
    }

    setLoadingFetch(true);
    setFetchError("");
    setMessage("");

    try {
      const res = await fetch(`/api/personnel/modifier?mle=${encodeURIComponent(formData.mle)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setFormData({
          mle: data.personnel.MLE || "",
          STE: data.personnel.STE || "",
          nom: data.personnel.NOM || "",
          prenoms: data.personnel.PRENOMS || "",
          intituleDuPoste: data.personnel.INTITULE_DU_POSE || "",
          categorie: data.personnel.CATEGORIE || "",
          codeSan: data.personnel.CODE_SAN || "",
          nbreEpouse: data.personnel.NBEP || "",
          nbreEnfant: data.personnel.NBENF || "",
          filiation_: data.personnel.FILIATION_ || "",
          filiation_2: data.personnel.FILIATION_2 || "",
          adresse: data.personnel.ADRESSE || "",
          stat: data.personnel.STAT || "",
          reg: data.personnel.REG || "",
          dateNaissance: data.personnel.DATE_NAIS ? data.personnel.DATE_NAIS.slice(0, 10) : "",
          lieuNaissance: data.personnel.LIEUNAIS || "",
          dateEmbauche: data.personnel.DATE_EMB ? data.personnel.DATE_EMB.slice(0, 10) : "",
          sexe: data.personnel.SEXE || "",
          nationalite: data.personnel.NATION || "",
          sf: data.personnel.SF || "",
          confession: data.personnel.CONFESSION || "",
          deptDivServSubd: data.personnel.DEPT_DIV_SERV_SUBD || "",
        });
      } else {
        setFetchError(data.error || "Matricule non trouvé.");
      }
    } catch (error) {
      setFetchError("Erreur réseau lors de la recherche.");
    } finally {
      setLoadingFetch(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mle) {
      setMessage("❌ Veuillez saisir un matricule avant de modifier.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        mle: formData.mle,
        STE: formData.STE,
        nom: formData.nom,
        prenoms: formData.prenoms,
        intitule_du_poste: formData.intituleDuPoste,
        categorie: formData.categorie,
        code_san: formData.codeSan,
        nbreEpouse: formData.nbreEpouse,
        nbreEnfant: formData.nbreEnfant,
        filiation_: formData.filiation_,
        filiation_2: formData.filiation_2,
        adresse: formData.adresse,
        stat: formData.stat,
        reg: formData.reg,
        date_naissance: formData.dateNaissance,
        lieu_naissance: formData.lieuNaissance,
        date_embauche: formData.dateEmbauche,
        sexe: formData.sexe,
        nationalite: formData.nationalite,
        sf: formData.sf,
        confession: formData.confession,
        dept_div_serv_subd: formData.deptDivServSubd,
      };

      const res = await fetch("/api/personnel/modifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("✅ Modification réussie !");
      } else {
        setMessage(`❌ Erreur : ${data.error || "Échec de la modification."}`);
      }
    } catch (error) {
      setMessage("❌ Erreur réseau, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Modifier Personnel</h1>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="mleSearch">Matricule à rechercher :</label>
        <input
          id="mleSearch"
          name="mle"
          type="text"
          value={formData.mle}
          onChange={(e) => setFormData((prev) => ({ ...prev, mle: e.target.value.toUpperCase() }))}
          style={{ marginLeft: 10, textTransform: "uppercase" }}
          disabled={loadingFetch || loading}
        />
        <button onClick={handleSearch} disabled={loadingFetch || loading} style={{ marginLeft: 10 }}>
          {loadingFetch ? "Recherche..." : "Rechercher"}
        </button>
        {fetchError && <p style={{ color: "red", marginTop: 5 }}>{fetchError}</p>}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {Object.entries(formData).map(([key, value]) => {
          if (key === "mle") return null;

          return (
            <div className={styles.formGroup} key={key}>
              <label htmlFor={key}>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/_/g, " ")
                  .toUpperCase()}
              </label>
              <input
                type={
                  key.toLowerCase().includes("date")
                    ? "date"
                    : key.toLowerCase().includes("nbre") || key.toLowerCase().includes("nb")
                    ? "number"
                    : "text"
                }
                id={key}
                name={key}
                className={styles.input}
                value={value}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          );
        })}

        <div className={styles.buttons}>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.returnBtn}
            disabled={loading}
            style={{ marginRight: "10px" }}
          >
            Retour
          </button>
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Modification..." : "Modifier"}
          </button>
        </div>

        {message && (
  <div className={styles.toast}>
    {message}
  </div>
)}

      </form>
    </main>
  );
}
