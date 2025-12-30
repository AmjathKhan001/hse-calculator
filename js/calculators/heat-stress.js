// heat-stress.js - Heat Stress Calculator Logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize heat stress calculator
    const calculateBtn = document.getElementById('calculate-heat');
    const resetBtn = document.getElementById('reset-heat');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateHeatStress);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetHeatStress);
    }
    
    // Initialize hydration calculator
    initHydrationCalculator();
    
    console.log('Heat Stress Calculator initialized');
});

function calculateHeatStress() {
    // Get environmental measurements
    const dryBulbTemp = parseFloat(document.getElementById('dry-bulb-temp').value);
    const wetBulbTemp = parseFloat(document.getElementById('wet-bulb-temp').value);
    const globeTemp = parseFloat(document.getElementById('globe-temp').value);
    const humidity = parseFloat(document.getElementById('humidity').value);
    const windSpeed = parseFloat(document.getElementById('wind-speed').value) || 0;
    const solarLoad = document.getElementById('solar-load').value;
    
    // Get work parameters
    const workIntensity = document.getElementById('work-intensity').value;
    const clothingType = document.getElementById('clothing-type').value;
    const acclimatization = document.getElementById('acclimatization').value;
    const workRestCycle = document.getElementById('work-rest-cycle').value;
    
    // Validate inputs
    if (isNaN(dryBulbTemp) || dryBulbTemp < -20 || dryBulbTemp > 60) {
        showNotification('Please enter a valid dry bulb temperature (-20 to 60°C).', 'error');
        return;
    }
    
    if (isNaN(wetBulbTemp) || wetBulbTemp < -20 || wetBulbTemp > 60) {
        showNotification('Please enter a valid wet bulb temperature (-20 to 60°C).', 'error');
        return;
    }
    
    if (isNaN(humidity) || humidity < 0 || humidity > 100) {
        showNotification('Please enter a valid humidity percentage (0-100).', 'error');
        return;
    }
    
    // Calculate WBGT (Wet Bulb Globe Temperature)
    const wbgt = calculateWBGT(dryBulbTemp, wetBulbTemp, globeTemp, solarLoad);
    
    // Calculate Heat Stress Index
    const heatIndex = calculateHeatIndex(dryBulbTemp, humidity);
    
    // Calculate Required Sweat Rate
    const sweatRate = calculateSweatRate(wbgt, workIntensity, clothingType);
    
    // Determine work-rest schedule
    const workRestSchedule = determineWorkRestSchedule(wbgt, workIntensity, acclimatization);
    
    // Calculate hydration requirements
    const hydration = calculateHydrationRequirements(sweatRate, workRestSchedule);
    
    // Determine risk level
    const riskAssessment = assessHeatRisk(wbgt, heatIndex, workIntensity, acclimatization);
    
    // Check OSHA/NIOSH compliance
    const compliance = checkHeatCompliance(wbgt, riskAssessment.level);
    
    // Generate recommendations
    const recommendations = generateHeatRecommendations(
        riskAssessment, 
        workRestSchedule, 
        hydration,
        wbgt
    );
    
    // Display results
    displayHeatResults({
        dryBulbTemp: dryBulbTemp,
        wetBulbTemp: wetBulbTemp,
        globeTemp: globeTemp,
        humidity: humidity,
        windSpeed: windSpeed,
        solarLoad: solarLoad,
        wbgt: wbgt,
        heatIndex: heatIndex,
        sweatRate: sweatRate,
        workIntensity: workIntensity,
        clothingType: clothingType,
        acclimatization: acclimatization,
        workRestCycle: workRestCycle,
        workRestSchedule: workRestSchedule,
        hydration: hydration,
        riskAssessment: riskAssessment,
        compliance: compliance,
        recommendations: recommendations
    });
    
    // Update heat chart
    updateHeatChart(wbgt, heatIndex, riskAssessment);
    
    showNotification('Heat stress assessment completed!', 'success');
}

