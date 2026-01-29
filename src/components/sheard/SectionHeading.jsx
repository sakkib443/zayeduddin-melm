 

const SectionHeading = ({ title, description }) => {
  return (
    <div className="w-full md:w-10/12 lg:w-8/12 mx-auto px-4 sm:px-6">
      <h1 className="text-center csd text-4xl md:text-5xl lg:text-6xl font-semibold outfit-semibold work">
        {title}
      </h1>
      <p className="text-center crd work mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base">
        {description}
      </p>
    </div>
  );
};

export default SectionHeading;
