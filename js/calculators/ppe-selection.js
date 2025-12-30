// ppe-selection.js - PPE Selection Calculator Logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize PPE selection calculator
    const calculateBtn = document.getElementById('calculate-ppe');
    const resetBtn = document.getElementById('reset-ppe');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculatePPESelection);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetPPESelection);
    }
    
    // Initialize hazard assessment
    initHazardAssessment();
    
    // Load PPE database
    loadPPEDatabase();
    
    console.log('PPE Selection Calculator initialized');
});

function calculatePPESelection() {
    // Get task information
    const taskDescription = document.getElementById('task-description').value.trim();
    const industryType = document.getElementById('industry-type').value;
    const taskDuration = parseFloat(document.getElementById('task-duration').value) || 8;
    
    // Get hazard assessments
    const hazards = getSelectedHazards();
    
    // Get environmental conditions
    const temperature = parseFloat(document.getElementById('temperature').value) || 20;
    const humidity = parseFloat(document.getElementById('humidity').value) || 50;
    const visibility = document.getElementById('visibility').value;
    
    // Validate inputs
    if (!taskDescription) {
        showNotification('Please enter a task description.', 'error');
        return;
    }
    
    if (hazards.length === 0) {
        showNotification('Please select at least one hazard type.', 'error');
        return;
    }
    
    // Assess hazard levels
    const hazardAssessment = assessHazardLevels(hazards, taskDuration, industryType);
    
    // Determine required PPE categories
    const requiredPPE = determineRequiredPPE(hazardAssessment);
    
    // Select specific PPE items
    const selectedPPE = selectPPEItems(requiredPPE, hazards, temperature, humidity);
    
    // Calculate protection factors
    const protectionFactors = calculateProtectionFactors(selectedPPE, hazardAssessment);
    
    // Assess compliance
    const compliance = assessCompliance(requiredPPE, selectedPPE, industryType);
    
    // Calculate comfort and usability
    const comfortAssessment = assessComfort(selectedPPE, temperature, humidity, taskDuration);
    
    // Generate recommendations
    const recommendations = generatePPERecommendations(
        hazardAssessment, 
        selectedPPE, 
        compliance,
        comfortAssessment
    );
    
    // Calculate cost estimate
    const costEstimate = estimatePPECost(selectedPPE, taskDuration);
    
    // Display results
    displayPPEResults({
        taskDescription: taskDescription,
        industryType: industryType,
        taskDuration: taskDuration,
        hazards: hazards,
        hazardAssessment: hazardAssessment,
        requiredPPE: requiredPPE,
        selectedPPE: selectedPPE,
        protectionFactors: protectionFactors,
        compliance: compliance,
        comfortAssessment: comfortAssessment,
        recommendations: recommendations,
        costEstimate: costEstimate,
        temperature: temperature,
        humidity: humidity,
        visibility: visibility
    });
    
    // Update PPE visualization
    updatePPEVisualization(selectedPPE, protectionFactors);
    
    showNotification('PPE selection completed!', 'success');
}

function getSelectedHazards() {
    const checkboxes = document.querySelectorAll('input[name="hazards"]:checked');
    const hazards = Array.from(checkboxes).map(cb => ({
        type: cb.value,
        level: document.getElementById(`${cb.value}-level`)?.value || 'medium'
    }));
    
    return hazards;
}

