import mysql from "mysql2/promise";

// Configuration de la connexion MySQL
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Passer*2003*",
  database: "stage",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const matricule = searchParams.get("matricule");

    if (!matricule) {
      return new Response(JSON.stringify({ success: false, message: "Matricule requis" }), {
        status: 400,
      });
    }

    // Récupérer les infos agent dans pers
    const [agents] = await pool.query("SELECT * FROM pers WHERE MLE = ?", [matricule]);
    if (agents.length === 0) {
      return new Response(JSON.stringify({ success: false, message: "Agent non trouvé" }), {
        status: 404,
      });
    }
    const agent = agents[0];

    // Récupérer le dernier contrat actif (par date_debut décroissante)
    const [contrats] = await pool.query(
      "SELECT * FROM contrats WHERE matricule = ? ORDER BY date_debut DESC LIMIT 1",
      [matricule]
    );
    const contrat = contrats.length > 0 ? contrats[0] : null;

    return new Response(
      JSON.stringify({
        success: true,
        agent,
        contrat,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Erreur serveur" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { matricule, typeContrat, dateDebut, dateFin, salaire } = data;

    if (!matricule || !typeContrat || !dateDebut || !salaire) {
      return new Response(
        JSON.stringify({ success: false, message: "Champs obligatoires manquants" }),
        { status: 400 }
      );
    }

    // Vérifier agent
    const [agents] = await pool.query("SELECT * FROM pers WHERE MLE = ?", [matricule]);
    if (agents.length === 0) {
      return new Response(JSON.stringify({ success: false, message: "Agent non trouvé" }), {
        status: 404,
      });
    }

    // Vérifier contrat actif (date_fin null ou > aujourd'hui)
    const [contratsActifs] = await pool.query(
      "SELECT * FROM contrats WHERE matricule = ? AND (date_fin IS NULL OR date_fin >= CURDATE())",
      [matricule]
    );

    if (contratsActifs.length > 0) {
      // Mise à jour du contrat actif (promotion/modif)
      const contratId = contratsActifs[0].id;
      await pool.query(
        "UPDATE contrats SET type_contrat = ?, date_debut = ?, date_fin = ?, salaire = ? WHERE id = ?",
        [typeContrat, dateDebut, dateFin || null, salaire, contratId]
      );
    } else {
      // Insertion nouveau contrat
      await pool.query(
        "INSERT INTO contrats (matricule, type_contrat, date_debut, date_fin, salaire) VALUES (?, ?, ?, ?, ?)",
        [matricule, typeContrat, dateDebut, dateFin || null, salaire]
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Contrat enregistré avec succès" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Erreur serveur" }), {
      status: 500,
    });
  }
}
