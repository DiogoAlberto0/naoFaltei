export const fetcher = (url: any) => fetch(url).then((r) => r.json());

export const axios = async ({
  route,
  method = "GET",
  body,
  cookie,
}: {
  route: string;
  method?: "POST" | "GET" | "PUT" | "DELETE";
  body?: any;
  cookie?: string;
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${route}`,
    {
      method,
      body: JSON.stringify(body),
      headers: cookie ? { cookie } : {},
    },
  );

  const data = await response.json();

  return { response, data };
};
