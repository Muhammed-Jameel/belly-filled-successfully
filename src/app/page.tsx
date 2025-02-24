"use client";
import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Share2 } from "lucide-react";
import imagesArray from "./belly";

const IftarInvitation = () => {
  const images = imagesArray;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [carouselStart, setCarouselStart] = useState(0);
  const [friendName, setFriendName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  console.log(carouselStart);

  const carouselRef = useRef<HTMLDivElement>(null);
  const imagesPerView = 4;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (!carouselRef.current) return;

    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const newStart = Math.floor(
      carouselRef.current.scrollLeft /
        (carouselRef.current.clientWidth / imagesPerView)
    );
    setCarouselStart(newStart);
  };

  const nextImages = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: carouselRef.current.clientWidth / imagesPerView,
      behavior: "smooth",
    });
  };

  const prevImages = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: -(carouselRef.current.clientWidth / imagesPerView),
      behavior: "smooth",
    });
  };

  const handleDownload = () => {
    const imageUrl = `./belly/${images[selectedImageIndex]}`;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = images[selectedImageIndex];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Iftar Invitation",
          text: `${friendName} انت مدعوا لـ`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/bg2.jpg')" }}
    >
      <Card className="w-full mx-10 max-w-4xl bg-orange-300/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 text-amber-950">
              إختر تعبئة الكرش المناسبة لليوم او أرسل دعوة تعبئة الكرش
            </h1>

            {/* Preview Section */}
            <div className="relative w-full md:w2/3 lg:w-1/2 aspect-auto mb-8 flex items-center justify-center mx-auto">
              <img
                src={`./belly/${images[selectedImageIndex]}`}
                alt="إختر الصورة التي تريدها"
                className="w-full h-full object-cover rounded-lg"
              />
              {friendName && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className=" px-6 py-3 rounded-lg">
                    <p className="text-white text-2xl text-right font-arabic">
                      {friendName} انت مدعوا لـ
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input Field */}
            <Input
              type="text"
              placeholder="أدخل إسم المدعو"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              className="max-w-md mx-auto mb-8 .placeholder-orange-400 text-right"
            />
          </div>

          {/* Carousel Section */}
          <div className="relative mb-8">
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              onScroll={handleScroll}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-1/4 aspect-square cursor-pointer transition-all ${
                    selectedImageIndex === index ? "ring-4 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={`./belly/${image}`}
                    alt={`Template ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    draggable="false"
                  />
                </div>
              ))}
            </div>

            {/* Carousel Navigation */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80"
              onClick={prevImages}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80"
              onClick={nextImages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              قم بتنزيل التعبئة المختارة
            </Button>
            <Button onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              قم بمشاركة التعبئة المختارة
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IftarInvitation;