function assessHazardLevels(hazards, taskDuration, industryType) {
    const assessment = {};
    let overallRisk = 'Low';
    
    hazards.forEach(hazard => {
        let level, color, description;
        let riskScore = 0;
        
        switch(hazard.type) {
            case 'chemical':
                riskScore = hazard.level === 'high' ? 9 : hazard.level === 'medium' ? 6 : 3;
                if (riskScore >= 7) {
                    level = 'High';
                    color = '#dc3545';
                    description = 'Chemical exposure requires highest level protection';
                } else if (riskScore >= 4) {
                    level = 'Medium';
                    color = '#ffc107';
                    description = 'Chemical exposure requires adequate protection';
                } else {
                    level = 'Low';
                    color = '#28a745';
                    description = 'Minimal chemical exposure risk';
                }
                break;
                
            case 'mechanical':
                riskScore = hazard.level === 'high' ? 8 : hazard.level === 'medium' ? 5 : 2;
                if (riskScore >= 6) {
                    level = 'High';
                    color = '#dc3545';
                    description = 'High risk of impact/cut hazards';
                } else if (riskScore >= 3) {
                    level = 'Medium';
                    color = '#ffc107';
                    description = 'Moderate mechanical hazard risk';
                } else {
                    level = 'Low';
                    color = '#28a745';
                    description = 'Low mechanical hazard risk';
                }
                break;
                
            case 'thermal':
                riskScore = hazard.level === 'high' ? 7 : hazard.level === 'medium' ? 4 : 1;
                if (riskScore >= 5) {
                    level = 'High';
                    color = '#dc3545';
                    description = 'Extreme temperature exposure';
                } else if (riskScore >= 2) {
                    level = 'Medium';
                    color = '#ffc107';
                    description = 'Moderate temperature exposure';
                } else {
                    level = 'Low';
                    color = '#28a745';
                    description = 'Normal temperature conditions';
                }
                break;
                
            case 'biological':
                riskScore = hazard.level === 'high' ? 10 : hazard.level === 'medium' ? 7 : 4;
                if (riskScore >= 8) {
                    level = 'High';
                    color = '#dc3545';
                    description = 'Biological hazard requires isolation';
                } else if (riskScore >= 5) {
                    level = 'Medium';
                    color = '#ffc107';
                    description = 'Biological hazard requires protection';
                } else {
                    level = 'Low';
                    color = '#28a745';
                    description = 'Low biological hazard risk';
                }
                break;
                
            case 'radiological':
                riskScore = hazard.level === 'high' ? 9 : hazard.level === 'medium' ? 6 : 3;
                if (riskScore >= 7) {
                    level = 'High';
                    color = '#dc3545';
                    description = 'Radiological hazard - specialized PPE required';
                } else if (riskScore >= 4) {
                    level = 'Medium';
                    color = '#ffc107';
                    description = 'Moderate radiological hazard';
                } else {
                    level = 'Low';
                    color = '#28a745';
                    description = 'Low radiological hazard risk';
                }
                break;
                
            case 'electrical':
                riskScore = hazard.level === 'high' ? 8 : hazard.level === 'medium' ? 5 : 2;
                if (riskScore >= 6) {
                    level = 'High';
                    color = '#dc3545';
                    description = 'Electrical hazard - arc flash/electrocution risk';
                } else if (riskScore >= 3) {
                    level = 'Medium';
                    color = '#ffc107';
                    description = 'Electrical hazard present';
                } else {
                    level = 'Low';
                    color = '#28a745';
                    description = 'Minimal electrical hazard';
                }
                break;
                
            case 'fall':
                riskScore = hazard.level === 'high' ? 9 : hazard.level === 'medium' ? 6 : 3;
                if (riskScore >= 7) {
                    level = 'High';
                    color = '#dc3545';
                    description = 'Fall hazard requires full arrest system';
                } else if (riskScore >= 4) {
                    level = 'Medium';
                    color = '#ffc107';
                    description = 'Fall hazard requires restraint system';
                } else {
                    level = 'Low';
                    color = '#28a745';
                    description = 'Minimal fall hazard';
                }
                break;
                
            default:
                level = 'Low';
                color = '#6c757d';
                description = 'General hazard';
                riskScore = 2;
        }
        
        // Adjust for task duration
        if (taskDuration > 4) riskScore *= 1.2;
        if (taskDuration > 8) riskScore *= 1.5;
        
        assessment[hazard.type] = {
            level: level,
            color: color,
            description: description,
            riskScore: riskScore
        };
        
        // Update overall risk
        if (riskScore > 7) overallRisk = 'High';
        else if (riskScore > 4 && overallRisk !== 'High') overallRisk = 'Medium';
    });
    
    assessment.overallRisk = overallRisk;
    
    return assessment;
}

