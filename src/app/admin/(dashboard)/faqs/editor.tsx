"use client";

import { saveDocument } from "@/app/admin/actions";
import { EditorShell, useDocEditor } from "@/components/admin/editor";
import { EditorSection, Repeater, TextInput } from "@/components/admin/fields";
import type { Faq } from "@/content/faqs";

type FaqGroups = { title: string; items: Faq[] }[];

export function FaqsEditor({ initial }: { initial: FaqGroups }) {
  const ed = useDocEditor(initial, (v) => saveDocument("faqs", v));

  return (
    <EditorShell
      title="FAQs"
      description="Grouped questions and answers on the FAQ page (also published to search engines)."
      dirty={ed.dirty}
      pending={ed.pending}
      onSave={() => ed.save()}
      onReset={ed.reset}
    >
      <EditorSection title="Groups">
        <Repeater
          items={ed.draft}
          onChange={(v) => ed.setDraft(v)}
          create={() => ({ title: "", items: [{ q: "", a: "" }] })}
          itemLabel={(g, i) => g.title || `Group ${i + 1}`}
          addLabel="Add group"
          render={(g, update) => (
            <>
              <TextInput
                label="Group title"
                value={g.title}
                onChange={(title) => update({ title })}
              />
              <Repeater
                label="Questions"
                items={g.items}
                onChange={(items) => update({ items })}
                create={() => ({ q: "", a: "" })}
                itemLabel={(f, i) => f.q || `Question ${i + 1}`}
                addLabel="Add question"
                render={(f, updateItem) => (
                  <>
                    <TextInput
                      label="Question"
                      value={f.q}
                      onChange={(q) => updateItem({ q })}
                    />
                    <TextInput
                      label="Answer"
                      multiline
                      rows={3}
                      value={f.a}
                      onChange={(a) => updateItem({ a })}
                    />
                  </>
                )}
              />
            </>
          )}
        />
      </EditorSection>
    </EditorShell>
  );
}
