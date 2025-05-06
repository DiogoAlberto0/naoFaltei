import Script from "next/script";

export const InPagePush = () => {
  return (
    <>
      <Script
        id="aclib"
        type="text/javascript"
        src="//acscdn.com/script/aclib.js"
        strategy="beforeInteractive"
      />

      <Script
        id="aclib-inPagePush"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
          aclib.runInPagePush({
            zoneId: '9910230',
            maxAds: 2,
          });
        `,
        }}
      />
    </>
  );
};
