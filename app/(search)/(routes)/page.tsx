import { db } from "@/lib/db"
import  Categories  from "@/app/(search)/_components/Categories"
import SearchForm from "../_components/SearchForm"
import DateSearchForm from "../_components/DateSearchForm"

export default async function Home() {

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  return (
    <div className="p-6">
      <SearchForm/>
      <DateSearchForm/>
      <Categories
      items={categories}
      />
    </div>
    
  )
}
