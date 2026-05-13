import { useDispatch } from "react-redux";

import { addStory} from "../features/stories/storiesSlice";

const useStoryUpload = () => {
  const dispatch = useDispatch();

  const handleImageUpload = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();

    img.src = event.target.result;

    img.onload = () => {
      const canvas =
        document.createElement("canvas");

      const ctx =
        canvas.getContext("2d");

      const MAX_WIDTH = 600;

      const scale =
        MAX_WIDTH / img.width;

      canvas.width = MAX_WIDTH;
      canvas.height =
        img.height * scale;

      ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const compressedImage =
        canvas.toDataURL(
          "image/jpeg",
          0.7
        );

      const newStory = {
        id: crypto.randomUUID(),
        image: compressedImage,
        createdAt: Date.now(),
      };

      dispatch(addStory(newStory));
    };
  };

  reader.readAsDataURL(file);
};
  return {
    handleImageUpload,
  };
};

export default useStoryUpload;
