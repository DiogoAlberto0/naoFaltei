interface IInputErrorParams {
  message: string;
  status_code?: number;
  action?: string;
}
export class InputError extends Error {
  public status_code: number;
  public action: string;

  constructor({ message, status_code, action }: IInputErrorParams) {
    super(message);
    this.name = "InputError";
    this.status_code = status_code || 400;
    this.action = action || "Contate o suporte";
  }
}

interface IBadRequestErrorParams {
  message: string;
  status_code?: number;
  action?: string;
}
export class BadRequestError extends Error {
  public status_code: number;
  public action: string;

  constructor({ message, status_code, action }: IBadRequestErrorParams) {
    super(message);
    this.name = "BadRequestError";
    this.status_code = status_code || 400;
    this.action = action || "Contate o suporte";
  }
}

interface IFetchErrorParams {
  message: string;
  status_code: number;
  action?: string;
}
export class FetchError extends Error {
  public status_code: number;
  public action: string;

  constructor({ message, status_code, action }: IFetchErrorParams) {
    super(message);
    this.name = "FetchError";
    this.status_code = status_code;
    this.action = action || "Contate o suporte";
  }
}

interface IConflictErrorParams {
  message: string;
  action?: string;
}
export class ConflictError extends Error {
  public status_code: number;
  public action: string;

  constructor({ message, action }: IConflictErrorParams) {
    super(message);
    this.name = "ConflictError";
    this.status_code = 409;
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
    super("Usuário não tem permissão para fazer essa operação.");
    this.name = "ForbiddenError";
    this.status_code = 403;
    this.action = "Contate o suporte.";
  }
}

interface INotFoundErrorParams {
  message: string;
  action?: string;
}
export class NotFoundError extends Error {
  public status_code: number;
  public action: string;

  constructor({ message, action }: INotFoundErrorParams) {
    super(message);
    this.name = "NotFound";
    this.status_code = 404;
    this.action = action || "Contate o suporte.";
  }
}
