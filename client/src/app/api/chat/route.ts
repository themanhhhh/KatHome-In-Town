import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // OpenAI API configuration
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured' 
      }, { status: 500 });
    }

    // Prepare conversation history for ChatGPT
    const messages = [
      {
        role: 'system',
        content: `Bạn là AI Assistant của KatHome In Town - một hệ thống đặt phòng khách sạn. 
        
        Nhiệm vụ của bạn:
        - Hỗ trợ khách hàng tìm hiểu về các phòng, giá cả, tiện nghi
        - Hướng dẫn quy trình đặt phòng
        - Trả lời câu hỏi về dịch vụ và chính sách
        - Cung cấp thông tin về vị trí và cơ sở
        - Hỗ trợ khách hàng một cách thân thiện và chuyên nghiệp
        
        Thông tin về KatHome In Town:
        - Có nhiều loại phòng: Standard, Deluxe, VIP, Suite
        - Giá phòng: 500,000đ - 1,500,000đ/đêm
        - Có nhiều cơ sở tại Hà Nội: Tây Hồ, Ba Đình, Hoàn Kiếm, Thanh Xuân, Đống Đa, Cầu Giấy
        - Tiện nghi: WiFi, TV, máy lạnh, tủ lạnh mini, phòng tắm riêng
        - Hỗ trợ đặt phòng online 24/7
        
        Hãy trả lời bằng tiếng Việt một cách tự nhiên và hữu ích.`
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenAI API
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
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to get AI response' 
      }, { status: 500 });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời câu hỏi này.';

    return NextResponse.json({ 
      message: aiResponse 
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
