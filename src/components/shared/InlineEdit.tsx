"use client";

import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import { Check, Pencil, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface InlineEditProps {
  value: string | number | null | undefined;
  onSave: (value: string) => Promise<{ success: boolean; error?: string }>;
  type?: "text" | "textarea" | "number";
  placeholder?: string;
  label?: string;
  className?: string;
  canEdit?: boolean;
}

export default function InlineEdit({
  value: initialValue,
  onSave,
  type = "text",
  placeholder = "Click to edit",
  label,
  className = "",
  canEdit = true,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue ?? "");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentValue(initialValue ?? "");
  }, [initialValue]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = useCallback(async () => {
    const val = String(currentValue).trim();
    if (val === String(initialValue ?? "").trim()) {
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      const result = await onSave(val || "");
      if (result.success) {
        toast.success("Saved");
        setEditing(false);
      } else {
        toast.error(result.error || "Failed to save");
        setCurrentValue(initialValue ?? "");
      }
    } catch {
      toast.error("Save failed");
      setCurrentValue(initialValue ?? "");
    } finally {
      setSaving(false);
    }
  }, [currentValue, initialValue, onSave]);

  const handleCancel = () => {
    setCurrentValue(initialValue ?? "");
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "textarea") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (editing && canEdit) {
    return (
      <div className={`flex items-start gap-2 ${className}`}>
        <div className="flex-1">
          {type === "textarea" ?
            <Textarea
              ref={inputRef as any}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              className="text-sm"
              disabled={saving}
            />
          : <Input
              ref={inputRef as any}
              value={currentValue}
              onChange={(e) =>
                setCurrentValue(
                  type === "number" ? e.target.value : e.target.value,
                )
              }
              onKeyDown={handleKeyDown}
              type={type === "number" ? "number" : "text"}
              className="text-sm"
              disabled={saving}
            />
          }
        </div>
        <div className="flex gap-1 pt-0.5">
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={handleSave}
            disabled={saving}>
            <Check className="size-3 text-green-500" />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={handleCancel}
            disabled={saving}>
            <X className="size-3 text-red-500" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={canEdit ? () => setEditing(true) : undefined}
      className={`group flex cursor-pointer items-center gap-2 ${className} ${canEdit ? "hover:bg-muted -mx-1 rounded-lg px-1 py-0.5 transition-colors" : ""}`}>
      <span className={!currentValue ? "text-muted-foreground italic" : ""}>
        {currentValue || placeholder}
      </span>
      {canEdit && (
        <Pencil className="text-muted-foreground size-3 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </div>
  );
}
