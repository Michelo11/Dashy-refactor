export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Sidebar */}
      <div>{children}</div>
    </section>
  );
}