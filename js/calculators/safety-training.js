// safety-training.js - Safety Training Calculator Logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize safety training calculator
    const calculateBtn = document.getElementById('calculate-training');
    const resetBtn = document.getElementById('reset-training');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateSafetyTraining);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSafetyTraining);
    }
    
    // Initialize training needs assessment
    initTrainingNeedsAssessment();
    
    // Load training database
    loadTrainingDatabase();
    
    console.log('Safety Training Calculator initialized');
});

function calculateSafetyTraining() {
    // Get organization parameters
    const companySize = document.getElementById('company-size').value;
    const industryType = document.getElementById('industry-type').value;
    const location = document.getElementById('location').value;
    
    // Get workforce parameters
    const totalEmployees = parseInt(document.getElementById('total-employees').value) || 0;
    const newHires = parseInt(document.getElementById('new-hires').value) || 0;
    const turnoverRate = parseFloat(document.getElementById('turnover-rate').value) || 0;
    const experienceLevel = document.getElementById('experience-level').value;
    
    // Get current training status
    const currentTrainingHours = parseFloat(document.getElementById('current-training').value) || 0;
    const trainingFrequency = document.getElementById('training-frequency').value;
    const trainingMethod = document.getElementById('training-method').value;
    const certificationRequired = document.getElementById('certification-required').checked;
    
    // Get regulatory requirements
    const regulations = Array.from(document.querySelectorAll('input[name="regulations"]:checked'))
                            .map(cb => cb.value);
    
    // Validate inputs
    if (totalEmployees <= 0) {
        showNotification('Please enter a valid number of total employees.', 'error');
        return;
    }
    
    // Calculate training needs
    const trainingNeeds = calculateTrainingNeeds(
        companySize, 
        industryType, 
        regulations,
        totalEmployees,
        newHires
    );
    
    // Calculate training hours required
    const hoursRequired = calculateTrainingHours(trainingNeeds, experienceLevel, certificationRequired);
    
    // Calculate training costs
    const trainingCosts = calculateTrainingCosts(
        hoursRequired, 
        trainingMethod, 
        totalEmployees,
        companySize
    );
    
    // Assess training effectiveness
    const effectiveness = assessTrainingEffectiveness(
        currentTrainingHours, 
        hoursRequired.total,
        trainingMethod,
        trainingFrequency
    );
    
    // Calculate compliance status
    const compliance = checkTrainingCompliance(
        trainingNeeds, 
        hoursRequired, 
        regulations,
        location
    );
    
    // Determine ROI potential
    const roiAnalysis = calculateTrainingROI(
        trainingCosts.total,
        totalEmployees,
        industryType,
        turnoverRate
    );
    
    // Generate training plan
    const trainingPlan = generateTrainingPlan(
        trainingNeeds, 
        hoursRequired, 
        trainingMethod,
        effectiveness
    );
    
    // Generate recommendations
    const recommendations = generateTrainingRecommendations(
        effectiveness, 
        compliance, 
        roiAnalysis,
        trainingCosts
    );
    
    // Display results
    displayTrainingResults({
        companySize: companySize,
        industryType: industryType,
        location: location,
        totalEmployees: totalEmployees,
        newHires: newHires,
        turnoverRate: turnoverRate,
        experienceLevel: experienceLevel,
        currentTrainingHours: currentTrainingHours,
        trainingFrequency: trainingFrequency,
        trainingMethod: trainingMethod,
        certificationRequired: certificationRequired,
        regulations: regulations,
        trainingNeeds: trainingNeeds,
        hoursRequired: hoursRequired,
        trainingCosts: trainingCosts,
        effectiveness: effectiveness,
        compliance: compliance,
        roiAnalysis: roiAnalysis,
        trainingPlan: trainingPlan,
        recommendations: recommendations
    });
    
    // Update training chart
    updateTrainingChart(trainingNeeds, hoursRequired, effectiveness);
    
    showNotification('Safety training analysis completed!', 'success');
}

