"use client";

import { saveDocument } from "@/app/admin/actions";
import { EditorShell, useDocEditor } from "@/components/admin/editor";
import { EditorSection, ImageListInput } from "@/components/admin/fields";
import type { MediaAsset } from "@/lib/types";

export function GalleryEditor({ initial }: { initial: MediaAsset[] }) {
  const ed = useDocEditor(initial, (v) => saveDocument("gallery", v));

  return (
    <EditorShell
      title="Gallery"
      description="The first 8 images appear on the homepage; all of them appear in the Lookbook."
      dirty={ed.dirty}
      pending={ed.pending}
      onSave={() => ed.save()}
      onReset={ed.reset}
    >
      <EditorSection title={`${ed.draft.length} images`}>
        <ImageListInput
          label="Images"
          value={ed.draft}
          onChange={(v) => ed.setDraft(v)}
        />
      </EditorSection>
    </EditorShell>
  );
}