function determineRequiredPPE(hazardAssessment) {
    const requiredCategories = new Set();
    
    // Head protection
    if (hazardAssessment.mechanical || hazardAssessment.electrical || hazardAssessment.fall) {
        requiredCategories.add('head');
    }
    
    // Eye protection
    if (hazardAssessment.chemical || hazardAssessment.mechanical || 
        hazardAssessment.thermal || hazardAssessment.radiological) {
        requiredCategories.add('eye');
    }
    
    // Hearing protection
    if (hazardAssessment.mechanical && hazardAssessment.mechanical.riskScore > 5) {
        requiredCategories.add('hearing');
    }
    
    // Respiratory protection
    if (hazardAssessment.chemical || hazardAssessment.biological || 
        hazardAssessment.radiological) {
        requiredCategories.add('respiratory');
    }
    
    // Hand protection
    if (hazardAssessment.chemical || hazardAssessment.mechanical || 
        hazardAssessment.thermal) {
        requiredCategories.add('hand');
    }
    
    // Foot protection
    if (hazardAssessment.mechanical || hazardAssessment.electrical || 
        hazardAssessment.chemical) {
        requiredCategories.add('foot');
    }
    
    // Body protection
    if (hazardAssessment.chemical || hazardAssessment.thermal || 
        hazardAssessment.radiological || hazardAssessment.biological) {
        requiredCategories.add('body');
    }
    
    // Fall protection
    if (hazardAssessment.fall && hazardAssessment.fall.riskScore > 4) {
        requiredCategories.add('fall');
    }
    
    return Array.from(requiredCategories);
}

function selectPPEItems(requiredCategories, hazards, temperature, humidity) {
    const selectedItems = {};
    
    requiredCategories.forEach(category => {
        switch(category) {
            case 'head':
                selectedItems.head = selectHeadProtection(hazards);
                break;
            case 'eye':
                selectedItems.eye = selectEyeProtection(hazards);
                break;
            case 'hearing':
                selectedItems.hearing = selectHearingProtection(hazards);
                break;
            case 'respiratory':
                selectedItems.respiratory = selectRespiratoryProtection(hazards);
                break;
            case 'hand':
                selectedItems.hand = selectHandProtection(hazards, temperature);
                break;
            case 'foot':
                selectedItems.foot = selectFootProtection(hazards);
                break;
            case 'body':
                selectedItems.body = selectBodyProtection(hazards, temperature);
                break;
            case 'fall':
                selectedItems.fall = selectFallProtection(hazards);
                break;
        }
    });
    
    return selectedItems;
}

function selectHeadProtection(hazards) {
    const hasChemical = hazards.some(h => h.type === 'chemical');
    const hasElectrical = hazards.some(h => h.type === 'electrical');
    const hasImpact = hazards.some(h => h.type === 'mechanical');
    
    if (hasElectrical) {
        return {
            type: 'Class E Hard Hat',
            description: 'Electrical hazard protection (20,000V)',
            standard: 'ANSI/ISEA Z89.1 Class E',
            protectionLevel: 'High',
            image: 'hard-hat-electrical.png'
        };
    } else if (hasChemical) {
        return {
            type: 'Bump Cap with Face Shield',
            description: 'Chemical splash protection',
            standard: 'ANSI/ISEA Z89.1 Type 1',
            protectionLevel: 'Medium',
            image: 'bump-cap.png'
        };
    } else if (hasImpact) {
        return {
            type: 'Type II Hard Hat',
            description: 'Lateral impact protection',
            standard: 'ANSI/ISEA Z89.1 Type II',
            protectionLevel: 'High',
            image: 'hard-hat-type2.png'
        };
    } else {
        return {
            type: 'Basic Hard Hat',
            description: 'General head protection',
            standard: 'ANSI/ISEA Z89.1 Type I',
            protectionLevel: 'Low',
            image: 'hard-hat-basic.png'
        };
    }
}