function calculateWBGT(dryBulb, wetBulb, globe, solarLoad) {
    // Calculate WBGT based on measurement type
    if (globe && !isNaN(globe)) {
        // Indoor: WBGT = 0.7 × Wet Bulb + 0.3 × Globe
        return (0.7 * wetBulb) + (0.3 * globe);
    } else {
        // Outdoor: WBGT = 0.7 × Wet Bulb + 0.2 × Globe + 0.1 × Dry Bulb
        // Estimate globe temp if not provided
        const estimatedGlobe = dryBulb + (solarLoad === 'high' ? 10 : solarLoad === 'medium' ? 5 : 0);
        return (0.7 * wetBulb) + (0.2 * estimatedGlobe) + (0.1 * dryBulb);
    }
}

function calculateHeatIndex(temp, humidity) {
    // Simplified heat index calculation
    // Using Rothfusz regression for °C
    const c1 = -8.78469475556;
    const c2 = 1.61139411;
    const c3 = 2.33854883889;
    const c4 = -0.14611605;
    const c5 = -0.012308094;
    const c6 = -0.0164248277778;
    const c7 = 0.002211732;
    const c8 = 0.00072546;
    const c9 = -0.000003582;
    
    return c1 + (c2 * temp) + (c3 * humidity) + (c4 * temp * humidity) +
           (c5 * temp * temp) + (c6 * humidity * humidity) +
           (c7 * temp * temp * humidity) + (c8 * temp * humidity * humidity) +
           (c9 * temp * temp * humidity * humidity);
}

function calculateSweatRate(wbgt, workIntensity, clothingType) {
    // Estimate sweat rate in liters per hour
    let baseRate;
    
    switch(workIntensity) {
        case 'light':
            baseRate = 0.3 + (wbgt * 0.01);
            break;
        case 'moderate':
            baseRate = 0.5 + (wbgt * 0.02);
            break;
        case 'heavy':
            baseRate = 0.8 + (wbgt * 0.03);
            break;
        case 'very-heavy':
            baseRate = 1.2 + (wbgt * 0.04);
            break;
        default:
            baseRate = 0.5;
    }
    
    // Adjust for clothing
    let clothingFactor = 1.0;
    switch(clothingType) {
        case 'coveralls':
            clothingFactor = 1.3;
            break;
        case 'impermeable':
            clothingFactor = 1.5;
            break;
        case 'double-layer':
            clothingFactor = 1.8;
            break;
        case 'chemical-protective':
            clothingFactor = 2.0;
            break;
    }
    
    return baseRate * clothingFactor;
}

function determineWorkRestSchedule(wbgt, workIntensity, acclimatization) {
    // Based on ACGIH Threshold Limit Values
    let workPercentage, restPercentage, cycleTime;
    
    if (wbgt <= 26) {
        // Normal work
        workPercentage = 100;
        restPercentage = 0;
        cycleTime = 'Continuous';
    } else if (wbgt <= 28) {
        // 75% work, 25% rest
        workPercentage = 75;
        restPercentage = 25;
        cycleTime = '45 min work / 15 min rest';
    } else if (wbgt <= 30) {
        // 50% work, 50% rest
        workPercentage = 50;
        restPercentage = 50;
        cycleTime = '30 min work / 30 min rest';
    } else if (wbgt <= 32) {
        // 25% work, 75% rest
        workPercentage = 25;
        restPercentage = 75;
        cycleTime = '15 min work / 45 min rest';
    } else {
        // Work not recommended
        workPercentage = 0;
        restPercentage = 100;
        cycleTime = 'No work in heat';
    }
    
    // Adjust for work intensity
    if (workIntensity === 'heavy' || workIntensity === 'very-heavy') {
        workPercentage = Math.max(0, workPercentage - 25);
        restPercentage = 100 - workPercentage;
    }
    
    // Adjust for acclimatization
    if (acclimatization === 'acclimatized') {
        workPercentage = Math.min(100, workPercentage + 10);
        restPercentage = 100 - workPercentage;
    } else if (acclimatization === 'unacclimatized') {
        workPercentage = Math.max(0, workPercentage - 15);
        restPercentage = 100 - workPercentage;
    }
    
    return {
        workPercentage: workPercentage,
        restPercentage: restPercentage,
        cycleTime: cycleTime,
        maxWorkTime: (workPercentage / 100) * 60 // minutes per hour
    };
}

