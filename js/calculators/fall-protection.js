// fall-protection.js - Fall Protection Calculator Logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize fall protection calculator
    const calculateBtn = document.getElementById('calculate-fall');
    const resetBtn = document.getElementById('reset-fall');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateFallProtection);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFallProtection);
    }
    
    // Initialize anchor point calculator
    initAnchorPointCalculator();
    
    console.log('Fall Protection Calculator initialized');
});

function calculateFallProtection() {
    // Get form values
    const fallHeight = parseFloat(document.getElementById('fall-height').value);
    const lanyardLength = parseFloat(document.getElementById('lanyard-length').value);
    const decelerationDistance = parseFloat(document.getElementById('deceleration-distance').value) || 1.0;
    const workerWeight = parseFloat(document.getElementById('worker-weight').value) || 100;
    const anchorHeight = parseFloat(document.getElementById('anchor-height').value) || 0;
    const surfaceType = document.getElementById('surface-type').value;
    const systemType = document.getElementById('system-type').value;
    
    // Validate inputs
    if (isNaN(fallHeight) || fallHeight <= 0) {
        showNotification('Please enter a valid fall height.', 'error');
        return;
    }
    
    if (isNaN(lanyardLength) || lanyardLength <= 0) {
        showNotification('Please enter a valid lanyard length.', 'error');
        return;
    }
    
    // Calculate free fall distance
    const freeFallDistance = calculateFreeFallDistance(fallHeight, anchorHeight, lanyardLength);
    
    // Calculate total fall distance
    const totalFallDistance = freeFallDistance + decelerationDistance;
    
    // Calculate fall clearance required
    const clearanceRequired = calculateClearanceRequired(totalFallDistance, surfaceType);
    
    // Calculate impact force
    const impactForce = calculateImpactForce(workerWeight, freeFallDistance, decelerationDistance);
    
    // Calculate clearance safety factor
    const safetyFactor = calculateSafetyFactor(fallHeight, clearanceRequired);
    
    // Check OSHA compliance
    const oshaCompliance = checkOSHACompliance(freeFallDistance, impactForce, systemType);
    
    // Determine risk level
    const riskAssessment = assessFallRisk(fallHeight, freeFallDistance, impactForce, clearanceRequired);
    
    // Generate recommendations
    const recommendations = generateFallRecommendations(
        fallHeight, 
        freeFallDistance, 
        impactForce, 
        clearanceRequired, 
        oshaCompliance,
        systemType
    );
    
    // Display results
    displayFallResults({
        fallHeight: fallHeight,
        anchorHeight: anchorHeight,
        lanyardLength: lanyardLength,
        freeFallDistance: freeFallDistance,
        decelerationDistance: decelerationDistance,
        totalFallDistance: totalFallDistance,
        clearanceRequired: clearanceRequired,
        workerWeight: workerWeight,
        impactForce: impactForce,
        safetyFactor: safetyFactor,
        surfaceType: surfaceType,
        systemType: systemType,
        oshaCompliance: oshaCompliance,
        riskAssessment: riskAssessment,
        recommendations: recommendations
    });
    
    // Update visualization
    updateFallVisualization(fallHeight, freeFallDistance, totalFallDistance, clearanceRequired);
    
    showNotification('Fall protection analysis completed!', 'success');
}

function calculateFreeFallDistance(fallHeight, anchorHeight, lanyardLength) {
    // Free fall distance = Fall height - Anchor height + Lanyard length + Harness stretch
    const harnessStretch = 0.5; // Estimated harness stretch in meters
    return Math.max(0, fallHeight - anchorHeight + lanyardLength + harnessStretch);
}

function calculateClearanceRequired(totalFallDistance, surfaceType) {
    // Clearance required = Total fall distance + Safety margin + D-ring shift + Harness stretch
    const safetyMargin = 1.0; // 1 meter safety margin
    const dRingShift = 0.5; // D-ring shift distance
    
    let surfaceFactor = 0;
    switch(surfaceType) {
        case 'concrete': surfaceFactor = 0.3; break;
        case 'steel': surfaceFactor = 0.5; break;
        case 'ground': surfaceFactor = 0.8; break;
        case 'water': surfaceFactor = 2.0; break;
        default: surfaceFactor = 0.5;
    }
    
    return totalFallDistance + safetyMargin + dRingShift + surfaceFactor;
}

