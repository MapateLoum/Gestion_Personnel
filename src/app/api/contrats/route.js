// app/api/contrat/route.js
import { getConnection } from "../../../lib/db";  // ajuste le chemin relatif selon ta structure
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const matricule = searchParams.get("matricule");

  if (!matricule) {
    return NextResponse.json(
      { success: false, message: "Matricule requis" },
      { status: 400 }
    );
  }

  try {
    const db = await getConnection();

    const [agents] = await db.query("SELECT * FROM pers WHERE MLE = ?", [matricule]);
    if (agents.length === 0) {
      await db.end();
      return NextResponse.json(
        { success: false, message: "Agent non trouvé" },
        { status: 404 }
      );
    }

    const [contrats] = await db.query(
      "SELECT * FROM contrats WHERE matricule = ? ORDER BY date_debut DESC LIMIT 1",
      [matricule]
    );
    await db.end();

    return NextResponse.json({
      success: true,
      agent: agents[0],
      contrat: contrats[0] || null,
    });
  } catch (error) {
    console.error("Erreur GET contrat:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { matricule, typeContrat, dateDebut, dateFin, salaire } = data;

    if (!matricule || !typeContrat || !dateDebut || !salaire) {
      return NextResponse.json(
        { success: false, message: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const db = await getConnection();

    const [agents] = await db.query("SELECT * FROM pers WHERE MLE = ?", [matricule]);
    if (agents.length === 0) {
      await db.end();
      return NextResponse.json(
        { success: false, message: "Agent non trouvé" },
        { status: 404 }
      );
    }

    const [contratsActifs] = await db.query(
      "SELECT * FROM contrats WHERE matricule = ? AND (date_fin IS NULL OR date_fin >= CURDATE())",
      [matricule]
    );

    if (contratsActifs.length > 0) {
      const contratId = contratsActifs[0].id;
      await db.query(
        "UPDATE contrats SET type_contrat = ?, date_debut = ?, date_fin = ?, salaire = ? WHERE id = ?",
        [typeContrat, dateDebut, dateFin || null, salaire, contratId]
      );
    } else {
      await db.query(
        "INSERT INTO contrats (matricule, type_contrat, date_debut, date_fin, salaire) VALUES (?, ?, ?, ?, ?)",
        [matricule, typeContrat, dateDebut, dateFin || null, salaire]
      );
    }

    await db.end();

    return NextResponse.json({ success: true, message: "Contrat enregistré avec succès" });
  } catch (error) {
    console.error("Erreur POST contrat:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}
