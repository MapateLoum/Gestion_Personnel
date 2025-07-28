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

    // Vérification des champs obligatoires
    if (
      !matricule ||
      anciennete == null ||
      !dateDepart ||
      !dateRetour ||
      medaille == null ||
      reliquat == null ||
      intercalaire == null ||
      supplFemme == null ||
      !observations
    ) {
      return NextResponse.json(
        { success: false, message: "Champs manquants" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection(dbConfig);

    // Vérifier si le congé chevauche un congé existant pour le même matricule
    const checkOverlapSql = `
      SELECT COUNT(*) AS overlapCount
      FROM conges
      WHERE MLE = ?
        AND NOT (DDEPART > ? OR DDRETOUR < ?)
    `;

    const [rows] = await connection.execute(checkOverlapSql, [
      matricule,
      dateRetour, // nouveau départ doit être après l'ancien retour pour pas chevaucher
      dateDepart, // nouvelle fin doit être avant l'ancien départ pour pas chevaucher
    ]);

    if (rows[0].overlapCount > 0) {
      await connection.end();
      return NextResponse.json(
        {
          success: false,
          message: "Le congé demandé chevauche un congé existant.",
        },
        { status: 409 }
      );
    }

    // Insérer le nouveau congé (REF est auto-incrémenté côté base)
    const sql = `
      INSERT INTO conges
      (MLE, NJANC, DDEPART, DDRETOUR, NJMEDAILLE, RELIQT, INTERC, SUPPF, OBSERVATIONS)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
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