function calculateImpactForce(workerWeight, freeFallDistance, decelerationDistance) {
    // Impact force = (Worker weight × g × Free fall distance) / Deceleration distance
    const g = 9.81; // Gravity m/s²
    return (workerWeight * g * freeFallDistance) / decelerationDistance;
}

function calculateSafetyFactor(fallHeight, clearanceRequired) {
    // Safety factor = Available clearance / Required clearance
    const availableClearance = fallHeight * 1.5; // Assume 50% extra clearance available
    return availableClearage / clearanceRequired;
}

function checkOSHACompliance(freeFallDistance, impactForce, systemType) {
    const violations = [];
    const warnings = [];
    const compliant = [];
    
    // OSHA 1926.502 - Fall Protection Systems Criteria
    if (freeFallDistance > 1.8) { // 6 feet
        violations.push('Free fall distance exceeds OSHA limit of 1.8m (6ft)');
    } else {
        compliant.push('Free fall distance within OSHA limits');
    }
    
    if (impactForce > 8000) { // 1800 lbs force
        violations.push('Impact force exceeds OSHA limit of 8kN (1800 lbf)');
    } else if (impactForce > 6000) {
        warnings.push('Impact force approaching OSHA limit - consider shock absorber');
    } else {
        compliant.push('Impact force within OSHA limits');
    }
    
    // System-specific requirements
    if (systemType === 'personal' && freeFallDistance > 0.6) {
        warnings.push('Personal fall arrest system should limit free fall to 0.6m (2ft)');
    }
    
    if (systemType === 'restraint' && freeFallDistance > 0) {
        violations.push('Fall restraint system should prevent any free fall');
    }
    
    return {
        violations: violations,
        warnings: warnings,
        compliant: compliant,
        isCompliant: violations.length === 0,
        hasWarnings: warnings.length > 0
    };
}

function assessFallRisk(fallHeight, freeFallDistance, impactForce, clearanceRequired) {
    let riskLevel, riskColor, riskDescription;
    
    const riskScore = (fallHeight / 3) + (freeFallDistance / 2) + (impactForce / 2000);
    
    if (riskScore < 3) {
        riskLevel = 'Low Risk';
        riskColor = '#28a745';
        riskDescription = 'Minimal fall risk with current setup';
    } else if (riskScore < 6) {
        riskLevel = 'Moderate Risk';
        riskColor = '#ffc107';
        riskDescription = 'Moderate fall risk - review required';
    } else if (riskScore < 10) {
        riskLevel = 'High Risk';
        riskColor = '#fd7e14';
        riskDescription = 'High fall risk - immediate action needed';
    } else {
        riskLevel = 'Extreme Risk';
        riskColor = '#dc3545';
        riskDescription = 'Extreme fall risk - STOP WORK';
    }
    
    return {
        level: riskLevel,
        color: riskColor,
        description: riskDescription,
        score: riskScore.toFixed(1)
    };
}

