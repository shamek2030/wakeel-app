import { useState, useCallback } from 'react';

function apiBase() {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) {
    const clean = domain.replace(/^https?:\/\//, '');
    return `https://${clean}/api`;
  }
  return '/api';
}

/**
 * useAI — drafts official Arabic administrative text through the backend
 * Anthropic proxy. Pro-only: callers should gate access via usePro().
 */
export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async ({ system, prompt, maxTokens = 1200 }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase()}/anthropic/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system, prompt, maxTokens }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `فشل الاتصال بالخدمة (${res.status})`);
      }
      const data = await res.json();
      return data.text || '';
    } catch (e) {
      setError(e.message || 'تعذر إنشاء النص');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading, error };
}

export default useAI;
