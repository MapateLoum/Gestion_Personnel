import { getConnection } from "../../../lib/db";  // ajuste le chemin relatif selon ta structure
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { matricule, password } = await request.json();

    if (!matricule || !password) {
      return NextResponse.json({ success: false, message: 'Champs manquants' }, { status: 400 });
    }

    const connection = await getConnection();

    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE matricule = ?',
      [matricule]
    );

    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Utilisateur non trouvé' }, { status: 401 });
    }

    const user = rows[0];

    // Comparaison simple (utiliser bcrypt en production)
    if (user.password_hash !== password) {
      return NextResponse.json({ success: false, message: 'Mot de passe incorrect' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API login:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}