function selectEyeProtection(hazards) {
    const hasChemical = hazards.some(h => h.type === 'chemical');
    const hasImpact = hazards.some(h => h.type === 'mechanical');
    const hasRadiation = hazards.some(h => h.type === 'radiological');
    
    if (hasChemical) {
        return {
            type: 'Chemical Splash Goggles',
            description: 'Sealed splash protection',
            standard: 'ANSI Z87.1 D3',
            protectionLevel: 'High',
            image: 'goggles-chemical.png'
        };
    } else if (hasImpact) {
        return {
            type: 'Safety Glasses with Side Shields',
            description: 'Impact protection',
            standard: 'ANSI Z87.1+',
            protectionLevel: 'Medium',
            image: 'safety-glasses.png'
        };
    } else if (hasRadiation) {
        return {
            type: 'Welding Helmet',
            description: 'UV/IR radiation protection',
            standard: 'ANSI Z87.1 & Z49.1',
            protectionLevel: 'High',
            image: 'welding-helmet.png'
        };
    } else {
        return {
            type: 'Basic Safety Glasses',
            description: 'General eye protection',
            standard: 'ANSI Z87.1',
            protectionLevel: 'Low',
            image: 'safety-glasses-basic.png'
        };
    }
}

function selectRespiratoryProtection(hazards) {
    const hasChemical = hazards.some(h => h.type === 'chemical');
    const hasBiological = hazards.some(h => h.type === 'biological');
    const hazardLevel = hazards.find(h => h.type === 'chemical' || h.type === 'biological')?.level || 'low';
    
    if (hazardLevel === 'high' || (hasChemical && hasBiological)) {
        return {
            type: 'PAPR with Full Facepiece',
            description: 'Powered Air Purifying Respirator',
            standard: 'NIOSH 42 CFR 84',
            protectionLevel: 'Very High',
            protectionFactor: 1000,
            image: 'papr.png'
        };
    } else if (hazardLevel === 'medium') {
        return {
            type: 'Half Mask Respirator with Cartridges',
            description: 'Chemical/organic vapor protection',
            standard: 'NIOSH 42 CFR 84',
            protectionLevel: 'High',
            protectionFactor: 10,
            image: 'half-mask.png'
        };
    } else if (hasChemical || hasBiological) {
        return {
            type: 'N95 Respirator',
            description: 'Particulate filtration',
            standard: 'NIOSH 42 CFR 84',
            protectionLevel: 'Medium',
            protectionFactor: 10,
            image: 'n95-mask.png'
        };
    } else {
        return {
            type: 'Disposable Dust Mask',
            description: 'Light dust protection',
            standard: 'NIOSH 42 CFR 84',
            protectionLevel: 'Low',
            protectionFactor: 5,
            image: 'dust-mask.png'
        };
    }
}

function selectHandProtection(hazards, temperature) {
    const hasChemical = hazards.some(h => h.type === 'chemical');
    const hasCut = hazards.some(h => h.type === 'mechanical');
    const hasThermal = hazards.some(h => h.type === 'thermal');
    
    if (hasChemical) {
        return {
            type: 'Chemical Resistant Gloves',
            description: 'Nitrile or neoprene, 18 mil thickness',
            standard: 'ANSI/ISEA 105-2016',
            protectionLevel: 'High',
            temperatureRating: temperature + '°C',
            image: 'gloves-chemical.png'
        };
    } else if (hasCut) {
        return {
            type: 'Cut Resistant Gloves',
            description: 'Level 5 cut protection',
            standard: 'ANSI/ISEA 105-2016 A9',
            protectionLevel: 'High',
            temperatureRating: temperature + '°C',
            image: 'gloves-cut.png'
        };
    } else if (hasThermal) {
        return {
            type: 'Heat Resistant Gloves',
            description: 'Kevlar/leather, 500°F rating',
            standard: 'ANSI/ISEA 105-2016',
            protectionLevel: 'High',
            temperatureRating: 'High',
            image: 'gloves-heat.png'
        };
    } else if (temperature < 10) {
        return {
            type: 'Insulated Gloves',
            description: 'Cold weather protection',
            standard: 'ANSI/ISEA 105-2016',
            protectionLevel: 'Medium',
            temperatureRating: 'Low',
            image: 'gloves-insulated.png'
        };
    } else {
        return {
            type: 'General Purpose Gloves',
            description: 'Leather or fabric',
            standard: 'ANSI/ISEA 105-2016',
            protectionLevel: 'Low',
            temperatureRating: temperature + '°C',
            image: 'gloves-general.png'
        };
    }
}

