"use client";

import dynamic from "next/dynamic";

const CarouselGallery = dynamic(() => import("@/components/CarouselGallery"), { ssr: false });

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-white text-[#111]">
      {/* 3D Cover Flow Carousel Gallery */}
      <CarouselGallery />
    </main>
  );
}
