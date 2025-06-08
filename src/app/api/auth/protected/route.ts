import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ protected: false });
}

export async function POST() {
  return NextResponse.json({ protected: false });
}

export async function PUT() {
  return NextResponse.json({ protected: false });
}