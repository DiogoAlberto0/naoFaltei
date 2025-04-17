// errors
import { InputError } from "@/src/Errors/errors";

//utils
import { cpfUtils } from "@/src/utils/cpf";
import { emailUtils } from "@/src/utils/email";
import { loginUtils } from "@/src/utils/login";
import { phoneUtils } from "@/src/utils/phone";
import { frontPasswordUtils } from "@/src/utils/password.front";

//fetcher
import { axios } from "@/src/utils/fetcher";

//hero ui
import { addToast } from "@heroui/toast";

interface IWorker {
  id: string;
  name: string;
  email: string;
  login: string;
  cpf: string;
  phone: string;
}
export const createWorker = async (formData: FormData) => {
  const establishmentId = formData.get("establishmentId");
  const name = formData.get("name");
  const phone = formData.get("phone");
  const login = formData.get("login");
  const email = formData.get("email");
  const cpf = formData.get("cpf");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  console.log({
    name,
    phone,
    cpf,
    login,
    password,
    confirmPassword,
  });

  if (
    !name ||
    !login ||
    !cpf ||
    !password ||
    !confirmPassword ||
    !phone ||
    !email
  )
    throw new InputError({
      message: "Campos obrigatórios faltando",
      action:
        "Informe o nome, phone, email, login, cpf, senha e confirmação de senha.",
    });

  if (password !== confirmPassword)
    throw new InputError({
      message: "As senhas não coincidem",
      action: "Verifique a senha e a confirmação",
    });

  loginUtils.isValidOrThrow(login.toString());
  cpfUtils.isValidOrThrow(cpf.toString());
  frontPasswordUtils.isValidOrThrow(password.toString());
  phoneUtils.isValidOrThrow(phone.toString());
  emailUtils.isValidOrThrow(email.toString());

  const { data } = await axios<IWorker>({
    route: "/api/v1/worker/create",
    method: "POST",
    body: {
      name,
      login,
      cpf,
      email,
      phone,
      password,
      establishmentId,
    },
  });

  addToast({
    color: "success",
    title: `Funcionário ${data.name} criado com sucesso`,
  });
};

export const updateWorker = async (formData: FormData) => {
  const workerId = formData.get("id");
  const establishmentId = formData.get("establishmentId");
  const name = formData.get("name");
  const phone = formData.get("phone");
  const login = formData.get("login");
  const email = formData.get("email");
  const cpf = formData.get("cpf");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!name || !login || !cpf || !phone || !email)
    throw new InputError({
      message: "Campos obrigatórios faltando",
      action:
        "Informe o nome, phone, email, login, cpf, senha e confirmação de senha.",
    });

  if (password && password !== confirmPassword)
    throw new InputError({
      message: "As senhas não coincidem",
      action: "Verifique a senha e a confirmação",
    });

  loginUtils.isValidOrThrow(login.toString());
  cpfUtils.isValidOrThrow(cpf.toString());
  if (password) frontPasswordUtils.isValidOrThrow(password.toString());
  phoneUtils.isValidOrThrow(phone.toString());
  emailUtils.isValidOrThrow(email.toString());

  const { data } = await axios<IWorker>({
    route: `/api/v1/worker/${workerId}/update`,
    method: "PUT",
    body: {
      name,
      login,
      cpf,
      email,
      phone,
      password,
      establishmentId,
    },
  });

  addToast({
    color: "success",
    title: `Funcionário ${data.name} alterado com sucesso`,
  });
};
