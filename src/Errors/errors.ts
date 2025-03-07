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
    this.action = action || "Contate o suporte";
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
    this.action = action || "Contate o suporte";
  }
}

interface IConnectionErrorParams {
  message: string;
  status_code?: number;
  action?: string;
}
export class ConnectionError extends Error {
  public status_code: number;
  public action: string;

  constructor({ message, status_code, action }: IConnectionErrorParams) {
    super(message);
    this.name = "ConnectionError";
    this.status_code = status_code || 500;
    this.action = action || "Contate o suporte";
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

export class ForbiddenError extends Error {
  public status_code: number;
  public action: string;

  constructor() {
    super("Usuário não tem permissão.");
    this.name = "ForbiddenError";
    this.status_code = 403;
    this.action = "Contate o suporte.";
  }
}
