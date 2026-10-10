"use client";

import { saveDocument } from "@/app/admin/actions";
import { EditorShell, useDocEditor } from "@/components/admin/editor";
import {
  EditorSection,
  ImageInput,
  Repeater,
  StringListInput,
  TextInput,
} from "@/components/admin/fields";
import type { HomeContent } from "@/lib/types";

export function HomeEditor({ initial }: { initial: HomeContent }) {
  const ed = useDocEditor(initial, (v) => saveDocument("home", v));
  const d = ed.draft;

  return (
    <EditorShell
      title="Homepage"
      description="Hero, brand story, feature tiles and the bespoke process. Products, gallery and testimonials have their own sections."
      dirty={ed.dirty}
      pending={ed.pending}
      onSave={() => ed.save()}
      onReset={ed.reset}
    >
      <EditorSection title="Hero">
        <TextInput
          label="Small heading"
          value={d.heroEyebrow}
          onChange={(heroEyebrow) => ed.update({ heroEyebrow })}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextInput
            label="Headline"
            value={d.heroTitle}
            onChange={(heroTitle) => ed.update({ heroTitle })}
          />
          <TextInput
            label="Headline (second line, italic)"
            value={d.heroAccent}
            onChange={(heroAccent) => ed.update({ heroAccent })}
          />
        </div>
        <TextInput
          label="Subtitle"
          multiline
          rows={2}
          value={d.heroSubtitle}
          onChange={(heroSubtitle) => ed.update({ heroSubtitle })}
        />
        <ImageInput
          label="Banner image"
          value={d.heroImage}
          onChange={(heroImage) => ed.update({ heroImage })}
          description="Wide image, at least 2000px across."
        />
      </EditorSection>

      <EditorSection title="Our story">
        <TextInput
          label="Small heading"
          value={d.storyEyebrow}
          onChange={(storyEyebrow) => ed.update({ storyEyebrow })}
        />
        <TextInput
          label="Heading"
          value={d.storyHeading}
          onChange={(storyHeading) => ed.update({ storyHeading })}
        />
        <StringListInput
          label="Paragraphs"
          value={d.storyParagraphs}
          onChange={(storyParagraphs) => ed.update({ storyParagraphs })}
          rows={4}
        />
        <ImageInput
          label="Image"
          value={d.storyImage}
          onChange={(storyImage) => ed.update({ storyImage })}
        />
      </EditorSection>

      <EditorSection
        title="Feature tiles"
        description="The image tiles below the story."
      >
        <Repeater
          items={d.features}
          onChange={(features) => ed.update({ features })}
          create={() => ({
            title: "",
            cta: "Explore",
            href: "/",
            image: { alt: "" },
          })}
          itemLabel={(f, i) => f.title || `Tile ${i + 1}`}
          addLabel="Add tile"
          render={(f, update) => (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  label="Title"
                  value={f.title}
                  onChange={(title) => update({ title })}
                />
                <TextInput
                  label="Button text"
                  value={f.cta}
                  onChange={(cta) => update({ cta })}
                />
              </div>
              <TextInput
                label="Link"
                value={f.href}
                onChange={(href) => update({ href })}
                description="A page on this site, e.g. /collections/ice-crystal"
              />
              <ImageInput
                label="Image"
                value={f.image}
                onChange={(image) => update({ image })}
              />
            </>
          )}
        />
      </EditorSection>

      <EditorSection title="Your dream dress">
        <TextInput
          label="Heading"
          value={d.dreamHeading}
          onChange={(dreamHeading) => ed.update({ dreamHeading })}
        />
        <TextInput
          label="Text"
          multiline
          rows={3}
          value={d.dreamBody}
          onChange={(dreamBody) => ed.update({ dreamBody })}
        />
        <StringListInput
          label="Process steps"
          value={d.dreamSteps}
          onChange={(dreamSteps) => ed.update({ dreamSteps })}
          addLabel="Add step"
          rows={2}
        />
        <ImageInput
          label="Image"
          value={d.dreamImage}
          onChange={(dreamImage) => ed.update({ dreamImage })}
        />
      </EditorSection>
    </EditorShell>
  );
}
