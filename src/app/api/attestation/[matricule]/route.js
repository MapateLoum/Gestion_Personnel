// /src/app/api/attestation/[matricule]/route.js

import { NextResponse } from "next/server";
import { getConnection } from "../../../../lib/db"; // chemin relatif correct

export async function GET(request, context) {
const { matricule } = await context.params;

  try {
    const connection = await getConnection();

    const [rows] = await connection.execute(
      `SELECT * FROM pers WHERE MLE = ? LIMIT 1`,
      [matricule.toUpperCase()] // standardisation facultative
    );

    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Matricule non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, agent: rows[0] });
  } catch (error) {
    console.error("Erreur attestation API :", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
