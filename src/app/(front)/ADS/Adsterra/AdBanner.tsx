"use client";
import { useEffect, useRef, useState } from "react";

export const AdBanner = () => {
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    setWidth(window.innerWidth); // inicial
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Limpa o conteúdo anterior
    containerRef.current.innerHTML = "";

    // Define atOptions

    if (width < 470) {
      (window as any).atOptions = {
        key: `${process.env.NEXT_PUBLIC_ADSTERRA_SMALL_BANNER_ID}`,
        format: "iframe",
        height: 50,
        width: 320,
        params: {},
      };
    } else if (width >= 470 && width <= 768) {
      (window as any).atOptions = {
        key: `${process.env.NEXT_PUBLIC_ADSTERRA_MEDIUM_BANNER_ID}`,
        format: "iframe",
        height: 60,
        width: 468,
        params: {},
      };
    } else {
      (window as any).atOptions = {
        key: `${process.env.NEXT_PUBLIC_ADSTERRA_BIG_BANNER_ID}`,
        format: "iframe",
        height: 90,
        width: 728,
        params: {},
      };
    }

    // Cria o script e injeta
    const script = document.createElement("script");
    script.type = "text/javascript";
    if (width < 470) {
      script.src = `//www.highperformanceformat.com/${process.env.NEXT_PUBLIC_ADSTERRA_SMALL_BANNER_ID}/invoke.js`;
    } else if (width >= 470 && width <= 768) {
      script.src = `//www.highperformanceformat.com/${process.env.NEXT_PUBLIC_ADSTERRA_MEDIUM_BANNER_ID}/invoke.js`;
    } else {
      script.src = `//www.highperformanceformat.com/${process.env.NEXT_PUBLIC_ADSTERRA_BIG_BANNER_ID}/invoke.js`;
    }
    script.async = true;

    containerRef.current.appendChild(script);
  }, [width]);

  return <div ref={containerRef} />;
};
