// src/app/api/modif_conge/route.js
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Passer*2003*",
  database: "stage",
};

// ✅ GET ➜ Récupérer un congé + info agent
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const matricule = searchParams.get("matricule");

  if (!matricule) {
    return NextResponse.json(
      { success: false, message: "Matricule requis." },
      { status: 400 }
    );
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Récupérer le congé
    const [congeRows] = await connection.execute(
      "SELECT * FROM conges WHERE MLE = ? LIMIT 1",
      [matricule]
    );

    if (congeRows.length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: "Aucun congé trouvé." },
        { status: 404 }
      );
    }

    const conge = congeRows[0];

    // Récupérer l’agent
    const [persRows] = await connection.execute(
      "SELECT MLE, NOM, PRENOMS, INTITULE_DU_POSE, CATEGORIE, DATE_EMB FROM pers WHERE MLE = ? LIMIT 1",
      [matricule]
    );

    let pers = null;
    if (persRows.length > 0) {
      pers = persRows[0];
    }

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

// ✅ PUT ➜ Mettre à jour un congé
export async function PUT(request) {
  try {
    const body = await request.json();
    const {
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

    if (!matricule) {
      return NextResponse.json(
        { success: false, message: "Matricule obligatoire." },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    const sql = `
      UPDATE conges
      SET
        NJANC = ?,
        DDEPART = ?,
        DDRETOUR = ?,
        NJMEDAILLE = ?,
        RELIQT = ?,
        INTERC = ?,
        SUPPF = ?,
        OBSERVATIONS = ?
      WHERE MLE = ?
    `;

    const values = [
      anciennete || null,
      dateDepart || null,
      dateRetour || null,
      medaille || null,
      reliquat || null,
      intercalaire || null,
      supplFemme || null,
      observations || null,
      matricule,
    ];

    const [result] = await connection.execute(sql, values);
    await connection.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Aucun congé trouvé pour ce matricule." },
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
