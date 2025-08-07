// src/app/api/personnel/afficher/route.js
import { NextResponse } from "next/server";
import { getConnection } from "../../../../lib/db";  // ajuste le chemin relatif selon ta structure

export async function GET() {
  let connection;

  try {
    connection = await getConnection();

    const [rows] = await connection.execute(
      "SELECT * FROM pers ORDER BY NOM ASC"
    );

    await connection.end();

    return NextResponse.json({ success: true, personnels: rows });
  } catch (error) {
    console.error("Erreur lors de la récupération du personnel :", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
