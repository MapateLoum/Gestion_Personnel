import { getConnection } from "../../../../lib/db"; // chemin relatif correct

export async function POST(req) {
  try {
    const { refDebut, refFin } = await req.json();

    if (!refDebut || !refFin) {
      return new Response(JSON.stringify({ error: "Références manquantes." }), {
        status: 400,
      });
    }

    const db = await getConnection();

    const [rows] = await db.execute(
      `
      SELECT 
        c.REF,
        c.MLE,
        p.NOM,
        p.PRENOMS,
        c.DDEPART,
        c.DDRETOUR,
        c.NJANC,
        c.SUPPF,
        c.RELIQT
      FROM 
        conges c
      LEFT JOIN 
        pers p ON c.MLE = p.MLE
      WHERE 
        c.REF BETWEEN ? AND ?
      ORDER BY c.REF ASC
      `,
      [refDebut, refFin]
    );

    await db.end();

    return new Response(JSON.stringify({ conges: rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur API /conges/periode :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur." }), {
      status: 500,
    });
  }
}
