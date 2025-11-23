import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const SYSTEM_PROMPT = `Você é uma IA de apoio emocional do aplicativo CalmZone. Seu papel é:

- Ser empático, acolhedor e gentil
- Ouvir sem julgamentos
- Fazer perguntas abertas para ajudar a pessoa a se expressar
- Encorajar e validar sentimentos
- Usar linguagem suave e humana

IMPORTANTE:
- NUNCA dê diagnósticos médicos
- NUNCA substitua profissionais de saúde mental
- Se a pessoa mencionar pensamentos suicidas ou auto-lesão, encoraje buscar ajuda profissional imediatamente (CVV 188)
- Mantenha respostas curtas e naturais (2-4 frases)

Exemplos de respostas:
- "Eu entendo o que você está sentindo. Pode me contar mais sobre isso?"
- "Isso deve ser muito difícil para você. Estou aqui para ouvir."
- "Seus sentimentos são válidos. Como você está lidando com isso?"`;

// GET - Buscar histórico de mensagens
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

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_hash', user_hash)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Erro ao buscar mensagens:', error);
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('Erro na API de chat (GET):', error);
    return NextResponse.json({ messages: [] });
  }
}

// POST - Enviar mensagem e receber resposta da IA
export async function POST(request: NextRequest) {
  try {
    const { user_hash, message } = await request.json();

    if (!user_hash || !message) {
      return NextResponse.json(
        { error: 'user_hash e message são obrigatórios' },
        { status: 400 }
      );
    }

    // Salva mensagem do usuário no Supabase
    const { error: userMessageError } = await supabase
      .from('messages')
      .insert({
        user_hash,
        role: 'user',
        content: message,
      });

    if (userMessageError) {
      console.error('Erro ao salvar mensagem do usuário:', userMessageError);
    }

    // Busca histórico recente (últimas 10 mensagens)
    const { data: history } = await supabase
      .from('messages')
      .select('role, content')
      .eq('user_hash', user_hash)
      .order('created_at', { ascending: false })
      .limit(10);

    // Inverte para ordem cronológica e mapeia roles corretamente
    const messages = (history?.reverse() || []).map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })) as Array<{ role: 'user' | 'assistant'; content: string }>;

    // Chama OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const aiResponse = completion.choices[0].message.content || 'Desculpe, não consegui processar sua mensagem.';

    // Salva resposta da IA no Supabase
    const { error: aiMessageError } = await supabase
      .from('messages')
      .insert({
        user_hash,
        role: 'ai',
        content: aiResponse,
      });

    if (aiMessageError) {
      console.error('Erro ao salvar mensagem da IA:', aiMessageError);
    }

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Erro na API de chat:', error);
    return NextResponse.json(
      { error: 'Erro ao processar mensagem', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}