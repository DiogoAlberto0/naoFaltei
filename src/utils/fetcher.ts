import { FetchError } from "../Errors/errors";

export const fetcher = async (url: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`);

  const data = await res.json();
  if (!res.ok) {
    throw new FetchError({
      message: data.message,
      action: data.action,
      status_code: res.status,
    });
  }

  return data;
};

export const axios = async <T>(options: {
  route: string;
  method?: "POST" | "GET" | "PUT" | "DELETE";
  body?: any;
  cookie?: string;
  revalidateHours?: number;
  revalidateTags?: string[];
}): Promise<{ response: Response; data: T }> => {
  const {
    route,
    method = "GET",
    body,
    cookie,
    revalidateHours = 24,
    revalidateTags,
  } = options;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${route}`,
    {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}),
      },
      cache: revalidateHours > 0 ? "force-cache" : "no-store",
      next: {
        revalidate: 60 * 60 * revalidateHours,
        tags: revalidateTags,
      },
    },
  );

  if (!response.ok) {
    // Erro explícito com mensagem vinda da API
    const errorData = await response.json();
    throw new FetchError({
      message: errorData.message,
      action: errorData.action,
      status_code: response.status,
    });
  }

  const data = (await response.json()) as T;
  return { response, data };
};
