interface IInputErrorParams {
  message: string;
  status_code: number;
  action?: string;
}
export class InputError extends Error {
  public status_code: number;
  public action: string;

  constructor({ message, status_code, action }: IInputErrorParams) {
    super(message);
    this.name = "InputError";
    this.status_code = status_code;
    this.action = action || "Contate o supervisor";
  }
}

interface IConflictErrorParams {
  message: string;
  status_code: number;
  action?: string;
}
export class ConflictError extends Error {
  public status_code: number;
  public action: string;

  constructor({ message, status_code, action }: IConflictErrorParams) {
    super(message);
    this.name = "ConflictError";
    this.status_code = status_code;
    this.action = action || "Contate o supervisor";
  }
}

export class UnauthorizedError extends Error {
  public status_code: number;
  public action: string;

  constructor() {
    super("Usuário não autorizado");
    this.name = "UnauthorizedError";
    this.status_code = 401;
    this.action = "Faça login no site";
  }
}
