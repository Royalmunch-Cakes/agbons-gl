import {
  BookOpenIcon,
  FileTextIcon,
  HomeIcon,
  ImagesIcon,
  LayersIcon,
  LayoutDashboardIcon,
  MessageSquareQuoteIcon,
  CircleHelpIcon,
  SettingsIcon,
  ShirtIcon,
} from "lucide-react";

export const adminNav = [
  {
    group: "Overview",
    items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboardIcon }],
  },
  {
    group: "Catalog",
    items: [
      { title: "Products", href: "/admin/products", icon: ShirtIcon },
      { title: "Collections", href: "/admin/collections", icon: LayersIcon },
    ],
  },
  {
    group: "Content",
    items: [
      { title: "Homepage", href: "/admin/home", icon: HomeIcon },
      { title: "Gallery", href: "/admin/gallery", icon: ImagesIcon },
      {
        title: "Testimonials",
        href: "/admin/testimonials",
        icon: MessageSquareQuoteIcon,
      },
      { title: "FAQs", href: "/admin/faqs", icon: CircleHelpIcon },
      { title: "Journal & Press", href: "/admin/journal", icon: BookOpenIcon },
      { title: "Policies", href: "/admin/policies", icon: FileTextIcon },
    ],
  },
  {
    group: "Site",
    items: [{ title: "Settings", href: "/admin/settings", icon: SettingsIcon }],
  },
];
