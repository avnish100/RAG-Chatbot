import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create a new FormData instance for the backend request
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Use the environment variable for the backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend:8000';
    const response = await fetch(`${backendUrl}/upload`, {
      method: 'POST',
      body: backendFormData,
      // Don't set Content-Type header - browser will set it automatically with boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to upload file' }));
      throw new Error(errorData.error || 'Failed to upload file');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    );
  }
}
