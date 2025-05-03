import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Template interface
interface Template {
  id: string;
  name: string;
  type: string;
  terms: string;
}

// Mock templates data
const templates: Template[] = [
  {
    id: 'template-001',
    name: 'Standard Distribution Template',
    type: 'Distribution',
    terms: 'Standard terms for content distribution with quarterly royalty payments. Licensor grants to Licensee the non-exclusive right to distribute the Content through specified channels. Royalty payments shall be made quarterly based on revenue generated from the Content distribution.'
  },
  {
    id: 'template-002',
    name: 'Exhibition Template',
    type: 'Exhibition',
    terms: 'Terms for theatrical exhibition with fixed royalty rate. Licensor grants to Licensee the exclusive right to exhibit the Content in specified territories. Licensee shall pay to Licensor a fixed royalty rate of the gross box office receipts.'
  },
  {
    id: 'template-003',
    name: 'Merchandise Licensing Template',
    type: 'Merchandise',
    terms: 'Template for merchandise licensing with minimum guarantee and royalty percentage. Licensor grants to Licensee the non-exclusive right to produce and sell merchandise based on the IP. Licensee shall pay to Licensor a minimum guarantee plus a royalty percentage of net sales.'
  },
  {
    id: 'template-004',
    name: 'Music Licensing Template',
    type: 'Music',
    terms: 'Standard terms for music licensing across multiple platforms. Licensor grants to Licensee the non-exclusive right to use the music in specified contexts. Royalty payments shall be made based on usage metrics and platform-specific rates.'
  },
  {
    id: 'template-005',
    name: 'Gaming Adaptation Template',
    type: 'Gaming',
    terms: 'Template for video game adaptations with milestone payments and revenue sharing. Licensor grants to Licensee the exclusive right to develop and publish games based on the IP. Licensee shall pay to Licensor milestone payments during development and a percentage of net revenue after release.'
  }
];

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
    const type = searchParams.get('type');
    
    // Filter templates based on query parameters
    let filteredTemplates = [...templates];
    
    if (type) {
      filteredTemplates = filteredTemplates.filter(template => 
        template.type.toLowerCase() === type.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredTemplates
    });
  } catch (error) {
    console.error('Templates error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch licensing templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const authToken = cookies().get('auth_token');
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { name, type, terms } = body;
    
    // Validate required fields
    if (!name || !type || !terms) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new template
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name,
      type,
      terms
    };
    
    // In a real implementation, you would save this to a database
    // For now, we'll just return the new template
    
    return NextResponse.json({
      success: true,
      data: newTemplate,
      message: 'Template created successfully'
    });
  } catch (error) {
    console.error('Create template error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create licensing template' },
      { status: 500 }
    );
  }
}
