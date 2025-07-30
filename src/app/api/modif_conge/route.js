import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Passer*2003*",
  database: "stage",
};

// GET : récupère conge + agent selon REF OU matricule (REF prioritaire)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref");
  const matricule = searchParams.get("matricule");

  if (!ref && !matricule) {
    return NextResponse.json(
      { success: false, message: "REF ou matricule requis." },
      { status: 400 }
    );
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    let congeRows = [];
    if (ref) {
      [congeRows] = await connection.execute(
        "SELECT * FROM conges WHERE REF = ? LIMIT 1",
        [ref]
      );
    } else if (matricule) {
      [congeRows] = await connection.execute(
        "SELECT * FROM conges WHERE MLE = ? LIMIT 1",
        [matricule]
      );
    }

    if (congeRows.length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Aucun congé trouvé." },
        { status: 404 }
      );
    }

    const conge = congeRows[0];

    // Récupérer l'agent lié
    const [persRows] = await connection.execute(
      "SELECT MLE, NOM, PRENOMS, INTITULE_DU_POSE, CATEGORIE, DATE_EMB FROM pers WHERE MLE = ? LIMIT 1",
      [conge.MLE]
    );

    const pers = persRows.length > 0 ? persRows[0] : null;

    await connection.end();

    return NextResponse.json({ success: true, data: { conge, pers } });
  } catch (error) {
    console.error("Erreur GET modif_conge:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}

// PUT : mettre à jour un congé via REF
export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      REF,
      matricule,
      anciennete,
      dateDepart,
      dateRetour,
      medaille,
      reliquat,
      intercalaire,
      supplFemme,
      observations,
    } = body;

    if (!REF) {
      return NextResponse.json(
        { success: false, message: "Référence congé obligatoire." },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    const sql = `
      UPDATE conges
      SET
        MLE = ?,
        NJANC = ?,
        DDEPART = ?,
        DDRETOUR = ?,
        NJMEDAILLE = ?,
        RELIQT = ?,
        INTERC = ?,
        SUPPF = ?,
        OBSERVATIONS = ?
      WHERE REF = ?
    `;

    const values = [
      matricule || null,
      anciennete || null,
      dateDepart || null,
      dateRetour || null,
      medaille || null,
      reliquat || null,
      intercalaire || null,
      supplFemme || null,
      observations || null,
      REF,
    ];

    const [result] = await connection.execute(sql, values);

    await connection.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Aucun congé trouvé pour cette référence." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur PUT modif_conge:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}

