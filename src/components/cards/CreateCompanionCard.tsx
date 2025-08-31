import Link from 'next/link';

const CreateCompanionCard = () => (
  <div
    className="relative h-[480px] rounded-2xl overflow-hidden bg-cover bg-center"
    style={{ backgroundImage: 'url("/assets/cardgirl1.png")' }}
  >
    <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center bg-black/30">
      <h3 className="text-3xl font-bold text-white mb-6">
        Create your own
        <br />
        AI Girlfriend
      </h3>
      <Link
        href="/create"
        className="bg-black bg-opacity-30 hover:bg-opacity-40 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200"
      >
        <span className="text-lg">Create AI Character</span>
      </Link>
    </div>
  </div>
);

export default CreateCompanionCard;
