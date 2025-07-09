// ✅ src/app/api/personnel/afficher/route.js
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Passer*2003*",
      database: "stage",
    });

    const [rows] = await connection.execute(
      "SELECT * FROM pers ORDER BY NOM ASC"
    );

    await connection.end();

    return NextResponse.json({ success: true, personnels: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
