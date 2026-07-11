import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { appRoutes } from "@/lib/routes";

/** Shared shell for create-job choice and type-specific wizards */
export default function CreateJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-full min-h-0 w-full flex-col">
      <ScrollArea className="h-full w-full">
        <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={appRoutes.nav.myJobs._self.path}>
                    {appRoutes.nav.myJobs._self.label}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {appRoutes.nav.myJobs.create._self.label}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-8 flex flex-col items-center">{children}</div>
        </div>
      </ScrollArea>
    </main>
  );
}
