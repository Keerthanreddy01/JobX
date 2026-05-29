import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, companyName, jobDescription } = await request.json()

    if (!jobTitle || !companyName) {
      return NextResponse.json(
        { error: 'Job title and company name are required' },
        { status: 400 }
      )
    }

    const jdSection = jobDescription?.trim()
      ? `\n\nJob Description:\n${jobDescription}`
      : ''

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `Write a professional, personalized cover letter for the following job application. 

Position: ${jobTitle}
Company: ${companyName}${jdSection}

Instructions:
- Write in a professional but warm tone
- Keep it to 3-4 paragraphs
- Include: opening (enthusiasm for the role), body (relevant skills/experience alignment), closing (call to action)
- Use [Your Name] as placeholder for the applicant's name
- Use today's date at the top
- Do NOT include a subject line — start directly with the date
- Make it compelling and specific to the company/role
- Return ONLY the cover letter text, no extra commentary`,
        },
      ],
    })

    const coverLetter = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ coverLetter })
  } catch (error: unknown) {
    console.error('Cover letter error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate cover letter'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