function selectBodyProtection(hazards, temperature) {
    const hasChemical = hazards.some(h => h.type === 'chemical');
    const hasBiological = hazards.some(h => h.type === 'biological');
    const hasThermal = hazards.some(h => h.type === 'thermal');
    
    if (hasChemical || hasBiological) {
        return {
            type: 'Chemical Protective Coverall',
            description: 'Type 3/4 with sealed seams',
            standard: 'NFPA 1991/1992',
            protectionLevel: 'High',
            material: 'Tychem or similar',
            image: 'coverall-chemical.png'
        };
    } else if (hasThermal) {
        return {
            type: 'Flame Resistant Coverall',
            description: 'Arc flash protection',
            standard: 'NFPA 70E',
            protectionLevel: 'High',
            material: 'Nomex or FR cotton',
            image: 'coverall-fr.png'
        };
    } else if (temperature > 30) {
        return {
            type: 'Cooling Vest',
            description: 'Heat stress prevention',
            standard: 'General Use',
            protectionLevel: 'Medium',
            material: 'Mesh with cooling packs',
            image: 'cooling-vest.png'
        };
    } else if (temperature < 5) {
        return {
            type: 'Insulated Jacket',
            description: 'Cold weather protection',
            standard: 'General Use',
            protectionLevel: 'Medium',
            material: 'Insulated synthetic',
            image: 'insulated-jacket.png'
        };
    } else {
        return {
            type: 'High Visibility Vest',
            description: 'Visibility enhancement',
            standard: 'ANSI/ISEA 107-2020',
            protectionLevel: 'Low',
            material: 'Fluorescent mesh',
            image: 'hi-vis-vest.png'
        };
    }
}

function calculateProtectionFactors(selectedPPE, hazardAssessment) {
    const factors = {};
    let overallFactor = 1;
    
    Object.keys(selectedPPE).forEach(category => {
        const ppe = selectedPPE[category];
        let factor;
        
        switch(ppe.protectionLevel) {
            case 'Very High': factor = 0.95; break;
            case 'High': factor = 0.85; break;
            case 'Medium': factor = 0.70; break;
            case 'Low': factor = 0.50; break;
            default: factor = 0.30;
        }
        
        // Adjust for specific hazards
        if (category === 'respiratory' && ppe.protectionFactor) {
            factor = 1 - (1 / ppe.protectionFactor);
        }
        
        factors[category] = factor;
        overallFactor *= (1 - factor);
    });
    
    factors.overall = 1 - overallFactor;
    
    return factors;
}

function assessCompliance(requiredCategories, selectedPPE, industryType) {
    const compliance = {
        osha: [],
        ansi: [],
        nfpa: [],
        missing: [],
        warnings: []
    };
    
    // Check for missing PPE
    requiredCategories.forEach(category => {
        if (!selectedPPE[category]) {
            compliance.missing.push(category);
        }
    });
    
    // Check standards compliance
    Object.keys(selectedPPE).forEach(category => {
        const ppe = selectedPPE[category];
        
        if (ppe.standard) {
            if (ppe.standard.includes('ANSI')) compliance.ansi.push(`${category}: ${ppe.standard}`);
            if (ppe.standard.includes('NFPA')) compliance.nfpa.push(`${category}: ${ppe.standard}`);
            if (ppe.standard.includes('NIOSH') || ppe.standard.includes('OSHA')) {
                compliance.osha.push(`${category}: Compliant`);
            }
        } else {
            compliance.warnings.push(`${category}: No standard specified`);
        }
    });
    
    // Industry-specific checks
    if (industryType === 'construction') {
        if (!selectedPPE.head) compliance.missing.push('head (hard hat required)');
        if (!selectedPPE.foot) compliance.missing.push('foot (safety boots required)');
    }
    
    if (industryType === 'healthcare') {
        if (!selectedPPE.respiratory && !selectedPPE.eye) {
            compliance.warnings.push('Consider face shield for droplet protection');
        }
    }
    
    compliance.isCompliant = compliance.missing.length === 0;
    
    return compliance;
}

