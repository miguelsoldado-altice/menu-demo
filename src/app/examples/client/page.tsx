const ClientPage = () => {
  return (
    <main className="example-page">
      <div className="example-page__content">
        <p className="example-page__eyebrow">Client example</p>
        <h1>Fetch the header and footer entirely on the client.</h1>
        <p>
          This route keeps the layout static, fetches taxonomy data with TanStack Query, and uses the package skeletons
          while the header and footer are loading.
        </p>
      </div>
    </main>
  );
};

export default ClientPage;
