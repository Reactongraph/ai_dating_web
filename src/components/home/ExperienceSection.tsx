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
    <div className="bg-black rounded-2xl p-5 sm:p-8 md:py-2 md:px-12">
      <h2 className="sm:text-3xl md:text-2xl font-bold text-white  sm:mb-4 md:text-center sm:text-left">
        {title} <span className="text-primary-500">{highlightText}</span>
      </h2>
      <div className="space-y-4 sm:space-y-6">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-gray-400 leading-relaxed text-sm sm:text-base text-center sm:text-left"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
