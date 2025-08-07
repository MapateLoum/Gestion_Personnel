import { NextResponse } from "next/server";
import { getConnection } from "../../../../../lib/db"; // chemin relatif correct



function formatDate(dateStr) {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET(request, context) {
  try {
    const params = await context.params;  // <-- correction ici
    const { mle } = params;
    if (!mle) {
      return NextResponse.json(
        { message: "Matricule requis." },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    // 1) Chercher la date DDRETOUR la plus récente dans conges pour ce MLE
    const [rows] = await connection.execute(
      `SELECT MAX(DDRETOUR) AS dernierRetour
       FROM conges
       WHERE MLE = ?`,
      [mle]
    );

    // 2) Si pas de congé, chercher la date d'embauche dans pers
    let dateDernierRetour = null;
    if (rows.length === 0 || rows[0].dernierRetour === null) {
      const [rowsPers] = await connection.execute(
        `SELECT DATE_EMB FROM pers WHERE MLE = ? LIMIT 1`,
        [mle]
      );
      if (rowsPers.length === 0 || !rowsPers[0].DATE_EMB) {
        await connection.end();
        return NextResponse.json(
          { message: "Agent non trouvé ou date embauche inconnue." },
          { status: 404 }
        );
      }
      dateDernierRetour = formatDate(rowsPers[0].DATE_EMB);
    } else {
      dateDernierRetour = formatDate(rows[0].dernierRetour);
    }

    await connection.end();

    return NextResponse.json({ dateDernierRetour });
  } catch (error) {
    console.error("Erreur API dernier retour :", error);
    return NextResponse.json(
      { message: "Erreur serveur." },
      { status: 500 }
    );
  }
}