function assessComfort(selectedPPE, temperature, humidity, duration) {
    let comfortScore = 100;
    const issues = [];
    
    // Temperature impact
    if (temperature > 25 && selectedPPE.body) {
        comfortScore -= 20;
        issues.push('Body protection may cause heat stress in warm conditions');
    }
    
    if (temperature < 10 && !selectedPPE.body) {
        comfortScore -= 15;
        issues.push('Consider additional insulation for cold conditions');
    }
    
    // Duration impact
    if (duration > 4) {
        comfortScore -= 10;
        issues.push('Extended wear may reduce comfort');
    }
    
    if (duration > 8) {
        comfortScore -= 15;
        issues.push('Consider PPE rotation for tasks >8 hours');
    }
    
    // Combination impact
    const ppeCount = Object.keys(selectedPPE).length;
    if (ppeCount > 4) {
        comfortScore -= (ppeCount - 4) * 5;
        issues.push('Multiple PPE items may reduce mobility');
    }
    
    // Determine comfort level
    let comfortLevel, color;
    if (comfortScore >= 80) {
        comfortLevel = 'Good';
        color = '#28a745';
    } else if (comfortScore >= 60) {
        comfortLevel = 'Moderate';
        color = '#ffc107';
    } else if (comfortScore >= 40) {
        comfortLevel = 'Poor';
        color = '#fd7e14';
    } else {
        comfortLevel = 'Uncomfortable';
        color = '#dc3545';
    }
    
    return {
        level: comfortLevel,
        color: color,
        score: comfortScore,
        issues: issues
    };
}

function estimatePPECost(selectedPPE, taskDuration) {
    let totalCost = 0;
    const itemCosts = {};
    
    const costRanges = {
        head: { low: 15, high: 50 },
        eye: { low: 5, high: 100 },
        hearing: { low: 2, high: 200 },
        respiratory: { low: 1, high: 1000 },
        hand: { low: 5, high: 50 },
        foot: { low: 50, high: 200 },
        body: { low: 20, high: 300 },
        fall: { low: 100, high: 500 }
    };
    
    Object.keys(selectedPPE).forEach(category => {
        const ppe = selectedPPE[category];
        let cost;
        
        switch(ppe.protectionLevel) {
            case 'Very High': cost = costRanges[category].high * 0.8; break;
            case 'High': cost = costRanges[category].high * 0.6; break;
            case 'Medium': cost = (costRanges[category].low + costRanges[category].high) / 2; break;
            case 'Low': cost = costRanges[category].low * 1.2; break;
            default: cost = costRanges[category].low;
        }
        
        // Adjust for specialty items
        if (ppe.type.includes('PAPR')) cost = 800;
        if (ppe.type.includes('Welding')) cost = 150;
        
        itemCosts[category] = cost;
        totalCost += cost;
    });
    
    // Estimate daily usage cost (assuming 10% of purchase price per day)
    const dailyCost = totalCost * 0.1;
    const taskCost = dailyCost * (taskDuration / 8);
    
    return {
        purchase: totalCost,
        daily: dailyCost,
        task: taskCost,
        items: itemCosts
    };
}