function calculateTrainingNeeds(companySize, industryType, regulations, totalEmployees, newHires) {
    const needs = [];
    const mandatory = [];
    const recommended = [];
    
    // OSHA mandatory training requirements
    const oshaRequirements = [
        'Hazard Communication',
        'Emergency Action Plan',
        'Fire Prevention',
        'Personal Protective Equipment',
        'Lockout/Tagout',
        'Electrical Safety',
        'Machine Guarding',
        'Bloodborne Pathogens',
        'Confined Space',
        'Fall Protection',
        'Respiratory Protection',
        'Hearing Conservation'
    ];
    
    // Industry-specific requirements
    const industryRequirements = {
        construction: [
            'Scaffold Safety',
            'Excavation Safety',
            'Crane Safety',
            'Steel Erection',
            'Powered Industrial Trucks'
        ],
        manufacturing: [
            'Process Safety Management',
            'Machine Safety',
            'Chemical Safety',
            'Noise Control',
            'Ergonomics'
        ],
        healthcare: [
            'Infection Control',
            'Sharps Safety',
            'Patient Handling',
            'Radiation Safety',
            'Laboratory Safety'
        ],
        oil_gas: [
            'Process Safety',
            'H2S Safety',
            'Well Control',
            'Offshore Safety',
            'Hot Work'
        ],
        transportation: [
            'Defensive Driving',
            'Hazardous Materials',
            'Hours of Service',
            'Vehicle Maintenance',
            'Loading/Unloading'
        ]
    };
    
    // Add OSHA requirements
    oshaRequirements.forEach(req => {
        mandatory.push(req);
    });
    
    // Add industry-specific requirements
    const industryReqs = industryRequirements[industryType] || [];
    industryReqs.forEach(req => {
        mandatory.push(req);
    });
    
    // Add regulatory-specific requirements
    if (regulations.includes('iso45001')) {
        mandatory.push('OH&S Management System');
        mandatory.push('Risk Assessment Training');
        mandatory.push('Incident Investigation');
    }
    
    if (regulations.includes('rcra')) {
        mandatory.push('Hazardous Waste Management');
        mandatory.push('Waste Minimization');
    }
    
    if (regulations.includes('dot')) {
        mandatory.push('Hazardous Materials Transportation');
    }
    
    // Add recommended training based on company size
    if (companySize === 'large' || companySize === 'very_large') {
        recommended.push('Safety Leadership Training');
        recommended.push('Behavior-Based Safety');
        recommended.push('Root Cause Analysis');
        recommended.push('Audit and Inspection');
    }
    
    if (newHires > totalEmployees * 0.1) { // High turnover
        recommended.push('New Employee Orientation');
        recommended.push('Mentorship Program');
        recommended.push('On-the-Job Training');
    }
    
    // Calculate total training modules
    const totalModules = mandatory.length + recommended.length;
    
    return {
        mandatory: mandatory,
        recommended: recommended,
        totalModules: totalModules,
        mandatoryCount: mandatory.length,
        recommendedCount: recommended.length
    };
}

function calculateTrainingHours(trainingNeeds, experienceLevel, certificationRequired) {
    // Base hours per training type
    const baseHours = {
        'Hazard Communication': 4,
        'Emergency Action Plan': 2,
        'Fire Prevention': 2,
        'Personal Protective Equipment': 4,
        'Lockout/Tagout': 8,
        'Electrical Safety': 8,
        'Machine Guarding': 4,
        'Bloodborne Pathogens': 4,
        'Confined Space': 8,
        'Fall Protection': 8,
        'Respiratory Protection': 8,
        'Hearing Conservation': 2,
        'Scaffold Safety': 8,
        'Excavation Safety': 8,
        'Crane Safety': 16,
        'Steel Erection': 8,
        'Powered Industrial Trucks': 8,
        'Process Safety Management': 16,
        'Machine Safety': 8,
        'Chemical Safety': 8,
        'Noise Control': 4,
        'Ergonomics': 4,
        'Infection Control': 4,
        'Sharps Safety': 2,
        'Patient Handling': 8,
        'Radiation Safety': 16,
        'Laboratory Safety': 8,
        'Process Safety': 16,
        'H2S Safety': 8,
        'Well Control': 40,
        'Offshore Safety': 16,
        'Hot Work': 4,
        'Defensive Driving': 8,
        'Hazardous Materials': 8,
        'Hours of Service': 4,
        'Vehicle Maintenance': 4,
        'Loading/Unloading': 4,
        'OH&S Management System': 16,
        'Risk Assessment Training': 8,
        'Incident Investigation': 8,
        'Hazardous Waste Management': 8,
        'Waste Minimization': 4,
        'Hazardous Materials Transportation': 16,
        'Safety Leadership Training': 16,
        'Behavior-Based Safety': 8,
        'Root Cause Analysis': 8,
        'Audit and Inspection': 8,
        'New Employee Orientation': 8,
        'Mentorship Program': 4,
        'On-the-Job Training': 40
    };
    
    // Calculate mandatory hours
    let mandatoryHours = 0;
    trainingNeeds.mandatory.forEach(training => {
        mandatoryHours += baseHours[training] || 4;
    });
    
    // Calculate recommended hours
    let recommendedHours = 0;
    trainingNeeds.recommended.forEach(training => {
        recommendedHours += baseHours[training] || 4;
    });
    
    // Adjust for experience level
    let experienceFactor = 1.0;
    switch(experienceLevel) {
        case 'novice': experienceFactor = 1.5; break;
        case 'intermediate': experienceFactor = 1.0; break;
        case 'experienced': experienceFactor = 0.8; break;
        case 'expert': experienceFactor = 0.6; break;
    }
    
    // Adjust for certification
    let certificationHours = 0;
    if (certificationRequired) {
        certificationHours = 40; // Additional hours for certification prep
    }
    
    const adjustedMandatory = mandatoryHours * experienceFactor;
    const adjustedRecommended = recommendedHours * experienceFactor;
    const totalHours = adjustedMandatory + adjustedRecommended + certificationHours;
    
    // Calculate annual hours per employee
    const annualHoursPerEmployee = totalHours / 3; // Spread over 3 years
    
    return {
        mandatory: adjustedMandatory,
        recommended: adjustedRecommended,
        certification: certificationHours,
        total: totalHours,
        annualPerEmployee: annualHoursPerEmployee,
        quarterlyPerEmployee: annualHoursPerEmployee / 4
    };
}

