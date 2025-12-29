import { NextRequest, NextResponse } from 'next/server';  // ✅ Correct imports
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { getRandomInterviewCover } from '@/lib/utils';
import { db } from "@/FireBase/admin";

export async function GET() {
  return NextResponse.json({ success: true, data: 'THANK YOU!' }, { status: 200 });
}

export async function POST(request: NextRequest) {  // ✅ NextRequest type
  try {
    const { type, role, level, techstack, amount, userid } = await request.json();

    const { text: questions } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: `Prepare question for a job interview.
The job role is ${role}.
The job experience level is ${level}.
The tech stack used in the job is: ${techstack}.
The focus between behavioural and technical question should lean towards: ${type}.
The amount of questions required is: ${amount}.
Please return only the questions, without any additional text.
The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice.
Return the question formatted like this:
["Question 1", "Question 2", "Question 3"]`,
    });

    // ✅ Safely parse AI response
    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(questions);
    } catch (parseError) {
      throw new Error(`AI response invalid JSON: ${questions.slice(0, 200)}`);
    }

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(','),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection('interviews').add(interview);

    return NextResponse.json({ success: true }, { status: 200 });  // ✅ NextResponse
  } catch (error) {
    console.error('POST Error:', error);  // ✅ Better logging
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

