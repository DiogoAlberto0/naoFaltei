"use client";
import { ManualInstallNotice } from "./ManualInstallNotice";
import { InstallModal } from "./InstallModal";

export const InstalPrompt = () => {
  return (
    <>
      <InstallModal />
      <ManualInstallNotice />
    </>
  );
};
