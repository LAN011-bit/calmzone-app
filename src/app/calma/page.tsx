'use client';

import { useState, useEffect } from 'react';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';

const phrases = [
  'Respire fundo. Você está seguro.',
  'Este momento vai passar.',
  'Você é mais forte do que imagina.',
  'Um passo de cada vez.',
  'Está tudo bem não estar bem.',
  'Você merece paz e tranquilidade.',
  'Seja gentil consigo mesmo.',
  'Você não está sozinho.',
];

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

export default function CalmaPage() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [counter, setCounter] = useState(4);
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setCounter((prev) => {
          if (prev > 1) return prev - 1;

          // Mudar fase
          switch (phase) {
            case 'inhale':
              setPhase('hold');
              return 4;
            case 'hold':
              setPhase('exhale');
              return 6;
            case 'exhale':
              setPhase('rest');
              setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
              return 2;
            case 'rest':
              setPhase('inhale');
              return 4;
            default:
              return 4;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCounter(4);
    setCurrentPhrase(phrases[0]);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Inspire';
      case 'hold':
        return 'Segure';
      case 'exhale':
        return 'Expire';
      case 'rest':
        return 'Descanse';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-cyan-400';
      case 'hold':
        return 'from-purple-400 to-pink-400';
      case 'exhale':
        return 'from-green-400 to-emerald-400';
      case 'rest':
        return 'from-yellow-400 to-orange-400';
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-150';
      case 'hold':
        return 'scale-150';
      case 'exhale':
        return 'scale-75';
      case 'rest':
        return 'scale-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full">
              <Wind className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Exercícios de Calma</h1>
              <p className="text-sm text-gray-500">Respiração guiada para relaxamento</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Área de Respiração */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Círculo Animado */}
            <div className="relative w-64 h-64 mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-48 h-48 rounded-full bg-gradient-to-br ${getPhaseColor()} transition-all duration-1000 ease-in-out ${
                    isActive ? getCircleScale() : 'scale-100'
                  } shadow-2xl flex items-center justify-center`}
                >
                  <div className="text-center text-white">
                    <div className="text-6xl font-bold mb-2">{counter}</div>
                    <div className="text-lg font-medium">{getPhaseText()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Frase Motivacional */}
            <div className="text-center mb-8 px-4">
              <p className="text-xl text-gray-700 font-medium leading-relaxed">
                {currentPhrase}
              </p>
            </div>

            {/* Controles */}
            <div className="flex gap-4">
              <button
                onClick={handleToggle}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-500 to-pink-500'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Começar
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5" />
                Reiniciar
              </button>
            </div>
          </div>
        </div>

        {/* Instruções */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Como Funciona</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-gray-800">Inspire (4 segundos)</p>
                <p className="text-sm text-gray-600">Respire profundamente pelo nariz</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-gray-800">Segure (4 segundos)</p>
                <p className="text-sm text-gray-600">Mantenha o ar nos pulmões</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-gray-800">Expire (6 segundos)</p>
                <p className="text-sm text-gray-600">Solte o ar lentamente pela boca</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-medium text-gray-800">Descanse (2 segundos)</p>
                <p className="text-sm text-gray-600">Relaxe antes de repetir</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
