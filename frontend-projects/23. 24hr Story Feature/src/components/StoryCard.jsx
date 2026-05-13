const StoryCard = ({ image, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        h-16
        w-16
        shrink-0
        overflow-hidden
        rounded-full
        border-2
        border-black
      "
    >
      <img
        src={image}
        alt="story"
        className="h-full w-full object-cover"
      />
    </button>
  );
};

export default StoryCard;