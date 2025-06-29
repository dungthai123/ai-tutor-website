import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Fetching categories from external API...');
    
    const response = await fetch('http://127.0.0.1:5001/chinese-categories');
    
    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Categories fetched successfully:', data.categories?.length, 'categories');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 