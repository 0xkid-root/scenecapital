import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Check authentication
    const authToken = cookies().get('auth_token');
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '12m'; // Default to 12 months
    const project = searchParams.get('project');
    
    // Generate forecast data based on period and project
    const forecastData = generateForecastData(period, project);

    return NextResponse.json({
      success: true,
      data: forecastData
    });
  } catch (error) {
    console.error('Royalties forecasts error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch royalties forecast data' },
      { status: 500 }
    );
  }
}

// Helper function to generate mock forecast data
function generateForecastData(period: string, projectFilter?: string | null) {
  const now = new Date();
  let forecastMonths = 12; // Default to 12 months
  
  // Set the forecast period based on the period parameter
  switch (period) {
    case '3m':
      forecastMonths = 3;
      break;
    case '6m':
      forecastMonths = 6;
      break;
    case '12m':
      forecastMonths = 12;
      break;
    case '24m':
      forecastMonths = 24;
      break;
    case '5y':
      forecastMonths = 60;
      break;
    default:
      forecastMonths = 12;
  }
  
  // Sample projects
  const projects = [
    { id: 'project-001', name: 'Urban Dreamscape', category: 'Film', growthRate: 8.5 },
    { id: 'project-002', name: 'Harmonic Waves', category: 'Music', growthRate: 6.2 },
    { id: 'project-003', name: 'Digital Renaissance', category: 'Art', growthRate: 12.3 },
    { id: 'project-004', name: 'Neon Horizons', category: 'Gaming', growthRate: 15.7 },
    { id: 'project-005', name: 'Ethereal Chronicles', category: 'Literature', growthRate: 4.8 }
  ];
  
  // Filter projects if a project filter is provided
  const filteredProjects = projectFilter 
    ? projects.filter(p => p.name.toLowerCase().includes(projectFilter.toLowerCase()))
    : projects;
  
  // Generate monthly forecast data for each project
  const monthlyForecasts = generateMonthlyForecasts(filteredProjects, forecastMonths);
  
  // Calculate quarterly and annual projections
  const quarterlyForecasts = calculateQuarterlyForecasts(monthlyForecasts);
  const annualForecasts = calculateAnnualForecasts(monthlyForecasts);
  
  // Calculate total projections
  const totalProjections = calculateTotalProjections(monthlyForecasts, filteredProjects);
  
  // Generate scenario analysis
  const scenarioAnalysis = generateScenarioAnalysis(filteredProjects, forecastMonths);
  
  return {
    summary: {
      forecastPeriod: period,
      projectCount: filteredProjects.length,
      totalProjection: totalProjections.total,
      bestCaseProjection: totalProjections.bestCase,
      worstCaseProjection: totalProjections.worstCase,
      confidenceLevel: 85 // Mock confidence level
    },
    projections: {
      monthly: monthlyForecasts,
      quarterly: quarterlyForecasts,
      annual: annualForecasts
    },
    scenarios: scenarioAnalysis,
    projects: filteredProjects.map(project => ({
      id: project.id,
      name: project.name,
      category: project.category,
      growthRate: project.growthRate,
      forecastTotal: totalProjections.byProject[project.id]
    }))
  };
}

// Helper function to generate monthly forecasts
function generateMonthlyForecasts(projects: any[], months: number) {
  const now = new Date();
  const forecasts: any[] = [];
  
  for (let i = 0; i < months; i++) {
    const forecastDate = new Date(now);
    forecastDate.setMonth(now.getMonth() + i + 1); // Start from next month
    
    const monthData: any = {
      date: forecastDate.toISOString().split('T')[0],
      month: forecastDate.toLocaleString('default', { month: 'long' }),
      year: forecastDate.getFullYear()
    };
    
    let monthTotal = 0;
    
    // Calculate forecast for each project
    projects.forEach(project => {
      // Base monthly value with some seasonal variation
      const baseValue = 5000 + Math.random() * 5000;
      
      // Apply growth rate (compounded monthly)
      const monthlyGrowthRate = Math.pow(1 + (project.growthRate / 100), 1/12) - 1;
      const growthFactor = Math.pow(1 + monthlyGrowthRate, i);
      
      // Add seasonal variation (higher in Q4, lower in Q1)
      const month = forecastDate.getMonth();
      let seasonalFactor = 1.0;
      if (month >= 9 && month <= 11) { // Q4: Oct-Dec
        seasonalFactor = 1.2 + Math.random() * 0.3; // 20-50% boost
      } else if (month >= 0 && month <= 2) { // Q1: Jan-Mar
        seasonalFactor = 0.8 + Math.random() * 0.1; // 10-20% reduction
      }
      
      const value = baseValue * growthFactor * seasonalFactor;
      const roundedValue = parseFloat(value.toFixed(2));
      
      monthData[project.id] = roundedValue;
      monthTotal += roundedValue;
    });
    
    monthData.total = parseFloat(monthTotal.toFixed(2));
    forecasts.push(monthData);
  }
  
  return forecasts;
}

