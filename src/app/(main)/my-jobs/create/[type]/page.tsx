import { notFound } from "next/navigation";
import { CreateLocumJobView } from "@/features/jobs/components/create-locum-job-view";
import { CreatePermanentJobView } from "@/features/jobs/components/create-permanent-job-view";
import { isCreateJobRouteType } from "@/features/jobs/constants";

type CreateJobByTypePageProps = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ draftId?: string }>;
};

/** Locum or permanent create-job wizard (supports `?draftId=` resume) */
export default async function CreateJobByTypePage({
  params,
  searchParams,
}: CreateJobByTypePageProps) {
  const { type } = await params;
  const { draftId } = await searchParams;

  if (!isCreateJobRouteType(type)) {
    notFound();
  }

  if (type === "locum") {
    return <CreateLocumJobView draftId={draftId} />;
  }

  return <CreatePermanentJobView draftId={draftId} />;
}
