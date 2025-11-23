import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Buscar histórico de humor
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_hash = searchParams.get('user_hash');

    if (!user_hash) {
      return NextResponse.json(
        { error: 'user_hash é obrigatório' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .eq('user_hash', user_hash)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ moods: data });
  } catch (error) {
    console.error('Erro ao buscar humores:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar humores' },
      { status: 500 }
    );
  }
}

// POST - Registrar novo humor
export async function POST(request: NextRequest) {
  try {
    const { user_hash, mood, note } = await request.json();

    if (!user_hash || !mood) {
      return NextResponse.json(
        { error: 'user_hash e mood são obrigatórios' },
        { status: 400 }
      );
    }

    const validMoods = ['feliz', 'neutro', 'triste', 'ansioso', 'calmo'];
    if (!validMoods.includes(mood)) {
      return NextResponse.json(
        { error: 'Humor inválido' },
        { status: 400 }
      );
    }

    // Verifica se já registrou humor hoje
    const today = new Date().toISOString().split('T')[0];
    const { data: existingMood } = await supabase
      .from('moods')
      .select('*')
      .eq('user_hash', user_hash)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)
      .single();

    if (existingMood) {
      // Atualiza humor do dia
      const { data, error } = await supabase
        .from('moods')
        .update({ mood, note })
        .eq('id', existingMood.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ mood: data, updated: true });
    }

    // Cria novo registro
    const { data, error } = await supabase
      .from('moods')
      .insert({
        user_hash,
        mood,
        note: note || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ mood: data, updated: false });
  } catch (error) {
    console.error('Erro ao registrar humor:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar humor' },
      { status: 500 }
    );
  }
}
