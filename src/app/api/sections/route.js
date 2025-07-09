// src/app/api/sections/route.js

import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Passer*2003*",
      database: "stage",
    });

    const [rows] = await connection.execute(`
      SELECT CODE, INTITULE, BUDGET, MERT FROM section_et_budget
    `);

    return NextResponse.json({ success: true, sections: rows });
  } catch (error) {
    console.error("Erreur API sections:", error);
    return NextResponse.json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
}
