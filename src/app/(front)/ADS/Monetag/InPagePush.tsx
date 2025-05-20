"use client";
import Script from "next/script";

export const MonetagInPagePush = () => {
  return (
    <>
      <Script
        id="9352231"
        data-cfasync="false"
        src="/InPagePushScript.js"
        strategy="afterInteractive"
      ></Script>
      <Script
        strategy="afterInteractive"
        src="//foomaque.net/400/9352231"
        onLoad={() => console.log("Carregando monetag")}
        onError={() => console.warn("Falha ao carregar monetag")}
      />
    </>
  );
};