function generatePPERecommendations(hazardAssessment, selectedPPE, compliance, comfortAssessment) {
    const recommendations = [];
    
    // Always include basic recommendations
    recommendations.push('Conduct PPE fit testing for all items');
    recommendations.push('Train workers on proper donning/doffing procedures');
    recommendations.push('Establish PPE inspection and maintenance program');
    
    // Hazard-specific recommendations
    if (hazardAssessment.overallRisk === 'High') {
        recommendations.push('Implement buddy system for high-risk tasks');
        recommendations.push('Consider additional engineering controls');
        recommendations.push('Establish emergency response procedures');
    }
    
    // Compliance recommendations
    if (!compliance.isCompliant) {
        recommendations.push(`Address missing PPE: ${compliance.missing.join(', ')}`);
    }
    
    if (compliance.warnings.length > 0) {
        recommendations.push(`Address standards issues: ${compliance.warnings.join(', ')}`);
    }
    
    // Comfort recommendations
    if (comfortAssessment.level === 'Poor' || comfortAssessment.level === 'Uncomfortable') {
        comfortAssessment.issues.forEach(issue => {
            recommendations.push(`Address comfort: ${issue}`);
        });
        recommendations.push('Consider PPE with better ergonomics');
        recommendations.push('Implement regular comfort breaks');
    }
    
    // Maintenance recommendations
    recommendations.push('Establish PPE replacement schedule based on manufacturer guidelines');
    recommendations.push('Store PPE properly to maintain effectiveness');
    
    return recommendations;
}

