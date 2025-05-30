import { NextResponse } from 'next/server';
import { streamText } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    console.log('Sending to backend:', lastMessage.content);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/ask?question=${encodeURIComponent(lastMessage.content)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get response from backend');
    }

    const data = await response.json();
    const text = data.answer || data.response || '';

    // Create the correct streaming format for useChat
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Split text into chunks for streaming effect
        const words = text.split(' ');
        let index = 0;

        const sendChunk = () => {
          if (index < words.length) {
            // Send only the current word, not accumulated content
            const currentWord = index === 0 ? words[index] : ' ' + words[index];
            
            // Properly escape the word for JSON string
            const escapedWord = currentWord
              .replace(/\\/g, '\\\\')  // escape backslashes first
              .replace(/"/g, '\\"')    // escape quotes
              .replace(/\n/g, '\\n')   // escape newlines
              .replace(/\r/g, '\\r')   // escape carriage returns
              .replace(/\t/g, '\\t');  // escape tabs
            
            // Use the AI SDK format with properly escaped content
            const chunk = `0:"${escapedWord}"\n`;
            controller.enqueue(encoder.encode(chunk));
            
            index++;
            setTimeout(sendChunk, 100);
          } else {
            // Send finish signal
            controller.enqueue(encoder.encode('e:{"finishReason":"stop"}\n'));
            controller.close();
          }
        };

        sendChunk();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    );
  }
}