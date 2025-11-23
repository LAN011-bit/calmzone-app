'use client';

import { useState, useEffect } from 'react';
import { Heart, Plus, Filter } from 'lucide-react';
import { getUserHash } from '@/lib/userHash';

interface Post {
  id: string;
  content: string;
  category: string;
  likes_count: number;
  created_at: string;
  user_hash: string;
}

const categories = ['Todos', 'Amor', 'Ansiedade', 'Família', 'Amizade', 'Motivação', 'Trabalho', 'Saúde'];

export default function MuralPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Motivação');
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [userHash, setUserHash] = useState('');

  useEffect(() => {
    const hash = getUserHash();
    setUserHash(hash);
    loadPosts();
    loadLikedPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    try {
      const category = selectedCategory === 'Todos' ? '' : selectedCategory;
      const response = await fetch(`/api/posts?category=${category}`);
      
      if (!response.ok) {
        console.error('Erro ao carregar posts:', response.status);
        return;
      }
      
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    }
  };

  const loadLikedPosts = () => {
    const liked = localStorage.getItem('likedPosts');
    if (liked) {
      setLikedPosts(new Set(JSON.parse(liked)));
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_hash: userHash,
          content: newPostContent,
          category: newPostCategory,
        }),
      });

      if (response.ok) {
        setNewPostContent('');
        setShowNewPost(false);
        loadPosts();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao criar post');
      }
    } catch (error) {
      console.error('Erro ao criar post:', error);
      alert('Erro ao criar post. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          post_id: postId,
          user_hash: userHash 
        }),
      });

      if (response.ok) {
        const newLiked = new Set(likedPosts);
        if (newLiked.has(postId)) {
          newLiked.delete(postId);
        } else {
          newLiked.add(postId);
        }
        setLikedPosts(newLiked);
        localStorage.setItem('likedPosts', JSON.stringify([...newLiked]));
        loadPosts();
      }
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Agora há pouco';
    if (hours < 24) return `Há ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `Há ${days}d`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mural Anônimo</h1>
              <p className="text-sm text-gray-500">Compartilhe seus sentimentos</p>
            </div>
            <button
              onClick={() => setShowNewPost(!showNewPost)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Novo Post */}
        {showNewPost && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-in fade-in slide-in-from-top duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Novo Desabafo</h3>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Escreva o que está sentindo..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
              rows={4}
            />
            <div className="flex items-center gap-3 mt-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value)}
                className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                {categories.filter(c => c !== 'Todos').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                onClick={handleCreatePost}
                disabled={loading || !newPostContent.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Nenhum post ainda nesta categoria</p>
              <p className="text-gray-400 text-sm mt-2">Seja o primeiro a compartilhar!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(post.created_at)}</span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      likedPosts.has(post.id)
                        ? 'bg-pink-100 text-pink-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{post.likes_count}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