function generateFallRecommendations(fallHeight, freeFallDistance, impactForce, clearanceRequired, oshaCompliance, systemType) {
    const recommendations = [];
    
    // Always include basic recommendations
    recommendations.push('Inspect all fall protection equipment before each use');
    recommendations.push('Ensure proper training for all workers at heights');
    recommendations.push('Develop rescue plan for fallen workers');
    
    // Height-based recommendations
    if (fallHeight > 3) {
        recommendations.push('Use guardrails or safety nets for work above 3 meters');
    }
    
    if (fallHeight > 6) {
        recommendations.push('Implement 100% tie-off policy for work above 6 meters');
    }
    
    // Free fall distance recommendations
    if (freeFallDistance > 1.8) {
        recommendations.push('Reduce lanyard length to limit free fall distance');
        recommendations.push('Consider using self-retracting lifelines');
    }
    
    if (freeFallDistance > 0.6 && systemType === 'personal') {
        recommendations.push('Use shorter lanyard or reposition anchor point');
    }
    
    // Impact force recommendations
    if (impactForce > 6000) {
        recommendations.push('Use shock-absorbing lanyard to reduce impact force');
        recommendations.push('Ensure anchor point can withstand 22kN (5000 lbf)');
    }
    
    // Clearance recommendations
    if (clearanceRequired > fallHeight * 0.8) {
        recommendations.push('Increase working height to ensure adequate clearance');
        recommendations.push('Consider using horizontal lifeline system');
    }
    
    // OSHA compliance recommendations
    if (oshaCompliance.violations.length > 0) {
        recommendations.push('Immediately address OSHA compliance violations');
    }
    
    if (oshaCompliance.warnings.length > 0) {
        recommendations.push('Address OSHA warning items promptly');
    }
    
    // System-specific recommendations
    if (systemType === 'restraint') {
        recommendations.push('Ensure restraint system prevents reaching fall edge');
    }
    
    if (systemType === 'arrest') {
        recommendations.push('Verify clearance below working area is sufficient');
        recommendations.push('Test rescue equipment and procedures regularly');
    }
    
    return recommendations;
}

