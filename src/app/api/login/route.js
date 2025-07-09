import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

// Configuration connexion MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Passer*2003*',
  database: 'stage',
};

export async function POST(request) {
  try {
    const { matricule, password } = await request.json();

    if (!matricule || !password) {
      return NextResponse.json({ success: false, message: 'Champs manquants' }, { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);

    // Recherche utilisateur avec matricule
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE matricule = ?',
      [matricule]
    );

    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Utilisateur non trouvé' }, { status: 401 });
    }

    const user = rows[0];

    // Vérifier mot de passe (ici simple égalité, mais tu devrais utiliser un hash en prod)
    if (user.password_hash !== password) {
      return NextResponse.json({ success: false, message: 'Mot de passe incorrect' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API login:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}
