import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = 'AIzaSyB76hmllaS6PCHkxPpuoIWFrUhOyzsk3sc'

export async function POST(request: NextRequest) {
  try {
    const { analysisText } = await request.json()

    if (!analysisText) {
      return NextResponse.json({ error: 'Analysis text is required' }, { status: 400 })
    }

    const prompt = `
Analyze the following resume analysis text and extract ONLY the essential information in a clean, concise format:

${analysisText}

Return a JSON object with this EXACT structure:
{
  "summary": "One sentence summary of the overall analysis",
  "matchScore": "X%" (extract the percentage match score if mentioned),
  "keywordsFound": ["keyword1", "keyword2", "keyword3"] (individual keywords only, no descriptions),
  "missingKeywords": ["keyword1", "keyword2", "keyword3"] (individual keywords only, no descriptions),  
  "skillsGap": ["skill1", "skill2", "skill3"] (individual skills only, no descriptions),
  "quickWins": ["action1", "action2", "action3"] (short actionable recommendations, max 6 words each),
  "categories": {
    "technical": ["tech1", "tech2"],
    "soft": ["soft1", "soft2"], 
    "tools": ["tool1", "tool2"],
    "frameworks": ["framework1", "framework2"]
  }
}

Rules:
- Keep keywords as single words or 2-word phrases maximum
- No long descriptions or explanations
- Extract only the most important items (max 8 per category)
- Quick wins should be short, actionable phrases
- If match score isn't mentioned, omit that field
- Focus on clean, scannable content
`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    })

    if (!response.ok) {
      throw new Error('Failed to call Gemini API')
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API')
    }

    const generatedText = data.candidates[0].content.parts[0].text
    
    // Clean up the response and parse JSON
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini response')
    }

    const parsedResult = JSON.parse(jsonMatch[0])
    
    return NextResponse.json(parsedResult)

  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json({ 
      error: 'Failed to parse analysis with AI',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