function calculateHydrationRequirements(sweatRate, workRestSchedule) {
    const hourlyFluidLoss = sweatRate; // liters per hour
    const workHoursPerDay = 8; // assumption
    const dailyFluidLoss = hourlyFluidLoss * workHoursPerDay * (workRestSchedule.workPercentage / 100);
    
    // Recommended intake: 1.5 times fluid loss
    const recommendedIntake = dailyFluidLoss * 1.5;
    
    // Break down by time
    const preShift = 0.5; // liters
    const duringWork = recommendedIntake - preShift;
    const perHour = duringWork / workHoursPerDay;
    
    return {
        hourlyLoss: hourlyFluidLoss.toFixed(2),
        dailyLoss: dailyFluidLoss.toFixed(2),
        recommendedIntake: recommendedIntake.toFixed(2),
        preShift: preShift.toFixed(1),
        duringWork: duringWork.toFixed(2),
        perHour: perHour.toFixed(2),
        schedule: `Drink ${perHour.toFixed(2)}L per hour during work`
    };
}

function assessHeatRisk(wbgt, heatIndex, workIntensity, acclimatization) {
    let riskLevel, riskColor, symptoms, action;
    
    if (wbgt <= 26) {
        riskLevel = 'Low Risk';
        riskColor = '#28a745';
        symptoms = 'Normal work, maintain hydration';
        action = 'General heat awareness';
    } else if (wbgt <= 28) {
        riskLevel = 'Moderate Risk';
        riskColor = '#ffc107';
        symptoms = 'Increased sweating, thirst, mild discomfort';
        action = 'Implement work-rest schedule, increase hydration';
    } else if (wbgt <= 30) {
        riskLevel = 'High Risk';
        riskColor = '#fd7e14';
        symptoms = 'Heat cramps, fatigue, headache, nausea';
        action = 'Mandatory work-rest cycles, close supervision';
    } else if (wbgt <= 32) {
        riskLevel = 'Very High Risk';
        riskColor = '#dc3545';
        symptoms = 'Heat exhaustion, dizziness, vomiting, confusion';
        action = 'Limited work only, medical supervision required';
    } else {
        riskLevel = 'Extreme Risk';
        riskColor = '#721c24';
        symptoms = 'Heat stroke - medical emergency';
        action = 'NO WORK ALLOWED - Immediate cooling required';
    }
    
    // Adjust for acclimatization
    if (acclimatization === 'acclimatized' && riskLevel !== 'Extreme Risk') {
        if (riskLevel === 'Very High Risk') riskLevel = 'High Risk';
        else if (riskLevel === 'High Risk') riskLevel = 'Moderate Risk';
    } else if (acclimatization === 'unacclimatized') {
        if (riskLevel === 'Moderate Risk') riskLevel = 'High Risk';
        else if (riskLevel === 'Low Risk') riskLevel = 'Moderate Risk';
    }
    
    // Calculate risk score
    const riskScore = wbgt + (heatIndex / 10) + 
                     (workIntensity === 'heavy' ? 5 : workIntensity === 'very-heavy' ? 10 : 0);
    
    return {
        level: riskLevel,
        color: riskColor,
        symptoms: symptoms,
        action: action,
        score: riskScore.toFixed(1)
    };
}

function checkHeatCompliance(wbgt, riskLevel) {
    const violations = [];
    const warnings = [];
    
    // OSHA General Duty Clause - employers must protect from recognized hazards
    if (riskLevel === 'Extreme Risk' || riskLevel === 'Very High Risk') {
        violations.push('OSHA General Duty Clause violation - Serious hazard present');
    }
    
    // Cal/OSHA Heat Illness Prevention Standard
    if (wbgt >= 27) {
        warnings.push('Cal/OSHA requires written heat illness prevention program');
    }
    
    if (wbgt >= 30) {
        violations.push('Cal/OSHA requires mandatory 10-minute cool-down rest every 2 hours');
    }
    
    // Washington State Heat Rule
    if (wbgt >= 29) {
        warnings.push('WA L&I requires additional precautions at 29°C WBGT');
    }
    
    return {
        violations: violations,
        warnings: warnings,
        hasViolations: violations.length > 0,
        hasWarnings: warnings.length > 0
    };
}

