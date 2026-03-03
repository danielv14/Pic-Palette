import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { TopicCard } from "~/components/TopicCard";
import { TopicGridSkeleton } from "~/components/TopicGridSkeleton";
import { listTopicsOptions } from "~/integration/unsplash";

const TopicsPage = () => {
  const { data: topics = [] } = useQuery(listTopicsOptions());

  return (
    <>
      <h2 className="bg-gradient-to-br from-brand-300 to-brand-600 bg-clip-text p-2 text-center text-2xl font-extrabold text-transparent font-display md:p-4 md:text-start md:text-3xl">
        Explore topics
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {topics.map((topic) => (
          <TopicCard key={topic.slug} topic={topic} />
        ))}
      </div>
    </>
  );
};

export const Route = createFileRoute("/_app/topics/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(listTopicsOptions()),
  pendingComponent: TopicGridSkeleton,
  component: TopicsPage,
});
