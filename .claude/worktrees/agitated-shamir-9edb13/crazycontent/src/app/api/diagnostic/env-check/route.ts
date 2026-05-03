import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  const envVars = {
    ANTHROPIC_API_KEY: {
      exists: !!process.env.ANTHROPIC_API_KEY,
      preview: process.env.ANTHROPIC_API_KEY
        ? `${process.env.ANTHROPIC_API_KEY.substring(0, 20)}...`
        : null,
      timestamp: new Date().toISOString(),
    },
    OPENAI_API_KEY: {
      exists: !!process.env.OPENAI_API_KEY,
      preview: process.env.OPENAI_API_KEY
        ? `${process.env.OPENAI_API_KEY.substring(0, 20)}...`
        : null,
      timestamp: new Date().toISOString(),
    },
  }

  return NextResponse.json({
    status: 'ok',
    environment: envVars,
    message: 'Environment check at ' + new Date().toISOString(),
  })
}
