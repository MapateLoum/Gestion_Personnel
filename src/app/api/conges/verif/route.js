import { getConnection } from "../../../../lib/db"; // chemin relatif correct

function calculJoursCongesOrdinaires(dernierRetourStr, dateDepartStr) {
  if (!dernierRetourStr) return 0;

  const dernierRetour = new Date(dernierRetourStr);
  const dateDepart = new Date(dateDepartStr);

  if (dateDepart <= dernierRetour) return 0;

  let totalMonths =
    (dateDepart.getFullYear() - dernierRetour.getFullYear()) * 12 +
    (dateDepart.getMonth() - dernierRetour.getMonth());

  const dateIntermediaire = new Date(dernierRetour);
  dateIntermediaire.setMonth(dateIntermediaire.getMonth() + totalMonths);

  const diffJoursReste = Math.floor((dateDepart - dateIntermediaire) / (1000 * 60 * 60 * 24));

  let joursSupplementaires = 0;
  if (diffJoursReste >= 15) {
    joursSupplementaires = 2;
  }

  return totalMonths * 2 + joursSupplementaires;
}

export async function POST(req) {
  let db;
  try {
    const { matricule, refConge } = await req.json();

    if (!matricule || !refConge) {
      return new Response(
        JSON.stringify({ error: "Matricule ou référence congé manquante." }),
        { status: 400 }
      );
    }

    db = await getConnection();

    // Récupérer infos agent
    const [agents] = await db.execute(
      "SELECT MLE, PRENOMS, NOM, INTITULE_DU_POSE, CATEGORIE, DATE_EMB FROM pers WHERE MLE = ?",
      [matricule]
    );

    if (agents.length === 0) {
      return new Response(JSON.stringify({ error: "Agent non existant" }), { status: 404 });
    }
    const agent = agents[0];

    // Récupérer congé actuel
    const [conges] = await db.execute(
      `SELECT REF, MLE, DDEPART, DDRETOUR, NJMEDAILLE, RELIQT, NJANC, INTERC, SUPPF, OBSERVATIONS 
       FROM conges WHERE REF = ? AND MLE = ?`,
      [refConge, matricule]
    );

    if (conges.length === 0) {
      return new Response(
        JSON.stringify({ error: "Référence de congé invalide pour cet agent" }),
        { status: 404 }
      );
    }

    const conge = conges[0];

    // Chercher dernier congé avec date retour < date départ
    const [precedents] = await db.execute(
      `SELECT DDRETOUR FROM conges 
       WHERE MLE = ? AND REF <> ? AND DDRETOUR < ? 
       ORDER BY DDRETOUR DESC LIMIT 1`,
      [matricule, refConge, conge.DDEPART]
    );

    let dernierRetour = null;
    if (precedents.length > 0) {
      dernierRetour = precedents[0].DDRETOUR;
    }

    // Calcul jours congé ordinaire
    const joursAcquis = calculJoursCongesOrdinaires(dernierRetour, conge.DDEPART);

    return new Response(
      JSON.stringify({
        agent,
        conge,
        dernierRetour: dernierRetour ? new Date(dernierRetour).toISOString().split("T")[0] : null,
        joursAcquis,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erreur API /conges/verif :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur." }), { status: 500 });
  } finally {
    if (db) await db.end();
  }
}
