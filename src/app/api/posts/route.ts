import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Listar posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'todos') {
      query = query.eq('category', category);
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error('Erro ao buscar posts:', error);
      return NextResponse.json({ posts: [] });
    }

    return NextResponse.json({ posts: posts || [] });
  } catch (error) {
    console.error('Erro na API de posts (GET):', error);
    return NextResponse.json({ posts: [] });
  }
}

// POST - Criar novo post
export async function POST(request: NextRequest) {
  try {
    const { user_hash, content, category } = await request.json();

    if (!user_hash || !content || !category) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_hash,
        content,
        category,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar post:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Erro na API de posts (POST):', error);
    return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500 });
  }
}

// PATCH - Curtir/Descurtir post
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { post_id, user_hash } = body;

    if (!post_id || !user_hash) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Buscar o post atual
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('liked_by, likes_count')
      .eq('id', post_id)
      .single();

    if (fetchError || !post) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }

    const likedBy = post.liked_by || [];
    const isLiked = likedBy.includes(user_hash);

    if (isLiked) {
      // Descurtir: remover user_hash do array
      const newLikedBy = likedBy.filter(hash => hash !== user_hash);
      const newLikesCount = Math.max(0, post.likes_count - 1);

      const { error: updateError } = await supabase
        .from('posts')
        .update({
          liked_by: newLikedBy,
          likes_count: newLikesCount
        })
        .eq('id', post_id);

      if (updateError) {
        console.error('Erro ao descurtir post:', updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    } else {
      // Curtir: adicionar user_hash ao array
      const newLikedBy = [...likedBy, user_hash];
      const newLikesCount = post.likes_count + 1;

      const { error: updateError } = await supabase
        .from('posts')
        .update({
          liked_by: newLikedBy,
          likes_count: newLikesCount
        })
        .eq('id', post_id);

      if (updateError) {
        console.error('Erro ao curtir post:', updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no PATCH /api/posts:', error);
    return NextResponse.json({ error: 'Erro ao curtir post' }, { status: 500 });
  }
}