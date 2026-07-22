// Navigation entre onglets
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Proportions d'entraînement d'après l'Excel AfU
const proportionsEntrainement = {
    "GAC": { "Gardien": "50%", "Défense": "16.67%", "Tacles": "16.67%", "Placement": "16.67%" },
    "DL - Normal": { "Défense": "50%", "Tacles": "25%", "Placement": "25%" },
    "DFC - Normal": { "Défense": "50%", "Tacles": "16.67%", "Placement": "16.67%", "Puissance": "16.67%" },
    "DFC - Participer à la construction": { "Défense": "42.86%", "Tacles": "14.29%", "Puissance": "14.29%", "Passes": "28.57%" },
    "DFC - Monter sur phases arrêtées": { "Défense": "50%", "Tacles": "16.67%", "Marquage": "33.33%" },
    "DFL - Normal": { "Défense": "50%", "Tacles": "16.67%", "Passes": "16.67%", "Vitesse": "16.67%" },
    "DFL - Prendre le couloir": { "Défense": "40%", "Tacles": "20%", "Vitesse": "40%" },
    "MD - Normal": { "Défense": "25%", "Passes": "50%", "Technique": "25%" },
    "MD - Défendre": { "Défense": "50%", "Passes": "25%", "Technique": "25%" },
    "MD - Attaquer": { "Passes": "50%", "Technique": "25%", "Attaque": "25%" },
    "MD - Provoquer": { "Défense": "25%", "Passes": "25%", "Technique": "50%" },
    "MOC - Normal": { "Passes": "33.33%", "Technique": "33.33%", "Attaque": "33.33%" },
    "MOC - Attaque": { "Passes": "25%", "Technique": "25%", "Attaque": "50%" },
    "MOC - Défendre": { "Défense": "33.33%", "Passes": "33.33%", "Technique": "33.33%" },
    "MOL - Normal": { "Passes": "33.33%", "Technique": "33.33%", "Vitesse": "33.33%" },
    "MOL - Attaque": { "Technique": "33.33%", "Vitesse": "33.33%", "Attaque": "33.33%" },
    "AC - Normal": { "Puissance": "25%", "Vitesse": "25%", "Attaque": "50%" },
    "AC - Rester en pointe": { "Puissance": "33.33%", "Attaque": "66.67%" },
    "AL - Normal": { "Technique": "25%", "Vitesse": "50%", "Attaque": "25%" },
    "AL - Repiquer au centre": { "Technique": "33.33%", "Vitesse": "33.33%", "Attaque": "33.33%" }
};

function calculerTout() {
    let gar = parseFloat(document.getElementById('st_gar').value) || 0;
    let def = parseFloat(document.getElementById('st_def').value) || 0;
    let tac = parseFloat(document.getElementById('st_tac').value) || 0;
    let pla = parseFloat(document.getElementById('st_pla').value) || 0;
    let mar = parseFloat(document.getElementById('st_mar').value) || 0;
    let pui = parseFloat(document.getElementById('st_pui').value) || 0;
    let pas = parseFloat(document.getElementById('st_pas').value) || 0;
    let tec = parseFloat(document.getElementById('st_tec').value) || 0;
    let vit = parseFloat(document.getElementById('st_vit').value) || 0;
    let att = parseFloat(document.getElementById('st_att').value) || 0;
    let end = parseFloat(document.getElementById('st_end').value) || 0;

    let poste = document.getElementById('posteSelect').value;

    // Calcul de la NG (Formule exacte de l'Excel)
    let totalCarac = gar + def + tac + pla + mar + pui + pas + tec + vit + att;
    let ng = (totalCarac / 10) * (end / 100);

    // Ajustements légers selon le poste
    if (poste.includes("GAC")) {
        ng = (gar * 0.5 + def * 0.2 + tac * 0.15 + pla * 0.15) * (end / 100);
    }

    document.getElementById('ngResult').innerText = ng.toFixed(2);

    // Affichage des ratios d'entraînement
    let ratioBox = document.getElementById('entrainementRatio');
    ratioBox.innerHTML = '';
    
    let ratios = proportionsEntrainement[poste] || {};
    for (let [stat, pct] of Object.entries(ratios)) {
        let badge = document.createElement('div');
        badge.className = 'ratio-badge';
        badge.innerText = `${stat} : ${pct}`;
        ratioBox.appendChild(badge);
    }
}

// Lancement au chargement
window.onload = function() {
    calculerTout();
};