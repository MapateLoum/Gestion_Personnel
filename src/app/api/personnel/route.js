import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request) {
  try {
    const data = await request.json();

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Passer*2003*",
      database: "stage",
    });

    const sql = `
      INSERT INTO pers (
        STE, CODE_SAN, MLE, CODE, NOM, PRENOMS, INTITULE_DU_POSE, CODEPOSTE, STAT, CODSTAT,
        CATEGORIE, REG, DATE_NAIS, DATE_EMB, DATE_DEP, SEXE, NATION, SF, CONFESSION, PELERINAGE,
        NBEP, NBENF, BASE_HORAIRE, DEPT_DIV_SERV_SUBD, ADRESSE, FILIATION_, FILIATION_2,
        LIEUNAIS, LIEUTRAVAIL, PHOTO
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.STE || null,
      data.code_san || null,
      data.mle,
      data.code || null,
      data.nom || null,
      data.prenoms || null,
      data.intitule_du_poste || null,
      data.codeposte || null,
      data.stat || null,
      data.codstat || null,
      data.categorie || null,
      data.reg || null,
      data.date_naissance || null,
      data.date_embauche || null,
      data.date_dep || null,
      data.sexe || null,
      data.nation || null,
      data.sf || null,
      data.confession || null,
      data.pelerinage || null,
      data.nbep ?? null,
      data.nbenf ?? null,
      data.base_horaire ?? null,
      data.dept_div_serv_subd || null,
      data.adresse || null,
      data.filiation_ || null,
      data.filiation_2 || null,
      data.lieunais || null,
      data.lieutravail || null,
      data.photo || null,
    ];

    const [result] = await connection.execute(sql, values);
    await connection.end();

    return NextResponse.json({ success: true, insertId: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
