// noise-exposure.js - Noise Exposure Calculator Logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize noise exposure calculator
    const calculateBtn = document.getElementById('calculate-noise');
    const resetBtn = document.getElementById('reset-noise');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateNoiseExposure);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetNoiseExposure);
    }
    
    // Add dB level examples
    addDbLevelExamples();
    
    console.log('Noise Exposure Calculator initialized');
});

function calculateNoiseExposure() {
    // Get form values
    const noiseLevel = parseFloat(document.getElementById('noise-level').value);
    const exposureDuration = parseFloat(document.getElementById('exposure-duration').value);
    const workDaysPerWeek = parseInt(document.getElementById('work-days').value) || 5;
    const hearingProtection = document.getElementById('hearing-protection').checked;
    const protectionRating = parseFloat(document.getElementById('protection-rating').value) || 0;
    
    // Validate inputs
    if (isNaN(noiseLevel) || noiseLevel < 50 || noiseLevel > 140) {
        showNotification('Please enter a valid noise level between 50-140 dB.', 'error');
        return;
    }
    
    if (isNaN(exposureDuration) || exposureDuration <= 0 || exposureDuration > 24) {
        showNotification('Please enter a valid exposure duration (0.1-24 hours).', 'error');
        return;
    }
    
    // Calculate daily noise dose
    const permissibleExposureTime = calculatePermissibleExposure(noiseLevel);
    const dailyDose = (exposureDuration / permissibleExposureTime) * 100;
    
    // Calculate weekly exposure (considering days per week)
    const weeklyExposure = exposureDuration * workDaysPerWeek;
    const weeklyPermissible = permissibleExposureTime * 5; // OSHA standard week
    const weeklyDose = (weeklyExposure / weeklyPermissible) * 100;
    
    // Apply hearing protection if used
    let protectedLevel = noiseLevel;
    let protectedDose = dailyDose;
    let protectionEffective = false;
    
    if (hearingProtection && protectionRating > 0) {
        protectedLevel = Math.max(0, noiseLevel - protectionRating);
        const protectedPermissibleTime = calculatePermissibleExposure(protectedLevel);
        protectedDose = (exposureDuration / protectedPermissibleTime) * 100;
        protectionEffective = protectedDose < 100;
    }
    
    // Determine risk level and recommendations
    let riskLevel, riskColor, recommendations, actionRequired;
    
    if (dailyDose <= 50) {
        riskLevel = 'Low Risk';
        riskColor = '#28a745';
        recommendations = [
            'Noise levels are acceptable',
            'Continue routine monitoring',
            'Maintain hearing conservation program'
        ];
        actionRequired = 'None';
    } else if (dailyDose <= 100) {
        riskLevel = 'Moderate Risk';
        riskColor = '#ffc107';
        recommendations = [
            'Consider implementing engineering controls',
            'Provide hearing protection',
            'Conduct annual audiometric testing'
        ];
        actionRequired = 'Recommended';
    } else {
        riskLevel = 'High Risk';
        riskColor = '#dc3545';
        recommendations = [
            'Implement engineering controls immediately',
            'Mandatory hearing protection use',
            'Post warning signs',
            'Conduct quarterly audiometric testing',
            'Implement hearing conservation program'
        ];
        actionRequired = 'Required';
    }
    
    // Calculate Time-Weighted Average (TWA)
    const twa = calculateTWA(dailyDose);
    
    // Display results
    displayNoiseResults({
        noiseLevel: noiseLevel,
        exposureDuration: exposureDuration,
        permissibleTime: permissibleExposureTime.toFixed(2),
        dailyDose: dailyDose.toFixed(1),
        weeklyDose: weeklyDose.toFixed(1),
        twa: twa.toFixed(1),
        riskLevel: riskLevel,
        riskColor: riskColor,
        recommendations: recommendations,
        actionRequired: actionRequired,
        hearingProtection: hearingProtection,
        protectionRating: protectionRating,
        protectedLevel: protectedLevel.toFixed(1),
        protectedDose: protectedDose.toFixed(1),
        protectionEffective: protectionEffective,
        workDaysPerWeek: workDaysPerWeek
    });
    
    // Update charts
    updateNoiseCharts(dailyDose, protectedDose, noiseLevel, protectedLevel);
    
    showNotification('Noise exposure assessment completed!', 'success');
}

