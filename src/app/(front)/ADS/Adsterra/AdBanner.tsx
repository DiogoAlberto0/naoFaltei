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
        key: "e2d1c460a7777e6eb6321ed398239202",
        format: "iframe",
        height: 50,
        width: 320,
        params: {},
      };
    } else if (width >= 470 && width <= 768) {
      (window as any).atOptions = {
        key: "62cd59d8fca42e137ae80d5255f1e15b",
        format: "iframe",
        height: 60,
        width: 468,
        params: {},
      };
    } else {
      (window as any).atOptions = {
        key: "c201a10f1fb4923bc4c5d44f9c08a33d",
        format: "iframe",
        height: 90,
        width: 728,
        params: {},
      };
    }

    // Cria o script e injeta
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      width >= 768
        ? "//www.highperformanceformat.com/c201a10f1fb4923bc4c5d44f9c08a33d/invoke.js"
        : "//www.highperformanceformat.com/e2d1c460a7777e6eb6321ed398239202/invoke.js";
    script.async = true;

    containerRef.current.appendChild(script);
  }, [width]);

  return <div ref={containerRef} />;
};
