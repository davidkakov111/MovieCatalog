// Use client
import React, { useEffect, useState } from 'react';

// SlideShow component
const SlideShow: React.FC<{ images: string[]; interval: number }> = ({ images, interval }) => {
  // Initialize state variable for the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effect for component mount and image transitions
  useEffect(() => {
    // Initialize timer for image transitions
    const intervalId = setInterval(() => {
      // Update the current image index
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    // Cleanup function to stop the timer on component unmount
    return () => clearInterval(intervalId);
  }, [images, interval]); // The dependency array includes the images array and the interval

  // Display the image based on the current image index
  return <img className="w-full h-full object-cover" src={images[currentImageIndex]} />;
};

export default SlideShow;
