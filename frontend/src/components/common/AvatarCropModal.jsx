import { useState } from "react";
import Cropper from "react-easy-crop";

const AvatarCropModal = ({
  image,
  onCancel,
  onCropDone,
}) => {
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState(null);

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">

      <div className="bg-white rounded-xl p-6 w-[95%] max-w-lg">

        <h2 className="text-xl font-semibold mb-5">
          Crop Avatar
        </h2>

        <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">

          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />

        </div>

        <div className="mt-5">

          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) =>
              setZoom(Number(e.target.value))
            }
            className="w-full"
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onCancel}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onCropDone(croppedAreaPixels)
            }
            className="px-5 py-2 bg-primary text-white rounded-lg"
          >
            Crop
          </button>

        </div>

      </div>

    </div>
  );
};

export default AvatarCropModal;