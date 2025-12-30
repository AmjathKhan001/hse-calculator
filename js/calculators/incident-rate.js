// incident-rate.js - Incident Rate Calculator Logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize incident rate calculator
    const calculateBtn = document.getElementById('calculate-incident');
    const resetBtn = document.getElementById('reset-incident');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateIncidentRates);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetIncidentRates);
    }
    
    // Load industry benchmarks
    loadIndustryBenchmarks();
    
    console.log('Incident Rate Calculator initialized');
});

function calculateIncidentRates() {
    // Get form values
    const recordableInjuries = parseInt(document.getElementById('recordable-injuries').value) || 0;
    const lostTimeInjuries = parseInt(document.getElementById('lost-time-injuries').value) || 0;
    const totalHoursWorked = parseInt(document.getElementById('total-hours').value);
    const totalEmployees = parseInt(document.getElementById('total-employees').value) || 1;
    const industry = document.getElementById('industry-type').value;
    const period = document.getElementById('time-period').value;
    
    // Validate inputs
    if (isNaN(totalHoursWorked) || totalHoursWorked <= 0) {
        showNotification('Please enter valid total hours worked.', 'error');
        return;
    }
    
    if (lostTimeInjuries > recordableInjuries) {
        showNotification('Lost time injuries cannot exceed recordable injuries.', 'error');
        return;
    }
    
    // Calculate incident rates
    const trir = calculateTRIR(recordableInjuries, totalHoursWorked);
    const dart = calculateDART(lostTimeInjuries, totalHoursWorked);
    const ltifr = calculateLTIFR(lostTimeInjuries, totalHoursWorked);
    
    // Calculate severity rates
    const severityRate = calculateSeverityRate(recordableInjuries, lostTimeInjuries);
    const frequencyRate = calculateFrequencyRate(recordableInjuries, totalHoursWorked);
    
    // Calculate average hours per employee
    const avgHoursPerEmployee = totalHoursWorked / totalEmployees;
    
    // Get industry benchmarks
    const benchmarks = getIndustryBenchmarks(industry);
    
    // Compare with benchmarks
    const trirComparison = compareWithBenchmark(trir, benchmarks.trir);
    const dartComparison = compareWithBenchmark(dart, benchmarks.dart);
    
    // Determine safety performance rating
    const performanceRating = assessPerformance(trir, dart, ltifr, industry);
    
    // Calculate improvement needed
    const improvementNeeded = calculateImprovementNeeded(trir, benchmarks.target);
    
    // Generate recommendations
    const recommendations = generateRecommendations(
        trir, dart, ltifr, 
        recordableInjuries, lostTimeInjuries,
        performanceRating
    );
    
    // Calculate cost impact (estimated)
    const costImpact = estimateCostImpact(recordableInjuries, lostTimeInjuries);
    
    // Display results
    displayIncidentResults({
        trir: trir,
        dart: dart,
        ltifr: ltifr,
        severityRate: severityRate,
        frequencyRate: frequencyRate,
        recordableInjuries: recordableInjuries,
        lostTimeInjuries: lostTimeInjuries,
        totalHours: totalHoursWorked,
        totalEmployees: totalEmployees,
        avgHoursPerEmployee: avgHoursPerEmployee.toFixed(0),
        period: period,
        industry: industry,
        benchmarks: benchmarks,
        trirComparison: trirComparison,
        dartComparison: dartComparison,
        performanceRating: performanceRating,
        improvementNeeded: improvementNeeded,
        recommendations: recommendations,
        costImpact: costImpact
    });
    
    // Update charts
    updateIncidentCharts(trir, dart, ltifr, benchmarks);
    
    showNotification('Incident rates calculated successfully!', 'success');
}

function calculateTRIR(recordableInjuries, hoursWorked) {
    // TRIR = (Number of recordable injuries × 200,000) / Total hours worked
    return (recordableInjuries * 200000) / hoursWorked;
}

