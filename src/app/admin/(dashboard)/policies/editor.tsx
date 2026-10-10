"use client";

import { saveDocument } from "@/app/admin/actions";
import { EditorShell, useDocEditor } from "@/components/admin/editor";
import {
  EditorSection,
  SectionsInput,
  SwitchInput,
  TextInput,
} from "@/components/admin/fields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PolicyDoc } from "@/content/legal";

export function PoliciesEditor({ initial }: { initial: PolicyDoc[] }) {
  const ed = useDocEditor(initial, (v) => saveDocument("policies", v));
  const updateDoc = (slug: PolicyDoc["slug"], patch: Partial<PolicyDoc>) =>
    ed.setDraft(
      ed.draft.map((d) => (d.slug === slug ? { ...d, ...patch } : d)),
    );

  return (
    <EditorShell
      title="Policies"
      description="Shipping, returns, privacy and terms. Have them reviewed before marking them as final."
      dirty={ed.dirty}
      pending={ed.pending}
      onSave={() => ed.save()}
      onReset={ed.reset}
    >
      <Tabs defaultValue={ed.draft[0]?.slug}>
        <TabsList className="flex-wrap">
          {ed.draft.map((doc) => (
            <TabsTrigger key={doc.slug} value={doc.slug}>
              {doc.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {ed.draft.map((doc) => (
          <TabsContent
            key={doc.slug}
            value={doc.slug}
            className="flex flex-col gap-6 pt-4"
          >
            <EditorSection
              title={doc.title}
              description={`agbons-gl.com/${doc.slug}`}
            >
              <SwitchInput
                label="Reviewed and final"
                checked={doc.reviewed}
                onChange={(reviewed) => updateDoc(doc.slug, { reviewed })}
                description="While off, the page shows a “Draft — pending review” notice."
              />
              <TextInput
                label="Page title"
                value={doc.title}
                onChange={(title) => updateDoc(doc.slug, { title })}
              />
              <TextInput
                label="Summary"
                multiline
                rows={2}
                value={doc.summary}
                onChange={(summary) => updateDoc(doc.slug, { summary })}
              />
            </EditorSection>
            <EditorSection title="Sections">
              <SectionsInput
                label="Content"
                value={doc.sections}
                onChange={(sections) => updateDoc(doc.slug, { sections })}
              />
            </EditorSection>
          </TabsContent>
        ))}
      </Tabs>
    </EditorShell>
  );
}
