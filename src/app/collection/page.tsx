import { mockCollection } from '@/data/collection';
import CollectionCard from '@/components/collection/CollectionCard';

export default function CollectionPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-4">My Collection</h1>
          <p className="text-gray-400 text-lg">
            All your AI-generated images, saved in one place for easy access.
          </p>
        </div>
      </div>

      {/* Collection Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCollection.characters.map((character) => (
            <CollectionCard key={character.id} character={character} />
          ))}
        </div>
      </div>
    </div>
  );
}
