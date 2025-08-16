import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Container } from '../Container/Container';
import { faqContent } from '../../data/content';
import styles from './FAQSection.module.scss';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}>
      <button 
        className={styles.faqButton}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={styles.faqQuestion}>{question}</span>
        <ChevronDownIcon
          className={`${styles.faqIcon} ${isOpen ? styles.rotated : ''}`}
          width={20}
          height={20}
        />
      </button>
      <div className={`${styles.faqAnswer} ${isOpen ? styles.expanded : ''}`}>
        <div className={styles.faqAnswerContent}>
          {answer}
        </div>
      </div>
    </div>
  );
};

interface FAQSectionProps {
  faqRef: React.RefObject<HTMLElement>;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqRef }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section ref={faqRef} id="faq" className={styles.faq}>
      <Container size="narrow">
        <div className={styles.faqHeader}>
          <h2 className={`${styles.faqTitle} animate-element`}>
            First-ever asked questions from real users
          </h2>
          <p className={`${styles.faqDescription} animate-element`}>
            The questions that matter most, answered directly.
          </p>
        </div>
        
        <div className={styles.faqList}>
          {faqContent.items.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openItems.has(index)}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};