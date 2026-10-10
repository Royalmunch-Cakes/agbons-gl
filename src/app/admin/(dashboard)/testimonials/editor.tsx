"use client";

import { saveDocument } from "@/app/admin/actions";
import { EditorShell, useDocEditor } from "@/components/admin/editor";
import { EditorSection, Repeater, TextInput } from "@/components/admin/fields";
import type { Testimonial } from "@/lib/types";

export function TestimonialsEditor({ initial }: { initial: Testimonial[] }) {
  const ed = useDocEditor(initial, (v) => saveDocument("testimonials", v));

  return (
    <EditorShell
      title="Testimonials"
      description="Client reviews in the homepage carousel. Only publish genuine reviews you have permission to share."
      dirty={ed.dirty}
      pending={ed.pending}
      onSave={() => ed.save()}
      onReset={ed.reset}
    >
      <EditorSection title="Reviews">
        <Repeater
          items={ed.draft}
          onChange={(v) => ed.setDraft(v)}
          create={() => ({ quote: "", name: "", location: "" })}
          itemLabel={(t, i) => t.name || `Review ${i + 1}`}
          addLabel="Add review"
          render={(t, update) => (
            <>
              <TextInput
                label="Quote"
                multiline
                rows={4}
                value={t.quote}
                onChange={(quote) => update({ quote })}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  label="Name"
                  value={t.name}
                  onChange={(name) => update({ name })}
                />
                <TextInput
                  label="Location / occasion"
                  value={t.location}
                  onChange={(location) => update({ location })}
                />
              </div>
            </>
          )}
        />
      </EditorSection>
    </EditorShell>
  );
}
