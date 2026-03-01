import { useEffect, useState } from "react";
import { api } from "../api";
import type { Task, TaskPriority, TaskStatus } from "../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Input, Select, Textarea } from "../ui";

const statusList: TaskStatus[] = ["pending", "in_progress", "completed"];
const priorityList: TaskPriority[] = ["low", "medium", "high"];

export default function TaskForm({ mode }: { mode: "create" | "edit" }) {
  const nav = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadOne() {
      if (mode !== "edit" || !id) return;
      const { data } = await api.get<Task[]>("/tasks");
      const found = data.find((t) => t.id === Number(id));
      if (!found) {
        setError("Task not found");
        return;
      }
      setTitle(found.title);
      setDescription(found.description ?? "");
      setStatus(found.status);
      setPriority(found.priority);
    }
    loadOne().catch((e) => setError(e?.response?.data?.detail ?? "Failed to load"));
  }, [mode, id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      description: description || null,
      status,
      priority,
    };

    try {
      if (mode === "create") {
        await api.post("/tasks", payload);
      } else {
        await api.put(`/tasks/${id}`, payload);
      }
      nav("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {mode === "create" ? "Nueva tarea" : "Editar tarea"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">Completa la información y guarda cambios</p>
        </div>
        <Link to="/">
          <Button variant="secondary">Volver</Button>
        </Link>
      </div>

      <Card>
        <CardHeader title="Detalle" subtitle="Campos obligatorios: title, status, priority" />
        <CardBody>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Implementar login" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Description (opcional)</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Detalles…" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
                  {statusList.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Priority</label>
                <Select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
                  {priorityList.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Link to="/">
                <Button variant="secondary" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button variant="primary" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}