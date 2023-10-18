function LoadingScreen() {
  return (
    <section className="fixed inset-0 bg-base-200 z-40">
      <h1 className="text-6xl inset-x-0 bottom-1/2 fixed font-bold text-center text-accent">
        Loading
        <br></br>
        <span className="loading loading-infinity loading-lg"></span>
      </h1>
    </section>
  );
};

export default LoadingScreen;