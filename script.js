/* ==========================================================================
   BIBLIO AFU - SCRIPT PRINCIPAL (VERSION COMPLÈTE AVEC PAGINATION)
   ========================================================================== */

// 1. VARIABLE GLOBALE DE LANGUE
let currentLang = 'fr';
let currentPage = 1;
const newsPerPage = 2;

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

// 5. BASE DE DONNÉES DES NEWS
const newsDatabase = [
    {
        id: 2,
        date: "24 Juillet 2026",
        title: "🏟️ Nouveau système de stade",
        author: "Aymeric",
        role: "Propriétaire de Virtuafoot",
        isNew: true,
        content: `
            <p>Afin d'harmoniser les infrastructures du club, le système de construction du stade évolue : les tribunes nommées (tribune principale, virages, etc.) disparaissent au profit d'un système de niveaux, comme pour la boutique, le centre de formation ou l'infirmerie.</p>
            
            <h4 style="color: #1b5e20; margin-top: 1.2rem;">🏗️ Nouveau fonctionnement :</h4>
            <ul style="line-height: 1.8;">
                <li><strong>Niveau du stade :</strong> chaque stade possède désormais un niveau, de 1 à 10. Chaque niveau fixe la capacité maximale du stade.</li>
                <li><strong>Extension des places :</strong> au sein d'un niveau, vous continuez d'agrandir votre stade en construisant des places, jusqu'à la capacité maximale du niveau.</li>
                <li><strong>Passage au niveau supérieur :</strong> une fois votre stade suffisamment rempli en places, vous pouvez lancer la construction du niveau suivant <strong>(chantier de 5 jours)</strong>, qui débloque une nouvelle capacité maximale.</li>
            </ul>
            <p style="background: #e8f5e9; padding: 0.8rem 1.2rem; border-radius: 6px; border-left: 4px solid #2e7d32;">
                <strong>📌 Important :</strong> Les stades existants ont été convertis automatiquement : le niveau attribué correspond à la capacité actuelle de votre stade, <strong>aucune place n'est perdue</strong>.
            </p>
            
            <h4 style="color: #1976d2; margin-top: 1.2rem;">📊 Les paliers :</h4>
            <div class="table-responsive">
                <table class="data-table" style="max-width: 500px; margin: 0 auto;">
                    <thead>
                        <tr>
                            <th style="text-align: center;">Niveau</th>
                            <th style="text-align: center;">Prix</th>
                            <th style="text-align: center;">Capacité max</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td style="text-align: center;">1</td><td style="text-align: center;">-</td><td style="text-align: center;">5 000</td></tr>
                        <tr><td style="text-align: center;">2</td><td style="text-align: center;">750 000 €</td><td style="text-align: center;">10 000</td></tr>
                        <tr><td style="text-align: center;">3</td><td style="text-align: center;">1 000 000 €</td><td style="text-align: center;">15 000</td></tr>
                        <tr><td style="text-align: center;">4</td><td style="text-align: center;">1 500 000 €</td><td style="text-align: center;">20 000</td></tr>
                        <tr><td style="text-align: center;">5</td><td style="text-align: center;">2 000 000 €</td><td style="text-align: center;">25 000</td></tr>
                        <tr><td style="text-align: center;">6</td><td style="text-align: center;">2 500 000 €</td><td style="text-align: center;">30 000</td></tr>
                        <tr><td style="text-align: center;">7</td><td style="text-align: center;">3 000 000 €</td><td style="text-align: center;">40 000</td></tr>
                        <tr><td style="text-align: center;">8</td><td style="text-align: center;">5 000 000 €</td><td style="text-align: center;">50 000</td></tr>
                        <tr><td style="text-align: center;">9</td><td style="text-align: center;">7 500 000 €</td><td style="text-align: center;">60 000</td></tr>
                        <tr><td style="text-align: center;">10</td><td style="text-align: center;">10 000 000 €</td><td style="text-align: center;">100 000</td></tr>
                    </tbody>
                </table>
            </div>
            <p style="margin-top: 1rem; font-size: 0.95rem; color: #666;">
                🔗 Le détail des paliers et l'état de votre stade sont consultables sur la page <a href="https://www.virtuafoot.com/#stade?equipement" target="_blank" style="color: #2e7d32; font-weight: bold;">https://www.virtuafoot.com/#stade?equipement</a>
            </p>
        `
    },
    {
        id: 1,
        date: "23 Juillet 2026",
        title: "📢 Nouveautés Virtuafoot",
        author: "Aymeric",
        role: "Propriétaire de Virtuafoot",
        isNew: false,
        content: `
            <p>Deux évolutions font leur apparition sur Virtuafoot :</p>
            
            <h4 style="color: #1b5e20; margin-top: 1.2rem;">🏃 Condition physique et style de jeu</h4>
            <p>La condition physique des joueurs est désormais prise en compte dans le calcul de l'impact du style de jeu.</p>
            <p style="background: #e8f5e9; padding: 0.8rem 1.2rem; border-radius: 6px; border-left: 4px solid #2e7d32;">
                <strong>Concrètement :</strong> Plus la condition physique de vos joueurs est basse, moins votre style de jeu pèsera sur le déroulement du match. Une équipe fatiguée appliquera donc moins efficacement ses consignes de jeu. <strong>Surveillez la fraîcheur de votre effectif avant les grandes échéances !</strong>
            </p>
            
            <h4 style="color: #1976d2; margin-top: 1.2rem;">💎 Des points VF pour les défaites</h4>
            <p>Jusqu'à présent, seules les victoires et les matchs nuls rapportaient des points VF. Désormais, les défaites rapporteront des points VF, à hauteur de <strong>50% des points gagnés en cas de victoire</strong>, soit autant que les matchs nuls.</p>
            <p style="background: #e3f2fd; padding: 0.8rem 1.2rem; border-radius: 6px; border-left: 4px solid #1976d2;">
                <strong>Vous aurez donc la garantie de faire progresser votre club en jouant des matchs</strong>, peu importe l'adversaire que vous choisissez.
            </p>
            
            <hr style="margin: 1.2rem 0; border: none; border-top: 2px dashed #ddd;">
            
            <p style="font-style: italic; color: #666; font-size: 0.95rem; background: #f5f5f5; padding: 0.8rem 1.2rem; border-radius: 6px;">
                <strong>📌 Note :</strong> Pour chaque actualisation (actu), la baisse de style est de <strong>0,3</strong>.
            </p>
        `
    }
];

