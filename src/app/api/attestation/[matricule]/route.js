// /src/app/api/attestation/[matricule]/route.js

import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { matricule } = params;

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Passer*2003*",
      database: "stage",
    });

    const [rows] = await connection.execute(
      `SELECT * FROM pers WHERE MLE = ? LIMIT 1`,
      [matricule]
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
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
