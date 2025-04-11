export const fetcher = (url: any) =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`).then((r) => r.json());

export const axios = async <T>({
  route,
  method = "GET",
  body,
  cookie,
  revalidateHours = 24,
  revalidateTags,
}: {
  route: string;
  method?: "POST" | "GET" | "PUT" | "DELETE";
  body?: any;
  cookie?: string;
  revalidateHours?: number;
  revalidateTags?: string[];
}): Promise<{ response: Response; data: T | any }> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${route}`,
    {
      method,
      body: JSON.stringify(body),
      headers: cookie ? { cookie } : {},
      cache: revalidateHours > 0 ? "force-cache" : "no-store",
      next: {
        revalidate: 1000 * 60 * 60 * revalidateHours,
        tags: revalidateTags,
      },
    },
  );

  const data = (await response.json()) as T | any;

  return { response, data };
};
