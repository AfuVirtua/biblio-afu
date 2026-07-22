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
    let ng = 0;

    // FORMULES EXACTES TIRÉES DE L'EXCEL AFU
    if (poste === "GAC") {
        ng = (gar + (def / 3) + (tac / 3) + (pla / 3)) / 2;
    } else if (poste === "DL - Normal") {
        ng = (def + (tac / 2) + (pla / 2)) / 2;
    } else if (poste === "DFC - Normal") {
        ng = (def + (tac / 3) + (pla / 3) + (pui / 3)) / 2;
    } else if (poste === "DFC - Participer à la construction") {
        ng = ((def * 0.857) + (tac * 0.285) + (pui * 0.285) + (pas * 0.571)) / 2;
    } else if (poste === "DFC - Monter sur phases arrêtées") {
        ng = (def + (tac / 3) + (mar * 0.667)) / 2;
    } else if (poste === "DFL - Normal") {
        ng = (def + (tac / 3) + (pas / 3) + (vit / 3)) / 2;
    } else if (poste === "DFL - Prendre le couloir") {
        ng = ((def * 0.8) + (tac * 0.4) + (vit * 0.8)) / 2;
    } else if (poste === "MD - Normal") {
        ng = ((def * 0.5) + pas + (tec * 0.5)) / 2;
    } else if (poste === "MD - Défendre") {
        ng = (def + (pas * 0.5) + (tec * 0.5)) / 2;
    } else if (poste === "MD - Attaquer") {
        ng = (pas + (tec * 0.5) + (att * 0.5)) / 2;
    } else if (poste === "MD - Provoquer") {
        ng = ((def * 0.5) + (pas * 0.5) + tec) / 2;
    } else if (poste === "MOC - Normal") {
        ng = (pas + tec + att) / 3;
    } else if (poste === "MOC - Attaque") {
        ng = ((pas * 0.75) + (tec * 0.75) + (att * 1.5)) / 3;
    } else if (poste === "MOC - Défendre") {
        ng = (def + pas + tec) / 3;
    } else if (poste === "MOL - Normal") {
        ng = (pas + tec + vit) / 3;
    } else if (poste === "MOL - Attaque") {
        ng = (tec + vit + att) / 3;
    } else if (poste === "AC - Normal") {
        ng = ((pui * 0.5) + (vit * 0.5) + att) / 2;
    } else if (poste === "AC - Rester en pointe") {
        ng = ((pui * 0.667) + (att * 1.333)) / 2;
    } else if (poste === "AL - Normal") {
        ng = ((tec * 0.5) + vit + (att * 0.5)) / 2;
    } else if (poste === "AL - Repiquer au centre") {
        ng = (tec + vit + att) / 3;
    }

    // Prise en compte du coefficient d'endurance
    ng = ng * (end / 100);

    document.getElementById('ngResult').innerText = ng.toFixed(2);

    // Mettre à jour la boîte des proportions d'entraînement
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

// Remplissage avec des valeurs de démonstration conformes (GAC -> NG 90)
function chargerExempleGAC() {
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

window.onload = function() {
    chargerExempleGAC();
};