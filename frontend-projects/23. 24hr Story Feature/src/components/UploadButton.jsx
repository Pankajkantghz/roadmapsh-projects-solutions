const UploadButton = ({ onUpload }) => {
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
        border-gray-400
        text-4xl
        text-gray-400
        transition
        hover:bg-gray-100
      "
    >
      +

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onUpload}
      />
    </label>
  );
};

export default UploadButton;