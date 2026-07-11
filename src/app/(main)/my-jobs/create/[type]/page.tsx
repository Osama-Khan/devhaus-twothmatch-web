import { notFound } from "next/navigation";
import { CreateLocumJobView } from "@/features/jobs/components/create-locum-job-view";
import { CreatePermanentJobView } from "@/features/jobs/components/create-permanent-job-view";
import { isCreateJobRouteType } from "@/features/jobs/constants";

type CreateJobByTypePageProps = {
  params: Promise<{ type: string }>;
};

/** Locum or permanent create-job wizard */
export default async function CreateJobByTypePage({
  params,
}: CreateJobByTypePageProps) {
  const { type } = await params;

  if (!isCreateJobRouteType(type)) {
    notFound();
  }

  if (type === "locum") {
    return <CreateLocumJobView />;
  }

  return <CreatePermanentJobView />;
}