function displayFallResults(results) {
    const resultBox = document.getElementById('fall-result');
    if (!resultBox) return;
    
    // Update main values
    updateElementText('.free-fall-value', `${results.freeFallDistance.toFixed(2)} m`, resultBox);
    updateElementText('.total-fall-value', `${results.totalFallDistance.toFixed(2)} m`, resultBox);
    updateElementText('.clearance-value', `${results.clearanceRequired.toFixed(2)} m`, resultBox);
    updateElementText('.impact-force-value', `${results.impactForce.toFixed(0)} N`, resultBox);
    
    // Update risk assessment
    const riskElement = resultBox.querySelector('.risk-assessment');
    if (riskElement) {
        riskElement.textContent = results.riskAssessment.level;
        riskElement.style.backgroundColor = results.riskAssessment.color;
        riskElement.style.color = results.riskAssessment.level === 'Extreme Risk' ? '#fff' : '#000';
    }
    
    updateElementText('.risk-description', results.riskAssessment.description, resultBox);
    updateElementText('.risk-score', `Risk Score: ${results.riskAssessment.score}`, resultBox);
    
    // Update safety factor
    const safetyElement = resultBox.querySelector('.safety-factor');
    if (safetyElement) {
        if (results.safetyFactor >= 2.0) {
            safetyElement.innerHTML = `
                <div class="safety-good">
                    <i class="fas fa-shield-alt"></i>
                    Safety Factor: ${results.safetyFactor.toFixed(1)} (Adequate)
                </div>
            `;
        } else if (results.safetyFactor >= 1.5) {
            safetyElement.innerHTML = `
                <div class="safety-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    Safety Factor: ${results.safetyFactor.toFixed(1)} (Marginal)
                </div>
            `;
        } else {
            safetyElement.innerHTML = `
                <div class="safety-danger">
                    <i class="fas fa-skull-crossbones"></i>
                    Safety Factor: ${results.safetyFactor.toFixed(1)} (INSUFFICIENT)
                </div>
            `;
        }
    }
    
    // Update OSHA compliance
    const oshaElement = resultBox.querySelector('.osha-compliance');
    if (oshaElement) {
        if (results.oshaCompliance.isCompliant) {
            oshaElement.innerHTML = `
                <div class="compliance-good">
                    <i class="fas fa-check-circle"></i>
                    OSHA Compliant
                    <br>
                    <small>${results.oshaCompliance.compliant.join(', ')}</small>
                </div>
            `;
        } else {
            oshaElement.innerHTML = `
                <div class="compliance-danger">
                    <i class="fas fa-exclamation-circle"></i>
                    OSHA VIOLATIONS
                    <br>
                    <small>${results.oshaCompliance.violations.join(', ')}</small>
                </div>
            `;
        }
    }
    
    // Update system details
    updateElementText('.system-details', 
        `${results.systemType} system on ${results.surfaceType}`, resultBox);
    
    updateElementText('.worker-details', 
        `${results.workerWeight} kg worker with ${results.lanyardLength} m lanyard`, resultBox);
    
    // Update recommendations
    const recommendationsElement = resultBox.querySelector('.recommendations-list');
    if (recommendationsElement) {
        recommendationsElement.innerHTML = '';
        results.recommendations.forEach(rec => {
            const li = document.createElement('li');
            const icon = rec.includes('STOP') ? 'fa-ban' : 
                        rec.includes('Immediately') ? 'fa-exclamation-triangle' : 'fa-check';
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

function updateFallVisualization(fallHeight, freeFallDistance, totalFallDistance, clearanceRequired) {
    const canvas = document.getElementById('fall-visualization');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const scale = 150 / Math.max(fallHeight, clearanceRequired);
    const groundY = 180;
    
    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(50, groundY, 200, 20);
    
    // Draw worker position
    const workerY = groundY - (fallHeight * scale);
    ctx.fillStyle = '#007bff';
    ctx.beginPath();
    ctx.arc(150, workerY, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw lanyard
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, workerY);
    ctx.lineTo(150, workerY + (freeFallDistance * scale));
    ctx.stroke();
    
    // Draw anchor point
    ctx.fillStyle = '#dc3545';
    ctx.beginPath();
    ctx.arc(150, workerY + (freeFallDistance * scale), 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw free fall zone
    ctx.fillStyle = 'rgba(255, 193, 7, 0.3)';
    ctx.fillRect(100, workerY, 100, freeFallDistance * scale);
    
    // Draw deceleration zone
    ctx.fillStyle = 'rgba(220, 53, 69, 0.3)';
    const decelerationStart = workerY + (freeFallDistance * scale);
    ctx.fillRect(100, decelerationStart, 100, (totalFallDistance - freeFallDistance) * scale);
    
    // Draw clearance zone
    ctx.fillStyle = 'rgba(40, 167, 69, 0.3)';
    const clearanceStart = groundY - (clearanceRequired * scale);
    ctx.fillRect(100, clearanceStart, 100, clearanceRequired * scale);
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Free fall label
    ctx.fillText(`Free Fall: ${freeFallDistance.toFixed(1)}m`, 150, workerY + (freeFallDistance * scale / 2));
    
    // Deceleration label
    ctx.fillText(`Deceleration: ${(totalFallDistance - freeFallDistance).toFixed(1)}m`, 
        150, decelerationStart + ((totalFallDistance - freeFallDistance) * scale / 2));
    
    // Clearance label
    ctx.fillText(`Clearance Required: ${clearanceRequired.toFixed(1)}m`, 
        150, clearanceStart + (clearanceRequired * scale / 2));
    
    // Height labels
    ctx.fillText(`Work Height: ${fallHeight.toFixed(1)}m`, 250, workerY);
    ctx.fillText(`Ground`, 250, groundY);
    
    // Add distance lines
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    // Free fall line
    ctx.beginPath();
    ctx.moveTo(80, workerY);
    ctx.lineTo(100, workerY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(80, workerY + (freeFallDistance * scale));
    ctx.lineTo(100, workerY + (freeFallDistance * scale));
    ctx.stroke();
    
    // Total fall line
    ctx.beginPath();
    ctx.moveTo(80, workerY + (totalFallDistance * scale));
    ctx.lineTo(100, workerY + (totalFallDistance * scale));
    ctx.stroke();
    
    // Clearance line
    ctx.beginPath();
    ctx.moveTo(80, groundY);
    ctx.lineTo(100, groundY);
    ctx.stroke();
    
    ctx.setLineDash([]);
}

function initAnchorPointCalculator() {
    const calculateAnchorBtn = document.getElementById('calculate-anchor');
    if (calculateAnchorBtn) {
        calculateAnchorBtn.addEventListener('click', calculateAnchorStrength);
    }
}

function calculateAnchorStrength() {
    const anchorType = document.getElementById('anchor-type').value;
    const material = document.getElementById('anchor-material').value;
    const diameter = parseFloat(document.getElementById('anchor-diameter').value);
    const depth = parseFloat(document.getElementById('anchor-depth').value);
    
    if (isNaN(diameter) || diameter <= 0 || isNaN(depth) || depth <= 0) {
        showNotification('Please enter valid anchor dimensions.', 'error');
        return;
    }
    
    let strength;
    switch(anchorType) {
        case 'beam-clamp':
            strength = calculateBeamClampStrength(material, diameter);
            break;
        case 'concrete-anchor':
            strength = calculateConcreteAnchorStrength(material, diameter, depth);
            break;
        case 'roof-anchor':
            strength = calculateRoofAnchorStrength(material, diameter);
            break;
        default:
            strength = { capacity: 0, description: 'Unknown anchor type' };
    }
    
    displayAnchorResults(strength);
}

function calculateBeamClampStrength(material, diameter) {
    const baseCapacity = 1000; // kg
    let capacity = baseCapacity;
    
    if (material === 'steel') capacity *= 2;
    if (diameter >= 20) capacity *= 1.5;
    
    return {
        capacity: capacity,
        description: `Beam clamp capacity: ${capacity} kg`,
        oshaCompliant: capacity >= 2268, // 5000 lbs
        recommendation: capacity >= 2268 ? 
            'Meets OSHA 2268 kg (5000 lbs) requirement' :
            'Does not meet OSHA requirements - use stronger anchor'
    };
}

function calculateConcreteAnchorStrength(material, diameter, depth) {
    const baseCapacity = 500 * diameter * depth; // Simplified calculation
    let capacity = baseCapacity;
    
    if (material === 'epoxy') capacity *= 1.5;
    if (material === 'wedge') capacity *= 1.2;
    
    return {
        capacity: capacity,
        description: `Concrete anchor capacity: ${capacity.toFixed(0)} kg`,
        oshaCompliant: capacity >= 2268,
        recommendation: `Installation depth: ${depth}mm, Diameter: ${diameter}mm`
    };
}

function calculateRoofAnchorStrength(material, diameter) {
    const baseCapacity = 800; // kg
    let capacity = baseCapacity;
    
    if (material === 'through-bolt') capacity *= 2;
    if (diameter >= 12) capacity *= 1.3;
    
    return {
        capacity: capacity,
        description: `Roof anchor capacity: ${capacity} kg`,
        oshaCompliant: capacity >= 2268,
        recommendation: capacity >= 2268 ? 
            'Suitable for fall arrest' :
            'Only suitable for restraint systems'
    };
}

function displayAnchorResults(strength) {
    const resultsDiv = document.getElementById('anchor-results');
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = `
        <div class="anchor-result ${strength.oshaCompliant ? 'compliant' : 'non-compliant'}">
            <h4><i class="fas fa-anchor"></i> Anchor Strength Analysis</h4>
            <p>${strength.description}</p>
            <p><strong>OSHA Compliance:</strong> 
                ${strength.oshaCompliant ? 
                    '<span class="text-success">Compliant</span>' : 
                    '<span class="text-danger">Non-Compliant</span>'}
            </p>
            <p><strong>Recommendation:</strong> ${strength.recommendation}</p>
            <p><small>Note: Always conduct pull testing for critical applications</small></p>
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

function resetFallProtection() {
    const form = document.querySelector('#fall-form');
    const resultBox = document.getElementById('fall-result');
    const anchorResults = document.getElementById('anchor-results');
    
    if (form) form.reset();
    if (resultBox) resultBox.classList.remove('active');
    if (anchorResults) {
        anchorResults.classList.remove('active');
        anchorResults.innerHTML = '';
    }
    
    showNotification('Fall protection calculator has been reset.', 'info');
}

// Export for use in main.js
window.FallCalculator = {
    calculate: calculateFallProtection,
    reset: resetFallProtection
};
