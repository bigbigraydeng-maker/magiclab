const Clients = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Trusted by growing businesses in New Zealand and Asia-Pacific.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-xs">
            <p className="text-center text-gray-800 font-medium">China Travel Service NZ</p>
          </div>
          <div className="bg-white p-8 rounded-lg w-full max-w-xs">
            <p className="text-center text-gray-800 font-medium">Compass Property</p>
          </div>
          <div className="bg-white p-8 rounded-lg w-full max-w-xs">
            <p className="text-center text-gray-800 font-medium">Warm Voyage</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;