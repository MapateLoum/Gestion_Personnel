import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Passer*2003*",
  database: "stage",
};

export async function POST(request) {
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

    if (
      !matricule ||
      !anciennete ||
      !dateDepart ||
      !dateRetour ||
      !medaille ||
      !reliquat ||
      !intercalaire ||
      !supplFemme ||
      !observations
    ) {
      return NextResponse.json(
        { success: false, message: "Champs manquants" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    const sql = `
      INSERT INTO conges
      (REF, MLE, NJANC, DDEPART, DDRETOUR, NJMEDAILLE, RELIQT, INTERC, SUPPF, OBSERVATIONS)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      `CONGE-${Date.now()}`,
      matricule,
      anciennete,
      dateDepart,
      dateRetour,
      medaille,
      reliquat,
      intercalaire,
      supplFemme,
      observations,
    ];

    await connection.execute(sql, values);
    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur API conges:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}
