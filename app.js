// Compléter les fonctions JavaScript pour Mon Cycle Pro

function updateTimeline(currentDay, cycle) {
    const cursor = document.getElementById('timelineCursor');
    const periodLength = cycle.periodLength;
    const ovulationDay = cycle.cycleLength - 14;
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay + 1;

    // Calculer la position du curseur (en pourcentage)
    const percentage = (currentDay / cycle.cycleLength) * 100;
    cursor.style.left = percentage + '%';

    // Mettre à jour les phases avec les bonnes données
    document.querySelector('#phasePeriod .phase-days').textContent = `J1-${periodLength}`;
    document.querySelector('#phaseSafe1 .phase-days').textContent = `J${periodLength + 1}-${fertileStart - 1}`;
    document.querySelector('#phaseFertile .phase-days').textContent = `J${fertileStart}-${fertileEnd}`;
    document.querySelector('#phaseOvulation .phase-days').textContent = `J${ovulationDay}`;
    document.querySelector('#phaseSafe2 .phase-days').textContent = `J${fertileEnd + 1}-${cycle.cycleLength}`;

    // Ajuster les tailles des phases selon le cycle
    document.getElementById('phasePeriod').style.flex = periodLength;
    document.getElementById('phaseSafe1').style.flex = Math.max(1, fertileStart - periodLength - 1);
    document.getElementById('phaseFertile').style.flex = fertileEnd - fertileStart + 1;
    document.getElementById('phaseOvulation').style.flex = 1;
    document.getElementById('phaseSafe2').style.flex = Math.max(1, cycle.cycleLength - fertileEnd);

    // Highlighting la phase actuelle
    document.querySelectorAll('.timeline-phase').forEach(phase => {
        phase.classList.remove('current');
    });

    if (currentDay <= periodLength) {
        document.getElementById('phasePeriod').classList.add('current');
    } else if (currentDay >= ovulationDay - 1 && currentDay <= ovulationDay + 1) {
        document.getElementById('phaseOvulation').classList.add('current');
    } else if (currentDay >= fertileStart && currentDay <= fertileEnd) {
        document.getElementById('phaseFertile').classList.add('current');
    } else if (currentDay < fertileStart) {
        document.getElementById('phaseSafe1').classList.add('current');
    } else {
        document.getElementById('phaseSafe2').classList.add('current');
    }
}

