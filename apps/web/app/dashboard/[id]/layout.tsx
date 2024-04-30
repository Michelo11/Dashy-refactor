export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mt-20 mb-12">{children}</div>
    </section>
  );
}
