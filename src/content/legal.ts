import { siteConfig } from "@/config/site";
import type { StorySection } from "@/lib/types";

/**
 * Policy pages (audit §5.3, §6: "0 of 4 required pages exist"; a
 * compliance gap before any payment processing).
 *
 * These are DRAFTS written from the business model documented in the audit.
 * They must be reviewed by the client and a legal adviser (incl. NDPR /
 * Nigeria Data Protection Act requirements) before launch. While
 * `reviewed` is false, the page shows a visible "draft" notice.
 */
export type PolicyDoc = {
  slug: "shipping" | "returns" | "privacy" | "terms";
  title: string;
  summary: string;
  reviewed: boolean;
  sections: StorySection[];
};

const { legalName, contact, addressLine } = siteConfig;

export const policies: PolicyDoc[] = [
  {
    slug: "shipping",
    title: "Shipping & Delivery",
    summary:
      "How and when your AGBONS-GL piece reaches you, in Nigeria and abroad.",
    reviewed: false,
    sections: [
      {
        heading: "Production times",
        paragraphs: [
          "Ready pieces are prepared for dispatch once your order is confirmed. Bespoke and made-to-measure pieces are produced after your measurements are confirmed; your consultant will give you a production timeline — signature couture can take three to four months.",
        ],
      },
      {
        heading: "Delivery within Nigeria",
        paragraphs: [
          "We deliver across Nigeria using trusted courier partners. Delivery options and fees are confirmed with you before payment.",
          `Collection from our studio at ${addressLine} is available by appointment.`,
        ],
      },
      {
        heading: "International delivery",
        paragraphs: [
          "We ship internationally with tracked, insured couriers. Import duties and taxes are set by the destination country and are the customer's responsibility unless agreed otherwise in writing.",
        ],
      },
      {
        heading: "Questions",
        paragraphs: [
          `Contact us at ${contact.email} or ${contact.phone} (WhatsApp) for a delivery quote.`,
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns & Exchange",
    summary: "Our approach to returns for ready pieces and bespoke couture.",
    reviewed: false,
    sections: [
      {
        heading: "Bespoke and made-to-measure pieces",
        paragraphs: [
          "Pieces created to your measurements or design are final sale and cannot be returned or exchanged. We work closely with you through fittings to make sure your piece is right, and alterations needed due to our workmanship are made free of charge.",
        ],
      },
      {
        heading: "Ready pieces",
        paragraphs: [
          "If a ready piece arrives damaged or not as described, contact us within the period stated at the time of your order with photos of the item and packaging. We will arrange a repair, exchange or refund as appropriate.",
          "Items must be unworn, unaltered and returned with all tags and packaging.",
        ],
      },
      {
        heading: "How to request a return",
        paragraphs: [
          `Email ${contact.email} or message us on WhatsApp at ${contact.phone} with your order details.`,
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "What personal data we collect, why, and the choices you have.",
    reviewed: false,
    sections: [
      {
        heading: "Who we are",
        paragraphs: [
          `${legalName} ("AGBONS-GL", "we") operates this website. Contact: ${contact.email}, ${addressLine}.`,
        ],
      },
      {
        heading: "Data we collect",
        paragraphs: [
          "Information you give us: your name, email, phone/WhatsApp number, location, event details, budget range, measurements and messages when you use our contact, consultation or newsletter forms or contact us on WhatsApp.",
          "Information stored on your device: your bag, wishlist and display-currency preference are kept in your browser's local storage and are not sent to us until you place an order.",
          "Analytics: if enabled, we use Google Analytics and/or Meta Pixel to understand how the site is used.",
        ],
      },
      {
        heading: "How we use it",
        paragraphs: [
          "To respond to enquiries, arrange consultations and fittings, fulfil orders, and — if you subscribe — send our newsletter. We do not sell your personal data.",
        ],
      },
      {
        heading: "Service providers",
        paragraphs: [
          "We use trusted providers to run the site and our communications, which may include our hosting provider, email delivery (e.g. Resend), newsletter platform (e.g. Mailchimp), WhatsApp and analytics services.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          `You may request access to, correction or deletion of your personal data, or unsubscribe from marketing at any time. Contact ${contact.email}.`,
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    summary:
      "The terms that apply when you use this website or order from AGBONS-GL.",
    reviewed: false,
    sections: [
      {
        heading: "About these terms",
        paragraphs: [
          `These terms apply to your use of this website and to orders placed with ${legalName}.`,
        ],
      },
      {
        heading: "Orders",
        paragraphs: [
          "Orders are placed by contacting us (including via WhatsApp) and are accepted once we confirm them in writing. Prices are shown in US dollars and the final amount is confirmed at order.",
          "Bespoke pieces begin production once measurements are confirmed and any agreed deposit is received.",
        ],
      },
      {
        heading: "Product images",
        paragraphs: [
          "Every piece is handmade, so colours, embellishment placement and finishes may vary slightly from images.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "All designs, images and content on this site belong to AGBONS-GL and may not be reproduced without permission.",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: [
          "These terms are governed by the laws of the Federal Republic of Nigeria.",
        ],
      },
    ],
  },
];