function updatePredictions(lastCycle, avgCycle) {
    const predictionsDiv = document.getElementById('predictions');
    const lastPeriodDate = new Date(lastCycle.startDate);
    
    // Prochaines règles
    const nextPeriod = new Date(lastPeriodDate);
    nextPeriod.setDate(lastPeriodDate.getDate() + avgCycle);
    
    // Prochaine ovulation (du cycle suivant)
    const nextOvulation = new Date(nextPeriod);
    nextOvulation.setDate(nextPeriod.getDate() + 14);

    // Calculer les jours restants
    const today = new Date();
    const daysToNextPeriod = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));
    const daysToNextOvulation = Math.ceil((nextOvulation - today) / (1000 * 60 * 60 * 24));
    
    predictionsDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div style="padding: 15px; background: linear-gradient(135deg, #fdf2f8, #ec4899); border-radius: 12px; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 8px;">🩸</div>
                <div style="font-weight: bold; color: #831843; margin-bottom: 5px;">Prochaines règles</div>
                <div style="font-size: 14px; color: #831843; margin-bottom: 5px;">${formatDateShort(nextPeriod)}</div>
                <div style="font-size: 12px; opacity: 0.8;">Dans ${daysToNextPeriod} jours</div>
            </div>
            <div style="padding: 15px; background: linear-gradient(135deg, #fecaca, #ef4444); border-radius: 12px; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 8px;">🔴</div>
                <div style="font-weight: bold; color: #991b1b; margin-bottom: 5px;">Prochaine ovulation</div>
                <div style="font-size: 14px; color: #991b1b; margin-bottom: 5px;">${formatDateShort(nextOvulation)}</div>
                <div style="font-size: 12px; opacity: 0.8;">Dans ${daysToNextOvulation} jours</div>
            </div>
        </div>
        <div style="margin-top: 15px; padding: 15px; background: #f8fafc; border-radius: 10px; border-left: 4px solid #64748b;">
            <div style="font-size: 14px; color: #475569;">
                <strong>💡 Conseil:</strong> Ces prédictions sont basées sur vos ${cycleData.length} dernier${cycleData.length > 1 ? 's' : ''} cycle${cycleData.length > 1 ? 's' : ''} enregistré${cycleData.length > 1 ? 's' : ''}.
                ${cycleData.length < 3 ? ' Plus vous ajoutez de cycles, plus les prédictions seront précises.' : ''}
            </div>
        </div>
    `;
}

function formatDateShort(date) {
    return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short'
    });
}

function formatDate(date) {
    return date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification show ${type === 'error' ? 'error' : ''}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function addNewCycle() {
    const date = document.getElementById('newPeriodDate').value;
    const periodLength = parseInt(document.getElementById('newPeriodLength').value);

    if (!date) {
        showNotification('Veuillez sélectionner une date', 'error');
        return;
    }

    const newCycle = {
        startDate: date,
        periodLength: periodLength,
        cycleLength: userData.defaultCycleLength,
        id: Date.now()
    };

    // Mettre à jour la variable globale
    cycleData.unshift(newCycle);
    // Sauvegarder vraiment sur le téléphone
    LocalDB.save('cycles', cycleData);

    // Réinitialiser le formulaire
    document.getElementById('newPeriodDate').value = '';
    document.getElementById('newPeriodLength').value = userData.defaultPeriodLength;

    updateDashboard();
    updateCycleHistory();
    showNotification('Nouveau cycle sauvegardé !');
}

function clearAllData() {
    if (confirm('Êtes-vous sûre de vouloir effacer TOUTES les données ? Cette action est irréversible.')) {
        // Effacer du localStorage ET des variables globales
        LocalDB.clear();
        
        // Rafraîchir l'affichage
        updateDashboard();
        updateCycleHistory();
        generateCalendar();
    }
}

function updateCycleHistory() {
    const historyDiv = document.getElementById('cycleHistory');
    
    if (cycleData.length === 0) {
        historyDiv.innerHTML = '<div class="empty-state"><p>Aucun cycle enregistré</p></div>';
        return;
    }
    
    historyDiv.innerHTML = cycleData.map(cycle => `
        <div class="cycle-entry">
            <div>
                <div style="font-weight: 600; color: #ec4899;">${formatDate(new Date(cycle.startDate))}</div>
                <div style="font-size: 14px; color: #64748b;">Durée: ${cycle.cycleLength}j • Règles: ${cycle.periodLength}j</div>
            </div>
            <button class="delete-btn" onclick="deleteCycle(${cycle.id})">🗑️</button>
        </div>
    `).join('');
}

function deleteCycle(id) {
    if (confirm('Êtes-vous sûre de vouloir supprimer ce cycle ?')) {
        cycleData = cycleData.filter(cycle => cycle.id !== id);
        LocalDB.save('cycles', cycleData);
        updateDashboard();
        updateCycleHistory();
        showNotification('Cycle supprimé');
    }
}

function switchTab(tabName) {
    // Masquer tous les onglets
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Afficher l'onglet sélectionné
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    // Mettre à jour le contenu spécifique
    if (tabName === 'calendar') {
        generateCalendar();
        updateMonthSummary();
    }
    if (tabName === 'history') {
        updateAllCyclesHistory();
        updateAdvancedStats();
    }
    if (tabName === 'stats') {
        updateRegularityStats();
        updateTrendAnalysis();
        updateAdvancedPredictions();
        updateComparisonStats();
    }
}

// FONCTIONS CALENDRIER
function generateCalendar() {
    const grid = document.getElementById('calendarGrid');
    const titleElement = document.getElementById('calendarMonthTitle');
    
    if (!grid || !titleElement) return;
    
    // Effacer le calendrier
    grid.innerHTML = '';
    
    // Mise à jour du titre
    titleElement.textContent = currentCalendarMonth.toLocaleDateString('fr-FR', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // En-têtes des jours
    const dayHeaders = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    dayHeaders.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day calendar-header-day';
        dayElement.textContent = day;
        grid.appendChild(dayElement);
    });
    
    // Calculer le premier et dernier jour du mois
    const firstDay = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), 1);
    const lastDay = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 0);
    
    // Calculer le début de la grille (lundi précédent)
    const startDate = new Date(firstDay);
    const firstDayOfWeek = firstDay.getDay();
    const daysToSubtract = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    startDate.setDate(firstDay.getDate() - daysToSubtract);
    
    // Générer 42 jours (6 semaines)
    const today = new Date();
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = currentDate.getDate();
        
        // Vérifier si c'est dans le mois actuel
        if (currentDate.getMonth() !== currentCalendarMonth.getMonth()) {
            dayElement.classList.add('other-month');
        }
        
        // Vérifier si c'est aujourd'hui
        if (currentDate.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Ajouter les informations de cycle
        const dayInfo = getDayInfo(currentDate);
        if (dayInfo.type) {
            dayElement.classList.add(dayInfo.type);
        }
        
        // Ajouter les prédictions futures
        if (dayInfo.predicted) {
            dayElement.classList.add('predicted');
        }
        
        grid.appendChild(dayElement);
    }
}

function getDayInfo(date) {
    if (cycleData.length === 0) return { type: null, predicted: false };
    
    // Vérifier dans les cycles existants
    for (let cycle of cycleData) {
        const cycleStart = new Date(cycle.startDate);
        const cycleEnd = new Date(cycleStart);
        cycleEnd.setDate(cycleStart.getDate() + cycle.cycleLength - 1);
        
        if (date >= cycleStart && date <= cycleEnd) {
            const dayInCycle = Math.floor((date - cycleStart) / (1000 * 60 * 60 * 24)) + 1;
            
            // Période de règles
            if (dayInCycle <= cycle.periodLength) {
                return { type: 'period', predicted: false };
            }
            
            // Ovulation (jour 14 avant la fin)
            const ovulationDay = cycle.cycleLength - 14;
            if (dayInCycle === ovulationDay) {
                return { type: 'ovulation', predicted: false };
            }
            
            // Période fertile (5 jours avant ovulation + 1 jour après)
            const fertileStart = ovulationDay - 5;
            const fertileEnd = ovulationDay + 1;
            if (dayInCycle >= fertileStart && dayInCycle <= fertileEnd) {
                return { type: 'fertile', predicted: false };
            }
        }
    }
    
    // Prédictions pour le futur
    if (date > new Date()) {
        const prediction = predictFutureDay(date);
        if (prediction) {
            return { type: prediction, predicted: true };
        }
    }
    
    return { type: null, predicted: false };
}

function predictFutureDay(date) {
    if (cycleData.length === 0) return null;
    
    const lastCycle = cycleData[0];
    const lastPeriodDate = new Date(lastCycle.startDate);
    const avgCycleLength = Math.round(cycleData.reduce((sum, cycle) => sum + cycle.cycleLength, 0) / cycleData.length);
    
    // Calculer les prochains cycles prédits
    let currentCycleStart = new Date(lastPeriodDate);
    currentCycleStart.setDate(lastPeriodDate.getDate() + avgCycleLength);
    
    // Chercher dans les 12 prochains cycles
    for (let i = 0; i < 12; i++) {
        const cycleEnd = new Date(currentCycleStart);
        cycleEnd.setDate(currentCycleStart.getDate() + avgCycleLength - 1);
        
        if (date >= currentCycleStart && date <= cycleEnd) {
            const dayInCycle = Math.floor((date - currentCycleStart) / (1000 * 60 * 60 * 24)) + 1;
            
            if (dayInCycle <= lastCycle.periodLength) {
                return 'period';
            }
            
            const ovulationDay = avgCycleLength - 14;
            if (dayInCycle === ovulationDay) {
                return 'ovulation';
            }
            
            const fertileStart = ovulationDay - 5;
            const fertileEnd = ovulationDay + 1;
            if (dayInCycle >= fertileStart && dayInCycle <= fertileEnd) {
                return 'fertile';
            }
        }
        
        currentCycleStart.setDate(currentCycleStart.getDate() + avgCycleLength);
    }
    
    return null;
}

function changeCalendarMonth(direction) {
    currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + direction);
    generateCalendar();
    updateMonthSummary();
}

function updateMonthSummary() {
    const summaryDiv = document.getElementById('monthSummary');
    if (!summaryDiv || cycleData.length === 0) {
        if (summaryDiv) summaryDiv.innerHTML = '<p>Ajoutez des cycles pour voir le résumé mensuel</p>';
        return;
    }
    
    const monthStart = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), 1);
    const monthEnd = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 0);
    
    let periodDays = 0;
    let fertileDays = 0;
    let ovulationDays = 0;
    
    // Compter les jours pour ce mois
    for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
        const dayInfo = getDayInfo(new Date(d));
        if (dayInfo.type === 'period') periodDays++;
        else if (dayInfo.type === 'fertile') fertileDays++;
        else if (dayInfo.type === 'ovulation') ovulationDays++;
    }
    
    summaryDiv.innerHTML = `
        <div class="stat-grid">
            <div class="stat-item">
                <span class="stat-number">${periodDays}</span>
                <div class="stat-label">Jours de règles</div>
            </div>
            <div class="stat-item">
                <span class="stat-number">${fertileDays}</span>
                <div class="stat-label">Jours fertiles</div>
            </div>
            <div class="stat-item">
                <span class="stat-number">${ovulationDays}</span>
                <div class="stat-label">Jours d'ovulation</div>
            </div>
        </div>
    `;
}

// Fonctions pour les stats, historique etc...
function updateRegularityStats() {
    const statsDiv = document.getElementById('regularityStats');
    if (!statsDiv) return;
    
    if (cycleData.length < 2) {
        statsDiv.innerHTML = '<p>Ajoutez au moins 2 cycles pour voir les statistiques de régularité</p>';
        return;
    }
    
    const cycleLengths = cycleData.map(c => c.cycleLength);
    const periodLengths = cycleData.map(c => c.periodLength);
    
    const avgCycle = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
    const avgPeriod = periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length;
    
    // Calcul de la variance et régularité
    const cycleVariance = cycleLengths.reduce((acc, val) => acc + Math.pow(val - avgCycle, 2), 0) / cycleLengths.length;
    const regularity = Math.max(0, Math.round(100 - cycleVariance * 10));
    
    const shortest = Math.min(...cycleLengths);
    const longest = Math.max(...cycleLengths);
    const variation = longest - shortest;
    
    statsDiv.innerHTML = `
        <div class="stat-grid">
            <div class="stat-item">
                <span class="stat-number">${Math.round(avgCycle)}j</span>
                <div class="stat-label">Cycle moyen</div>
            </div>
            <div class="stat-item">
                <span class="stat-number">${Math.round(avgPeriod)}j</span>
                <div class="stat-label">Règles moyennes</div>
            </div>
            <div class="stat-item">
                <span class="stat-number">${regularity}%</span>
                <div class="stat-label">Régularité</div>
            </div>
            <div class="stat-item">
                <span class="stat-number">${variation}j</span>
                <div class="stat-label">Variation max</div>
            </div>
        </div>
        <div class="trend-chart">
            <h4>Évolution des cycles</h4>
            ${cycleLengths.slice(0, 6).reverse().map((length, index) => `
                <div class="cycle-bar">
                    <div class="cycle-fill" style="width: ${(length / 35) * 100}%">
                        Cycle ${cycleData.length - index}: ${length}j
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function updateTrendAnalysis() {
    // Implementation simplifiée
    const trendDiv = document.getElementById('trendAnalysis');
    if (!trendDiv) return;
    
    if (cycleData.length < 3) {
        trendDiv.innerHTML = '<p>Ajoutez au moins 3 cycles pour voir l\'analyse des tendances</p>';
        return;
    }
    
    trendDiv.innerHTML = '<p>Analyse des tendances disponible avec plus de données</p>';
}

function updateAdvancedPredictions() {
    // Implementation simplifiée
    const predDiv = document.getElementById('advancedPredictions');
    if (!predDiv) return;
    
    if (cycleData.length === 0) {
        predDiv.innerHTML = '<p>Ajoutez des cycles pour voir les prédictions avancées</p>';
        return;
    }
    
    predDiv.innerHTML = '<p>Prédictions avancées disponibles</p>';
}

function updateComparisonStats() {
    // Implementation simplifiée
    const compDiv = document.getElementById('comparisonStats');
    if (!compDiv) return;
    
    if (cycleData.length === 0) {
        compDiv.innerHTML = '<p>Ajoutez des cycles pour voir la comparaison</p>';
        return;
    }
    
    compDiv.innerHTML = '<p>Comparaison avec moyennes disponible</p>';
}

function addHistoricalCycle() {
    const date = document.getElementById('historyPeriodDate').value;
    const periodLength = parseInt(document.getElementById('historyPeriodLength').value);
    const cycleLength = parseInt(document.getElementById('historyCycleLength').value);
    const notes = document.getElementById('historyNotes').value;

    if (!date) {
        showNotification('Veuillez sélectionner une date', 'error');
        return;
    }

    const newCycle = {
        startDate: date,
        periodLength: periodLength,
        cycleLength: cycleLength,
        notes: notes,
        id: Date.now()
    };

    // Mettre à jour la variable globale
    cycleData.push(newCycle);
    
    // Trier par date décroissante
    cycleData.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    
    // Sauvegarder vraiment sur le téléphone
    LocalDB.save('cycles', cycleData);

    // Réinitialiser le formulaire
    document.getElementById('historyPeriodDate').value = '';
    document.getElementById('historyPeriodLength').value = 5;
    document.getElementById('historyCycleLength').value = 28;
    document.getElementById('historyNotes').value = '';

    updateDashboard();
    updateCycleHistory();
    updateAllCyclesHistory();
    updateAdvancedStats();
    
    showNotification('Cycle historique sauvegardé !');
}

function updateAllCyclesHistory() {
    const historyDiv = document.getElementById('allCyclesHistory');
    
    if (cycleData.length === 0) {
        historyDiv.innerHTML = '<div class="empty-state"><p>Aucun cycle enregistré</p></div>';
        return;
    }
    
    historyDiv.innerHTML = cycleData.map(cycle => `
        <div class="cycle-history-item">
            <div class="cycle-date-header">${formatDate(new Date(cycle.startDate))}</div>
            <div class="cycle-details">
                <div class="cycle-detail"><strong>Durée cycle:</strong> ${cycle.cycleLength} jours</div>
                <div class="cycle-detail"><strong>Durée règles:</strong> ${cycle.periodLength} jours</div>
                <div class="cycle-detail"><strong>Ajouté:</strong> ${new Date(cycle.id).toLocaleDateString('fr-FR')}</div>
            </div>
            ${cycle.notes ? `<div class="cycle-notes"><strong>Notes:</strong> ${cycle.notes}</div>` : ''}
            <button class="delete-btn" onclick="deleteCycle(${cycle.id})" style="position: absolute; top: 15px; right: 15px;">🗑️</button>
        </div>
    `).join('');
}

function updateAdvancedStats() {
    const statsDiv = document.getElementById('advancedStats');
    
    if (cycleData.length < 2) {
        statsDiv.innerHTML = '<p>Ajoutez au moins 2 cycles pour voir les statistiques avancées</p>';
        return;
    }
    
    const cycleLengths = cycleData.map(c => c.cycleLength);
    const periodLengths = cycleData.map(c => c.periodLength);
    
    const avgCycle = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
    const avgPeriod = Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length);
    const shortest = Math.min(...cycleLengths);
    const longest = Math.max(...cycleLengths);
    
    // Calcul de la régularité
    const variance = cycleLengths.reduce((acc, val) => acc + Math.pow(val - avgCycle, 2), 0) / cycleLengths.length;
    const regularity = Math.max(0, Math.round(100 - variance * 10));
    
    statsDiv.innerHTML = `
        <div class="stats-grid">
            <div class="stat-box">
                <span class="stat-number">${avgCycle}j</span>
                <div class="stat-label">Cycle moyen</div>
            </div>
            <div class="stat-box">
                <span class="stat-number">${avgPeriod}j</span>
                <div class="stat-label">Règles moyennes</div>
            </div>
            <div class="stat-box">
                <span class="stat-number">${shortest}j</span>
                <div class="stat-label">Cycle le plus court</div>
            </div>
            <div class="stat-box">
                <span class="stat-number">${longest}j</span>
                <div class="stat-label">Cycle le plus long</div>
            </div>
            <div class="stat-box">
                <span class="stat-number">${regularity}%</span>
                <div class="stat-label">Régularité</div>
            </div>
            <div class="stat-box">
                <span class="stat-number">${cycleData.length}</span>
                <div class="stat-label">Total cycles</div>
            </div>
        </div>
    `;
}