// Helper function to calculate quarterly forecasts
function calculateQuarterlyForecasts(monthlyForecasts: any[]) {
  const quarterlyForecasts: any[] = [];
  const quarters: any = {};
  
  // Group monthly forecasts by quarter
  monthlyForecasts.forEach(month => {
    const date = new Date(month.date);
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    const year = date.getFullYear();
    const quarterKey = `${year}-Q${quarter}`;
    
    if (!quarters[quarterKey]) {
      quarters[quarterKey] = {
        quarter: `Q${quarter}`,
        year,
        date: `${year}-Q${quarter}`,
        total: 0
      };
      
      // Initialize project values
      Object.keys(month).forEach(key => {
        if (key !== 'date' && key !== 'month' && key !== 'year' && key !== 'total') {
          quarters[quarterKey][key] = 0;
        }
      });
    }
    
    // Sum values for each project
    Object.keys(month).forEach(key => {
      if (key !== 'date' && key !== 'month' && key !== 'year') {
        quarters[quarterKey][key] += month[key];
      }
    });
  });
  
  // Convert to array and round values
  Object.values(quarters).forEach((quarter: any) => {
    Object.keys(quarter).forEach(key => {
      if (key !== 'quarter' && key !== 'year' && key !== 'date') {
        quarter[key] = parseFloat(quarter[key].toFixed(2));
      }
    });
    quarterlyForecasts.push(quarter);
  });
  
  return quarterlyForecasts.sort((a: any, b: any) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.quarter.substring(1) - b.quarter.substring(1);
  });
}

// Helper function to calculate annual forecasts
function calculateAnnualForecasts(monthlyForecasts: any[]) {
  const annualForecasts: any[] = [];
  const years: any = {};
  
  // Group monthly forecasts by year
  monthlyForecasts.forEach(month => {
    const year = new Date(month.date).getFullYear();
    
    if (!years[year]) {
      years[year] = {
        year,
        total: 0
      };
      
      // Initialize project values
      Object.keys(month).forEach(key => {
        if (key !== 'date' && key !== 'month' && key !== 'year' && key !== 'total') {
          years[year][key] = 0;
        }
      });
    }
    
    // Sum values for each project
    Object.keys(month).forEach(key => {
      if (key !== 'date' && key !== 'month' && key !== 'year') {
        years[year][key] += month[key];
      }
    });
  });
  
  // Convert to array and round values
  Object.values(years).forEach((yearData: any) => {
    Object.keys(yearData).forEach(key => {
      if (key !== 'year') {
        yearData[key] = parseFloat(yearData[key].toFixed(2));
      }
    });
    annualForecasts.push(yearData);
  });
  
  return annualForecasts.sort((a: any, b: any) => a.year - b.year);
}

// Helper function to calculate total projections
function calculateTotalProjections(monthlyForecasts: any[], projects: any[]) {
  const totalByProject: Record<string, number> = {};
  let total = 0;
  
  // Initialize totals for each project
  projects.forEach(project => {
    totalByProject[project.id] = 0;
  });
  
  // Sum all monthly forecasts
  monthlyForecasts.forEach(month => {
    projects.forEach(project => {
      totalByProject[project.id] += month[project.id];
    });
    total += month.total;
  });
  
  // Round values
  Object.keys(totalByProject).forEach(key => {
    totalByProject[key] = parseFloat(totalByProject[key].toFixed(2));
  });
  
  // Calculate best and worst case scenarios
  const bestCase = parseFloat((total * 1.2).toFixed(2)); // 20% better
  const worstCase = parseFloat((total * 0.8).toFixed(2)); // 20% worse
  
  return {
    total: parseFloat(total.toFixed(2)),
    bestCase,
    worstCase,
    byProject: totalByProject
  };
}

// Helper function to generate scenario analysis
function generateScenarioAnalysis(projects: any[], months: number) {
  const scenarios = [
    { name: 'Base Case', probabilityWeight: 0.6, growthAdjustment: 1.0 },
    { name: 'Optimistic', probabilityWeight: 0.2, growthAdjustment: 1.5 },
    { name: 'Pessimistic', probabilityWeight: 0.2, growthAdjustment: 0.5 }
  ];
  
  const scenarioResults = scenarios.map(scenario => {
    let totalProjection = 0;
    const projectProjections: Record<string, number> = {};
    
    // Calculate adjusted projections for each project
    projects.forEach(project => {
      const adjustedGrowthRate = project.growthRate * scenario.growthAdjustment;
      let projectTotal = 0;
      
      // Simple compound growth calculation
      for (let i = 0; i < months; i++) {
        const monthlyGrowthRate = Math.pow(1 + (adjustedGrowthRate / 100), 1/12) - 1;
        const growthFactor = Math.pow(1 + monthlyGrowthRate, i);
        
        // Base monthly value
        const baseValue = 5000 + Math.random() * 5000;
        const value = baseValue * growthFactor;
        
        projectTotal += value;
      }
      
      const roundedTotal = parseFloat(projectTotal.toFixed(2));
      projectProjections[project.id] = roundedTotal;
      totalProjection += roundedTotal;
    });
    
    return {
      scenario: scenario.name,
      probabilityWeight: scenario.probabilityWeight,
      totalProjection: parseFloat(totalProjection.toFixed(2)),
      projectProjections
    };
  });
  
  return scenarioResults;
}
