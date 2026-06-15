const Loading = () => {
  return (
    <div className="loading">
      <div className="loading-inner">
        <h1 className="loading-wordmark">METTAIRE</h1>
        <div className="loading-bar">
          <span />
        </div>
        <p className="loading-status">LOADING</p>
      </div>
      <div className="loading-scanlines" aria-hidden="true" />
    </div>
  );
};

export default Loading;
