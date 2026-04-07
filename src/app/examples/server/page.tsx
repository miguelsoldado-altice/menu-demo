const ServerPage = () => {
  return (
    <main className="example-page">
      <div className="example-page__content">
        <p className="example-page__eyebrow">Server example</p>
        <h1>Fetch the initial header and footer in the layout.</h1>
        <p>
          This route resolves taxonomy data on the server, renders the real header and footer immediately, and only
          leaves the user-specific header enrichment to the client.
        </p>
      </div>
    </main>
  );
};

export default ServerPage;
