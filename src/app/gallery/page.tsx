"use client";

import dynamic from "next/dynamic";

const CarouselGallery = dynamic(() => import("@/components/CarouselGallery"), { ssr: false });

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#020306] text-white selection:bg-white selection:text-black">
      {/* 3D Cover Flow Carousel Gallery */}
      <CarouselGallery />
    </main>
  );
}