function generateHeatRecommendations(riskAssessment, workRestSchedule, hydration, wbgt) {
    const recommendations = [];
    
    // Always include basic recommendations
    recommendations.push('Provide cool drinking water (10-15°C)');
    recommendations.push('Train workers on heat illness recognition');
    recommendations.push('Establish buddy system for heat monitoring');
    
    // Risk level specific
    if (riskAssessment.level === 'Moderate Risk' || riskAssessment.level === 'High Risk') {
        recommendations.push('Implement work-rest schedule: ' + workRestSchedule.cycleTime);
        recommendations.push('Provide shaded or air-conditioned rest areas');
        recommendations.push('Monitor workers for heat illness symptoms');
    }
    
    if (riskAssessment.level === 'High Risk' || riskAssessment.level === 'Very High Risk') {
        recommendations.push('Assign dedicated heat safety observer');
        recommendations.push('Provide cooling vests or other personal cooling');
        recommendations.push('Schedule hardest work for cooler parts of day');
    }
    
    if (riskAssessment.level === 'Extreme Risk') {
        recommendations.push('STOP ALL WORK IN HEAT');
        recommendations.push('Implement emergency response plan');
        recommendations.push('Provide immediate cooling facilities');
    }
    
    // Hydration recommendations
    recommendations.push(`Hydration: ${hydration.schedule}`);
    recommendations.push(`Drink ${hydration.preShift}L before shift, ${hydration.duringWork}L during work`);
    
    // Acclimatization recommendations
    if (wbgt > 26) {
        recommendations.push('Implement 7-day acclimatization program for new workers');
        recommendations.push('Gradually increase workload over first week');
    }
    
    // Clothing recommendations
    recommendations.push('Provide light-colored, loose-fitting clothing');
    recommendations.push('Allow for removal of unnecessary PPE during breaks');
    
    return recommendations;
}

