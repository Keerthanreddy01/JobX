import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { jobDescription } = await request.json()

    if (!jobDescription?.trim()) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a job posting analyzer. Extract the following information from this job description and return ONLY a valid JSON object with no extra text or markdown:

{
  "role": "exact job title/role",
  "skills": ["skill1", "skill2", "skill3", ...],
  "salary": "salary range or 'Not mentioned'",
  "location": "location or 'Not specified'"
}

Keep skills to the top 10 most important ones. Be concise.

Job Description:
${jobDescription}`,
        },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON from response (handle any markdown wrapping)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse AI response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (error: unknown) {
    console.error('Parse JD error:', error)
    const message = error instanceof Error ? error.message : 'Failed to parse job description'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
