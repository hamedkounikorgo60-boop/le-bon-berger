// =====================
// 1️⃣ Initialisation EmailJS (UNE SEULE FOIS)
// =====================
emailjs.init("ytxxTVPD_rpfhs84Q");

// =====================
// 2️⃣ Génération du code membre
// =====================
function genererCodeMembre() {
  const annee = new Date().getFullYear();
  let compteur = localStorage.getItem("compteurMembre") || 0;
  compteur++;
  localStorage.setItem("compteurMembre", compteur);
  return `LB-${annee}-${String(compteur).padStart(3, "0")}`;
}

// =====================
// 3️⃣ Enregistrement localStorage
// =====================
function enregistrerMembre(membre) {
  let membres = JSON.parse(localStorage.getItem("membres")) || [];
  membres.push(membre);
  localStorage.setItem("membres", JSON.stringify(membres));
}

// =====================
// 4️⃣ Génération PDF carte membre
// =====================
function genererCartePDF(membre) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("CARTE DE MEMBRE – LE BON BERGER", 20, 20);

  doc.setFontSize(12);
  doc.text(`Nom : ${membre.nom}`, 20, 40);
  doc.text(`Prénom : ${membre.prenom}`, 20, 50);
  doc.text(`Code membre : ${membre.code}`, 20, 60);
  doc.text(`Téléphone : ${membre.telephone}`, 20, 70);
  doc.text(`Email : ${membre.email}`, 20, 80);
  doc.text(`Profession : ${membre.profession}`, 20, 90);

  doc.text("« Le Seigneur est mon berger » – Psaume 23", 20, 120);

  doc.save(`Carte_Membre_${membre.code}.pdf`);
}

// =====================
// 5️⃣ Gestion du formulaire
// =====================
const form = document.getElementById("membreForm");
const codeInput = document.getElementById("code");

document.addEventListener("DOMContentLoaded", () => {
  codeInput.value = genererCodeMembre();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // 🔍 Validation simple
  if (nom.value.length < 2) {
    alert("Nom trop court");
    return;
  }

  if (!email.value.includes("@")) {
    alert("Email invalide");
    return;
  }

  const membre = {
    nom: nom.value,
    prenom: prenom.value,
    email: email.value,
    telephone: telephone.value,
    profession: profession.value,
    message: message.value,
    code: codeInput.value
  };

  // 💾 Sauvegarde
  enregistrerMembre(membre);

  // 📧 Envoi EmailJS
  emailjs.send("service_7yvlbwj", "cj92253", membre)
    .then(() => {
      alert("🎉 Inscription réussie !\nCode membre : " + membre.code);
      genererCartePDF(membre);
      form.reset();
      codeInput.value = genererCodeMembre();
    })
    .catch(err => {
      alert("❌ Erreur EmailJS");
      console.error(err);
    });
});
