import { getConnection } from "../../../lib/db";  // ajuste le chemin relatif selon ta structure
import { NextResponse } from "next/server";

export async function GET(request) {
  let connection;

  try {
    const { searchParams } = new URL(request.url);
    const dateDebut = searchParams.get("dateDebut");
    const dateFin = searchParams.get("dateFin");

    if (!dateDebut || !dateFin) {
      return NextResponse.json(
        { success: false, message: "Les dates sont requises." },
        { status: 400 }
      );
    }

    connection = await getConnection(); // 👈 Connexion via lib/db.js

    const [rows] = await connection.execute(
      `
      SELECT 
        c.id,
        p.NOM AS nom,
        p.PRENOMS AS prenom,
        c.type_contrat,
        c.date_fin
      FROM contrats c
      JOIN pers p ON c.matricule = p.MLE
      WHERE c.date_fin BETWEEN ? AND ?
      ORDER BY c.date_fin ASC
      `,
      [dateDebut, dateFin]
    );

    return NextResponse.json({ success: true, contrats: rows });
  } catch (error) {
    console.error("Erreur API échéancier:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
