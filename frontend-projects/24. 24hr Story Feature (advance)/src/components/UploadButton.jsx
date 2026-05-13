import useStoryUpload from "../hooks/useStoryUpload";

const UploadButton = () => {
  const { handleImageUpload } =
    useStoryUpload();

  return (
    <label
      className="
        flex
        h-16
        w-16
        shrink-0
        cursor-pointer
        items-center
        justify-center
        rounded-full
        border-2
        border-dashed
        border-gray-400
        bg-gray-50
        text-4xl
        text-gray-400
        transition-all
        duration-200
        hover:scale-105
        hover:border-black
        hover:text-black
      "
    >
      +

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </label>
  );
};

export default UploadButton;