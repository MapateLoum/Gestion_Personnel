import { NextResponse } from "next/server";
import { getConnection } from "../../../lib/db";  // ajuste le chemin relatif selon ta structure

export async function GET(request) {
  let connection;

  try {
    const { searchParams } = new URL(request.url);
    const matricule = searchParams.get("matricule");

    if (!matricule) {
      return NextResponse.json(
        { success: false, message: "Matricule requis" },
        { status: 400 }
      );
    }

    connection = await getConnection();

    // ✅ 1) Infos agent
    const [persRows] = await connection.execute(
      `SELECT MLE, NOM, PRENOMS, INTITULE_DU_POSE AS poste, CATEGORIE, REG, BASE_HORAIRE, CODE_SAN 
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

    // ✅ 2) Contrat actif (le plus récent)
    const [contratRows] = await connection.execute(
      `SELECT type_contrat, date_debut, date_fin, salaire 
       FROM contrats 
       WHERE matricule = ? 
       ORDER BY date_debut DESC LIMIT 1`,
      [matricule]
    );

    let typeContrat = null;
    let dateDebut = null;
    let dateFin = null;
    let salaireContrat = null;

    if (contratRows.length > 0) {
      typeContrat = contratRows[0].type_contrat;
      dateDebut = contratRows[0].date_debut;
      dateFin = contratRows[0].date_fin;
      salaireContrat = contratRows[0].salaire;
    }

    // ✅ 3) Optionnel : salaires_categoriels
    const [salRows] = await connection.execute(
      `SELECT SALCON, SALMINI, AVALOIR FROM salaires_categoriels WHERE MLE = ?`,
      [matricule]
    );

    let salaireConventionnel = null;
    let salaireMinimum = null;
    let avantage = null;

    if (salRows.length > 0) {
      salaireConventionnel = salRows[0].SALCON;
      salaireMinimum = salRows[0].SALMINI;
      avantage = salRows[0].AVALOIR;
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      matricule: agent.MLE,
      nom: agent.NOM,
      prenom: agent.PRENOMS,
      poste: agent.poste,
      categorie: agent.CATEGORIE,
      reg: agent.REG,
      baseHoraire: agent.BASE_HORAIRE !== null ? agent.BASE_HORAIRE.toString() : null,
      codeSan: agent.CODE_SAN,

      typeContrat,
      dateDebut,
      dateFin,
      salaireContrat,

      salaireConventionnel,
      salaireMinimum,
      avantage,
    });
  } catch (error) {
    console.error("Erreur API salaire:", error);
    if (connection) await connection.end();
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}
