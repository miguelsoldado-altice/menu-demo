import Link from "next/link";

const examples = [
  {
    href: "/examples/server",
    eyebrow: "Server example",
    title: "Fetch header and footer in the layout",
    description: "Use server-side taxonomy requests for the initial render, then enrich the header on the client.",
  },
  {
    href: "/examples/client",
    eyebrow: "Client example",
    title: "Fetch everything with TanStack Query",
    description: "Keep the route static, show the built-in skeletons, and resolve header/footer state in components.",
  },
];

const HomePage = () => {
  return (
    <main className="home-page">
      <section className="home-page__hero">
        <p className="home-page__eyebrow">Header Footer Demo</p>
        <h1>Choose an implementation pattern and copy from the example that matches your app.</h1>
        <p className="home-page__lede">
          Shared integration code lives under <code>src/features/header-footer</code>. The routes under{" "}
          <code>src/app/examples</code> show how to compose that code in either a server-first or client-first flow.
        </p>
      </section>
      <section className="example-grid" aria-label="Implementation examples">
        {examples.map((example) => (
          <Link key={example.href} href={example.href} className="example-card">
            <p className="example-card__eyebrow">{example.eyebrow}</p>
            <h2>{example.title}</h2>
            <p>{example.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default HomePage;
