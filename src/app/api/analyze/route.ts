import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get('resume') as File | null;
    const jdText = formData.get('jd') as string | null;

    if (!resumeFile || !jdText) {
      return NextResponse.json({ error: 'Missing resume or JD' }, { status: 400 });
    }

    // Parse Resume
    let resumeText = '';
    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    
    if (resumeFile.name.endsWith('.pdf')) {
      const data = await pdf(buffer);
      resumeText = data.text;
    } else if (resumeFile.name.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      resumeText = result.value;
    } else {
      resumeText = buffer.toString('utf-8');
    }

    // AI Skill Extraction
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert HR recruiter and technical architect. Analyze the provided Job Description and Resume."
        },
        {
          role: "user",
          content: `
            Job Description: ${jdText}
            Resume: ${resumeText}
            
            Based on the Job Description, extract the top 5-7 most important technical skills.
            Then, for each skill, provide:
            1. required_proficiency (1-10)
            2. candidate_proficiency_estimate (1-10 based on resume only)
            
            Output ONLY valid JSON in this format:
            {
              "skills": [
                { "name": "Python", "required": 8, "estimated": 6 },
                ...
              ]
            }
          `
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Analysis error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
