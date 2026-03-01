import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">{children}</div>;
}

export function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="px-5 py-4">{children}</div>;
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-60 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-black/90"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "border bg-white hover:bg-gray-50";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10 ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10 ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10 ${props.className ?? ""}`}
    />
  );
}

export function Badge({
  tone,
  children,
}: {
  tone: "gray" | "yellow" | "blue" | "green" | "red";
  children: React.ReactNode;
}) {
  const map = {
    gray: "bg-gray-100 text-gray-700",
    yellow: "bg-yellow-100 text-yellow-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}