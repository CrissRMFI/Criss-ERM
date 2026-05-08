import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Completá todos los campos");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.login(email, password);
      router.push("/factura");
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  };
}
