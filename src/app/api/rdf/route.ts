import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const rdfFilePath = path.join(process.cwd(), 'public', 'protege-tesis.rdf');
    const rdfContent = fs.readFileSync(rdfFilePath, 'utf-8');
    
    return new NextResponse(rdfContent, {
      headers: {
        'Content-Type': 'application/rdf+xml',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load RDF file' }, { status: 500 });
  }
}
