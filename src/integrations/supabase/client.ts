// Supabase is not used in this project — Firebase is used instead.
// This stub is kept so existing imports don't break at compile time.
export const supabase = {
  auth: {
    onAuthStateChange: (_event: any, _cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getSession: async () => ({ data: { session: null } }),
    signOut: async () => {},
  },
};