function calculatePermissibleExposure(noiseLevel) {
    // OSHA permissible exposure time formula: T = 8 / 2^((L-85)/3)
    return 8 / Math.pow(2, (noiseLevel - 85) / 3);
}

function calculateTWA(dailyDose) {
    // TWA = 85 + 3 * log2(D/100)
    return 85 + (3 * Math.log2(dailyDose / 100));
}

function displayNoiseResults(results) {
    const resultBox = document.getElementById('noise-result');
    if (!resultBox) return;
    
    // Update main values
    updateElementText('.dose-value', `${results.dailyDose}%`, resultBox);
    updateElementText('.twa-value', `${results.twa} dB`, resultBox);
    updateElementText('.permissible-value', `${results.permissibleTime} hours`, resultBox);
    
    // Update risk level
    const riskLevelElement = resultBox.querySelector('.risk-level');
    if (riskLevelElement) {
        riskLevelElement.textContent = results.riskLevel;
        riskLevelElement.style.backgroundColor = results.riskColor;
        riskLevelElement.style.color = '#000';
    }
    
    // Update action required
    updateElementText('.action-required', results.actionRequired, resultBox);
    
    // Update protection info
    const protectionInfo = resultBox.querySelector('.protection-info');
    if (protectionInfo) {
        if (results.hearingProtection) {
            protectionInfo.innerHTML = `
                <div class="protection-effective ${results.protectionEffective ? 'effective' : 'ineffective'}">
                    <i class="fas fa-${results.protectionEffective ? 'check-circle' : 'exclamation-triangle'}"></i>
                    Protection reduces exposure to ${results.protectedLevel} dB
                    <br>
                    <small>Protected dose: ${results.protectedDose}%</small>
                </div>
            `;
        } else {
            protectionInfo.innerHTML = `
                <div class="protection-warning">
                    <i class="fas fa-exclamation-circle"></i>
                    No hearing protection used
                </div>
            `;
        }
    }
    
    // Update recommendations
    const recommendationsElement = resultBox.querySelector('.recommendations-list');
    if (recommendationsElement) {
        recommendationsElement.innerHTML = '';
        results.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${rec}`;
            recommendationsElement.appendChild(li);
        });
    }
    
    // Update weekly exposure
    updateElementText('.weekly-exposure', `${results.weeklyDose}%`, resultBox);
    
    // Show result box
    resultBox.classList.add('active');
    
    // Scroll to results
    setTimeout(() => {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function updateNoiseCharts(dailyDose, protectedDose, noiseLevel, protectedLevel) {
    // Update dose gauge
    updateDoseGauge(dailyDose, protectedDose);
    
    // Update level comparison
    updateLevelComparison(noiseLevel, protectedLevel);
}

function updateDoseGauge(dailyDose, protectedDose) {
    const gauge = document.getElementById('dose-gauge');
    if (!gauge) return;
    
    const ctx = gauge.getContext('2d');
    
    // Clear previous gauge
    ctx.clearRect(0, 0, gauge.width, gauge.height);
    
    // Draw gauge background
    drawGaugeArc(ctx, 100, 270, 90, '#e9ecef', 20);
    
    // Draw safe zone (0-50%)
    drawGaugeArc(ctx, 50, 270, 90, '#28a745', 20);
    
    // Draw warning zone (50-100%)
    drawGaugeArc(ctx, 100, 270 + 90, 90, '#ffc107', 20);
    
    // Draw danger zone (100%+)
    if (dailyDose > 100) {
        drawGaugeArc(ctx, Math.min(dailyDose, 200) - 100, 270 + 180, 90, '#dc3545', 20);
    }
    
    // Draw current dose needle
    drawNeedle(ctx, Math.min(dailyDose, 200), 270, 90);
    
    // Draw protected dose marker
    if (protectedDose > 0 && protectedDose !== dailyDose) {
        drawProtectedMarker(ctx, protectedDose, 270, 90);
    }
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    ctx.fillText('0%', gauge.width * 0.25, gauge.height * 0.7);
    ctx.fillText('50%', gauge.width * 0.5, gauge.height * 0.25);
    ctx.fillText('100%', gauge.width * 0.75, gauge.height * 0.7);
    ctx.fillText('200%', gauge.width * 0.5, gauge.height * 0.9);
}

function drawGaugeArc(ctx, value, startAngle, totalAngle, color, thickness) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    const endAngle = startAngle + (value / 100) * (totalAngle / 100);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 
            degToRad(startAngle), degToRad(endAngle));
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.stroke();
}

function drawNeedle(ctx, value, startAngle, totalAngle) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 30;
    
    const angle = startAngle + (Math.min(value, 200) / 100) * (totalAngle / 100);
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + radius * Math.cos(degToRad(angle)),
        centerY + radius * Math.sin(degToRad(angle))
    );
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
}

function drawProtectedMarker(ctx, value, startAngle, totalAngle) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;
    
    const angle = startAngle + (Math.min(value, 200) / 100) * (totalAngle / 100);
    
    ctx.beginPath();
    ctx.arc(
        centerX + radius * Math.cos(degToRad(angle)),
        centerY + radius * Math.sin(degToRad(angle)),
        5, 0, Math.PI * 2
    );
    ctx.fillStyle = '#007bff';
    ctx.fill();
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function updateLevelComparison(noiseLevel, protectedLevel) {
    const comparison = document.getElementById('level-comparison');
    if (!comparison) return;
    
    const ctx = comparison.getContext('2d');
    ctx.clearRect(0, 0, comparison.width, comparison.height);
    
    const barWidth = 30;
    const maxHeight = 150;
    const startX = 50;
    
    // Draw OSHA action levels
    drawReferenceLine(ctx, 85, 'Action Level', '#28a745', startX + 120);
    drawReferenceLine(ctx, 90, 'PEL', '#ffc107', startX + 120);
    
    // Draw noise level bar
    const noiseHeight = (noiseLevel / 140) * maxHeight;
    drawBar(ctx, startX, maxHeight - noiseHeight, barWidth, noiseHeight, '#dc3545', 'Actual Noise Level');
    
    // Draw protected level bar if applicable
    if (protectedLevel < noiseLevel) {
        const protectedHeight = (protectedLevel / 140) * maxHeight;
        drawBar(ctx, startX + 60, maxHeight - protectedHeight, barWidth, protectedHeight, '#007bff', 'With Protection');
    }
}

function drawBar(ctx, x, y, width, height, color, label) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    
    // Add label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + width / 2, y + height + 20);
    
    // Add value
    ctx.fillStyle = '#fff';
    ctx.fillText(`${Math.round((height / 150) * 140)} dB`, x + width / 2, y + height / 2);
}

function drawReferenceLine(ctx, level, label, color, x) {
    const y = 150 - (level / 140) * 150;
    
    ctx.beginPath();
    ctx.moveTo(x - 100, y);
    ctx.lineTo(x + 100, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = color;
    ctx.font = '11px Arial';
    ctx.fillText(`${label} (${level} dB)`, x + 110, y - 5);
}

function addDbLevelExamples() {
    const examples = [
        { level: '30', description: 'Whisper, quiet library' },
        { level: '60', description: 'Normal conversation' },
        { level: '85', description: 'OSHA Action Level (8 hours)' },
        { level: '90', description: 'OSHA PEL (8 hours)' },
        { level: '100', description: 'Power tools, lawn mower' },
        { level: '115', description: 'Rock concert, chainsaw' },
        { level: '140', description: 'Jet engine (pain threshold)' }
    ];
    
    const container = document.getElementById('db-examples');
    if (container) {
        container.innerHTML = examples.map(example => `
            <div class="db-example">
                <span class="db-level">${example.level} dB</span>
                <span class="db-description">${example.description}</span>
            </div>
        `).join('');
    }
}

function updateElementText(selector, text, parent = document) {
    const element = parent.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

function resetNoiseExposure() {
    const form = document.querySelector('#noise-form');
    const resultBox = document.getElementById('noise-result');
    
    if (form) form.reset();
    if (resultBox) resultBox.classList.remove('active');
    
    showNotification('Noise exposure calculator has been reset.', 'info');
}

// Export for use in main.js
window.NoiseCalculator = {
    calculate: calculateNoiseExposure,
    reset: resetNoiseExposure
};
