// src/app/api/consultation_conge/route.js
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Passer*2003*",
  database: "stage",
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const matricule = searchParams.get("matricule");

    if (!matricule) {
      return NextResponse.json(
        { success: false, message: "Matricule requis" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Requête pour infos agent
    const [persRows] = await connection.execute(
      `SELECT MLE, NOM, PRENOMS, INTITULE_DU_POSE AS poste, CATEGORIE, REG, DATE_NAIS, DATE_EMB, BASE_HORAIRE 
       FROM pers WHERE MLE = ?`,
      [matricule]
    );

    if (persRows.length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Agent non trouvé" },
        { status: 404 }
      );
    }

    const agent = persRows[0];

    // Requête pour congés de l'agent
    const [congesRows] = await connection.execute(
      `SELECT REF AS ref, DDEPART AS dateDepart, NJMEDAILLE AS medaille, RELIQT AS reliquat, NJANC AS anciennete,
              OBSERVATIONS AS observation, DTA_RET_EFF AS dateReference, SUPPF AS supplFemme, MLE AS matricule, INTERC AS intercalaire
       FROM conges WHERE MLE = ? ORDER BY DDEPART DESC`,
      [matricule]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      agent: {
        nom: agent.NOM,
        prenom: agent.PRENOMS,
        poste: agent.poste,
        categorie: agent.CATEGORIE,
        reg: agent.REG,
        dateNaissance: agent.DATE_NAIS ? agent.DATE_NAIS.toISOString().slice(0, 10) : null,
        dateEmbauche: agent.DATE_EMB ? agent.DATE_EMB.toISOString().slice(0, 10) : null,
        baseHoraire: agent.BASE_HORAIRE?.toString() || null,
        conges: congesRows.map(c => ({
          ...c,
          dateDepart: c.dateDepart ? c.dateDepart.toISOString().slice(0, 10) : null,
          dateReference: c.dateReference ? c.dateReference.toISOString().slice(0, 10) : null,
          medaille: c.medaille === 1 ? "OUI" : "NON", // converti int en texte
          supplFemme: c.supplFemme === "O" || c.supplFemme === "o" ? "Oui" : "Non",
          intercalaire: c.intercalaire === "O" || c.intercalaire === "o" ? "Oui" : "Non",
        })),
      },
    });
  } catch (error) {
    console.error("Erreur API consultation_conge:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}
