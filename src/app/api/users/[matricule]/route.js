import { NextResponse } from "next/server";
import { getConnection } from "../../../../lib/db"; // ajuste le chemin selon ta structure

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    const matricule = segments[segments.length - 1];

    const connection = await getConnection();

    const [rows] = await connection.execute(
      "SELECT matricule, nom, prenom, email FROM users WHERE matricule = ?",
      [matricule]
    );

    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Erreur API matricule :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
