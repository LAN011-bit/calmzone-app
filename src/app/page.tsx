'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Users, Heart, Wind, Sparkles } from 'lucide-react';
import Navigation from '@/components/custom/Navigation';
import { getUserHash } from '@/lib/userHash';

export default function Home() {
  const [userHash, setUserHash] = useState<string>('');

  useEffect(() => {
    // Gera ou recupera o user_hash ao carregar o app
    const hash = getUserHash();
    setUserHash(hash);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90E2] to-[#A37CFF] pb-20">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Logo e Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-[#4A90E2]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">CalmZone</h1>
          <p className="text-white/90 text-lg">Seu espaço de apoio emocional</p>
        </div>

        {/* Botões Principais */}
        <div className="space-y-4 mb-6">
          <Link
            href="/chat"
            className="block w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#4A90E2] to-[#A37CFF] rounded-xl flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">Desabafar com IA</h2>
                <p className="text-gray-600 text-sm">Converse de forma anônima e segura</p>
              </div>
            </div>
          </Link>

          <Link
            href="/mural"
            className="block w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#A37CFF] to-[#4A90E2] rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">Mural Anônimo</h2>
                <p className="text-gray-600 text-sm">Compartilhe e leia desabafos</p>
              </div>
            </div>
          </Link>

          <Link
            href="/humor"
            className="block w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-red-400 rounded-xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">Meu Humor Diário</h2>
                <p className="text-gray-600 text-sm">Registre como você está se sentindo</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Botão Exercícios de Calma */}
        <Link
          href="/exercicios"
          className="block w-full bg-white/20 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/40 hover:bg-white/30 transition-all"
        >
          <div className="flex items-center gap-3 justify-center">
            <Wind className="w-6 h-6 text-white" />
            <span className="text-white font-semibold text-lg">Exercícios de Calma</span>
          </div>
        </Link>

        {/* Informação de Privacidade */}
        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm">
            🔒 Totalmente anônimo e seguro
          </p>
          {userHash && (
            <p className="text-white/60 text-xs mt-2">
              ID: {userHash.substring(0, 8)}...
            </p>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
}
