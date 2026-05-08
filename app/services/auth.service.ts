import { signIn, signOut } from "next-auth/react";

export const authService = {
  login: async (email: string, password: string) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) throw new Error("Email o contraseña incorrectos");
    return res;
  },

  logout: async () => {
    await signOut({ redirect: false });
  },
};
