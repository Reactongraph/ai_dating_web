import CompanionsLayout from '@/components/layouts/CompanionsLayout';
import CompanionCard from '@/components/cards/CompanionCard';
import { animeCompanions } from '@/data/companions';
import CreateCompanionCard from '@/components/cards/CreateCompanionCard';

export default function AnimePage() {
  return (
    <CompanionsLayout
      title="Meet Your AI Companions"
      subtitle="From friendly to flirty — dive into a world of personalities crafted just for you."
    >
      <CreateCompanionCard />
      {animeCompanions.map((companion) => (
        <CompanionCard key={companion.id} companion={companion} />
      ))}
    </CompanionsLayout>
  );
}
