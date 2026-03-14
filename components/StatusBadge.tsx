import type { BookStatus } from "@/types";

const STATUS_CONFIG: Record<
  BookStatus,
  { label: string; classes: string; spine: string }
> = {
  want_to_read: {
    label: "Want to Read",
    classes: "bg-warm/15 text-warm-dark border-warm/30",
    spine: "bg-warm",
  },
  reading: {
    label: "Reading",
    classes: "bg-sage-pale text-sage-deep border-sage/30",
    spine: "bg-sage",
  },
  read: {
    label: "Read",
    classes: "bg-sage-dark/10 text-sage-deep border-sage-dark/25",
    spine: "bg-sage-dark",
  },
};

interface StatusBadgeProps {
  status: BookStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const { label, classes } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center border rounded-full font-lora font-medium ${classes} ${
        size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-3 py-1"
      }`}
    >
      {label}
    </span>
  );
}

export function getSpineColor(status: BookStatus): string {
  return STATUS_CONFIG[status].spine;
}
