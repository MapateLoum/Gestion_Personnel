import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { refDebut, refFin } = req.body;

  if (!refDebut || !refFin || isNaN(refDebut) || isNaN(refFin) || parseInt(refDebut) >= parseInt(refFin)) {
    return res.status(400).json({ error: 'Références invalides' });
  }

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'stage',
    });

    const [rows] = await connection.execute(
      `SELECT c.REF, c.MLE, p.NOM, p.PRENOMS, p.CATEGORIE, p.INTITULE_DU_POSTE, c.DDEPART, c.DDRETOUR, c.OBSERVATIONS
       FROM conges c
       LEFT JOIN pers p ON c.MLE = p.MLE
       WHERE c.REF BETWEEN ? AND ?
       ORDER BY c.REF ASC`,
      [refDebut, refFin]
    );

    await connection.end();
    return res.status(200).json({ conges: rows });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
