import { useState, useEffect, useCallback } from "react";
import { auth as firebaseAuth } from "@/integrations/firebase/client";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { syncSocialUser } from "@/lib/api";

const TOKEN_KEY = "imi_token";

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
  provider: "firebase";
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
    const unsubFirebase = onAuthStateChanged(firebaseAuth, (fbUser) => {
      if (fbUser) {
        const authUser: AuthUser = {
          id: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split("@")[0] || null,
          provider: "firebase",
        };
        setUser(authUser);
        if (fbUser.email) {
          syncBackendToken(fbUser.email, authUser.displayName || "", "google");
        }
      } else {
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
      }
      setLoading(false);
    });

    return () => unsubFirebase();
  }, [syncBackendToken]);

  const signOut = async () => {
    localStorage.removeItem(TOKEN_KEY);
    await firebaseSignOut(firebaseAuth);
  };

  return { user, loading, signOut };
};
