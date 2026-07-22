// Navigation entre les onglets
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// Proportions idéales d'entraînement issues de la feuille Excel AfU
const proportionsEntrainement = {
    "GAC": { "Gardien": "50%", "Défense": "16.67%", "Tacles": "16.67%", "Placement": "16.67%" },
    "GAC - Relanceur": { "Gardien": "50%", "Tacles": "16.67%", "Placement": "16.67%", "Passes": "16.67%" },
    "DL - Normal": { "Défense": "50%", "Tacles": "25%", "Placement": "25%" },
    "DFC - Normal": { "Défense": "50%", "Tacles": "16.67%", "Placement": "16.67%", "Puissance": "16.67%" },
    "DFC - Participer à la construction": { "Défense": "42.86%", "Tacles": "14.29%", "Puissance": "14.29%", "Passes": "28.57%" },
    "DFC - Monter sur phases arrêtées": { "Défense": "50%", "Tacles": "16.67%", "Puissance": "33.33%" },
    "DFL - Normal": { "Défense": "50%", "Tacles": "16.67%", "Passes": "16.67%", "Vitesse": "16.67%" },
    "DFL - Prendre le couloir": { "Défense": "40%", "Tacles": "20%", "Vitesse": "40%" },
    "MD - Normal": { "Défense": "25%", "Passes": "50%", "Technique": "25%" },
    "MD - Défendre": { "Défense": "50%", "Passes": "25%", "Technique": "25%" },
    "MD - Attaquer": { "Passes": "50%", "Technique": "25%", "Attaque": "25%" },
    "MD - Provoquer": { "Défense": "25%", "Passes": "25%", "Technique": "50%" },
    "MOC - Normal": { "Passes": "33.33%", "Technique": "33.33%", "Attaque": "33.33%" },
    "MOC - Attaque": { "Passes": "25%", "Technique": "25%", "Attaque": "50%" },
    "MOC - Défendre": { "Défense": "33.33%", "Passes": "33.33%", "Technique": "33.33%" },
    "MOL - Normal": { "Passes": "20%", "Technique": "20%", "Vitesse": "40%", "Attaque": "20%" },
    "MOL - Centrer": { "Passes": "40%", "Technique": "20%", "Vitesse": "20%", "Attaque": "20%" },
    "MOL - Provoquer": { "Passes": "20%", "Technique": "40%", "Vitesse": "20%", "Attaque": "20%" },
    "MOL - Déborder": { "Passes": "16.67%", "Technique": "16.67%", "Vitesse": "50%", "Attaque": "16.67%" },
    "AS - Normal": { "Passes": "20%", "Technique": "20%", "Vitesse": "20%", "Attaque": "40%" },
    "AC - Normal": { "Technique": "25%", "Vitesse": "25%", "Attaque": "50%" },
    "AT - Jeu en profondeur": { "Technique": "20%", "Vitesse": "40%", "Attaque": "40%" },
    "AT - Provoquer": { "Technique": "40%", "Vitesse": "20%", "Attaque": "40%" },
    "AT - Pivot": { "Puissance": "16.67%", "Passes": "16.67%", "Vitesse": "16.67%", "Technique": "16.67%", "Attaque": "33.33%" }
};

// Calcul de la NG et affichage des ratios
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

    let poste = document.getElementById('posteSelect').value;
    let ng = 0;

    switch(poste) {
        case "GAC": ng = (gar + def + tac + pla) / 2; break;
        case "GAC - Relanceur": ng = (gar + tac + pla + pas) / 2; break;
        case "DL - Normal": ng = (def + tac + pla) / 2; break;
        case "DFC - Normal": ng = (def + tac + pla + pui) / 2; break;
        case "DFC - Monter sur phases arrêtées": ng = (3 * def + tac + 2 * pui) / 6; break;
        case "DFC - Participer à la construction": ng = (3 * def + tac + pui + 2 * pas) / 7; break;
        case "DFL - Normal": ng = (3 * def + tac + pas + vit) / 6; break;
        case "DFL - Prendre le couloir": ng = (2 * def + tac + 2 * vit) / 5; break;
        case "MD - Normal": ng = (def + 2 * pas + tec) / 4; break;
        case "MD - Défendre": ng = (2 * def + pas + tec) / 4; break;
        case "MD - Attaquer": ng = (2 * pas + tec + att) / 4; break;
        case "MD - Provoquer": ng = (def + pas + 2 * tec) / 4; break;
        case "MOC - Normal": ng = (pas + tec + att) / 3; break;
        case "MOC - Attaque": ng = (pas + tec + 2 * att) / 4; break;
        case "MOC - Défendre": ng = (def + pas + tec) / 3; break;
        case "MOL - Normal": ng = (pas + tec + 2 * vit + att) / 5; break;
        case "MOL - Centrer": ng = (2 * pas + tec + vit + att) / 5; break;
        case "MOL - Provoquer": ng = (pas + 2 * tec + vit + att) / 5; break;
        case "MOL - Déborder": ng = (pas + tec + 3 * vit + att) / 6; break;
        case "AS - Normal": ng = (pas + tec + vit + 2 * att) / 5; break;
        case "AC - Normal":
        case "AT Normal": ng = (tec + vit + 2 * att) / 4; break;
        case "AT - Jeu en profondeur": ng = (tec + 2 * vit + 2 * att) / 5; break;
        case "AT - Provoquer": ng = (2 * tec + vit + 2 * att) / 5; break;
        case "AT - Pivot": ng = (pui + pas + vit + tec + 2 * att) / 6; break;
        default: ng = 0;
    }

    document.getElementById('ngResult').innerText = ng.toFixed(2);

    let ratioBox = document.getElementById('entrainementRatio');
    if (ratioBox) {
        ratioBox.innerHTML = '';
        let ratios = proportionsEntrainement[poste] || {};
        for (let [stat, pct] of Object.entries(ratios)) {
            let badge = document.createElement('div');
            badge.className = 'ratio-badge';
            badge.innerText = `${stat} : ${pct}`;
            ratioBox.appendChild(badge);
        }
    }
}

function chargerExempleGAC() {
    if (document.getElementById('posteSelect')) {
        document.getElementById('posteSelect').value = "GAC";
        document.getElementById('st_gar').value = 91;
        document.getElementById('st_def').value = 29;
        document.getElementById('st_tac').value = 30;
        document.getElementById('st_pla').value = 29;
        document.getElementById('st_mar').value = 1;
        document.getElementById('st_pui').value = 1;
        document.getElementById('st_pas').value = 1;
        document.getElementById('st_tec').value = 1;
        document.getElementById('st_vit').value = 1;
        document.getElementById('st_att').value = 1;
        document.getElementById('st_end').value = 100;
        calculerTout();
    }
}

window.onload = function() {
    chargerExempleGAC();
};