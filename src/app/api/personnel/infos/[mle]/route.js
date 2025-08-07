import { NextResponse } from "next/server";
import { getConnection } from "../../../../../lib/db";  // ajuste le chemin relatif selon ta structure

// Formate une date JS au format AAAA-MM-JJ
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Calcule l’âge en années à partir d’une date de naissance
function calculateAge(birthDateStr) {
  const birthDate = new Date(birthDateStr);
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const m = now.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
}

export async function GET(request, context) {
  const params = await context.params;
  const mle = params.mle;

  if (!mle) {
    return NextResponse.json(
      { found: false, message: "Matricule requis." },
      { status: 400 }
    );
  }

  try {
    const connection = await getConnection();

    const [rows] = await connection.execute(
      "SELECT MLE, NOM, PRENOMS, INTITULE_DU_POSE, CATEGORIE, DATE_EMB, DATE_NAIS FROM pers WHERE MLE = ? LIMIT 1",
      [mle]
    );

    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json(
        { found: false, message: "Agent non trouvé." },
        { status: 404 }
      );
    }

    const agent = rows[0];

    // Formatage des dates
    if (agent.DATE_NAIS) agent.DATE_NAIS = formatDate(agent.DATE_NAIS);
    if (agent.DATE_EMB) agent.DATE_EMB = formatDate(agent.DATE_EMB);

    // Calcul âge
    const age = agent.DATE_NAIS ? calculateAge(agent.DATE_NAIS) : null;

    return NextResponse.json({
      found: true,
      agent: {
        ...agent,
        age,
      },
    });
  } catch (error) {
    console.error("Erreur API personnel infos:", error);
    return NextResponse.json(
      { found: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}