function displayPPEResults(results) {
    const resultBox = document.getElementById('ppe-result');
    if (!resultBox) return;
    
    // Update hazard assessment
    updateElementText('.overall-risk', results.hazardAssessment.overallRisk, resultBox);
    
    const hazardList = resultBox.querySelector('.hazard-list');
    if (hazardList) {
        hazardList.innerHTML = '';
        results.hazards.forEach(hazard => {
            const assessment = results.hazardAssessment[hazard.type];
            if (assessment) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="hazard-type">${hazard.type}</span>
                    <span class="hazard-level" style="background-color: ${assessment.color}">
                        ${assessment.level}
                    </span>
                `;
                hazardList.appendChild(li);
            }
        });
    }
    
    // Update selected PPE
    const ppeGrid = resultBox.querySelector('.ppe-grid');
    if (ppeGrid) {
        ppeGrid.innerHTML = '';
        Object.keys(results.selectedPPE).forEach(category => {
            const ppe = results.selectedPPE[category];
            const protection = results.protectionFactors[category] * 100;
            
            const div = document.createElement('div');
            div.className = 'ppe-item';
            div.innerHTML = `
                <div class="ppe-icon">
                    <i class="fas fa-${getPPEIcon(category)}"></i>
                </div>
                <div class="ppe-details">
                    <h5>${ppe.type}</h5>
                    <p>${ppe.description}</p>
                    <div class="ppe-meta">
                        <span class="standard">${ppe.standard || 'No standard'}</span>
                        <span class="protection">${protection.toFixed(0)}% protection</span>
                    </div>
                </div>
            `;
            ppeGrid.appendChild(div);
        });
    }
    
    // Update protection factors
    updateElementText('.overall-protection', 
        `${(results.protectionFactors.overall * 100).toFixed(1)}%`, resultBox);
    
    // Update compliance
    const complianceElement = resultBox.querySelector('.compliance-status');
    if (complianceElement) {
        if (results.compliance.isCompliant) {
            complianceElement.innerHTML = `
                <div class="compliance-good">
                    <i class="fas fa-check-circle"></i>
                    PPE Selection Compliant
                </div>
            `;
        } else {
            complianceElement.innerHTML = `
                <div class="compliance-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    Missing: ${results.compliance.missing.join(', ')}
                </div>
            `;
        }
    }
    
    // Update comfort assessment
    const comfortElement = resultBox.querySelector('.comfort-assessment');
    if (comfortElement) {
        comfortElement.innerHTML = `
            <div class="comfort-rating" style="background-color: ${results.comfortAssessment.color}">
                ${results.comfortAssessment.level} (${results.comfortAssessment.score}/100)
            </div>
            ${results.comfortAssessment.issues.length > 0 ? 
                `<ul class="comfort-issues">
                    ${results.comfortAssessment.issues.map(issue => 
                        `<li><i class="fas fa-exclamation-circle"></i> ${issue}</li>`
                    ).join('')}
                </ul>` : ''}
        `;
    }
    
    // Update cost estimate
    updateElementText('.cost-estimate', 
        `$${results.costEstimate.purchase.toFixed(2)} (purchase) | $${results.costEstimate.task.toFixed(2)} (task cost)`, 
        resultBox);
    
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
    
    // Show result box
    resultBox.classList.add('active');
    
    // Scroll to results
    setTimeout(() => {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function getPPEIcon(category) {
    const icons = {
        head: 'hard-hat',
        eye: 'glasses',
        hearing: 'deaf',
        respiratory: 'lungs',
        hand: 'hand-paper',
        foot: 'shoe-prints',
        body: 'tshirt',
        fall: 'anchor'
    };
    
    return icons[category] || 'shield-alt';
}

function updatePPEVisualization(selectedPPE, protectionFactors) {
    const canvas = document.getElementById('ppe-visualization');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw human silhouette
    drawSilhouette(ctx);
    
    // Draw PPE items on silhouette
    const positions = {
        head: { x: 150, y: 60, radius: 20 },
        eye: { x: 150, y: 85, radius: 15 },
        hearing: { x: 120, y: 85, radius: 10 },
        respiratory: { x: 150, y: 100, radius: 15 },
        body: { x: 150, y: 140, width: 60, height: 80 },
        hand: { x: 100, y: 140, radius: 12 },
        foot: { x: 140, y: 220, width: 20, height: 30 },
        fall: { x: 150, y: 180, radius: 15 }
    };
    
    Object.keys(selectedPPE).forEach(category => {
        const ppe = selectedPPE[category];
        const pos = positions[category];
        if (!pos) return;
        
        // Draw PPE item
        ctx.fillStyle = getPPEColor(ppe.protectionLevel);
        ctx.globalAlpha = 0.7;
        
        if (pos.radius) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, pos.radius, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(pos.x - pos.width/2, pos.y - pos.height/2, pos.width, pos.height);
        }
        
        ctx.globalAlpha = 1;
        
        // Add protection factor
        const protection = protectionFactors[category] * 100;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${protection.toFixed(0)}%`, pos.x, pos.y + 4);
    });
    
    // Add overall protection
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Overall Protection: ${(protectionFactors.overall * 100).toFixed(1)}%`, 150, 20);
}

function drawSilhouette(ctx) {
    // Head
    ctx.beginPath();
    ctx.arc(150, 70, 25, 0, Math.PI * 2);
    ctx.fillStyle = '#e9ecef';
    ctx.fill();
    
    // Body
    ctx.fillRect(130, 95, 40, 60);
    
    // Arms
    ctx.fillRect(90, 100, 40, 15);
    ctx.fillRect(180, 100, 40, 15);
    
    // Legs
    ctx.fillRect(135, 155, 15, 40);
    ctx.fillRect(150, 155, 15, 40);
    
    // Outline
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function getPPEColor(protectionLevel) {
    switch(protectionLevel) {
        case 'Very High': return '#28a745';
        case 'High': return '#7bd34f';
        case 'Medium': return '#ffc107';
        case 'Low': return '#fd7e14';
        default: return '#6c757d';
    }
}

function initHazardAssessment() {
    const hazardCheckboxes = document.querySelectorAll('input[name="hazards"]');
    hazardCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const levelSelect = document.getElementById(`${this.value}-level`);
            if (levelSelect) {
                levelSelect.disabled = !this.checked;
            }
        });
    });
}

function loadPPEDatabase() {
    // This would typically load from an API or JSON file
    // For now, we'll just log that it's loaded
    console.log('PPE database loaded');
}

function resetPPESelection() {
    const form = document.querySelector('#ppe-form');
    const resultBox = document.getElementById('ppe-result');
    
    if (form) {
        form.reset();
        
        // Re-enable all level selects
        document.querySelectorAll('select[id$="-level"]').forEach(select => {
            select.disabled = true;
        });
    }
    
    if (resultBox) resultBox.classList.remove('active');
    
    showNotification('PPE selection calculator has been reset.', 'info');
}

// Export for use in main.js
window.PPECalculator = {
    calculate: calculatePPESelection,
    reset: resetPPESelection
};
