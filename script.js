function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

function calculerNote() {
    let physique = parseFloat(document.getElementById('physique').value) || 0;
    let technique = parseFloat(document.getElementById('technique').value) || 0;
    let mental = parseFloat(document.getElementById('mental').value) || 0;

    // Formule basée sur les proportions de l'Excel AfU
    let score = (physique * 0.3) + (technique * 0.4) + (mental * 0.3);

    document.getElementById('scoreVal').innerText = score.toFixed(2) + " / 100";
}