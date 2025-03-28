import { UpdateInfosForm } from "./UpdateInfosForm";

const UpdateInfosPage = () => {
  return (
    <div className="max-h-full overflow-auto flex flex-col h-full w-full p-5 max-sm:p-2">
      <h1 className="text-xl w-full text-center">Atualize seus dados</h1>

      <UpdateInfosForm />
    </div>
  );
};

export default UpdateInfosPage;
