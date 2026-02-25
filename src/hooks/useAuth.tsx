import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { auth as firebaseAuth } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { signOut as firebaseSignOut } from "firebase/auth";
import { syncSocialUser } from "@/lib/api";
import type { User } from "@supabase/supabase-js";
import type { User as FirebaseUser } from "firebase/auth";

const TOKEN_KEY = "imi_token";

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
  provider: "supabase" | "firebase";
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const syncBackendToken = useCallback(async (email: string, name: string, provider: string) => {
    try {
      const res = await syncSocialUser(email, name, provider);
      localStorage.setItem(TOKEN_KEY, res.token);
    } catch {
      // Silently fail — payment will re-prompt if token missing
    }
  }, []);

  useEffect(() => {
    let supabaseUser: User | null = null;
    let firebaseUser: FirebaseUser | null = null;
    let supabaseReady = false;
    let firebaseReady = false;

    const resolve = () => {
      if (!supabaseReady || !firebaseReady) return;
      if (firebaseUser) {
        const authUser: AuthUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || null,
          provider: "firebase",
        };
        setUser(authUser);
        if (firebaseUser.email) {
          syncBackendToken(firebaseUser.email, authUser.displayName || "", "google");
        }
      } else if (supabaseUser) {
        const name =
          supabaseUser.user_metadata?.full_name ||
          supabaseUser.user_metadata?.name ||
          supabaseUser.email?.split("@")[0] || "";
        const authUser: AuthUser = {
          id: supabaseUser.id,
          email: supabaseUser.email ?? null,
          displayName: name,
          provider: "supabase",
        };
        setUser(authUser);
        if (supabaseUser.email) {
          syncBackendToken(supabaseUser.email, name, "supabase");
        }
      } else {
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
      }
      setLoading(false);
    };

    // Track Supabase auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      supabaseUser = session?.user ?? null;
      supabaseReady = true;
      resolve();
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      supabaseUser = session?.user ?? null;
      supabaseReady = true;
      resolve();
    });

    // Track Firebase auth
    const unsubFirebase = onAuthStateChanged(firebaseAuth, (fbUser) => {
      firebaseUser = fbUser;
      firebaseReady = true;
      resolve();
    });

    return () => {
      subscription.unsubscribe();
      unsubFirebase();
    };
  }, [syncBackendToken]);

  const signOut = async () => {
    localStorage.removeItem(TOKEN_KEY);
    await Promise.allSettled([
      supabase.auth.signOut(),
      firebaseSignOut(firebaseAuth),
    ]);
  };

  return { user, loading, signOut };
};
