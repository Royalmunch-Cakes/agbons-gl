"use client";

import { RotateCcwIcon, SaveIcon } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";

import type { ActionResult } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

/**
 * State for editing one content document: local draft, dirty tracking,
 * save via a server action, and a leave-page warning while unsaved.
 */
export function useDocEditor<T, R extends ActionResult = ActionResult>(
  initial: T,
  save: (value: T) => Promise<R>,
) {
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = useCallback((patch: Partial<T> | ((d: T) => T)) => {
    setDraft((d) =>
      typeof patch === "function" ? patch(d) : { ...d, ...patch },
    );
  }, []);

  const submit = useCallback(
    (value: T = draft, onSuccess?: (result: R) => void) => {
      startTransition(async () => {
        const result = await save(value);
        if (result.ok) {
          setSaved(value);
          setDraft(value);
          toast.add({
            title: "Saved",
            description: "The website has been updated.",
            type: "success",
          });
          onSuccess?.(result);
        } else {
          toast.add({
            title: "Not saved",
            description: result.error,
            type: "error",
          });
        }
      });
    },
    [draft, save],
  );

  return {
    draft,
    setDraft,
    update,
    dirty,
    pending,
    save: submit,
    reset: () => setDraft(saved),
  };
}

export function EditorShell({
  title,
  description,
  dirty,
  pending,
  onSave,
  onReset,
  actions,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  dirty: boolean;
  pending: boolean;
  onSave: () => void;
  onReset: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 pb-24">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl md:text-4xl">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur md:left-(--sidebar-width)">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <div className="text-sm">
            {dirty ? (
              <Badge variant="brand">Unsaved changes</Badge>
            ) : (
              <span className="text-muted-foreground">All changes saved</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onReset}
              disabled={!dirty || pending}
            >
              <RotateCcwIcon data-icon="inline-start" />
              Discard
            </Button>
            <Button onClick={onSave} disabled={!dirty || pending}>
              {pending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SaveIcon data-icon="inline-start" />
              )}
              Save & publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