function calculateDART(lostTimeInjuries, hoursWorked) {
    // DART = (Number of DART cases × 200,000) / Total hours worked
    return (lostTimeInjuries * 200000) / hoursWorked;
}

function calculateLTIFR(lostTimeInjuries, hoursWorked) {
    // LTIFR = (Number of lost time injuries × 1,000,000) / Total hours worked
    return (lostTimeInjuries * 1000000) / hoursWorked;
}

function calculateSeverityRate(recordableInjuries, lostTimeInjuries) {
    // Severity Rate = (Lost time injuries / Recordable injuries) × 100
    if (recordableInjuries === 0) return 0;
    return (lostTimeInjuries / recordableInjuries) * 100;
}

function calculateFrequencyRate(recordableInjuries, hoursWorked) {
    // Frequency Rate = (Recordable injuries / Hours worked) × 1,000,000
    return (recordableInjuries / hoursWorked) * 1000000;
}

function getIndustryBenchmarks(industry) {
    // Industry benchmarks (simplified)
    const benchmarks = {
        'construction': { trir: 3.0, dart: 2.0, target: 2.5 },
        'manufacturing': { trir: 2.5, dart: 1.8, target: 2.0 },
        'transportation': { trir: 4.0, dart: 2.5, target: 3.0 },
        'healthcare': { trir: 4.5, dart: 3.0, target: 3.5 },
        'oil-gas': { trir: 0.8, dart: 0.5, target: 0.6 },
        'mining': { trir: 2.0, dart: 1.2, target: 1.5 },
        'agriculture': { trir: 5.0, dart: 3.5, target: 4.0 },
        'retail': { trir: 3.5, dart: 2.2, target: 2.8 },
        'education': { trir: 2.8, dart: 1.9, target: 2.2 },
        'general': { trir: 3.2, dart: 2.1, target: 2.5 }
    };
    
    return benchmarks[industry] || benchmarks.general;
}

function compareWithBenchmark(rate, benchmark) {
    const difference = rate - benchmark;
    const percentage = (difference / benchmark) * 100;
    
    if (rate <= benchmark * 0.5) {
        return { level: 'Excellent', color: '#28a745', difference: difference.toFixed(2), percentage: percentage.toFixed(1) };
    } else if (rate <= benchmark * 0.8) {
        return { level: 'Good', color: '#7bd34f', difference: difference.toFixed(2), percentage: percentage.toFixed(1) };
    } else if (rate <= benchmark) {
        return { level: 'Average', color: '#ffc107', difference: difference.toFixed(2), percentage: percentage.toFixed(1) };
    } else if (rate <= benchmark * 1.2) {
        return { level: 'Below Average', color: '#fd7e14', difference: difference.toFixed(2), percentage: percentage.toFixed(1) };
    } else {
        return { level: 'Poor', color: '#dc3545', difference: difference.toFixed(2), percentage: percentage.toFixed(1) };
    }
}

function assessPerformance(trir, dart, ltifr, industry) {
    const benchmarks = getIndustryBenchmarks(industry);
    
    let score = 0;
    
    if (trir <= benchmarks.target) score += 30;
    else if (trir <= benchmarks.trir) score += 20;
    else score += 10;
    
    if (dart <= benchmarks.target * 0.8) score += 30;
    else if (dart <= benchmarks.dart) score += 20;
    else score += 10;
    
    if (ltifr <= 0.5) score += 40;
    else if (ltifr <= 1.0) score += 30;
    else if (ltifr <= 2.0) score += 20;
    else score += 10;
    
    if (score >= 90) return { rating: 'World Class', color: '#28a745', score: score };
    else if (score >= 80) return { rating: 'Excellent', color: '#7bd34f', score: score };
    else if (score >= 70) return { rating: 'Good', color: '#ffc107', score: score };
    else if (score >= 60) return { rating: 'Fair', color: '#fd7e14', score: score };
    else return { rating: 'Needs Improvement', color: '#dc3545', score: score };
}