function displayHeatResults(results) {
    const resultBox = document.getElementById('heat-result');
    if (!resultBox) return;
    
    // Update environmental values
    updateElementText('.wbgt-value', `${results.wbgt.toFixed(1)}°C`, resultBox);
    updateElementText('.heat-index-value', `${results.heatIndex.toFixed(1)}°C`, resultBox);
    updateElementText('.sweat-rate-value', `${results.sweatRate.toFixed(2)} L/hr`, resultBox);
    
    // Update risk assessment
    const riskElement = resultBox.querySelector('.risk-assessment');
    if (riskElement) {
        riskElement.textContent = results.riskAssessment.level;
        riskElement.style.backgroundColor = results.riskAssessment.color;
        riskElement.style.color = results.riskAssessment.level === 'Extreme Risk' ? '#fff' : '#000';
    }
    
    updateElementText('.risk-symptoms', results.riskAssessment.symptoms, resultBox);
    updateElementText('.risk-action', results.riskAssessment.action, resultBox);
    updateElementText('.risk-score', `Risk Score: ${results.riskAssessment.score}`, resultBox);
    
    // Update work-rest schedule
    const scheduleElement = resultBox.querySelector('.work-rest-schedule');
    if (scheduleElement) {
        scheduleElement.innerHTML = `
            <div class="schedule-details">
                <i class="fas fa-clock"></i>
                <strong>${results.workRestSchedule.cycleTime}</strong>
                <br>
                <small>Work: ${results.workRestSchedule.workPercentage}% | 
                Rest: ${results.workRestSchedule.restPercentage}%</small>
            </div>
        `;
    }
    
    // Update hydration requirements
    const hydrationElement = resultBox.querySelector('.hydration-requirements');
    if (hydrationElement) {
        hydrationElement.innerHTML = `
            <div class="hydration-details">
                <i class="fas fa-tint"></i>
                <strong>Total Daily: ${results.hydration.recommendedIntake} liters</strong>
                <br>
                <small>Pre-shift: ${results.hydration.preShift}L | 
                During work: ${results.hydration.duringWork}L | 
                Hourly: ${results.hydration.perHour}L</small>
            </div>
        `;
    }
    
    // Update compliance status
    const complianceElement = resultBox.querySelector('.compliance-status');
    if (complianceElement) {
        if (results.compliance.hasViolations) {
            complianceElement.innerHTML = `
                <div class="compliance-danger">
                    <i class="fas fa-exclamation-circle"></i>
                    Regulatory Violations Identified
                    <br>
                    <small>${results.compliance.violations.join(', ')}</small>
                </div>
            `;
        } else if (results.compliance.hasWarnings) {
            complianceElement.innerHTML = `
                <div class="compliance-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    Regulatory Warnings
                    <br>
                    <small>${results.compliance.warnings.join(', ')}</small>
                </div>
            `;
        } else {
            complianceElement.innerHTML = `
                <div class="compliance-good">
                    <i class="fas fa-check-circle"></i>
                    Compliant with Heat Regulations
                </div>
            `;
        }
    }
    
    // Update environmental conditions
    updateElementText('.environmental-summary', 
        `Dry Bulb: ${results.dryBulbTemp}°C | Wet Bulb: ${results.wetBulbTemp}°C | RH: ${results.humidity}%`, 
        resultBox);
    
    updateElementText('.work-parameters', 
        `Work: ${results.workIntensity} | Clothing: ${results.clothingType} | Acclimatization: ${results.acclimatization}`, 
        resultBox);
    
    // Update recommendations
    const recommendationsElement = resultBox.querySelector('.recommendations-list');
    if (recommendationsElement) {
        recommendationsElement.innerHTML = '';
        results.recommendations.forEach(rec => {
            const li = document.createElement('li');
            const icon = rec.includes('STOP') ? 'fa-ban' : 
                        rec.includes('emergency') ? 'fa-ambulance' : 'fa-check';
            li.innerHTML = `<i class="fas ${icon}"></i> ${rec}`;
            recommendationsElement.appendChild(li);
        });
    }
    
    // Show result box
    resultBox.classList.add('active');
    
    // Scroll to results
    setTimeout(() => {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function updateHeatChart(wbgt, heatIndex, riskAssessment) {
    const canvas = document.getElementById('heat-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw risk zones
    const zones = [
        { min: 0, max: 26, color: '#28a745', label: 'Low' },
        { min: 26, max: 28, color: '#ffc107', label: 'Moderate' },
        { min: 28, max: 30, color: '#fd7e14', label: 'High' },
        { min: 30, max: 32, color: '#dc3545', label: 'Very High' },
        { min: 32, max: 40, color: '#721c24', label: 'Extreme' }
    ];
    
    const zoneHeight = 30;
    zones.forEach((zone, index) => {
        const y = index * zoneHeight;
        ctx.fillStyle = zone.color;
        ctx.fillRect(50, y, 200, zoneHeight);
        
        // Add zone label
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${zone.label} Risk (${zone.min}-${zone.max}°C)`, 150, y + zoneHeight/2 + 4);
    });
    
    // Draw WBGT indicator
    const wbgtY = ((wbgt - 20) / 20) * 150; // Scale 20-40°C to 0-150px
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(250, wbgtY);
    ctx.lineTo(270, wbgtY - 5);
    ctx.lineTo(270, wbgtY + 5);
    ctx.closePath();
    ctx.fill();
    
    // Add WBGT label
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`WBGT: ${wbgt.toFixed(1)}°C`, 300, wbgtY + 4);
    
    // Draw Heat Index indicator
    const heatIndexY = ((heatIndex - 20) / 30) * 150; // Scale 20-50°C
    ctx.fillStyle = '#007bff';
    ctx.beginPath();
    ctx.arc(50, heatIndexY, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Add Heat Index label
    ctx.fillStyle = '#007bff';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`Heat Index: ${heatIndex.toFixed(1)}°C`, 30, heatIndexY - 10);
    
    // Add current risk level marker
    const riskIndex = zones.findIndex(z => wbgt >= z.min && wbgt < z.max);
    if (riskIndex >= 0) {
        const riskY = riskIndex * zoneHeight + zoneHeight/2;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(150, riskY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.font = 'bold 10px Arial';
        ctx.fillText('Current', 150, riskY + 20);
    }
}

function initHydrationCalculator() {
    const calculateHydrationBtn = document.getElementById('calculate-hydration');
    if (calculateHydrationBtn) {
        calculateHydrationBtn.addEventListener('click', calculatePersonalHydration);
    }
}

function calculatePersonalHydration() {
    const weight = parseFloat(document.getElementById('body-weight').value);
    const activityLevel = document.getElementById('activity-level').value;
    const temperature = parseFloat(document.getElementById('env-temperature').value);
    
    if (isNaN(weight) || weight <= 0) {
        showNotification('Please enter a valid body weight.', 'error');
        return;
    }
    
    if (isNaN(temperature) || temperature < -20 || temperature > 50) {
        showNotification('Please enter a valid temperature.', 'error');
        return;
    }
    
    // Calculate base hydration needs
    let baseIntake = weight * 0.03; // 30ml per kg body weight
    
    // Adjust for activity level
    switch(activityLevel) {
        case 'sedentary': baseIntake *= 1.0; break;
        case 'light': baseIntake *= 1.2; break;
        case 'moderate': baseIntake *= 1.5; break;
        case 'heavy': baseIntake *= 2.0; break;
        case 'very-heavy': baseIntake *= 2.5; break;
    }
    
    // Adjust for temperature
    if (temperature > 25) {
        baseIntake *= 1 + ((temperature - 25) * 0.04); // 4% increase per degree above 25°C
    }
    
    // Convert to liters
    baseIntake = baseIntake / 1000;
    
    // Calculate urine color guidance
    const urineColorGuide = [
        { color: '#e6f7ff', description: 'Clear: Overhydrated, reduce intake' },
        { color: '#b3e0ff', description: 'Pale Yellow: Well hydrated' },
        { color: '#66c2ff', description: 'Yellow: Normal hydration' },
        { color: '#3399ff', description: 'Dark Yellow: Mild dehydration' },
        { color: '#0066cc', description: 'Amber: Dehydrated, drink water' },
        { color: '#004080', description: 'Brown: Severely dehydrated, medical attention' }
    ];
    
    displayHydrationResults(baseIntake.toFixed(2), urineColorGuide);
}

function displayHydrationResults(intake, urineGuide) {
    const resultsDiv = document.getElementById('hydration-results');
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = `
        <div class="hydration-result">
            <h4><i class="fas fa-tint"></i> Personal Hydration Plan</h4>
            <p><strong>Daily Water Requirement:</strong> ${intake} liters</p>
            <p><strong>Hourly During Work:</strong> ${(intake / 8).toFixed(2)} liters</p>
            <p><strong>Pre-shift:</strong> 0.5 liters</p>
            <p><strong>Post-shift:</strong> 0.5 liters</p>
            
            <h5>Urine Color Guide</h5>
            <div class="urine-guide">
                ${urineGuide.map(item => `
                    <div class="urine-color">
                        <span class="color-box" style="background-color: ${item.color}"></span>
                        <span class="color-desc">${item.description}</span>
                    </div>
                `).join('')}
            </div>
            
            <p class="text-muted"><small>Note: These are general guidelines. Individual needs may vary.</small></p>
        </div>
    `;
    
    resultsDiv.classList.add('active');
}

function updateElementText(selector, text, parent = document) {
    const element = parent.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

function resetHeatStress() {
    const form = document.querySelector('#heat-form');
    const resultBox = document.getElementById('heat-result');
    const hydrationResults = document.getElementById('hydration-results');
    
    if (form) form.reset();
    if (resultBox) resultBox.classList.remove('active');
    if (hydrationResults) {
        hydrationResults.classList.remove('active');
        hydrationResults.innerHTML = '';
    }
    
    showNotification('Heat stress calculator has been reset.', 'info');
}

// Export for use in main.js
window.HeatCalculator = {
    calculate: calculateHeatStress,
    reset: resetHeatStress
};
