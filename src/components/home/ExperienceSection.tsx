interface ExperienceSectionProps {
  title: string;
  highlightText: string;
  paragraphs: string[];
}

const ExperienceSection = ({
  title,
  highlightText,
  paragraphs,
}: ExperienceSectionProps) => {
  return (
    <div className="bg-black rounded-2xl p-8 md:p-12">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        {title} <span className="text-[#3BB9FF]">{highlightText}</span>
      </h2>
      <div className="space-y-6">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-gray-400 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
