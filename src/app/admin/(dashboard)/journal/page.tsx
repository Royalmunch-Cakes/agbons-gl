import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getContentForEdit } from "@/lib/content";
import { requireAdmin } from "@/lib/server/admin-auth";

/** Session-checked per request; see the dashboard layout. */
export const instant = false;

export const metadata: Metadata = { title: "Journal & Press" };

export default async function JournalAdminPage() {
  await requireAdmin();
  const posts = await getContentForEdit("journal");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl">Journal & Press</h1>
          <p className="text-sm text-muted-foreground">
            The first post is featured at the top of the Journal page.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/admin/journal/new" />}
        >
          <PlusIcon data-icon="inline-start" />
          New post
        </Button>
      </div>
      <ul className="flex flex-col divide-y border bg-card">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/admin/journal/${post.slug}`}
              className="flex items-center gap-4 p-3 hover:bg-secondary"
            >
              {post.image.src ? (
                <Image
                  src={post.image.src}
                  alt=""
                  width={96}
                  height={72}
                  className="h-16 w-20 shrink-0 object-cover"
                />
              ) : (
                <div className="h-16 w-20 shrink-0 bg-secondary" />
              )}
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {post.kind}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.dateLabel}
                  </span>
                </div>
                <p className="truncate font-medium">{post.title}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
