import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Passer*2003*',
  database: 'stage',
};

export async function GET(request) {
  let connection;

  try {
    const { searchParams } = new URL(request.url);
    const dateDebut = searchParams.get('dateDebut');
    const dateFin = searchParams.get('dateFin');

    if (!dateDebut || !dateFin) {
      return NextResponse.json(
        { success: false, message: 'Les dates sont requises.' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

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
    console.error('Erreur API échéancier:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur.' },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
