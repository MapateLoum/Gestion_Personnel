// src/app/api/sections/route.js

import { NextResponse } from "next/server";
import { getConnection } from "../../../lib/db";  // ajuste le chemin relatif selon ta structure

export async function GET() {
  let connection;
  try {
    connection = await getConnection();

    const [rows] = await connection.execute(`
      SELECT CODE, INTITULE, BUDGET, MERT FROM section_et_budget
    `);

    await connection.end();

    return NextResponse.json({ success: true, sections: rows });
  } catch (error) {
    console.error("Erreur API sections:", error);
    if (connection) await connection.end();
    return NextResponse.json({ success: false, error: error.message });
  }
}