function calculateImprovementNeeded(trir, target) {
    const reduction = trir - target;
    const percentage = ((reduction / trir) * 100).toFixed(1);
    
    return {
        reduction: reduction.toFixed(2),
        percentage: percentage,
        target: target
    };
}

function generateRecommendations(trir, dart, ltifr, recordableInjuries, lostTimeInjuries, performance) {
    const recommendations = [];
    
    // General recommendations
    if (recordableInjuries > 0) {
        recommendations.push('Conduct incident investigation for all recordable injuries');
        recommendations.push('Implement corrective actions based on root cause analysis');
    }
    
    if (lostTimeInjuries > 0) {
        recommendations.push('Review lost time incidents with senior management');
        recommendations.push('Implement return-to-work programs');
    }
    
    // TRIR-specific recommendations
    if (trir > 3.0) {
        recommendations.push('Strengthen safety training programs');
        recommendations.push('Increase safety inspections and audits');
        recommendations.push('Implement behavior-based safety programs');
    }
    
    // DART-specific recommendations
    if (dart > 2.0) {
        recommendations.push('Focus on ergonomic improvements');
        recommendations.push('Implement job hazard analysis for high-risk tasks');
        recommendations.push('Enhance first aid and medical response capabilities');
    }
    
    // Performance-based recommendations
    if (performance.rating === 'Needs Improvement') {
        recommendations.push('Develop comprehensive safety improvement plan');
        recommendations.push('Increase management safety walkthroughs');
        recommendations.push('Consider hiring safety consultant');
        recommendations.push('Benchmark against industry leaders');
    } else if (performance.rating === 'World Class') {
        recommendations.push('Maintain current safety programs');
        recommendations.push('Share best practices within organization');
        recommendations.push('Consider safety certification (ISO 45001)');
    }
    
    // Add industry-specific recommendations
    recommendations.push('Review industry-specific safety standards and regulations');
    recommendations.push('Participate in industry safety groups and forums');
    
    return recommendations;
}

function estimateCostImpact(recordableInjuries, lostTimeInjuries) {
    // Estimated costs (simplified)
    const avgCostRecordable = 38000; // Average cost per recordable injury
    const avgCostLostTime = 75000;   // Average cost per lost time injury
    const indirectMultiplier = 4;    // Indirect costs are typically 4x direct costs
    
    const directCosts = (recordableInjuries * avgCostRecordable) + 
                       (lostTimeInjuries * avgCostLostTime);
    const totalCosts = directCosts * indirectMultiplier;
    
    return {
        direct: directCosts,
        indirect: directCosts * (indirectMultiplier - 1),
        total: totalCosts,
        perInjury: totalCosts / (recordableInjuries || 1)
    };
}

