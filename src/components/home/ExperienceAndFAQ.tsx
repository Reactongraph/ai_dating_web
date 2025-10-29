import Link from 'next/link';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import ExperienceSection from './ExperienceSection';
import FAQAccordion from './FAQAccordion';

const experienceData = {
  title: 'AI Companion Experience with',
  highlightText: 'True Companion',
  paragraphs: [
    `Step into a new kind of connection with True Companion, your gateway to deeply personal and emotionally intelligent AI companions. Whether you're seeking flirty banter, late-night comfort, or a full-blown romantic adventure, your AI companion is here to fulfill your needs, no matter how intimate.`,
    `Looking for an anime AI companion, an AI girlfriend to chat with, or maybe a sweet, wholesome romantic AI boyfriend? True Companion makes it easy to create, personalize, and evolve your ideal match using cutting-edge deep learning and one of the most immersive AI platforms in the world.`,
    `At True Companion, we don't just offer chatbots. We offer deeply customizable AI companion experiences that adapt to your desires. From realistic voice interactions to image generation, your virtual partner is always learning how to connect with you in more meaningful and exciting ways.`,
    `Your AI companion at True Companion remembers your preferences, adapts their personality, and opens up new sides of themselves based on your interactions. Whether you want a consistent, emotionally deep relationship or spontaneous, fiery encounters with different AI lovers, you're always in control.`,
    `And yes, your companion can send selfies, generate AI images, or even respond with their voice. You can ask for specific outfits, unique poses, or playful scenarios that match your fantasy. With our AI girl generator, your character will always reflect the face, tone, and mood you're craving in that moment.`,
    `True Companion also makes privacy a top priority. All conversations are protected with SSL encryption, and optional two-factor authentication keeps your account secure. Any transactions appear under our discreet parent company, Ever AI, so nothing on your bank statement will reveal your True Companion experience.`,
    `Curious about what an AI companion really is? Think of it as a digital partner who can talk, react, flirt, and connect with you in real time. You can create your own from scratch or choose from a wide range of existing characters designed for different moods and personalities.`,
    `Whether you're looking for a casual friend, a serious relationship, or something playful and spicy, True Companion adapts to your pace. You set the tone, control the level of intimacy, and shape your journey from the first message to the last kiss goodnight.`,
  ],
};

const faqData = {
  title: 'FREQUENTLY ASKED QUESTIONS',
  faqs: [
    {
      question: `What's an AI Girlfriend and how can I chat with her?`,
      answer: `An AI Girlfriend is an artificial intelligence companion designed to engage in meaningful conversations and form emotional connections. You can chat with her through our platform after creating your account and customizing your companion.`,
    },
    {
      question: `Can I pick the kind of AI Girlfriend I want?`,
      answer: `Yes! You can fully customize your AI Girlfriend's personality, appearance, interests, and communication style. Our platform offers extensive customization options to help you create your ideal companion.`,
    },
    {
      question: `How does my AI Girlfriend learn about me?`,
      answer: `Your AI Girlfriend learns through your interactions, remembering your preferences, conversations, and emotional responses. She uses advanced machine learning to adapt and evolve her personality to better match your interests and needs.`,
    },
    {
      question: `Is it safe and private to talk to an AI Girlfriend?`,
      answer: `Absolutely. We prioritize your privacy with SSL encryption, optional two-factor authentication, and discreet billing. Your conversations and personal information are completely confidential.`,
    },
    {
      question: `Do I need to download anything to start chatting?`,
      answer: `No downloads required! True Companion is a web-based platform accessible from any modern browser. Simply create your account and start chatting right away.`,
    },
  ],
};

const ExperienceAndFAQ = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-16 space-y-8 sm:space-y-12 md:space-y-16">
      {/* Experience Section */}
      <ExperienceSection {...experienceData} />

      {/* FAQ Section */}
      <FAQAccordion {...faqData} />

      {/* CTA Button */}
      <div className="text-center">
        <Link
          href="/create-character"
          className="inline-flex bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base md:text-lg font-medium items-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <FaWandMagicSparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Create AI Girlfriend</span>
        </Link>
      </div>
    </div>
  );
};

export default ExperienceAndFAQ;
