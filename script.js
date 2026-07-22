/* ==========================================================================
   BIBLIO AFU - GESTION DU BILINGUISME, NAVIGATION ET CALCULATEUR
   ========================================================================== */

// 1. VARIABLE GLOBALE DE LANGUE
let currentLang = 'fr';

// 2. NOMS DES CARACTÉRISTIQUES EN ANGLAIS (POUR LE CALCULATEUR)
const statNamesEN = {
    "Gardien": "Goalkeeping",
    "Défense": "Defense",
    "Tacles": "Tackling",
    "Placement": "Positioning",
    "Marquage": "Marking",
    "Puissance": "Power",
    "Passes": "Passing",
    "Technique": "Technique",
    "Vitesse": "Speed",
    "Attaque": "Attack",
    "Endurance": "Stamina"
};

// 3. TABLEAU DES PROPORTIONS D'ENTRAÎNEMENT (EXCEL AFU)
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

// 4. FONCTION POUR CHANGER DE LANGUE (FR / EN)
function switchLanguage(lang) {
    currentLang = lang;
    
    // Mise à jour de l'état actif sur les boutons FR/EN
    const btnFr = document.getElementById('btn-fr');
    const btnEn = document.getElementById('btn-en');
    
    if (btnFr && btnEn) {
        btnFr.classList.toggle('active', lang === 'fr');
        btnEn.classList.toggle('active', lang === 'en');
    }

    // Mise à jour des textes ayant l'attribut data-i18n
    if (typeof translations !== 'undefined' && translations[lang]) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });
    }

    // Recalculer pour mettre à jour les libellés traduits dans le calculateur
    calculerTout();
}

// 5. FONCTION POUR LA NAVIGATION ENTRE ONGLETS
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
}

// 6. FONCTION DE CALCUL DE LA NG BRUTE ET AFFICHAGE DES RATIOS
function calculerTout() {
    // Récupération des valeurs d'entrées
    const gar = parseFloat(document.getElementById('st_gar')?.value) || 0;
    const def = parseFloat(document.getElementById('st_def')?.value) || 0;
    const tac = parseFloat(document.getElementById('st_tac')?.value) || 0;
    const pla = parseFloat(document.getElementById('st_pla')?.value) || 0;
    const pui = parseFloat(document.getElementById('st_pui')?.value) || 0;
    const pas = parseFloat(document.getElementById('st_pas')?.value) || 0;
    const tec = parseFloat(document.getElementById('st_tec')?.value) || 0;
    const vit = parseFloat(document.getElementById('st_vit')?.value) || 0;
    const att = parseFloat(document.getElementById('st_att')?.value) || 0;

    const posteSelect = document.getElementById('posteSelect');
    if (!posteSelect) return;
    
    const poste = posteSelect.value;
    let ng = 0;

    // Calcul exact des notes selon le poste et la consigne
    switch(poste) {
        case "GAC": ng = (3 * gar + def + tac + pla) / 6; break;
        case "GAC - Relanceur": ng = (3 * gar + tac + pla + pas) / 6; break;
        case "DL - Normal": ng = (2 * def + tac + pla) / 4; break;
        case "DFC - Normal": ng = (3 * def + tac + pla + pui) / 6; break;
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

    // Affichage de la NG arrondie à 2 décimales
    const ngResultElem = document.getElementById('ngResult');
    if (ngResultElem) {
        ngResultElem.innerText = ng.toFixed(2);
    }

    // Affichage dynamique des badges de répartition d'entraînement
    const ratioBox = document.getElementById('entrainementRatio');
    if (ratioBox) {
        ratioBox.innerHTML = '';
        const ratios = proportionsEntrainement[poste] || {};
        for (const [stat, pct] of Object.entries(ratios)) {
            const labelStat = (currentLang === 'en' && statNamesEN[stat]) ? statNamesEN[stat] : stat;
            const badge = document.createElement('div');
            badge.className = 'ratio-badge';
            badge.innerText = `${labelStat} : ${pct}`;
            ratioBox.appendChild(badge);
        }
    }
}

// 7. INITIALISATION LORS DU CHARGEMENT DE LA PAGE
window.addEventListener('DOMContentLoaded', () => {
    calculerTout();
});