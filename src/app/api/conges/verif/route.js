import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const { matricule, refConge } = await req.json();

    if (!matricule || !refConge) {
      return new Response(JSON.stringify({ error: "Matricule ou référence congé manquante." }), {
        status: 400,
      });
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Passer*2003*",
      database: "stage",
    });

    const [agents] = await db.execute(
      "SELECT MLE, PRENOMS, NOM, INTITULE_DU_POSE, CATEGORIE, DATE_EMB FROM pers WHERE MLE = ?",
      [matricule]
    );

    if (agents.length === 0) {
      await db.end();
      return new Response(JSON.stringify({ error: "Agent non existant" }), { status: 404 });
    }
    const agent = agents[0];

    const [conges] = await db.execute(
      `SELECT REF, MLE, DDEPART, DDRETOUR, NJMEDAILLE, RELIQT, NJANC, INTERC, SUPPF, OBSERVATIONS 
       FROM conges WHERE REF = ? AND MLE = ?`,
      [refConge, matricule]
    );

    if (conges.length === 0) {
      await db.end();
      return new Response(JSON.stringify({ error: "Référence de congé invalide pour cet agent" }), { status: 404 });
    }
    const conge = conges[0];

    await db.end();

    return new Response(JSON.stringify({ agent, conge }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur API /conges/verif :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur." }), { status: 500 });
  }
}
