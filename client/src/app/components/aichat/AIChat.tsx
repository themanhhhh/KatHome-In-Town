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
  const [isUsingChatGPT, setIsUsingChatGPT] = useState(true); // Default to ChatGPT
  const [apiError, setApiError] = useState(false);
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
    const currentInput = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      if (isUsingChatGPT) {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentInput,
            conversationHistory: messages.slice(-10) // Send last 10 messages for context
          })
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message || 'Xin lỗi, tôi không thể trả lời câu hỏi này.',
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setApiError(false);
      } else {
        // Use local response
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateAIResponse(currentInput),
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('Chat API error:', error);
      setApiError(true);
      
      // Fallback to local response if API fails
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(currentInput),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('phòng') || input.includes('room')) {
      return 'Chúng tôi có nhiều loại phòng khác nhau với đầy đủ tiện nghi hiện đại. Bạn có thể tìm kiếm phòng theo nhu cầu của mình.';
    }
    
    if (input.includes('giá') || input.includes('price') || input.includes('cost')) {
      return 'Giá phòng được cập nhật theo thời gian thực. Bạn có thể xem chi tiết giá trong trang tìm kiếm hoặc chi tiết phòng.';
    }
    
    if (input.includes('đặt phòng') || input.includes('book') || input.includes('reservation')) {
      return 'Để đặt phòng, bạn có thể tìm kiếm phòng theo ngày và số khách, sau đó chọn phòng phù hợp và điền thông tin.';
    }
    
    if (input.includes('liên hệ') || input.includes('contact') || input.includes('phone')) {
      return 'Bạn có thể liên hệ với chúng tôi qua hotline hoặc email. Thông tin liên hệ được hiển thị trên trang chủ.';
    }
    
    if (input.includes('cảm ơn') || input.includes('thank')) {
      return 'Không có gì! Tôi rất vui được giúp đỡ bạn. Nếu có thêm câu hỏi gì, đừng ngại hỏi nhé! 😊';
    }
    
    // Default response when API is unavailable
    return 'Xin chào! Tôi là trợ lý ảo của KatHome In Town. Hiện tại hệ thống AI đang tạm thời không khả dụng. Bạn có thể liên hệ trực tiếp với chúng tôi để được hỗ trợ.';
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
    <div className={`fixed bottom-4 right-4 z-50 ${className}`} data-aichat="true">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: '#82213D' }}
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
              className="flex items-center justify-between p-3 border-b cursor-pointer rounded-t-xl"
              style={{ backgroundColor: '#82213D', borderColor: '#F8E8EC' }}
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-white" />
                <span className="text-white font-medium">AI Assistant</span>
                {isUsingChatGPT && !apiError && (
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-xl">
                    ChatGPT
                  </span>
                )}
                {apiError && (
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-xl">
                    Offline
                  </span>
                )}
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
                        className={`max-w-[80%] rounded-xl p-3 ${
                          message.isUser
                            ? 'rounded-br-sm'
                            : 'rounded-bl-sm'
                        }`}
                        style={{
                          backgroundColor: message.isUser ? '#82213D' : '#FAD0C4',
                          color: message.isUser ? '#ffffff' : '#82213D',
                          border: message.isUser ? '1px solid #F8E8EC' : '1px solid #F8E8EC'
                        }}
                      >
                        <div className="flex items-start space-x-2">
                          {!message.isUser && (
                            <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          )}
                          {message.isUser && (
                            <User 
                              className="w-4 h-4 mt-0.5 flex-shrink-0" 
                              style={{ 
                                color: '#ffffff',
                                fill: '#ffffff',
                                stroke: '#ffffff'
                              }} 
                            />
                          )}
                          <div className="flex-1">
                            <p 
                              className="text-sm"
                              style={{ 
                                color: message.isUser ? '#ffffff' : '#82213D',
                                WebkitTextFillColor: message.isUser ? '#ffffff' : '#82213D',
                                fontWeight: message.isUser ? 'bold' : 'normal',
                                backgroundColor: message.isUser ? '#88213D' : 'transparent'
                              }}
                            >
                              {message.text}
                            </p>
                            <p 
                              className="text-xs mt-1 opacity-80"
                              style={{ 
                                color: message.isUser ? 'rgba(255,255,255,0.9)' : 'rgba(61,3,1,0.7)',
                                WebkitTextFillColor: message.isUser ? 'rgba(255,255,255,0.9)' : 'rgba(61,3,1,0.7)'
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
                          className="max-w-[80%] rounded-xl rounded-bl-sm p-3"
                          style={{ 
                            backgroundColor: '#FAD0C4', 
                            color: '#82213D',
                            border: '1px solid #F8E8EC'
                          }}
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
                  {/* API Status */}
                  {apiError && (
                    <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                      ⚠️ ChatGPT API không khả dụng. Đang sử dụng chế độ offline.
                    </div>
                  )}
                  
                  {/* Toggle ChatGPT */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">AI Mode:</span>
                      <button
                        onClick={() => {
                          setIsUsingChatGPT(!isUsingChatGPT);
                          setApiError(false);
                        }}
                        className={`text-xs px-2 py-1 rounded-xl transition-colors ${
                          isUsingChatGPT 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                        style={{ border: '1px solid #F8E8EC' }}
                      >
                        {isUsingChatGPT ? 'ChatGPT' : 'Local'}
                      </button>
                    </div>
                    {isUsingChatGPT && !apiError && (
                      <span className="text-xs text-green-600">Powered by OpenAI</span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập câu hỏi của bạn..."
                      className="flex-1 rounded-xl"
                      style={{ borderColor: '#F8E8EC' }}
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      size="sm"
                      className="px-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ 
                        backgroundColor: '#82213D',
                        border: '1px solid #F8E8EC',
                        color: '#ffffff'
                      }}
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