function displayIncidentResults(results) {
    const resultBox = document.getElementById('incident-result');
    if (!resultBox) return;
    
    // Update rate values
    updateElementText('.trir-value', results.trir.toFixed(2), resultBox);
    updateElementText('.dart-value', results.dart.toFixed(2), resultBox);
    updateElementText('.ltifr-value', results.ltifr.toFixed(2), resultBox);
    updateElementText('.severity-value', results.severityRate.toFixed(1) + '%', resultBox);
    updateElementText('.frequency-value', results.frequencyRate.toFixed(2), resultBox);
    
    // Update performance rating
    const ratingElement = resultBox.querySelector('.performance-rating');
    if (ratingElement) {
        ratingElement.textContent = results.performanceRating.rating;
        ratingElement.style.backgroundColor = results.performanceRating.color;
        ratingElement.style.color = '#000';
    }
    
    updateElementText('.performance-score', results.performanceRating.score + '/100', resultBox);
    
    // Update industry comparison
    updateElementText('.industry-benchmark', 
        `${results.benchmarks.trir.toFixed(1)} (${results.industry})`, resultBox);
    
    updateElementText('.trir-comparison', 
        `${results.trirComparison.level} (${results.trirComparison.difference})`, resultBox);
    
    updateElementText('.dart-comparison', 
        `${results.dartComparison.level} (${results.dartComparison.difference})`, resultBox);
    
    // Update improvement needed
    const improvementElement = resultBox.querySelector('.improvement-needed');
    if (improvementElement) {
        if (parseFloat(results.improvementNeeded.reduction) > 0) {
            improvementElement.innerHTML = `
                <div class="improvement-warning">
                    <i class="fas fa-chart-line"></i>
                    Need to reduce TRIR by ${results.improvementNeeded.reduction} 
                    (${results.improvementNeeded.percentage}%) to reach target of ${results.improvementNeeded.target}
                </div>
            `;
        } else {
            improvementElement.innerHTML = `
                <div class="improvement-success">
                    <i class="fas fa-trophy"></i>
                    Exceeding target by ${Math.abs(results.improvementNeeded.reduction)} points!
                </div>
            `;
        }
    }
    
    // Update statistics
    updateElementText('.statistics-summary', 
        `${results.recordableInjuries} recordable injuries, ${results.lostTimeInjuries} lost time injuries`, 
        resultBox);
    
    updateElementText('.hours-summary', 
        `${results.totalHours.toLocaleString()} hours worked (${results.avgHoursPerEmployee} hrs/employee)`, 
        resultBox);
    
    // Update cost impact
    const costElement = resultBox.querySelector('.cost-impact');
    if (costElement) {
        if (results.recordableInjuries > 0) {
            costElement.innerHTML = `
                <div class="cost-warning">
                    <i class="fas fa-dollar-sign"></i>
                    Estimated total cost impact: $${results.costImpact.total.toLocaleString()}
                    <br>
                    <small>Direct: $${results.costImpact.direct.toLocaleString()} | 
                    Indirect: $${results.costImpact.indirect.toLocaleString()}</small>
                </div>
            `;
        } else {
            costElement.innerHTML = `
                <div class="cost-success">
                    <i class="fas fa-smile"></i>
                    No recordable injuries - No estimated costs!
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
            li.innerHTML = `<i class="fas fa-check-circle"></i> ${rec}`;
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

function updateIncidentCharts(trir, dart, ltifr, benchmarks) {
    // Update gauge charts
    updateRateGauge('trir-gauge', trir, benchmarks.trir, 'TRIR');
    updateRateGauge('dart-gauge', dart, benchmarks.dart, 'DART');
    updateRateGauge('ltifr-gauge', ltifr, benchmarks.target, 'LTIFR');
    
    // Update comparison chart
    updateComparisonChart(trir, dart, ltifr, benchmarks);
}

function updateRateGauge(canvasId, value, benchmark, label) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Draw gauge background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 20;
    ctx.stroke();
    
    // Draw value arc
    const maxValue = benchmark * 2;
    const angle = Math.PI + (Math.min(value, maxValue) / maxValue) * Math.PI;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, angle);
    
    // Choose color based on value
    let color;
    if (value <= benchmark * 0.5) color = '#28a745';
    else if (value <= benchmark) color = '#ffc107';
    else color = '#dc3545';
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 20;
    ctx.stroke();
    
    // Draw benchmark line
    const benchmarkAngle = Math.PI + (benchmark / maxValue) * Math.PI;
    ctx.beginPath();
    ctx.moveTo(
        centerX + radius * Math.cos(benchmarkAngle),
        centerY + radius * Math.sin(benchmarkAngle)
    );
    ctx.lineTo(
        centerX + (radius + 15) * Math.cos(benchmarkAngle),
        centerY + (radius + 15) * Math.sin(benchmarkAngle)
    );
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add value text
    ctx.fillStyle = color;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(value.toFixed(2), centerX, centerY);
    
    // Add label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(label, centerX, centerY + 30);
    
    // Add benchmark text
    ctx.fillStyle = '#6c757d';
    ctx.font = '10px Arial';
    ctx.fillText(`Benchmark: ${benchmark.toFixed(1)}`, centerX, centerY + 45);
}

function updateComparisonChart(trir, dart, ltifr, benchmarks) {
    const canvas = document.getElementById('comparison-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const data = [
        { label: 'TRIR', value: trir, benchmark: benchmarks.trir },
        { label: 'DART', value: dart, benchmark: benchmarks.dart },
        { label: 'Target', value: benchmarks.target, benchmark: benchmarks.target }
    ];
    
    const barWidth = 40;
    const spacing = 30;
    const startX = 50;
    const maxValue = Math.max(trir, dart, benchmarks.trir, benchmarks.dart) * 1.2;
    const scaleFactor = 150 / maxValue;
    
    data.forEach((item, index) => {
        const x = startX + index * (barWidth + spacing);
        
        // Draw benchmark bar
        const benchmarkHeight = item.benchmark * scaleFactor;
        ctx.fillStyle = 'rgba(108, 117, 125, 0.3)';
        ctx.fillRect(x, 150 - benchmarkHeight, barWidth, benchmarkHeight);
        
        // Draw actual value bar
        const valueHeight = item.value * scaleFactor;
        
        let color;
        if (item.value <= item.benchmark * 0.5) color = '#28a745';
        else if (item.value <= item.benchmark) color = '#ffc107';
        else color = '#dc3545';
        
        ctx.fillStyle = color;
        ctx.fillRect(x, 150 - valueHeight, barWidth, valueHeight);
        
        // Add value labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x + barWidth/2, 170);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Arial';
        ctx.fillText(item.value.toFixed(2), x + barWidth/2, 150 - valueHeight/2);
        
        // Add benchmark line
        ctx.beginPath();
        ctx.moveTo(x - 5, 150 - benchmarkHeight);
        ctx.lineTo(x + barWidth + 5, 150 - benchmarkHeight);
        ctx.strokeStyle = '#6c757d';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
    });
    
    // Add legend
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Actual', 10, 20);
    ctx.fillStyle = '#6c757d';
    ctx.fillText('Benchmark', 10, 35);
}

function loadIndustryBenchmarks() {
    const select = document.getElementById('industry-type');
    if (!select) return;
    
    // Add benchmark info tooltips
    const industries = [
        { value: 'construction', name: 'Construction', benchmark: '3.0' },
        { value: 'manufacturing', name: 'Manufacturing', benchmark: '2.5' },
        { value: 'transportation', name: 'Transportation', benchmark: '4.0' },
        { value: 'healthcare', name: 'Healthcare', benchmark: '4.5' },
        { value: 'oil-gas', name: 'Oil & Gas', benchmark: '0.8' },
        { value: 'mining', name: 'Mining', benchmark: '2.0' },
        { value: 'agriculture', name: 'Agriculture', benchmark: '5.0' },
        { value: 'retail', name: 'Retail', benchmark: '3.5' },
        { value: 'education', name: 'Education', benchmark: '2.8' },
        { value: 'general', name: 'General Industry', benchmark: '3.2' }
    ];
    
    // Update select options with benchmark info
    industries.forEach(industry => {
        const option = select.querySelector(`option[value="${industry.value}"]`);
        if (option) {
            option.textContent = `${industry.name} (TRIR benchmark: ${industry.benchmark})`;
        }
    });
}

function updateElementText(selector, text, parent = document) {
    const element = parent.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

function resetIncidentRates() {
    const form = document.querySelector('#incident-form');
    const resultBox = document.getElementById('incident-result');
    
    if (form) form.reset();
    if (resultBox) resultBox.classList.remove('active');
    
    showNotification('Incident rate calculator has been reset.', 'info');
}

// Export for use in main.js
window.IncidentCalculator = {
    calculate: calculateIncidentRates,
    reset: resetIncidentRates
};
