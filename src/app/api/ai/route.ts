import { NextRequest, NextResponse } from 'next/server'

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'
const NVIDIA_MODEL = 'deepseek-ai/deepseek-r1'

export async function POST(req: NextRequest) {
  try {
    const { action, job_title, company_name, job_description } = await req.json()

    if (!action) {
      return NextResponse.json({ error: 'Missing required field: action' }, { status: 400 })
    }

    let prompt = ''

    if (action === 'parse') {
      if (!job_description?.trim()) {
        return NextResponse.json({ error: 'job_description is required for parse action' }, { status: 400 })
      }
      prompt = `Extract structured information from this job description and return ONLY a valid JSON object (no markdown, no extra text):

{
  "skills_required": ["skill1", "skill2"],
  "experience_level": "Junior/Mid/Senior/Lead",
  "salary": "salary range or null",
  "location": "location or Remote",
  "responsibilities": ["responsibility1", "responsibility2"]
}

Limit skills to the top 8 most important. Limit responsibilities to top 5.

Job Description:
${job_description}`
    } else if (action === 'cover_letter') {
      if (!job_title || !company_name) {
        return NextResponse.json(
          { error: 'job_title and company_name are required for cover_letter action' },
          { status: 400 }
        )
      }
      const jdSection = job_description?.trim()
        ? `\nJob Description:\n${job_description}`
        : ''

      prompt = `Write a professional cover letter for:
Job Title: ${job_title}
Company: ${company_name}${jdSection}

Requirements:
- 3 paragraphs maximum
- Confident, tailored, and specific to the role
- Opening: enthusiasm + why this role/company
- Middle: how your skills align (use [Your Key Skill] as placeholder)
- Closing: call to action
- Use [Your Name] as applicant name placeholder
- Include today's date at the top
- Return ONLY the cover letter, no additional commentary`
    } else {
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }

    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('NVIDIA API error:', response.status, errText)
      return NextResponse.json(
        { error: `NVIDIA API returned ${response.status}: ${errText.slice(0, 200)}` },
        { status: 502 }
      )
    }

    const data = await response.json()
    const result: string = data.choices?.[0]?.message?.content ?? ''

    if (!result) {
      return NextResponse.json({ error: 'Empty response from NVIDIA API' }, { status: 502 })
    }

    return NextResponse.json({ result })
  } catch (error: unknown) {
    console.error('AI route error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
