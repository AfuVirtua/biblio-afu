/* ==========================================================================
   BIBLIO AFU - SCRIPT PRINCIPAL (VERSION CORRIGÉE)
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
    "MOC - Défendre": { "Défense": "33.33%", "Passes": "33.33%", "Technique": "33.33%" },
    "MOC - Attaque": { "Passes": "25%", "Technique": "25%", "Attaque": "50%" },
    "MOL - Normal": { "Passes": "20%", "Technique": "20%", "Vitesse": "40%", "Attaque": "20%" },
    "MOL - Centrer": { "Passes": "40%", "Technique": "20%", "Vitesse": "20%", "Attaque": "20%" },
    "MOL - Provoquer": { "Passes": "20%", "Technique": "40%", "Vitesse": "20%", "Attaque": "20%" },
    "MOL - Déborder": { "Passes": "16.67%", "Technique": "16.67%", "Vitesse": "50%", "Attaque": "16.67%" },
    "AS - Normal": { "Passes": "20%", "Technique": "20%", "Vitesse": "20%", "Attaque": "40%" },
    "AT - Normal": { "Technique": "25%", "Vitesse": "25%", "Attaque": "50%" },
    "AT - Jeu en profondeur": { "Technique": "20%", "Vitesse": "40%", "Attaque": "40%" },
    "AT - Provoquer": { "Technique": "40%", "Vitesse": "20%", "Attaque": "40%" },
    "AT - Pivot": { "Puissance": "16.67%", "Passes": "16.67%", "Vitesse": "16.67%", "Technique": "16.67%", "Attaque": "33.33%" }
};

// 4. FONCTION POUR CHANGER DE LANGUE
function switchLanguage(lang) {
    currentLang = lang;
    
    const btnFr = document.getElementById('btn-fr');
    const btnEn = document.getElementById('btn-en');
    if (btnFr && btnEn) {
        btnFr.classList.toggle('active', lang === 'fr');
        btnEn.classList.toggle('active', lang === 'en');
    }

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key] !== undefined) {
            element.innerHTML = translations[lang][key];
        }
    });

    calculerTout();
}

// 5. FONCTION POUR LA NAVIGATION
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
        }
    });
}

// 6. FONCTION DE CALCUL DE LA NG - VERSION CORRIGÉE
function calculerTout() {
    // Récupération des valeurs
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

    // ================================================================
    // CALCUL DE LA NG SELON LA RÉPARTITION DES CARACTÉRISTIQUES
    // Basé sur les informations du forum Virtuafoot
    // ================================================================
    
    switch(poste) {
        // ===== GARDIENS =====
        // GAC Normal : Gardien 3 | Défense 1 | Tacles 1 | Placement 1
        case "GAC": 
            ng = (3 * gar + def + tac + pla) / 6; 
            break;
            
        // GAC Relanceur : Gardien 3 | Tacles 1 | Placement 1 | Passes 1
        case "GAC - Relanceur": 
            ng = (3 * gar + tac + pla + pas) / 6; 
            break;

        // ===== DÉFENSEURS =====
        // DL Normal : Défense 2 | Tacles 1 | Placement 1
        case "DL - Normal": 
            ng = (2 * def + tac + pla) / 4; 
            break;
            
        // DFC Normal : Défense 3 | Tacles 1 | Placement 1 | Puissance 1
        case "DFC - Normal": 
            ng = (3 * def + tac + pla + pui) / 6; 
            break;
            
        // DFC Monter sur phases arrêtées : Défense 3 | Tacles 1 | Puissance 2
        case "DFC - Monter sur phases arrêtées": 
            ng = (3 * def + tac + 2 * pui) / 6; 
            break;
            
        // DFC Participer à la construction : Défense 3 | Tacles 1 | Puissance 1 | Passes 2
        case "DFC - Participer à la construction": 
            ng = (3 * def + tac + pui + 2 * pas) / 7; 
            break;
            
        // DFL Normal : Défense 3 | Tacles 1 | Passes 1 | Vitesse 1
        case "DFL - Normal": 
            ng = (3 * def + tac + pas + vit) / 6; 
            break;
            
        // DFL Prendre le couloir : Défense 2 | Tacles 1 | Vitesse 2
        case "DFL - Prendre le couloir": 
            ng = (2 * def + tac + 2 * vit) / 5; 
            break;

        // ===== MILIEUX =====
        // MD Normal : Défense 1 | Passes 2 | Technique 1
        case "MD - Normal": 
            ng = (def + 2 * pas + tec) / 4; 
            break;
            
        // MD Défendre : Défense 2 | Passes 1 | Technique 1
        case "MD - Défendre": 
            ng = (2 * def + pas + tec) / 4; 
            break;
            
        // MD Attaquer : Passes 2 | Technique 1 | Attaque 1
        case "MD - Attaquer": 
            ng = (2 * pas + tec + att) / 4; 
            break;
            
        // MD Provoquer : Défense 1 | Passes 1 | Technique 2
        case "MD - Provoquer": 
            ng = (def + pas + 2 * tec) / 4; 
            break;
            
        // MOC Normal : Passes 1 | Technique 1 | Attaque 1
        case "MOC - Normal": 
            ng = (pas + tec + att) / 3; 
            break;
            
        // MOC Défendre : Défense 1 | Passes 1 | Technique 1
        case "MOC - Défendre": 
            ng = (def + pas + tec) / 3; 
            break;
            
        // MOC Attaque : Passes 1 | Technique 1 | Attaque 2
        case "MOC - Attaque": 
            ng = (pas + tec + 2 * att) / 4; 
            break;
            
        // MOL Normal : Passes 1 | Technique 1 | Vitesse 2 | Attaque 1
        case "MOL - Normal": 
            ng = (pas + tec + 2 * vit + att) / 5; 
            break;
            
        // MOL Centrer : Passes 2 | Technique 1 | Vitesse 1 | Attaque 1
        case "MOL - Centrer": 
            ng = (2 * pas + tec + vit + att) / 5; 
            break;
            
        // MOL Provoquer : Passes 1 | Technique 2 | Vitesse 1 | Attaque 1
        case "MOL - Provoquer": 
            ng = (pas + 2 * tec + vit + att) / 5; 
            break;
            
        // MOL Déborder : Passes 1 | Technique 1 | Vitesse 3 | Attaque 1
        case "MOL - Déborder": 
            ng = (pas + tec + 3 * vit + att) / 6; 
            break;

        // ===== ATTAQUANTS =====
        // AS Normal : Passes 1 | Technique 1 | Vitesse 1 | Attaque 2
        case "AS - Normal": 
            ng = (pas + tec + vit + 2 * att) / 5; 
            break;
            
        // AT Normal : Technique 1 | Vitesse 1 | Attaque 2
        case "AT - Normal": 
            ng = (tec + vit + 2 * att) / 4; 
            break;
            
        // AT Jeu en profondeur : Technique 1 | Vitesse 2 | Attaque 2
        case "AT - Jeu en profondeur": 
            ng = (tec + 2 * vit + 2 * att) / 5; 
            break;
            
        // AT Provoquer : Technique 2 | Vitesse 1 | Attaque 2
        case "AT - Provoquer": 
            ng = (2 * tec + vit + 2 * att) / 5; 
            break;
            
        // AT Pivot : Puissance 1 | Passes 1 | Vitesse 1 | Technique 1 | Attaque 2
        case "AT - Pivot": 
            ng = (pui + pas + vit + tec + 2 * att) / 6; 
            break;

        default: 
            ng = 0;
    }

    // Affichage de la NG arrondie
    const ngResultElem = document.getElementById('ngResult');
    if (ngResultElem) {
        ngResultElem.innerText = ng.toFixed(2);
    }

    // Affichage des badges de proportions d'entraînement
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

// 7. INITIALISATION
document.addEventListener('DOMContentLoaded', function() {
    switchLanguage('fr');
    calculerTout();
});