import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    console.log('🔍 Fetching topics for category:', categoryId);
    
    const response = await fetch(`http://127.0.0.1:5001/chinese-topics/${categoryId}`);
    
    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Topics fetched successfully:', data.topics?.length, 'topics for category', categoryId);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching topics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
} 