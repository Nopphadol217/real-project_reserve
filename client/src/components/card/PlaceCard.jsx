import { Card } from "../ui/card";

function PlaceCard({ places }) {
  const { title, price, description, lat, lng, category, secure_url } = places;
  
  return (
    <div className="w-full h-full">
      <Card className="
        w-full h-full
        flex flex-col
        rounded-xl overflow-hidden 
        shadow-md hover:shadow-xl
        transition-all duration-300 
        bg-white
        border border-gray-200
        transform hover:-translate-y-1
        hover:scale-[1.02]
      ">
        {/* Image Section - Responsive Heights */}
        <div className="relative w-full h-48 sm:h-52 md:h-56 lg:h-60 overflow-hidden group">
          <img
            src={secure_url}
            alt={title || "Place Image"}
            className="w-full h-full object-cover 
                     transition-transform duration-500 
                     group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          {category && (
            <div className="absolute top-3 left-3 
                          bg-blue-600/90 backdrop-blur-sm text-white 
                          text-xs font-semibold px-3 py-1.5 rounded-full
                          shadow-lg">
              {category}
            </div>
          )}
          
          {/* Price Badge - Mobile Friendly */}
          <div className="absolute bottom-3 right-3 
                        bg-white/95 backdrop-blur-sm text-gray-900 
                        text-sm font-bold px-3 py-1.5 rounded-full
                        shadow-lg border border-gray-200">
            ฿{price?.toLocaleString() || 0}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow p-4 sm:p-5">
          {/* Title - Responsive Typography */}
          <h2 className="text-lg sm:text-xl  text-gray-800 mb-2
                       line-clamp-2 leading-tight">
            {title || 'ไม่มีชื่อ'}
          </h2>
          
          {/* Description - Responsive */}
          <p className="text-sm sm:text-base text-gray-600 mb-4
                       line-clamp-3 leading-relaxed flex-grow">
            {description || 'ไม่มีคำอธิบาย'}
          </p>
          
          {/* Action Button - Always at Bottom */}
          <div className="mt-auto">
            <button className="
              w-full bg-gradient-to-r from-blue-600 to-sky-500 
              text-white py-2.5 sm:py-3 rounded-lg 
              font-semibold text-sm sm:text-base
              hover:from-blue-700 hover:to-sky-600 
              active:scale-95
              transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
            ">
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>ดูรายละเอียด</span>
              </span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PlaceCard;