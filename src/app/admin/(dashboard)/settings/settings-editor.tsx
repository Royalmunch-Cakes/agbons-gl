"use client";

import { saveDocument } from "@/app/admin/actions";
import { EditorShell, useDocEditor } from "@/components/admin/editor";
import {
  EditorSection,
  NumberInput,
  Repeater,
  TextInput,
} from "@/components/admin/fields";
import type { SiteSettings } from "@/lib/types";

export function SettingsEditor({ initial }: { initial: SiteSettings }) {
  const ed = useDocEditor(initial, (v) => saveDocument("settings", v));
  const d = ed.draft;

  return (
    <EditorShell
      title="Settings"
      description="Contact details, WhatsApp, opening hours, social profiles and currency."
      dirty={ed.dirty}
      pending={ed.pending}
      onSave={() => ed.save()}
      onReset={ed.reset}
    >
      <EditorSection
        title="Announcement bar"
        description="The thin strip at the very top of every page."
      >
        <TextInput
          label="Announcement"
          value={d.announcement}
          onChange={(announcement) => ed.update({ announcement })}
        />
      </EditorSection>

      <EditorSection title="Contact">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextInput
            label="Email"
            type="email"
            value={d.contact.email}
            onChange={(email) =>
              ed.update({ contact: { ...d.contact, email } })
            }
          />
          <TextInput
            label="Phone (as displayed)"
            value={d.contact.phone}
            onChange={(phone) =>
              ed.update({ contact: { ...d.contact, phone } })
            }
          />
        </div>
        <TextInput
          label="WhatsApp number"
          inputMode="numeric"
          value={d.contact.whatsapp}
          onChange={(whatsapp) =>
            ed.update({
              contact: { ...d.contact, whatsapp: whatsapp.replace(/\D/g, "") },
            })
          }
          description="International format, digits only (e.g. 2347056814352). Every WhatsApp button on the site uses this number."
        />
      </EditorSection>

      <EditorSection title="Opening hours">
        <Repeater
          items={d.hours}
          onChange={(hours) => ed.update({ hours })}
          create={() => ({ days: "", time: "" })}
          itemLabel={(h, i) => h.days || `Row ${i + 1}`}
          addLabel="Add row"
          render={(h, update) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="Days"
                value={h.days}
                onChange={(days) => update({ days })}
              />
              <TextInput
                label="Hours"
                value={h.time}
                onChange={(time) => update({ time })}
              />
            </div>
          )}
        />
        <TextInput
          label="Note"
          value={d.hoursNote}
          onChange={(hoursNote) => ed.update({ hoursNote })}
        />
      </EditorSection>

      <EditorSection
        title="Social profiles"
        description="Leave a field empty to hide that icon."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {(["instagram", "facebook", "tiktok", "x"] as const).map((k) => (
            <TextInput
              key={k}
              label={
                k === "x" ? "X (Twitter)" : k[0].toUpperCase() + k.slice(1)
              }
              type="url"
              placeholder="https://"
              value={d.socials[k]}
              onChange={(v) => ed.update({ socials: { ...d.socials, [k]: v } })}
            />
          ))}
        </div>
      </EditorSection>

      <EditorSection title="Currency">
        <NumberInput
          label="USD → NGN exchange rate"
          value={d.usdToNgnRate}
          min={1}
          step={1}
          onChange={(v) => ed.update({ usdToNgnRate: v ?? 0 })}
          description="Used when visitors switch prices to naira. Prices are stored in US dollars."
        />
      </EditorSection>
    </EditorShell>
  );
}
