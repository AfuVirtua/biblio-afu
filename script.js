/* ==========================================================================
   BIBLIO AFU - SCRIPT PRINCIPAL (VERSION AVEC CALCUL NG CORRECT)
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

// 3. TABLEAU DES COEFFICIENTS (PROPORTIONS ENTRAINEMENTS - EXCEL AFU)
const coefficients = {
    "GAC": { "Gardien": 0.5, "Défense": 0.1667, "Tacles": 0.1667, "Placement": 0.1667 },
    "GAC - Relanceur": { "Gardien": 0.5, "Tacles": 0.1667, "Placement": 0.1667, "Passes": 0.1667 },
    "DL - Normal": { "Défense": 0.5, "Tacles": 0.25, "Placement": 0.25 },
    "DFC - Normal": { "Défense": 0.5, "Tacles": 0.1667, "Placement": 0.1667, "Puissance": 0.1667 },
    "DFC - Participer à la construction": { "Défense": 0.4286, "Tacles": 0.1429, "Puissance": 0.1429, "Passes": 0.2857 },
    "DFC - Monter sur phases arrêtées": { "Défense": 0.5, "Tacles": 0.1667, "Puissance": 0.3333 },
    "DFL - Normal": { "Défense": 0.5, "Tacles": 0.1667, "Passes": 0.1667, "Vitesse": 0.1667 },
    "DFL - Prendre le couloir": { "Défense": 0.4, "Tacles": 0.2, "Vitesse": 0.4 },
    "MD - Normal": { "Défense": 0.25, "Passes": 0.5, "Technique": 0.25 },
    "MD - Défendre": { "Défense": 0.5, "Passes": 0.25, "Technique": 0.25 },
    "MD - Attaquer": { "Passes": 0.5, "Technique": 0.25, "Attaque": 0.25 },
    "MD - Provoquer": { "Défense": 0.25, "Passes": 0.25, "Technique": 0.5 },
    "MOC - Normal": { "Passes": 0.3333, "Technique": 0.3333, "Attaque": 0.3333 },
    "MOC - Défendre": { "Défense": 0.3333, "Passes": 0.3333, "Technique": 0.3333 },
    "MOC - Attaque": { "Passes": 0.25, "Technique": 0.25, "Attaque": 0.5 },
    "MOL - Normal": { "Passes": 0.2, "Technique": 0.2, "Vitesse": 0.4, "Attaque": 0.2 },
    "MOL - Centrer": { "Passes": 0.4, "Technique": 0.2, "Vitesse": 0.2, "Attaque": 0.2 },
    "MOL - Provoquer": { "Passes": 0.2, "Technique": 0.4, "Vitesse": 0.2, "Attaque": 0.2 },
    "MOL - Déborder": { "Passes": 0.1667, "Technique": 0.1667, "Vitesse": 0.5, "Attaque": 0.1667 },
    "AS - Normal": { "Passes": 0.2, "Technique": 0.2, "Vitesse": 0.2, "Attaque": 0.4 },
    "AT - Normal": { "Technique": 0.25, "Vitesse": 0.25, "Attaque": 0.5 },
    "AT - Jeu en profondeur": { "Technique": 0.2, "Vitesse": 0.4, "Attaque": 0.4 },
    "AT - Provoquer": { "Technique": 0.4, "Vitesse": 0.2, "Attaque": 0.4 },
    "AT - Pivot": { "Puissance": 0.1667, "Passes": 0.1667, "Vitesse": 0.1667, "Technique": 0.1667, "Attaque": 0.3333 }
};

// 4. CORRESPONDANCE DES STATS POUR LE CALCUL
const statMapping = {
    "Gardien": "gar",
    "Défense": "def",
    "Tacles": "tac",
    "Placement": "pla",
    "Marquage": "mar",
    "Puissance": "pui",
    "Passes": "pas",
    "Technique": "tec",
    "Vitesse": "vit",
    "Attaque": "att"
};

// 5. FONCTION POUR CHANGER DE LANGUE
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

// 6. FONCTION POUR LA NAVIGATION
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

// 7. FONCTION DE CALCUL DE LA NG - MÉTHODE CORRECTE
function calculerTout() {
    // Récupération des valeurs des caractéristiques
    const stats = {
        gar: parseFloat(document.getElementById('st_gar')?.value) || 0,
        def: parseFloat(document.getElementById('st_def')?.value) || 0,
        tac: parseFloat(document.getElementById('st_tac')?.value) || 0,
        pla: parseFloat(document.getElementById('st_pla')?.value) || 0,
        mar: parseFloat(document.getElementById('st_mar')?.value) || 0,
        pui: parseFloat(document.getElementById('st_pui')?.value) || 0,
        pas: parseFloat(document.getElementById('st_pas')?.value) || 0,
        tec: parseFloat(document.getElementById('st_tec')?.value) || 0,
        vit: parseFloat(document.getElementById('st_vit')?.value) || 0,
        att: parseFloat(document.getElementById('st_att')?.value) || 0
    };

    const posteSelect = document.getElementById('posteSelect');
    if (!posteSelect) return;
    
    const poste = posteSelect.value;
    
    // Récupérer les coefficients pour ce poste
    const coeffs = coefficients[poste] || {};
    
    // Étape 1: Calculer la somme des stats utiles pondérées
    let sommeStats = 0;
    let sommeCoeffs = 0;
    const statsUtiles = {};
    
    for (const [statName, coeff] of Object.entries(coeffs)) {
        const statKey = statMapping[statName];
        if (statKey && stats[statKey] !== undefined) {
            statsUtiles[statKey] = stats[statKey];
            sommeStats += stats[statKey];
            sommeCoeffs += coeff;
        }
    }
    
    // Étape 2: Calculer la NG idéale (la plus haute stat * 2)
    // La NG maximale est limitée par la stat la plus élevée
    // Pour un GAC avec Gardien à 91, la NG max est 91 * (6/2) = 273? Non.
    // En réalité, la NG = (somme des min(stat_réelle, stat_idéale)) / 2
    
    // Étape 3: Calculer les valeurs idéales basées sur la stat la plus élevée
    const statKeys = Object.keys(statsUtiles);
    if (statKeys.length === 0) {
        document.getElementById('ngResult').innerText = '0.00';
        return;
    }
    
    // Trouver la stat la plus élevée pour déterminer la référence
    let maxStat = 0;
    let maxStatKey = '';
    for (const key of statKeys) {
        if (statsUtiles[key] > maxStat) {
            maxStat = statsUtiles[key];
            maxStatKey = key;
        }
    }
    
    // Calculer les valeurs idéales basées sur la stat max
    // Idéalement, chaque stat devrait être proportionnelle à son coefficient
    // Par exemple, si Gardien=91 et coeff=0.5, alors Défense idéale = 91 * (0.1667/0.5)
    let ngSum = 0;
    for (const key of statKeys) {
        const statValue = statsUtiles[key];
        // Trouver le nom de la stat correspondant
        let statName = '';
        for (const [name, mappingKey] of Object.entries(statMapping)) {
            if (mappingKey === key) {
                statName = name;
                break;
            }
        }
        if (statName && coeffs[statName]) {
            const coeff = coeffs[statName];
            // Valeur idéale basée sur la stat max
            const idealValue = maxStat * (coeff / coeffs[statNameForMax]);
            // Prendre le minimum entre la valeur réelle et l'idéale
            const minValue = Math.min(statValue, idealValue);
            ngSum += minValue;
        }
    }
    
    // La NG est la somme divisée par 2
    const ng = ngSum / 2;
    
    // Trouver le nom de la stat max pour l'affichage
    let statNameForMax = '';
    for (const [name, mappingKey] of Object.entries(statMapping)) {
        if (mappingKey === maxStatKey) {
            statNameForMax = name;
            break;
        }
    }
    
    // Si la stat max est 0, NG = 0
    const finalNg = maxStat === 0 ? 0 : ng;

    // Affichage de la NG arrondie
    const ngResultElem = document.getElementById('ngResult');
    if (ngResultElem) {
        ngResultElem.innerText = finalNg.toFixed(2);
    }

    // Affichage des badges de proportions d'entraînement
    const ratioBox = document.getElementById('entrainementRatio');
    if (ratioBox) {
        ratioBox.innerHTML = '';
        for (const [statName, coeff] of Object.entries(coeffs)) {
            const pct = (coeff * 100).toFixed(1) + '%';
            const labelStat = (currentLang === 'en' && statNamesEN[statName]) ? statNamesEN[statName] : statName;
            const badge = document.createElement('div');
            badge.className = 'ratio-badge';
            badge.innerText = `${labelStat} : ${pct}`;
            ratioBox.appendChild(badge);
        }
    }
}

// 8. INITIALISATION
document.addEventListener('DOMContentLoaded', function() {
    switchLanguage('fr');
    calculerTout();
});