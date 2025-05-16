export const useCookiesConsent = () => {
  const getConsent = () => {
    const consent = localStorage.getItem("cookie-consent");
    return consent;
  };

  const setGranted = () => {
    localStorage.setItem("cookie-consent", "granted");
  };

  const setDenied = () => {
    localStorage.setItem("cookie-consent", "denied");
  };

  return {
    getConsent,
    setGranted,
    setDenied,
  };
};
