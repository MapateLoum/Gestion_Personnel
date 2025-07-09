// src/app/api/personnel/route.js
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    // Connexion à la base MySQL
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Passer*2003*",
      database: "stage",
    });

    // Requête d'insertion avec tous les champs de ta table "pers"
    const sql = `
      INSERT INTO pers
      (STE, CODE_SAN, MLE, CODE, NOM, PRENOMS, INTITULE_DU_POSE, CODEPOSTE, STAT, CODSTAT,
       CATEGORIE, REG, DATE_NAIS, DATE_EMB, DATE_DEP, SEXE, NATION, SF, CONFESSION, PELERINAGE,
       NBEP, NBENF, BASE_HORAIRE, DEPT_DIV_SERV_SUBD, ADRESSE, FILIATION_, FILIATION_2, LIEUNAIS, LIEUTRAVAIL, PHOTO)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Valeurs dans l’ordre exact des colonnes
    const values = [
      data.STE || null,
      data.CODE_SAN || null,
      data.MLE || null,
      data.CODE || null,
      data.NOM || null,
      data.PRENOMS || null,
      data.INTITULE_DU_POSE || null,
      data.CODEPOSTE || null,
      data.STAT || null,
      data.CODSTAT || null,
      data.CATEGORIE || null,
      data.REG || null,
      data.DATE_NAIS || null,
      data.DATE_EMB || null,
      data.DATE_DEP || null,
      data.SEXE || null,
      data.NATION || null,
      data.SF || null,
      data.CONFESSION || null,
      data.PELERINAGE || null,
      data.NBEP || null,
      data.NBENF || null,
      data.BASE_HORAIRE || null,
      data.DEPT_DIV_SERV_SUBD || null,
      data.ADRESSE || null,
      data.FILIATION_ || null,
      data.FILIATION_2 || null,
      data.LIEUNAIS || null,
      data.LIEUTRAVAIL || null,
      data.PHOTO || null,
    ];

    // Exécution de la requête d’insertion
    await connection.execute(sql, values);

    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
