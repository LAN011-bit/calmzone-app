'use client';

import { useState, useEffect } from 'react';
import { Smile, Meh, Frown, Heart, Cloud, Calendar } from 'lucide-react';
import { getUserHash } from '@/lib/userHash';

interface Mood {
  id: string;
  mood: string;
  note: string;
  created_at: string;
}

const moodOptions = [
  { value: 'feliz', label: 'Feliz', icon: Smile, color: 'from-yellow-400 to-orange-400', bg: 'bg-yellow-50' },
  { value: 'calmo', label: 'Calmo', icon: Cloud, color: 'from-blue-400 to-cyan-400', bg: 'bg-blue-50' },
  { value: 'neutro', label: 'Neutro', icon: Meh, color: 'from-gray-400 to-gray-500', bg: 'bg-gray-50' },
  { value: 'ansioso', label: 'Ansioso', icon: Heart, color: 'from-purple-400 to-pink-400', bg: 'bg-purple-50' },
  { value: 'triste', label: 'Triste', icon: Frown, color: 'from-indigo-400 to-blue-500', bg: 'bg-indigo-50' },
];

export default function HumorPage() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [todayMood, setTodayMood] = useState<Mood | null>(null);

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    try {
      const userHash = getUserHash();
      const response = await fetch(`/api/moods?user_hash=${userHash}`);
      const data = await response.json();
      setMoods(data.moods || []);
      
      // Verificar se já registrou humor hoje
      const today = new Date().toISOString().split('T')[0];
      const moodToday = data.moods?.find((m: Mood) => 
        m.created_at.startsWith(today)
      );
      setTodayMood(moodToday || null);
    } catch (error) {
      console.error('Erro ao carregar humores:', error);
    }
  };

  const handleSaveMood = async () => {
    if (!selectedMood) return;

    setLoading(true);
    try {
      const userHash = getUserHash();
      const response = await fetch('/api/moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_hash: userHash,
          mood: selectedMood,
          note: note.trim(),
        }),
      });

      if (response.ok) {
        setSelectedMood('');
        setNote('');
        loadMoods();
      }
    } catch (error) {
      console.error('Erro ao salvar humor:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Hoje';
    if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
    
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const getMoodIcon = (moodValue: string) => {
    const mood = moodOptions.find(m => m.value === moodValue);
    return mood || moodOptions[2];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">Meu Humor Diário</h1>
          <p className="text-sm text-gray-500 mt-1">Como você está se sentindo hoje?</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Registro de Humor */}
        {!todayMood ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Registrar Humor de Hoje</h3>
            
            {/* Seleção de Humor */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              {moodOptions.map((mood) => {
                const Icon = mood.icon;
                return (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 ${
                      selectedMood === mood.value
                        ? `${mood.bg} ring-2 ring-offset-2 ring-blue-400 scale-105`
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`p-3 rounded-full bg-gradient-to-br ${mood.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{mood.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Anotação */}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Quer adicionar uma anotação? (opcional)"
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none mb-4"
              rows={3}
            />

            <button
              onClick={handleSaveMood}
              disabled={loading || !selectedMood}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Salvar Humor'}
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 mb-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500 rounded-full">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Humor de Hoje Registrado!</h3>
            </div>
            <p className="text-green-700">Você já registrou seu humor hoje. Volte amanhã para um novo registro.</p>
          </div>
        )}

        {/* Histórico */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Histórico de Humor</h3>
          
          {moods.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhum registro ainda</p>
              <p className="text-gray-400 text-sm mt-1">Comece registrando seu humor hoje!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {moods.map((mood) => {
                const moodData = getMoodIcon(mood.mood);
                const Icon = moodData.icon;
                
                return (
                  <div
                    key={mood.id}
                    className={`${moodData.bg} rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-300`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full bg-gradient-to-br ${moodData.color} flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-800">{moodData.label}</span>
                          <span className="text-xs text-gray-500">{formatDate(mood.created_at)}</span>
                        </div>
                        {mood.note && (
                          <p className="text-sm text-gray-600 leading-relaxed">{mood.note}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
