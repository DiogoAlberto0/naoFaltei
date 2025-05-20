"use client";
import Script from "next/script";

export const MonetagVignette = () => {
  return (
    <>
      <Script
        id="9352165"
        data-cfasync="false"
        src="/VignetteScript.js"
        strategy="afterInteractive"
      ></Script>
      <Script
        src="//stoampaliy.net/400/9352165"
        strategy="afterInteractive"
        onLoad={() => console.log("Carregando monetag")}
        onError={() => console.warn("Falha ao carregar monetag")}
      />
    </>
  );
};
