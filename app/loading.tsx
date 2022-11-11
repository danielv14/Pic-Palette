const loading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((key) => {
        return (
          <div
            key={key}
            className="bg-slate-700 rounded-lg max-w-[300px] w-full h-[350px] justify-self-center"
          />
        );
      })}
    </div>
  );
};

export default loading;
