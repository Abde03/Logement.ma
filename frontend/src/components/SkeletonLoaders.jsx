import PropTypes from 'prop-types';

const PlaceCardSkeleton = () => {
  return (
    <div className="bg-gray-300 animate-pulse rounded-2xl mb-2">
      <div className="aspect-square bg-gray-400 rounded-2xl mb-2"></div>
      <div className="px-2">
        <div className="h-4 bg-gray-400 rounded mb-2"></div>
        <div className="h-3 bg-gray-400 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-400 rounded w-1/3"></div>
      </div>
    </div>
  );
};

const PlaceGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid gap-x-6 gap-y-8 lg:grid-cols-3 sm:grid-cols-2 grow mt-8">
      {Array.from({ length: count }, (_, index) => (
        <PlaceCardSkeleton key={index} />
      ))}
    </div>
  );
};

PlaceGridSkeleton.propTypes = {
  count: PropTypes.number,
};

export { PlaceCardSkeleton, PlaceGridSkeleton };