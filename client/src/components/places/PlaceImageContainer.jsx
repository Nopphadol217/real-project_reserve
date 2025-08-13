import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
      <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-200 rounded-xl flex items-center justify-center mb-8">
        <div className="text-center text-gray-500">
          <p className="text-sm md:text-base">ไม่มีรูปภาพ</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        {/* Mobile: Simple Image Slice */}
        <div className="block sm:hidden">
          <div className="relative">
            <div 
              className="w-full h-64 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openDialog(0)}
            >
              <img
                src={allImages[0]?.url}
                alt={allImages[0]?.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {allImages.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                  1 / {allImages.length}
                </div>
              )}
            </div>
            
            {/* Mobile navigation dots */}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {allImages.slice(0, Math.min(5, allImages.length)).map((_, index) => (
                  <button
                    key={index}
                    className="w-2 h-2 rounded-full bg-white/60 hover:bg-white/90 transition-all"
                    onClick={() => openDialog(index)}
                  />
                ))}
                {allImages.length > 5 && (
                  <span className="text-white text-xs ml-2">+{allImages.length - 5}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tablet and Desktop: Enhanced Bento Grid Layout */}
        <div className="hidden sm:block">
          {allImages.length === 1 ? (
            // Single image - full width
            <div 
              className="w-full h-[400px] md:h-[450px] lg:h-[500px] rounded-xl overflow-hidden cursor-pointer"
              onClick={() => openDialog(0)}
            >
              <img
                src={allImages[0]?.url}
                alt={allImages[0]?.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : allImages.length === 2 ? (
            // Two images - side by side
            <div className="grid grid-cols-2 gap-2 h-[400px] md:h-[450px] rounded-xl overflow-hidden">
              {allImages.slice(0, 2).map((image, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer hover:opacity-95 hover:scale-[1.01] transition-all duration-300"
                  onClick={() => openDialog(index)}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : allImages.length === 3 ? (
            // Three images - main left, two right
            <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[400px] md:h-[450px] rounded-xl overflow-hidden">
              <div
                className="row-span-2 cursor-pointer hover:opacity-95 hover:scale-[1.01] transition-all duration-300"
                onClick={() => openDialog(0)}
              >
                <img
                  src={allImages[0]?.url}
                  alt={allImages[0]?.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              {allImages.slice(1, 3).map((image, index) => (
                <div
                  key={index + 1}
                  className="cursor-pointer hover:opacity-95 hover:scale-[1.01] transition-all duration-300"
                  onClick={() => openDialog(index + 1)}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            // Four or more images - Enhanced Bento Grid
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[450px] lg:h-[500px] rounded-xl overflow-hidden">
              {/* Main Image - Takes 2x2 space */}
              <div
                className="col-span-2 row-span-2 relative cursor-pointer hover:opacity-95 hover:scale-[1.01] transition-all duration-300 group"
                onClick={() => openDialog(0)}
              >
                <img
                  src={allImages[0]?.url}
                  alt={allImages[0]?.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Secondary Images */}
              {allImages.slice(1, 5).map((image, index) => {
                const actualIndex = index + 1;
                const isLastVisible = actualIndex === 4 && allImages.length > 5;

                return (
                  <div
                    key={actualIndex}
                    className="relative cursor-pointer hover:opacity-95 hover:scale-[1.01] transition-all duration-300 group"
                    onClick={() => openDialog(actualIndex)}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay for additional images */}
                    {isLastVisible && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="text-center text-white">
                          <div className="text-lg md:text-xl font-bold mb-1">
                            +{allImages.length - 5}
                          </div>
                          <div className="text-xs md:text-sm opacity-90">
                            ภาพเพิ่มเติม
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                );
              })}

              {/* Fill empty spaces if less than 5 images */}
              {allImages.length < 5 && 
                Array.from({ length: 5 - allImages.length }).map((_, index) => (
                  <div 
                    key={`empty-${index}`} 
                    className="bg-gray-100 rounded-lg"
                  />
                ))
              }
            </div>
          )}
        </div>

        {/* Image counter for all layouts */}
        {allImages.length > 1 && (
          <div className="mt-3 text-center">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              ทั้งหมด {allImages.length} ภาพ
            </span>
          </div>
        )}
      </div>

      {/* Gallery Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-full w-[50vh] h-[80vh] sm:w-[90vh] md:w-[140vh] xl:w-[180vh] xl:h-[100vh] max-h-[95vh] p-0 bg-white overflow-y-auto rounded-lg">
          <DialogTitle className="flex mt-4 mx-auto">
            <span>ภาพทั้งหมด ({allImages.length} รูป)</span>
          </DialogTitle>
          {viewMode === "grid" ? (
            /* Gallery Grid View */
            <div className="relative w-full h-full flex flex-col bg-white">
              {/* Improved Grid Gallery with ScrollArea */}
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                  {allImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square cursor-pointer rounded-lg overflow-hidden hover:opacity-90 hover:scale-[1.02] duration-300 transition-all group shadow-sm hover:shadow-md"
                      onClick={() => openSlideView(index)}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />

                      {/* Image number overlay */}
                      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Slide View */
            <div className="mx-auto relative h-full flex flex-col bg-white w-[300px] sm:w-[550px] md:w-full xl:w-full xl:h-full">
              {/* Slide Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white">
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
              <div className="mx-auto xl:flex-1 relative flex items-center justify-center p-2 sm:p-4 md:p-6 md:w-[650px] xl:w-full xl:h-full">
                <img
                  src={allImages[currentImageIndex]?.url}
                  alt={allImages[currentImageIndex]?.alt}
                  className="rounded-lg object-contain max-w-full max-h-[calc(100vh-150px)]"
                />

                {/* Navigation Buttons */}
                {allImages.length > 1 && (
                  <>
                    <Button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md shadow-lg hover:bg-gray-100 text-gray-700 border"
                      size="icon"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md shadow-lg hover:bg-gray-100 text-gray-700 border"
                      size="icon"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
              </div>

              {/* Bottom Thumbnails with ScrollArea */}
              <div className="h-16 md:h-20 bg-gray-50 border-t grid">
                <ScrollArea className="h-full p-3 md:p-4">
                  <div className="flex gap-2 h-10 md:h-12">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 h-10 md:h-12 aspect-square rounded-lg overflow-hidden hover:scale-[1.02] duration-300 transition-all ${
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