"use client"
import React, { useEffect, useState } from 'react';

// SlideShow komponens
const SlideShow: React.FC<{ images: string[]; interval: number }> = ({ images, interval }) => {
  // Állapotváltozó inicializálása a jelenlegi kép indexel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effektus a komponens mount-jakor és a kép váltásához
  useEffect(() => {
    // Időzítő inicializálása a kép váltásához
    const intervalId = setInterval(() => {
      // A jelenlegi kép indexének frissítése
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    // Tisztító függvény az időzítő leállításához a komponens elválasztásakor
    return () => clearInterval(intervalId);
  }, [images, interval]); // A dependency tömb tartalmazza a képek tömböt és az időközt

  // Kép megjelenítése a jelenlegi kép index alapján
  return <img className="w-full h-full object-cover" src={images[currentImageIndex]} />;
};

export default SlideShow;
