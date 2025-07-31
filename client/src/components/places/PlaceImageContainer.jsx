import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Grid3X3, ArrowLeft } from "lucide-react";

const PlaceImageContainer = ({ place }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'slide'

  // Combine main image and galleries
  const allImages = [
    { url: place?.secure_url, alt: place?.title || "Main image" },
    ...(place?.galleries?.map((img, index) => ({
      url: img.secure_url,
      alt: `Gallery ${index + 1}`,
    })) || []),
  ].filter((img) => img.url);

  const openDialog = (index = 0) => {
    setCurrentImageIndex(index);
    setViewMode("grid");
    setIsDialogOpen(true);
  };

  const openSlideView = (index) => {
    setCurrentImageIndex(index);
    setViewMode("slide");
  };

  const backToGrid = () => {
    setViewMode("grid");
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isDialogOpen) return;

      if (event.key === "ArrowLeft") {
        prevImage();
      } else if (event.key === "ArrowRight") {
        nextImage();
      } else if (event.key === "Escape") {
        setIsDialogOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDialogOpen]);

  if (!place?.secure_url) {
    return (
      <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-200 rounded-xl flex items-center justify-center mb-8">
        <div className="text-center text-gray-500">
          <p>ไม่มีรูปภาพ</p>
        </div>
      </div>
    );
  }

  // Prepare images for grid (max 5 images for display)
  const gridImages = allImages.slice(0, 5);

  if (!place?.secure_url) {
    return (
      <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-200 rounded-xl flex items-center justify-center mb-8">
        <div className="text-center text-gray-500">
          <p>ไม่มีรูปภาพ</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        {/* Bento Grid Layout like in the image */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] rounded-lg overflow-hidden">
          {/* Main Image - Takes 2x2 grid (left side) */}
          <div
            className="col-span-2 row-span-2 relative cursor-pointer hover:opacity-95 hover:scale-102 duration-500 transition-all"
            onClick={() => openDialog(0)}
          >
            <img
              src={allImages[0]?.url}
              alt={allImages[0]?.alt}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side - 4 smaller images */}
          {allImages.slice(1, 5).map((item, index) => {
            const actualIndex = index + 1;
            const isLastItem = actualIndex === 4 && allImages.length > 5;

            return (
              <div
                key={actualIndex}
                className="relative cursor-pointer hover:opacity-95 hover:scale-102 duration-500 transition-all"
                onClick={() => openDialog(actualIndex)}
              >
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />

                {/* Overlay for last item */}
                {isLastItem && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      +{allImages.length - 5} ภาพ
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Gallery Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-w-6xl w-full h-[90vh] p-0 bg-white"
          hideCloseIcon={true}
        >
          {viewMode === "grid" ? (
            /* Gallery Grid View */
            <div className="relative w-full h-full flex flex-col bg-white">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  ภาพทั้งหมด ({allImages.length} รูป)
                </h2>
            
              </div>

              {/* Grid Gallery with ScrollArea */}
              <ScrollArea className="flex-1 p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square cursor-pointer rounded-lg overflow-hidden hover:opacity-90 hover:scale-102 duration-500 transition-all group"
                      onClick={() => openSlideView(index)}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            /* Slide View */
            <div className="relative w-full h-full flex flex-col bg-white">
              {/* Slide Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={backToGrid}
                    className="hover:bg-gray-100 text-gray-600"
                    variant="ghost"
                    size="icon"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    {currentImageIndex + 1} / {allImages.length}
                  </span>
                </div>
                
              </div>

              {/* Main Image Viewer */}
              <div className="flex-1 relative flex items-center justify-center p-6">
                <img
                  src={allImages[currentImageIndex]?.url}
                  alt={allImages[currentImageIndex]?.alt}
                  className="rounded-lg shadow-lg object-cover"
                  style={{ width: "650px", height: "439px" }}
                />

                {/* Navigation Buttons */}
                {allImages.length > 1 && (
                  <>
                    <Button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 text-gray-700 border"
                      size="icon"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 text-gray-700 border"
                      size="icon"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>

              {/* Bottom Thumbnails with ScrollArea */}
              <div className="h-20 bg-gray-50 border-t">
                <ScrollArea className="h-full p-4">
                  <div className="flex gap-2 h-12">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 h-12 aspect-square rounded-lg overflow-hidden hover:scale-102 duration-300 transition-all ${
                          currentImageIndex === index
                            ? "ring-2 ring-blue-500 opacity-100"
                            : "opacity-70 hover:opacity-90"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaceImageContainer;