function calculateTrainingCosts(hoursRequired, trainingMethod, totalEmployees, companySize) {
    // Cost factors per hour
    const costFactors = {
        'in-person': {
            instructor: 100,    // $ per hour
            materials: 25,
            facility: 50,
            travel: 75
        },
        'online': {
            platform: 50,      // $ per hour
            development: 100,
            administration: 25,
            support: 15
        },
        'blended': {
            instructor: 50,
            platform: 25,
            materials: 20,
            facility: 25,
            development: 50
        },
        'on-the-job': {
            mentor: 75,
            materials: 10,
            productivity: 50   // Lost productivity cost
        }
    };
    
    const factors = costFactors[trainingMethod] || costFactors['in-person'];
    
    // Calculate direct costs
    let directCosts = 0;
    Object.values(factors).forEach(factor => {
        directCosts += factor * hoursRequired.total;
    });
    
    // Calculate indirect costs (lost productivity)
    const productivityCost = totalEmployees * hoursRequired.total * 50; // $50/hour average wage
    
    // Calculate employee costs
    const employeeCost = totalEmployees * hoursRequired.annualPerEmployee * 35; // $35/hour burdened rate
    
    // Calculate development costs (one-time)
    let developmentCost = 0;
    if (trainingMethod === 'online' || trainingMethod === 'blended') {
        developmentCost = hoursRequired.total * 150; // $150/hour development
    }
    
    const totalCost = directCosts + productivityCost + employeeCost + developmentCost;
    
    // Calculate cost per employee
    const costPerEmployee = totalCost / totalEmployees;
    
    // Calculate annual cost
    const annualCost = totalCost / 3; // Spread over 3-year cycle
    
    return {
        direct: directCosts,
        productivity: productivityCost,
        employee: employeeCost,
        development: developmentCost,
        total: totalCost,
        perEmployee: costPerEmployee,
        annual: annualCost,
        method: trainingMethod
    };
}

