'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import Navigation from '@/components/custom/Navigation';
import { getUserHash } from '@/lib/userHash';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userHash, setUserHash] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = getUserHash();
    setUserHash(hash);
    loadMessages(hash);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async (hash: string) => {
    try {
      const response = await fetch(`/api/chat?user_hash=${hash}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_hash: userHash,
          message: userMessage.content,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: data.response,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A90E2] to-[#A37CFF] text-white p-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Apoio Emocional IA</h1>
            <p className="text-sm text-white/80">Estou aqui para ouvir você</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4 mb-24">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4A90E2] to-[#A37CFF] rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Olá! Como posso ajudar?
            </h2>
            <p className="text-gray-600 text-sm">
              Sinta-se à vontade para compartilhar o que está sentindo.
              <br />
              Tudo aqui é anônimo e seguro.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-[#4A90E2] to-[#A37CFF] text-white'
                  : 'bg-white text-gray-800 shadow-md'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <p
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                }`}
              >
                {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
            rows={1}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-12 h-12 bg-gradient-to-r from-[#4A90E2] to-[#A37CFF] text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
