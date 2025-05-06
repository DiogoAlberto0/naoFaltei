import Script from "next/script";

export const BigBanner = () => {
  return (
    <>
      <Script
        id="aclib"
        type="text/javascript"
        src="//acscdn.com/script/aclib.js"
        strategy="beforeInteractive"
      />

      <div>
        <Script
          id="aclib-banner"
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
          aclib.runBanner({
            zoneId: '9907810',
          });
        `,
          }}
        />
      </div>
    </>
  );
};
