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
      dateRetourPrevue, // 🔹 ajouté ici
    } = body;

    // ✅ Vérifie aussi dateRetourPrevue
    if (
      !matricule ||
      anciennete === "" || anciennete == null ||
      !dateDepart ||
      dateRetour === "" || dateRetour == null ||
      dateRetourPrevue === "" || dateRetourPrevue == null || // 🔹 ajouté
      medaille === "" || medaille == null ||
      reliquat === "" || reliquat == null ||
      intercalaire === "" || intercalaire == null ||
      supplFemme === "" || supplFemme == null ||
      !observations
    ) {
      return NextResponse.json(
        { success: false, message: "Champs manquants" },
        { status: 400 }
      );
    }

    function formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toISOString().split("T")[0];
    }

    const dateDepartFormatted = formatDate(dateDepart);
    const dateRetourFormatted = formatDate(dateRetour);
    const dateRetourPrevueFormatted = formatDate(dateRetourPrevue); // 🔹 ajouté

    const connection = await mysql.createConnection(dbConfig);

    const checkOverlapSql = `
      SELECT COUNT(*) AS overlapCount
      FROM conges
      WHERE MLE = ?
        AND NOT (DDEPART > ? OR DDRETOUR < ?)
    `;

    const [rows] = await connection.execute(checkOverlapSql, [
      matricule,
      dateRetourFormatted,
      dateDepartFormatted,
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

    const sql = `
      INSERT INTO conges
      (MLE, NJANC, DDEPART, DDRETOUR, DTA_RET_EFF, NJMEDAILLE, RELIQT, INTERC, SUPPF, OBSERVATIONS)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      matricule,
      Number(anciennete),
      dateDepartFormatted,
      dateRetourFormatted,
      dateRetourPrevueFormatted, // 🔹 ajouté ici
      Number(medaille),
      Number(reliquat),
      Number(intercalaire),
      Number(supplFemme),
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
