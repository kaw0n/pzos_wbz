import { db } from "@/lib/db";
import Categories from "@/app/(search)/_components/Categories";
import SearchForm from "../_components/SearchForm";
import DateSearchForm from "../_components/DateSearchForm";
import { EventsList } from "@/app/(search)/_components/EventsList";
import { getEvents } from "@/actions/getEvents";

export default async function Home({ searchParams }: { searchParams: { title?: string; categoryid?: string; date?: string } }) {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const events = await getEvents({
    ...searchParams,
  });

  return (
    <div className="p-6 space-y-4">
      <SearchForm />
      <DateSearchForm />
      <Categories items={categories} />
      <EventsList items={events} />
    </div>
  );
}
