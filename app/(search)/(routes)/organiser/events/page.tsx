
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import OrganiserClientPage from "./_components/OgraniserClientPage";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/Columns";


const OrganiserPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const events = await db.event.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div >
        <OrganiserClientPage />
        <div className="p-6">
            <DataTable columns={columns} data={events}/>
        </div>

    </div>
  )
};

export default OrganiserPage;
