import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Passer*2003*',
  database: 'stage',
};

export async function POST(request) {
  try {
    const { matricule, email, nom, prenom, password } = await request.json();

    if (!matricule || !email || !nom || !prenom || !password) {
      return NextResponse.json({ success: false, message: 'Champs manquants' }, { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);

    // Vérifier si matricule ou email existe déjà
    const [existing] = await connection.execute(
      'SELECT * FROM users WHERE matricule = ? OR email = ?',
      [matricule, email]
    );

    if (existing.length > 0) {
      await connection.end();
      return NextResponse.json({ success: false, message: 'Matricule ou email déjà utilisé' }, { status: 409 });
    }

    // Insérer nouvel utilisateur
    await connection.execute(
      'INSERT INTO users (matricule, email, nom, prenom, password_hash) VALUES (?, ?, ?, ?, ?)',
      [matricule, email, nom, prenom, password] // tu devrais hasher le mot de passe en prod
    );

    await connection.end();

    return NextResponse.json({ success: true, message: 'Inscription réussie' });
  } catch (error) {
    console.error('Erreur API register:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}
