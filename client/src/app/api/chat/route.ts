import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ;

interface ChatMessage {
  isUser: boolean;
  text: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Prepare conversation context for ChatGPT
    const messages = [
      {
        role: 'system',
        content: `Bạn là AI Assistant của KatHome In Town, một khách sạn cao cấp. 
        Nhiệm vụ của bạn là:
        - Hỗ trợ khách hàng tìm hiểu về các phòng và dịch vụ
        - Trả lời câu hỏi về đặt phòng, giá cả, tiện nghi
        - Cung cấp thông tin về chính sách và quy định
        - Hướng dẫn khách hàng trong quá trình đặt phòng
        - Luôn thân thiện, chuyên nghiệp và hữu ích
        - Trả lời bằng tiếng Việt trừ khi khách hàng hỏi bằng ngôn ngữ khác
        
        Thông tin về KatHome In Town:
        - Khách sạn cao cấp với nhiều loại phòng
        - Có đầy đủ tiện nghi hiện đại (Wifi, điều hòa, TV, v.v.)
        - Dịch vụ chuyên nghiệp và thân thiện
        - Hỗ trợ đặt phòng online 24/7`
      }
    ];

    // Add conversation history
    conversationHistory.forEach((msg: ChatMessage) => {
      messages.push({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    // Call OpenAI API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời câu hỏi này.';

    return NextResponse.json({
      message: aiMessage,
      success: true
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    let errorMessage = 'Xin lỗi, hệ thống AI đang gặp sự cố. Vui lòng thử lại sau.';
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.';
      } else if (error.message.includes('API key')) {
        errorMessage = 'Lỗi cấu hình API. Vui lòng liên hệ quản trị viên.';
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to get AI response',
        message: errorMessage
      },
      { status: 500 }
    );
  }
}