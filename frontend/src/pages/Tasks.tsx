import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import type { Task, TaskStatus } from "../types";
import { clearToken } from "../auth";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card, CardBody, CardHeader, Select } from "../ui";

const statusOptions: Array<{ label: string; value: TaskStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "pending", value: "pending" },
  { label: "in_progress", value: "in_progress" },
  { label: "completed", value: "completed" },
];

function statusTone(s: TaskStatus) {
  if (s === "pending") return "yellow";
  if (s === "in_progress") return "blue";
  return "green";
}

function priorityTone(p: Task["priority"]) {
  if (p === "high") return "red";
  if (p === "medium") return "blue";
  return "gray";
}

export default function Tasks() {
  const nav = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const url = useMemo(() => (status === "all" ? "/tasks" : `/tasks?status=${status}`), [status]);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.get<Task[]>(url);
      setTasks(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Error loading tasks");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("¿Eliminar tarea?")) return;
    await api.delete(`/tasks/${id}`);
    await load();
  }

  function logout() {
    clearToken();
    nav("/login");
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Tareas</h1>
          <p className="mt-1 text-sm text-gray-500">Crea, edita y filtra por estado</p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/tasks/new">
            <Button variant="primary">+ Nueva</Button>
          </Link>
          <Button variant="secondary" onClick={logout}>
            Salir
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Lista"
          subtitle="Filtra por estado y gestiona tus tareas"
          right={
            <div className="flex items-center gap-2">
              <div className="w-44">
                <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  {statusOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </div>
              <Button variant="secondary" onClick={load} disabled={loading}>
                {loading ? "Cargando..." : "Refrescar"}
              </Button>
            </div>
          }
        />
        <CardBody>
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">
              {error}
            </div>
          )}

          {tasks.length === 0 && !loading ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <p className="text-sm text-gray-600">No hay tareas para este filtro.</p>
              <div className="mt-4">
                <Link to="/tasks/new">
                  <Button variant="primary">Crear primera tarea</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">Título</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Estado</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Prioridad</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Actualizado</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id} className="border-t bg-white hover:bg-gray-50/60">
                      <td className="px-4 py-3">
                        <div className="font-medium">{t.title}</div>
                        {t.description && <div className="mt-0.5 text-gray-500">{t.description}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={statusTone(t.status)}>{t.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={priorityTone(t.priority)}>{t.priority}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(t.updated_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link to={`/tasks/${t.id}/edit`}>
                            <Button variant="secondary">Editar</Button>
                          </Link>
                          <Button variant="danger" onClick={() => onDelete(t.id)}>
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {loading && (
                <div className="border-t bg-white px-4 py-3 text-sm text-gray-500">
                  Cargando...
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}