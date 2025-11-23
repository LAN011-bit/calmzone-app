'use client';

import { v4 as uuidv4 } from 'uuid';

const USER_HASH_KEY = 'calmzone_user_hash';

/**
 * Gera ou recupera o user_hash anônimo do usuário
 * Este hash identifica o usuário sem revelar identidade
 */
export function getUserHash(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  // Verifica se já existe um hash salvo
  let userHash = localStorage.getItem(USER_HASH_KEY);

  // Se não existe, cria um novo
  if (!userHash) {
    userHash = uuidv4();
    localStorage.setItem(USER_HASH_KEY, userHash);
  }

  return userHash;
}

/**
 * Remove o user_hash (útil para testes ou reset)
 */
export function clearUserHash(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_HASH_KEY);
  }
}
