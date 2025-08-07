import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getConnection } from "../../../../../lib/db";  // ajuste le chemin relatif selon ta structure

export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split("/");
    const matricule = segments[segments.length - 1];

    const { nouveauMotDePasse } = await request.json();

    if (!nouveauMotDePasse) {
      return NextResponse.json({ message: "Mot de passe manquant" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(nouveauMotDePasse, 10);

    const connection = await getConnection();

    const [result] = await connection.execute(
      "UPDATE users SET password_hash = ? WHERE matricule = ?",
      [passwordHash, matricule]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur mise à jour du mot de passe :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