function assessTrainingEffectiveness(currentHours, requiredHours, trainingMethod, frequency) {
    // Calculate coverage percentage
    const coverage = Math.min(100, (currentHours / requiredHours) * 100);
    
    // Method effectiveness factors
    const methodEffectiveness = {
        'in-person': 0.85,
        'blended': 0.90,
        'online': 0.75,
        'on-the-job': 0.80
    };
    
    // Frequency effectiveness factors
    const frequencyEffectiveness = {
        'daily': 0.95,
        'weekly': 0.90,
        'monthly': 0.85,
        'quarterly': 0.80,
        'yearly': 0.70,
        'as-needed': 0.60
    };
    
    const methodFactor = methodEffectiveness[trainingMethod] || 0.75;
    const frequencyFactor = frequencyEffectiveness[frequency] || 0.70;
    
    // Calculate overall effectiveness score
    const effectivenessScore = coverage * methodFactor * frequencyFactor;
    
    let effectiveness, color, description;
    
    if (effectivenessScore >= 90) {
        effectiveness = 'Excellent';
        color = '#28a745';
        description = 'Comprehensive and effective training program';
    } else if (effectivenessScore >= 80) {
        effectiveness = 'Good';
        color = '#7bd34f';
        description = 'Effective training with room for improvement';
    } else if (effectivenessScore >= 70) {
        effectiveness = 'Fair';
        color = '#ffc107';
        description = 'Basic training coverage, needs enhancement';
    } else if (effectivenessScore >= 60) {
        effectiveness = 'Poor';
        color = '#fd7e14';
        description = 'Inadequate training, significant improvements needed';
    } else {
        effectiveness = 'Very Poor';
        color = '#dc3545';
        description = 'Critical training deficiencies - immediate action required';
    }
    
    return {
        level: effectiveness,
        color: color,
        description: description,
        score: effectivenessScore.toFixed(1),
        coverage: coverage.toFixed(1),
        methodFactor: (methodFactor * 100).toFixed(0),
        frequencyFactor: (frequencyFactor * 100).toFixed(0)
    };
}

function checkTrainingCompliance(trainingNeeds, hoursRequired, regulations, location) {
    const violations = [];
    const warnings = [];
    
    // Check minimum hours compliance
    const minimumHours = {
        'usa': 10,    // Hours per year minimum
        'eu': 8,
        'canada': 12,
        'australia': 10,
        'uk': 8
    };
    
    const locationHours = minimumHours[location] || 8;
    if (hoursRequired.annualPerEmployee < locationHours) {
        violations.push(`Training hours (${hoursRequired.annualPerEmployee.toFixed(1)}) below ${locationHours} hour minimum`);
    }
    
    // Check mandatory training coverage
    if (trainingNeeds.mandatoryCount === 0) {
        warnings.push('No mandatory training identified - review requirements');
    }
    
    // Regulation-specific checks
    if (regulations.includes('osha')) {
        if (hoursRequired.total < 40) {
            warnings.push('OSHA recommends minimum 40 hours of safety training');
        }
    }
    
    if (regulations.includes('iso45001')) {
        if (!trainingNeeds.mandatory.includes('OH&S Management System')) {
            violations.push('ISO 45001 requires OH&S management system training');
        }
    }
    
    // Document requirements
    const documentationRequired = [];
    if (regulations.length > 0) {
        documentationRequired.push('Training records for all employees');
        documentationRequired.push('Certification documentation');
        documentationRequired.push('Training program evaluation records');
    }
    
    return {
        violations: violations,
        warnings: warnings,
        isCompliant: violations.length === 0,
        documentation: documentationRequired,
        minimumHours: locationHours
    };
}

function calculateTrainingROI(totalCost, totalEmployees, industryType, turnoverRate) {
    // Benefits calculation
    const averageInjuryCost = {
        construction: 75000,
        manufacturing: 50000,
        healthcare: 40000,
        oil_gas: 100000,
        transportation: 60000,
        general: 40000
    };
    
    const baseInjuryCost = averageInjuryCost[industryType] || averageInjuryCost.general;
    
    // Estimated injury reduction from effective training
    const injuryReduction = 0.3; // 30% reduction
    
    // Calculate potential savings
    const injuriesPrevented = totalEmployees * 0.05; // 5% injury rate without training
    const savingsFromInjuries = injuriesPrevented * baseInjuryCost * injuryReduction;
    
    // Turnover reduction savings
    const turnoverCost = 15000; // Average cost to replace an employee
    const turnoverReduction = 0.2; // 20% reduction
    const savingsFromTurnover = totalEmployees * turnoverRate * turnoverCost * turnoverReduction;
    
    // Productivity improvement
    const productivityImprovement = 0.05; // 5% improvement
    const averageSalary = 50000;
    const savingsFromProductivity = totalEmployees * averageSalary * productivityImprovement;
    
    // Total annual benefits
    const totalBenefits = savingsFromInjuries + savingsFromTurnover + savingsFromProductivity;
    
    // ROI calculation (3-year period)
    const roi = ((totalBenefits * 3 - totalCost) / totalCost) * 100;
    
    // Payback period
    const paybackPeriod = totalCost / totalBenefits;
    
    return {
        injurySavings: savingsFromInjuries,
        turnoverSavings: savingsFromTurnover,
        productivitySavings: savingsFromProductivity,
        totalBenefits: totalBenefits,
        roi: roi.toFixed(1),
        paybackPeriod: paybackPeriod.toFixed(1),
        costBenefitRatio: (totalBenefits / (totalCost / 3)).toFixed(2)
    };
}

