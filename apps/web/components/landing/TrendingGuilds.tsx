import Guild from "./Guild";

export default function TrendingGuilds() {
  return (
    <section>
      <p className="paragraph uppercase text-center">
        Trusted by over 1000 communities
      </p>
      
      <div className="flex gap-6 2xl:justify-between mt-3 flex-wrap 2xl:items-center justify-center">
        {Array.from({ length: 5 }, (v, i) => (
          <div key={i}>
            <Guild />
          </div>
        ))}
      </div>
    </section>
  );
}
