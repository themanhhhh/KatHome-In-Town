'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../input/input';
import { Card, CardContent } from '../card/card';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatProps {
  className?: string;
}

export function AIChat({ className = '' }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là AI Assistant của KatHome In Town. Tôi có thể giúp bạn tìm hiểu về các phòng, đặt phòng, hoặc trả lời các câu hỏi khác. Bạn cần hỗ trợ gì?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue.trim()),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('phòng') || input.includes('room')) {
      return 'Chúng tôi có nhiều loại phòng khác nhau: Standard, Deluxe, VIP, Suite. Mỗi phòng đều có đầy đủ tiện nghi hiện đại. Bạn muốn tìm hiểu về loại phòng nào?';
    }
    
    if (input.includes('giá') || input.includes('price') || input.includes('cost')) {
      return 'Giá phòng dao động từ 500,000đ - 1,500,000đ/đêm tùy theo loại phòng và thời gian. Bạn có thể xem chi tiết giá trong trang tìm kiếm hoặc chi tiết phòng.';
    }
    
    if (input.includes('đặt phòng') || input.includes('book') || input.includes('reservation')) {
      return 'Để đặt phòng, bạn có thể: 1) Tìm kiếm phòng theo ngày và số khách, 2) Chọn phòng phù hợp, 3) Điền thông tin và thanh toán. Tôi có thể hướng dẫn bạn từng bước!';
    }
    
    if (input.includes('tiện nghi') || input.includes('amenities')) {
      return 'Các phòng đều có: WiFi miễn phí, TV, máy lạnh, tủ lạnh mini, phòng tắm riêng, đồ vệ sinh cá nhân, và nhiều tiện nghi khác. Một số phòng còn có ban công và view đẹp!';
    }
    
    if (input.includes('vị trí') || input.includes('location') || input.includes('địa chỉ')) {
      return 'KatHome In Town có nhiều cơ sở tại Hà Nội: Tây Hồ, Ba Đình, Hoàn Kiếm, Thanh Xuân, Đống Đa, Cầu Giấy. Mỗi cơ sở đều có vị trí thuận tiện gần trung tâm.';
    }
    
    if (input.includes('hủy') || input.includes('cancel')) {
      return 'Bạn có thể hủy đặt phòng miễn phí trước 24 tiếng. Sau đó sẽ có phí hủy theo chính sách. Bạn cần hỗ trợ hủy đặt phòng nào không?';
    }
    
    if (input.includes('thanh toán') || input.includes('payment')) {
      return 'Chúng tôi chấp nhận thanh toán bằng: Thẻ tín dụng, chuyển khoản ngân hàng, hoặc thanh toán tại quầy. Bạn có thể thanh toán khi nhận phòng.';
    }
    
    if (input.includes('cảm ơn') || input.includes('thank')) {
      return 'Không có gì! Tôi rất vui được giúp đỡ bạn. Nếu có thêm câu hỏi gì, đừng ngại hỏi nhé! 😊';
    }
    
    // Default response
    const responses = [
      'Tôi hiểu bạn đang hỏi về: "' + userInput + '". Bạn có thể hỏi tôi về phòng, giá, đặt phòng, tiện nghi, hoặc bất kỳ thông tin nào về KatHome In Town.',
      'Để tôi giúp bạn tốt hơn, bạn có thể hỏi cụ thể về: các loại phòng, giá cả, cách đặt phòng, tiện nghi, hoặc vị trí các cơ sở.',
      'Tôi có thể hỗ trợ bạn về thông tin phòng, đặt phòng, giá cả, tiện nghi, và các dịch vụ của KatHome In Town. Bạn muốn biết gì cụ thể?'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: '#3D0301' }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card 
          className={`w-80 shadow-2xl transition-all duration-300 ${
            isMinimized ? 'h-12' : 'h-96'
          }`}
          style={{ backgroundColor: '#fef5f6' }}
        >
          <CardContent className="p-0 h-full flex flex-col">
            {/* Header */}
            <div 
              className="flex items-center justify-between p-3 border-b cursor-pointer"
              style={{ backgroundColor: '#3D0301', borderColor: '#F8E8EC' }}
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-white" />
                <span className="text-white font-medium">AI Assistant</span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                  className="text-white hover:bg-white/20 p-1"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.isUser
                            ? 'rounded-br-sm'
                            : 'rounded-bl-sm'
                        }`}
                        style={{
                          backgroundColor: message.isUser ? '#3D0301' : '#FAD0C4',
                          color: message.isUser ? 'white' : '#3D0301'
                        }}
                      >
                        <div className="flex items-start space-x-2">
                          {!message.isUser && (
                            <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          )}
                          {message.isUser && (
                            <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{message.text}</p>
                            <p 
                              className="text-xs mt-1 opacity-70"
                              style={{ 
                                color: message.isUser ? 'rgba(255,255,255,0.7)' : 'rgba(61,3,1,0.7)' 
                              }}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div
                        className="max-w-[80%] rounded-lg rounded-bl-sm p-3"
                        style={{ backgroundColor: '#FAD0C4', color: '#3D0301' }}
                      >
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t" style={{ borderColor: '#F8E8EC' }}>
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập câu hỏi của bạn..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      size="sm"
                      className="px-3"
                      style={{ backgroundColor: '#3D0301' }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
