const SVGDefs = () => {
  return (
    <div className="svg-defs" style={{ height: 0, width: 0 }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <defs>
          <linearGradient id="gradient-to-solid">
            <stop stop-color="#000" />
          </linearGradient>
          <linearGradient id="match-background">
            <stop stop-color="#000" />
          </linearGradient>
          <linearGradient id="hero-stroke">
            <stop stop-color="#000"></stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
export default SVGDefs;
