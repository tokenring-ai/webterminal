import { useCallback, useEffect, useState } from "react";

/**
 * useSession hook for Auth.js/NextAuth.js compatible API
 * Fetches session from /api/auth/session and provides signIn/signOut helpers.
 */
export default function useSession() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch session info
  const fetchSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/session", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch session");
      const data = await res.json();
      setSession(data?.user ? data : null);
    } catch (e) {
      setSession(null);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSession();
    // Optionally, poll or listen for changes
  }, [fetchSession]);

  // Sign out and refresh session
  const signOut = useCallback(async () => {
    await fetch("/api/auth/signout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    setSession(null);
    void fetchSession();
  }, [fetchSession]);

  return {
    data: session,
    loading,
    error,
    signOut,
    refresh: fetchSession,
  };
}