// 6. FONCTION POUR CHANGER DE LANGUE
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
    renderNews(); // Re-rendre les news avec la nouvelle langue
}

// 7. FONCTION POUR LA NAVIGATION
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
    
    // Réinitialiser la pagination quand on ouvre l'onglet News
    if (tabId === 'news') {
        currentPage = 1;
        renderNews();
    }
}

// 8. FONCTION DE CALCUL DE LA NG - MÉTHODE CORRECTE
function calculerTout() {
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
    const coeffs = coefficients[poste] || {};
    const statKeys = Object.keys(coeffs);
    
    if (statKeys.length === 0) {
        document.getElementById('ngResult').innerText = '0.00';
        return;
    }
    
    const statValues = {};
    for (const statName of statKeys) {
        const statKey = statMapping[statName];
        if (statKey && stats[statKey] !== undefined) {
            statValues[statName] = stats[statKey];
        }
    }
    
    let maxStatValue = 0;
    let maxStatName = '';
    for (const [name, value] of Object.entries(statValues)) {
        if (value > maxStatValue) {
            maxStatValue = value;
            maxStatName = name;
        }
    }
    
    if (maxStatValue === 0) {
        document.getElementById('ngResult').innerText = '0.00';
        return;
    }
    
    const maxCoeff = coeffs[maxStatName];
    let ngSum = 0;
    
    for (const statName of statKeys) {
        const statValue = statValues[statName] || 0;
        const coeff = coeffs[statName];
        const idealValue = maxStatValue * (coeff / maxCoeff);
        const minValue = Math.min(statValue, idealValue);
        ngSum += minValue;
    }
    
    const ng = ngSum / 2;
    
    const ngResultElem = document.getElementById('ngResult');
    if (ngResultElem) {
        ngResultElem.innerText = ng.toFixed(2);
    }

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

// 9. RENDU DES NEWS AVEC PAGINATION
function renderNews() {
    const container = document.getElementById('newsContainer');
    if (!container) return;
    
    const totalPages = Math.ceil(newsDatabase.length / newsPerPage);
    const startIndex = (currentPage - 1) * newsPerPage;
    const endIndex = startIndex + newsPerPage;
    const pageNews = newsDatabase.slice(startIndex, endIndex);
    
    if (pageNews.length === 0) {
        container.innerHTML = `<div class="card"><p style="text-align: center; color: #999;">Aucune news à afficher.</p></div>`;
    } else {
        container.innerHTML = pageNews.map(news => `
            <div class="card" style="border-left: 6px solid ${news.isNew ? '#d32f2f' : '#ff6f00'}; background-color: ${news.isNew ? '#fff5f5' : '#fff8e1'};">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                    <h3 style="margin: 0; color: ${news.isNew ? '#d32f2f' : '#ff6f00'};">${news.title}</h3>
                    ${news.isNew ? '<span style="font-size: 0.9rem; color: #d32f2f; background: #ffebee; padding: 4px 12px; border-radius: 20px; font-weight: bold;">🔴 Nouveau</span>' : ''}
                </div>
                <p style="color: #666; font-style: italic; margin-top: 0;">Posté par <strong>${news.author}</strong>${news.role ? ' - ' + news.role : ''}</p>
                <div style="background: white; padding: 1.5rem; border-radius: 8px; margin: 0.5rem 0; line-height: 1.8;">
                    ${news.content}
                </div>
                <p style="color: #999; font-size: 0.85rem; text-align: right; margin: 0;">
                    📅 ${news.date}
                </p>
            </div>
        `).join('');
    }
    
    // Mise à jour de la pagination
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (pageInfo) {
        const lang = currentLang === 'fr' ? 'Page' : 'Page';
        pageInfo.textContent = `${lang} ${currentPage} / ${totalPages}`;
    }
    
    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
    }
}

// 10. CHANGER DE PAGE DANS LES NEWS
function changePage(direction) {
    const totalPages = Math.ceil(newsDatabase.length / newsPerPage);
    const newPage = currentPage + direction;
    if (newPage < 1 || newPage > totalPages) return;
    currentPage = newPage;
    renderNews();
    
    // Scroll en haut de la section
    const container = document.getElementById('newsContainer');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// 11. COMPTEUR DE VISITEURS (localStorage)
function initVisitorCounter() {
    let count = localStorage.getItem('afu_visitor_count');
    
    if (count === null) {
        count = 1;
    } else {
        count = parseInt(count) + 1;
    }
    
    localStorage.setItem('afu_visitor_count', count);
    
    const visitorElement = document.getElementById('visitorCount');
    if (visitorElement) {
        visitorElement.textContent = count;
    }
}

// 12. INITIALISATION AU CHARGEMENT DE LA PAGE
document.addEventListener('DOMContentLoaded', function() {
    switchLanguage('fr');
    calculerTout();
    initVisitorCounter();
    renderNews();
});