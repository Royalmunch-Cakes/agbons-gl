/**
 * FAQs (audit §2.5, §7). The WordPress FAQ page only held template
 * placeholders ("This is the first FAQ question."), so these answers are
 * written from facts published elsewhere on the site.
 *
 * TODO(content): confirm with the client before launch.
 */
export type Faq = { q: string; a: string };

export const faqGroups: { title: string; items: Faq[] }[] = [
  {
    title: "Bespoke & bridal",
    items: [
      {
        q: "How does the bespoke bridal process work?",
        a: "It begins with a consultation where we discuss your occasion, date, budget and vision. We then move to design and measurements — in our Benin City studio or virtually — before our artisans craft and hand-finish your piece, perfected at a final fitting.",
      },
      {
        q: "How far in advance should I book?",
        a: "Couture gowns are extraordinarily detailed — some signature looks take three to four months of hand-beading and embroidery. We recommend contacting us at least four to six months before your event; shorter timelines may be possible depending on the design.",
      },
      {
        q: "Can I commission a piece from a collection in my measurements?",
        a: "Yes. Every signature collection piece can be commissioned and made to your exact measurements. Use the “Commission this piece” button on any product or collection page, or book a consultation.",
      },
      {
        q: "Do you offer virtual consultations and fittings?",
        a: "Yes. Clients outside Benin City — including international brides — can consult and be measured virtually. We'll guide you through taking accurate measurements.",
      },
    ],
  },
  {
    title: "Orders & payment",
    items: [
      {
        q: "How do I place an order?",
        a: "Add pieces to your bag and choose “Place order via WhatsApp”, or use “Complete order via WhatsApp” on any product. Our team confirms availability, measurements, delivery and payment with you directly.",
      },
      {
        q: "Which currency are your prices in?",
        a: "Prices are listed in US dollars. Your final amount, including delivery, is confirmed when your order is placed; ask us on WhatsApp if you'd like a quote in naira.",
      },
      {
        q: "Can I pay online by card?",
        a: "Online card payment is coming soon. For now, our team shares secure payment details once your order is confirmed on WhatsApp.",
      },
    ],
  },
  {
    title: "Visiting & contact",
    items: [
      {
        q: "Can I visit the studio?",
        a: "Our studio at 169 Murtala Mohammed Way, Avbiama, Benin City is open Monday to Friday, 09:00–17:00, strictly by appointment. Please book before visiting.",
      },
      {
        q: "How quickly will you reply?",
        a: "We aim to reply to WhatsApp messages, consultation requests and emails within one working day.",
      },
    ],
  },
];
