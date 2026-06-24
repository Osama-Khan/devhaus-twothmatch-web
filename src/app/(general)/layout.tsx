/** Minimal layout for marketing and landing pages */
export default function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-1 flex-col">{children}</div>
    </>
  );
}
