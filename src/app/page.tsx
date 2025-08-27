export default function Home() {
  return (
    <div className="min-h-screen p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome to True Companion</h1>

        {/* Featured Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            Featured AI Characters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder cards - replace with actual character components */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
              >
                <div className="aspect-video bg-gray-600 rounded-md mb-4" />
                <h3 className="text-xl font-medium mb-2">AI Character {i}</h3>
                <p className="text-gray-400">
                  Experience unique conversations with our AI companions.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {['Girls', 'Guys', 'Anime', 'Custom'].map((category) => (
              <div
                key={category}
                className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <h3 className="text-lg font-medium">{category}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