function generateTrainingPlan(trainingNeeds, hoursRequired, trainingMethod, effectiveness) {
    const plan = {
        phases: [],
        timeline: {},
        resources: [],
        evaluation: []
    };
    
    // Phase 1: Mandatory Training
    plan.phases.push({
        phase: 'Phase 1: Mandatory Compliance',
        duration: 'Months 1-6',
        trainings: trainingNeeds.mandatory.slice(0, 6),
        hours: hoursRequired.mandatory * 0.5,
        priority: 'High'
    });
    
    // Phase 2: Core Safety Training
    plan.phases.push({
        phase: 'Phase 2: Core Safety Skills',
        duration: 'Months 7-12',
        trainings: trainingNeeds.mandatory.slice(6),
        hours: hoursRequired.mandatory * 0.5,
        priority: 'High'
    });
    
    // Phase 3: Advanced Training
    if (trainingNeeds.recommendedCount > 0) {
        plan.phases.push({
            phase: 'Phase 3: Advanced & Specialized',
            duration: 'Year 2',
            trainings: trainingNeeds.recommended,
            hours: hoursRequired.recommended,
            priority: 'Medium'
        });
    }
    
    // Phase 4: Refresher & Certification
    plan.phases.push({
        phase: 'Phase 4: Refresher & Certification',
        duration: 'Year 3',
        trainings: ['Annual Refresher Training', 'Certification Renewal'],
        hours: hoursRequired.total * 0.2,
        priority: 'Ongoing'
    });
    
    // Timeline
    plan.timeline = {
        immediate: 'First 30 days: High-risk training',
        shortTerm: '3-6 months: Core compliance training',
        mediumTerm: '6-12 months: Skill development',
        longTerm: '1-3 years: Advanced and specialized training'
    };
    
    // Resources needed
    plan.resources = [
        'Qualified instructors or training providers',
        'Training facilities or online platform',
        'Training materials and equipment',
        'Assessment and testing tools',
        'Record-keeping system'
    ];
    
    // Evaluation methods
    plan.evaluation = [
        'Pre- and post-training assessments',
        'Skills demonstration',
        'On-the-job observation',
        'Incident rate monitoring',
        'Employee feedback surveys',
        'Management review'
    ];
    
    return plan;
}

function generateTrainingRecommendations(effectiveness, compliance, roiAnalysis, trainingCosts) {
    const recommendations = [];
    
    // Always include basic recommendations
    recommendations.push('Develop written training program and policies');
    recommendations.push('Maintain detailed training records for all employees');
    recommendations.push('Conduct regular training needs assessments');
    
    // Effectiveness-based recommendations
    if (effectiveness.level === 'Poor' || effectiveness.level === 'Very Poor') {
        recommendations.push('Increase training hours to meet minimum requirements');
        recommendations.push('Consider blended learning approach for better retention');
        recommendations.push('Implement more frequent refresher training');
    }
    
    // Compliance recommendations
    if (!compliance.isCompliant) {
        recommendations.push('Address compliance violations immediately');
        compliance.violations.forEach(violation => {
            recommendations.push(`Fix: ${violation}`);
        });
    }
    
    // ROI-based recommendations
    if (parseFloat(roiAnalysis.roi) > 100) {
        recommendations.push('Training investment shows excellent ROI - consider expanding program');
    } else if (parseFloat(roiAnalysis.roi) < 50) {
        recommendations.push('Optimize training methods to improve ROI');
    }
    
    // Cost optimization recommendations
    if (trainingCosts.total > 100000) {
        recommendations.push('Consider online training to reduce costs');
        recommendations.push('Negotiate volume discounts with training providers');
        recommendations.push('Develop in-house training capabilities');
    }
    
    // Quality improvement recommendations
    recommendations.push('Implement Kirkpatrick model for training evaluation');
    recommendations.push('Use competency-based assessment methods');
    recommendations.push('Provide train-the-trainer programs');
    
    // Technology recommendations
    recommendations.push('Consider Learning Management System (LMS) for tracking');
    recommendations.push('Use mobile learning for remote employees');
    recommendations.push('Implement virtual reality for high-risk scenario training');
    
    return recommendations;
}

