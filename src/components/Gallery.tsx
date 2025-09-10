import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    {
      src: "https://images.unsplash.com/photo-1675621926040-b514257d5941?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwaG9tZXN0YXklMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU3NDQxMzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Phòng ngủ chính",
      title: "Phòng ngủ chính"
    },
    {
      src: "https://images.unsplash.com/photo-1606202598125-e2077bb5ebcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBsaXZpbmclMjByb29tJTIwaG9tZXN0YXl8ZW58MXx8fHwxNzU3NDQxMzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Phòng khách",
      title: "Phòng khách"
    },
    {
      src: "https://images.unsplash.com/photo-1572534382965-ef9f328c8db4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaG9tZXN0YXl8ZW58MXx8fHwxNzU3NDQxMzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Bếp hiện đại",
      title: "Bếp hiện đại"
    },
    {
      src: "https://images.unsplash.com/photo-1743813584899-696881ddc8aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lc3RheSUyMG91dGRvb3IlMjBnYXJkZW58ZW58MXx8fHwxNzU3NDQxMzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Khu vườn",
      title: "Khu vườn"
    }
  ];

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  return (
    <section id="gallery" className="py-20" style={{ backgroundColor: '#F2A7C3' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4" style={{ color: '#C599B6' }}>
            Thư viện ảnh
          </h2>
           <p className="text-lg max-w-2xl mx-auto opacity-80" style={{ color: '#C599B6' }}>
             Khám phá không gian xinh đẹp của KatHome In Town qua những hình ảnh chân thực
           </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {images.map((image, index) => (
            <Card 
              key={index}
              className="overflow-hidden cursor-pointer group border-0 hover:shadow-xl transition-all duration-300"
              onClick={() => openLightbox(index)}
            >
              <div className="relative aspect-square">
                <ImageWithFallback
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm">{image.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Button 
            variant="outline" 
            className="border-2 hover:bg-white/20"
            style={{ 
              borderColor: '#C599B6',
              color: '#C599B6'
            }}
          >
            Xem thêm ảnh
          </Button>
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navigation buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={prevImage}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={nextImage}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              {/* Image */}
              <div className="relative">
                <ImageWithFallback
                  src={images[selectedImage].src}
                  alt={images[selectedImage].alt}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <div className="bg-black/60 rounded-lg px-4 py-2 inline-block">
                    <p className="text-white">{images[selectedImage].title}</p>
                    <p className="text-white/70 text-sm">
                      {selectedImage + 1} / {images.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}