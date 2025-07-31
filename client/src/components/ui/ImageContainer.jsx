import React from "react";

const ImageContainer = ({ image, name, galleries = [] }) => {
  if (!image) {
    return (
      <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-200 rounded-xl flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>ไม่มีรูปภาพ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <img
        src={image}
        alt={name}
        className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl shadow-lg"
      />
    </div>
  );
};

export default ImageContainer;
