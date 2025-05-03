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
    const period = searchParams.get('period') || '1y'; // Default to 1 year
    const project = searchParams.get('project');
    
    // Generate analytics data based on period and project
    const analyticsData = generateAnalyticsData(period, project);

    return NextResponse.json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    console.error('Royalties analytics error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch royalties analytics data' },
      { status: 500 }
    );
  }
}

// Helper function to generate mock analytics data
function generateAnalyticsData(period: string, projectFilter?: string | null) {
  const now = new Date();
  let startDate = new Date();
  
  // Set the start date based on the period
  switch (period) {
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(now.getDate() - 90);
      break;
    case '6m':
      startDate.setMonth(now.getMonth() - 6);
      break;
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case '2y':
      startDate.setFullYear(now.getFullYear() - 2);
      break;
    case 'ytd':
      startDate = new Date(now.getFullYear(), 0, 1); // January 1st of current year
      break;
    default:
      startDate.setFullYear(now.getFullYear() - 1);
  }
  
  // Sample projects
  const projects = [
    { id: 'project-001', name: 'Urban Dreamscape', category: 'Film' },
    { id: 'project-002', name: 'Harmonic Waves', category: 'Music' },
    { id: 'project-003', name: 'Digital Renaissance', category: 'Art' },
    { id: 'project-004', name: 'Neon Horizons', category: 'Gaming' },
    { id: 'project-005', name: 'Ethereal Chronicles', category: 'Literature' }
  ];
  
  // Filter projects if a project filter is provided
  const filteredProjects = projectFilter 
    ? projects.filter(p => p.name.toLowerCase().includes(projectFilter.toLowerCase()))
    : projects;
  
  // Sample platforms
  const platforms = ['Spotify', 'Apple Music', 'Netflix', 'YouTube', 'Amazon', 'Tidal', 'Disney+'];
  
  // Sample territories
  const territories = ['North America', 'Europe', 'Asia', 'Latin America', 'Oceania', 'Africa'];
  
  // Generate time series data
  const timeSeriesData = generateTimeSeriesData(startDate, now, filteredProjects);
  
  // Generate platform distribution
  const platformDistribution = platforms.map(platform => {
    const baseValue = 10000 + Math.random() * 40000;
    return {
      platform,
      value: parseFloat(baseValue.toFixed(2)),
      percentage: 0 // Will be calculated below
    };
  });
  
  // Calculate percentages for platform distribution
  const totalPlatformValue = platformDistribution.reduce((sum, item) => sum + item.value, 0);
  platformDistribution.forEach(item => {
    item.percentage = parseFloat(((item.value / totalPlatformValue) * 100).toFixed(2));
  });
  
  // Generate territory distribution
  const territoryDistribution = territories.map(territory => {
    const baseValue = 5000 + Math.random() * 25000;
    return {
      territory,
      value: parseFloat(baseValue.toFixed(2)),
      percentage: 0 // Will be calculated below
    };
  });
  
  // Calculate percentages for territory distribution
  const totalTerritoryValue = territoryDistribution.reduce((sum, item) => sum + item.value, 0);
  territoryDistribution.forEach(item => {
    item.percentage = parseFloat(((item.value / totalTerritoryValue) * 100).toFixed(2));
  });
  
  // Generate project performance data
  const projectPerformance = filteredProjects.map(project => {
    const baseValue = 15000 + Math.random() * 50000;
    const previousValue = baseValue * (0.7 + Math.random() * 0.3); // Previous period value (70-100% of current)
    const change = baseValue - previousValue;
    const percentageChange = (change / previousValue) * 100;
    
    return {
      id: project.id,
      name: project.name,
      category: project.category,
      currentValue: parseFloat(baseValue.toFixed(2)),
      previousValue: parseFloat(previousValue.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      percentageChange: parseFloat(percentageChange.toFixed(2)),
      trend: generateTrendData(project.id)
    };
  });
  
  // Calculate total earnings and growth
  const currentPeriodTotal = projectPerformance.reduce((sum, project) => sum + project.currentValue, 0);
  const previousPeriodTotal = projectPerformance.reduce((sum, project) => sum + project.previousValue, 0);
  const totalChange = currentPeriodTotal - previousPeriodTotal;
  const totalPercentageChange = (totalChange / previousPeriodTotal) * 100;
  
  return {
    summary: {
      currentPeriodTotal: parseFloat(currentPeriodTotal.toFixed(2)),
      previousPeriodTotal: parseFloat(previousPeriodTotal.toFixed(2)),
      change: parseFloat(totalChange.toFixed(2)),
      percentageChange: parseFloat(totalPercentageChange.toFixed(2)),
      period,
      projectCount: filteredProjects.length
    },
    timeSeries: timeSeriesData,
    distribution: {
      platforms: platformDistribution,
      territories: territoryDistribution
    },
    projectPerformance
  };
}

// Helper function to generate time series data
function generateTimeSeriesData(startDate: Date, endDate: Date, projects: any[]) {
  const timeSeriesData: any[] = [];
  const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
  
  // Determine the interval based on the date range
  let interval: 'day' | 'week' | 'month';
  if (monthDiff <= 1) {
    interval = 'day';
  } else if (monthDiff <= 6) {
    interval = 'week';
  } else {
    interval = 'month';
  }
  
  // Generate data points
  let currentDate = new Date(startDate);
  const dataPoints: any[] = [];
  
  while (currentDate <= endDate) {
    const dataPoint: any = {
      date: currentDate.toISOString().split('T')[0]
    };
    
    // Add values for each project
    let totalForDate = 0;
    projects.forEach(project => {
      // Base value that increases over time with some randomness
      const progress = (currentDate.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime());
      const baseValue = (100 + progress * 200) * (0.8 + Math.random() * 0.4);
      const value = parseFloat(baseValue.toFixed(2));
      
      dataPoint[project.name] = value;
      totalForDate += value;
    });
    
    dataPoint.total = parseFloat(totalForDate.toFixed(2));
    dataPoints.push(dataPoint);
    
    // Increment date based on interval
    if (interval === 'day') {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (interval === 'week') {
      currentDate.setDate(currentDate.getDate() + 7);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }
  
  return {
    interval,
    dataPoints
  };
}

// Helper function to generate trend data for a project
function generateTrendData(projectId: string) {
  // Generate 12 monthly data points with a general upward trend
  const trendData = [];
  let baseValue = 1000 + Math.random() * 2000;
  
  for (let i = 0; i < 12; i++) {
    // Add some randomness but maintain an upward trend
    const randomFactor = 0.9 + Math.random() * 0.2;
    const growthFactor = 1 + (i * 0.01); // Small growth each month
    
    baseValue = baseValue * randomFactor * growthFactor;
    trendData.push(parseFloat(baseValue.toFixed(2)));
  }
  
  return trendData;
}
