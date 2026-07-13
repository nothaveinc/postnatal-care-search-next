"use client";

import { useState } from "react";

export type FaqCategory = {
  id: string;
  title: string;
  items: { question: string; answer: string }[];
};

export default function FaqAccordion({
  categories,
}: {
  categories: FaqCategory[];
}) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <>
      {categories.map((category) => (
        <div className="faq-category" id={category.id} key={category.id}>
          <h2 className="faq-category__title">{category.title}</h2>
          {category.items.map((item) => {
            const key = `${category.id}:${item.question}`;
            const isOpen = openKey === key;
            return (
              <div className={`faq-item${isOpen ? " is-open" : ""}`} key={key}>
                <button
                  className="faq-question"
                  aria-expanded={isOpen}
                  onClick={() => setOpenKey(isOpen ? null : key)}
                >
                  <span>{item.question}</span>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-answer">
                  <div className="faq-answer__inner">{item.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
