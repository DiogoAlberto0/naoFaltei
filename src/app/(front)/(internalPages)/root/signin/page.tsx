import { CredentialsSigninForm } from "../../../components/CredentialsSigninForm/CredentialsSigninForm";

const RootSigninPage = async () => {
  return (
    <main className="flex justify-center items-center h-dvh">
      <CredentialsSigninForm isRoot />
    </main>
  );
};
export default RootSigninPage;
