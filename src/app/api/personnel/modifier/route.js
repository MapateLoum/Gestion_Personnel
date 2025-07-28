import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

function toNullIfUndefined(value) {
  return value === undefined ? null : value;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mle = searchParams.get("mle");

    if (!mle) {
      return NextResponse.json({ success: false, error: "Matricule requis" }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Passer*2003*",
      database: "stage",
    });

    const [rows] = await connection.execute("SELECT * FROM pers WHERE MLE = ?", [mle.toUpperCase()]);
    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Matricule non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ success: true, personnel: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.mle) {
      return NextResponse.json({ success: false, error: "Matricule requis pour mise à jour" }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Passer*2003*",
      database: "stage",
    });

    const sql = `
      UPDATE pers SET
        STE = ?,
        NOM = ?,
        PRENOMS = ?,
        INTITULE_DU_POSE = ?,
        CATEGORIE = ?,
        CODE_SAN = ?,
        NBEP = ?,
        NBENF = ?,
        FILIATION_ = ?,
        FILIATION_2 = ?,
        ADRESSE = ?,
        STAT = ?,
        REG = ?,
        DATE_NAIS = ?,
        LIEUNAIS = ?,
        DATE_EMB = ?,
        SEXE = ?,
        NATION = ?,
        SF = ?,
        CONFESSION = ?,
        DEPT_DIV_SERV_SUBD = ?
      WHERE MLE = ?
    `;

    const params = [
      toNullIfUndefined(data.STE),
      toNullIfUndefined(data.nom),
      toNullIfUndefined(data.prenoms),
      toNullIfUndefined(data.intitule_du_poste),
      toNullIfUndefined(data.categorie),
      toNullIfUndefined(data.code_san),
      toNullIfUndefined(data.nbreEpouse),
      toNullIfUndefined(data.nbreEnfant),
      toNullIfUndefined(data.filiation_),
      toNullIfUndefined(data.filiation_2),
      toNullIfUndefined(data.adresse),
      toNullIfUndefined(data.stat),
      toNullIfUndefined(data.reg),
      toNullIfUndefined(data.date_naissance),
      toNullIfUndefined(data.lieu_naissance),
      toNullIfUndefined(data.date_embauche),
      toNullIfUndefined(data.sexe),
      toNullIfUndefined(data.nation),
      toNullIfUndefined(data.sf),
      toNullIfUndefined(data.confession),
      toNullIfUndefined(data.dept_div_serv_subd),
      data.mle.toUpperCase(),
    ];

    const [result] = await connection.execute(sql, params);
    await connection.end();

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Aucun enregistrement mis à jour, matricule non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Personnel mis à jour avec succès" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