function displayTrainingResults(results) {
    const resultBox = document.getElementById('training-result');
    if (!resultBox) return;
    
    // Update training needs
    updateElementText('.training-modules', 
        `${results.trainingNeeds.totalModules} modules (${results.trainingNeeds.mandatoryCount} mandatory, ${results.trainingNeeds.recommendedCount} recommended)`, 
        resultBox);
    
    // Update hours required
    updateElementText('.total-hours', `${results.hoursRequired.total.toFixed(1)} hours`, resultBox);
    updateElementText('.annual-hours', `${results.hoursRequired.annualPerEmployee.toFixed(1)} hours/employee/year`, resultBox);
    
    // Update effectiveness
    const effectivenessElement = resultBox.querySelector('.effectiveness-rating');
    if (effectivenessElement) {
        effectivenessElement.textContent = results.effectiveness.level;
        effectivenessElement.style.backgroundColor = results.effectiveness.color;
        effectivenessElement.style.color = results.effectiveness.level === 'Very Poor' ? '#fff' : '#000';
    }
    
    updateElementText('.effectiveness-score', `${results.effectiveness.score}/100`, resultBox);
    updateElementText('.coverage-rate', `${results.effectiveness.coverage}% coverage`, resultBox);
    
    // Update costs
    updateElementText('.total-cost', `$${results.trainingCosts.total.toFixed(0)}`, resultBox);
    updateElementText('.cost-per-employee', `$${results.trainingCosts.perEmployee.toFixed(0)}/employee`, resultBox);
    updateElementText('.annual-cost', `$${results.trainingCosts.annual.toFixed(0)}/year`, resultBox);
    
    // Update ROI analysis
    updateElementText('.roi-percentage', `${results.roiAnalysis.roi}%`, resultBox);
    updateElementText('.payback-period', `${results.roiAnalysis.paybackPeriod} years`, resultBox);
    updateElementText('.cost-benefit-ratio', `1:${results.roiAnalysis.costBenefitRatio}`, resultBox);
    
    // Update compliance
    const complianceElement = resultBox.querySelector('.compliance-status');
    if (complianceElement) {
        if (results.compliance.isCompliant) {
            complianceElement.innerHTML = `
                <div class="compliance-good">
                    <i class="fas fa-check-circle"></i>
                    Training Program Compliant
                    <br>
                    <small>Meets ${results.compliance.minimumHours} hour minimum requirement</small>
                </div>
            `;
        } else {
            complianceElement.innerHTML = `
                <div class="compliance-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    Compliance Issues Found
                    <br>
                    <small>${results.compliance.violations.join(', ')}</small>
                </div>
            `;
        }
    }
    
    // Update training plan summary
    const planElement = resultBox.querySelector('.training-plan-summary');
    if (planElement) {
        planElement.innerHTML = `
            <div class="plan-overview">
                <h5>Recommended Training Plan</h5>
                ${results.trainingPlan.phases.map(phase => `
                    <div class="phase">
                        <strong>${phase.phase}</strong>
                        <div>${phase.duration} | ${phase.hours.toFixed(1)} hours | Priority: ${phase.priority}</div>
                    </div>
                `).join('')}
            </div>
        `;
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
    
    // Show result box
    resultBox.classList.add('active');
    
    // Scroll to results
    setTimeout(() => {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function updateTrainingChart(trainingNeeds, hoursRequired, effectiveness) {
    const canvas = document.getElementById('training-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Prepare data for stacked bar chart
    const data = {
        labels: ['Mandatory', 'Recommended', 'Certification'],
        datasets: [{
            label: 'Training Hours',
            data: [
                hoursRequired.mandatory,
                hoursRequired.recommended,
                hoursRequired.certification
            ],
            backgroundColor: [
                '#2c5aa0',
                '#4caf50',
                '#ff9800'
            ],
            borderColor: [
                '#1a3a6e',
                '#2e7d32',
                '#f57c00'
            ],
            borderWidth: 1
        }]
    };
    
    // Draw chart
    const barWidth = 40;
    const maxHours = Math.max(hoursRequired.mandatory, hoursRequired.recommended, hoursRequired.certification) * 1.2;
    const scaleFactor = 150 / maxHours;
    const startX = 80;
    
    data.labels.forEach((label, index) => {
        const x = startX + index * (barWidth + 50);
        const hours = data.datasets[0].data[index];
        const barHeight = hours * scaleFactor;
        const y = 180 - barHeight;
        
        // Draw bar
        ctx.fillStyle = data.datasets[0].backgroundColor[index];
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw border
        ctx.strokeStyle = data.datasets[0].borderColor[index];
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);
        
        // Add value label
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(hours.toFixed(0) + 'h', x + barWidth/2, y - 10);
        
        // Add category label
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.fillText(label, x + barWidth/2, 195);
    });
    
    // Add effectiveness indicator
    ctx.fillStyle = effectiveness.color;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Effectiveness: ${effectiveness.level} (${effectiveness.score}/100)`, 200, 30);
    
    // Add total hours
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText(`Total: ${hoursRequired.total.toFixed(0)} hours`, 200, 50);
}

function initTrainingNeedsAssessment() {
    const assessBtn = document.getElementById('assess-needs');
    if (assessBtn) {
        assessBtn.addEventListener('click', conductNeedsAssessment);
    }
}

function conductNeedsAssessment() {
    const department = document.getElementById('assessment-department').value;
    const riskLevel = document.getElementById('assessment-risk').value;
    const incidentHistory = document.getElementById('assessment-incidents').value;
    const skillGaps = document.getElementById('assessment-skills').value;
    
    let needs = [];
    
    // Department-specific needs
    switch(department) {
        case 'production':
            needs = ['Machine Safety', 'Lockout/Tagout', 'PPE', 'Emergency Procedures'];
            break;
        case 'maintenance':
            needs = ['Confined Space', 'Electrical Safety', 'Hot Work', 'Fall Protection'];
            break;
        case 'laboratory':
            needs = ['Chemical Safety', 'Laboratory Safety', 'Emergency Response', 'Waste Management'];
            break;
        case 'warehouse':
            needs = ['Powered Industrial Trucks', 'Material Handling', 'Fire Safety', 'Ergonomics'];
            break;
        case 'office':
            needs = ['Ergonomics', 'Emergency Evacuation', 'First Aid', 'Workplace Violence'];
            break;
        default:
            needs = ['General Safety Awareness', 'Emergency Procedures', 'PPE'];
    }
    
    // Risk-level adjustments
    if (riskLevel === 'high') {
        needs.push('Risk Assessment', 'Incident Investigation', 'Safety Leadership');
    }
    
    // Incident history adjustments
    if (incidentHistory === 'frequent') {
        needs.push('Root Cause Analysis', 'Behavior-Based Safety', 'Safety Observation');
    }
    
    // Skill gap adjustments
    if (skillGaps === 'significant') {
        needs.push('On-the-Job Training', 'Mentorship Program', 'Skills Assessment');
    }
    
    displayNeedsAssessment(needs);
}

function displayNeedsAssessment(needs) {
    const resultsDiv = document.getElementById('needs-assessment-results');
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = `
        <div class="needs-assessment-result">
            <h4><i class="fas fa-clipboard-list"></i> Training Needs Assessment</h4>
            <p><strong>Identified Training Needs:</strong></p>
            <ul class="needs-list">
                ${needs.map(need => `<li><i class="fas fa-graduation-cap"></i> ${need}</li>`).join('')}
            </ul>
            
            <h5>Assessment Recommendations</h5>
            <ul class="assessment-recommendations">
                <li>Prioritize high-risk area training first</li>
                <li>Schedule training based on risk assessment results</li>
                <li>Include both classroom and practical components</li>
                <li>Assess competency after training completion</li>
                <li>Document all training and assessment results</li>
            </ul>
        </div>
    `;
    
    resultsDiv.classList.add('active');
}

function loadTrainingDatabase() {
    // This would typically load from an API or JSON file
    // For now, we'll just log that it's loaded
    console.log('Training database loaded');
}

function updateElementText(selector, text, parent = document) {
    const element = parent.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

function resetSafetyTraining() {
    const form = document.querySelector('#training-form');
    const resultBox = document.getElementById('training-result');
    const needsResults = document.getElementById('needs-assessment-results');
    
    if (form) form.reset();
    if (resultBox) resultBox.classList.remove('active');
    if (needsResults) {
        needsResults.classList.remove('active');
        needsResults.innerHTML = '';
    }
    
    showNotification('Safety training calculator has been reset.', 'info');
}

// Export for use in main.js
window.TrainingCalculator = {
    calculate: calculateSafetyTraining,
    reset: resetSafetyTraining
};
