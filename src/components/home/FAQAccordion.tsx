'use client';

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  title: string;
  faqs: FAQItem[];
}

const FAQAccordion = ({ title, faqs }: FAQAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-8 sm:py-12 md:py-16">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-6 sm:mb-8 md:mb-12">
        {title}
      </h2>
      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-800 last:border-b-0">
            <button
              className="w-full flex items-center justify-between py-4 text-left focus:outline-none"
              onClick={() => toggleAccordion(index)}
            >
              <span className="text-base sm:text-lg text-gray-300 hover:text-white transition-colors">
                {faq.question}
              </span>
              <FaChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
              }`}
            >
              <p className="text-gray-400 text-sm sm:text-base">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQAccordion;
