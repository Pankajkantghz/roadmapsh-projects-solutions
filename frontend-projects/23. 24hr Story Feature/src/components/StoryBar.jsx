import StoryCard from "./StoryCard";
import UploadButton from "./UploadButton";

const StoryBar = ({
  stories,
  onUpload,
  onStoryClick,
}) => {
  return (
    <div className="flex items-center gap-4 overflow-x-auto rounded-2xl border-2 border-black bg-white p-4">
      
      {/* Upload */}
      <UploadButton
        onUpload={onUpload}
      />

      {/* Stories */}
      {stories.map((story, index) => (
        <StoryCard
          key={story.id}
          image={story.image}
          onClick={() => onStoryClick(index)}
        />
      ))}
    </div>
  );
};

export default StoryBar;