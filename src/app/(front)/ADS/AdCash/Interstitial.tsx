import Script from "next/script";

export const Interstitial = () => {
  return (
    <>
      <Script
        id="aclib"
        type="text/javascript"
        src="//acscdn.com/script/aclib.js"
        strategy="beforeInteractive"
      />
      <Script
        id="aclib-interstitial"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `aclib.runInterstitial({
            zoneId: '9910034',
          });`,
        }}
      />
    </>
  );
};
