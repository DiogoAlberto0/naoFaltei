"use client";
// components/GoogleConsentScript.tsx
import Script from "next/script";

export const GoogleScripts = () => {
  return (
    <>
      {/* Consent Mode V2 - Deve vir ANTES dos outros scripts do Google */}
      <Script id="google-consent">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            ad_storage: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500 // espera antes de ativar tracking
          });
        `}
      </Script>

      {/* Google Tag Manager */}

      <Script id="google-GTM">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}');
        `}
      </Script>

      {/* Google ads*/}
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
      />
      <Script id="google-ads">
        {`
            window.dataLayer = window.dataLayer || [];
            
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');
          `}
      </Script>

      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALITICS_ID}`}
      />
      <Script id="google-analytics">
        {`
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALITICS_ID}'); // substitua pelo seu ID
        `}
      </Script>

      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        data-ad-client={`${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT_METATAG}`} // substitua pelo seu
        crossOrigin="anonymous"
      />
    </>
  );
};
