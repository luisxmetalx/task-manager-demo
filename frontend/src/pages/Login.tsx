import { useState } from "react";
import { api } from "../api";
import { setToken } from "../auth";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Input } from "../ui";

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post("/login", { username, password });
      setToken(data.access_token);
      nav("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
        <div className="w-full space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Task Manager</h1>
            <p className="mt-1 text-sm text-gray-500">Inicia sesión para gestionar tus tareas</p>
          </div>

          <Card>
            <CardHeader title="Iniciar sesión" subtitle="Demo: admin / admin123" />
            <CardBody>
              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Usuario</label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Contraseña</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">
                    {error}
                  </div>
                )}

                <Button variant="primary" disabled={loading} className="w-full">
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </CardBody>
          </Card>

          <p className="text-center text-xs text-gray-400">FastAPI + React + Tailwind</p>
        </div>
      </div>
    </div>
  );
}