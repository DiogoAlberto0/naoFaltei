import { FetchError, InputError } from "@/src/Errors/errors";
import { cpfUtils } from "@/src/utils/cpf";
import { emailUtils } from "@/src/utils/email";
import { axios } from "@/src/utils/fetcher";
import { loginUtils } from "@/src/utils/login";
import { frontPasswordUtils } from "@/src/utils/password.front";
import { phoneUtils } from "@/src/utils/phone";
import { addToast } from "@heroui/toast";

export const createWorker = async (formData: FormData) => {
  try {
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

    const { response, data } = await axios({
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

    if (response.status != 201)
      throw new FetchError({
        message: data.message,
        action: data.action,
        status_code: response.status,
      });

    addToast({
      color: "success",
      title: `Funcionário ${data.name} criado com sucesso`,
    });
    return true;
  } catch (error: any) {
    if (error.status_code != 500) {
      addToast({
        color: "danger",
        title: error.message,
        description: error.action,
      });
      return false;
    } else throw error;
  }
};

export const updateWorker = async (formData: FormData) => {
  try {
    const workerId = formData.get("id");
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

    const { response, data } = await axios({
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

    console.log({ data });
    if (response.status != 200)
      throw new FetchError({
        message: data.message,
        action: data.action,
        status_code: response.status,
      });

    addToast({
      color: "success",
      title: `Funcionário ${data.name} alterado com sucesso`,
    });
    return true;
  } catch (error: any) {
    if (error.status_code != 500) {
      addToast({
        color: "danger",
        title: error.message,
        description: error.action,
      });
      return false;
    } else throw error;
  }
};
