import { Button } from "@heroui/button";
import { Interstitial } from "../../ADS/AdCash/Interstitial";
import { BigBanner } from "../../ADS/AdCash/Banner";
import { InPagePush } from "../../ADS/AdCash/InPagePush";
import { Native } from "../../ADS/AdCash/Native";

const TestPage = () => {
  return (
    <>
      <h1>Hello world</h1>

      <BigBanner />
      <InPagePush />
      <Interstitial />
      <Native />

      <Button>OK</Button>
    </>
  );
};

export default TestPage;
