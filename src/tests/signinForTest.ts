export const signinForTest = async ({
  login,
  password,
}: {
  login: string;
  password: string;
}) => {
  try {
    const loginResponse = await fetch("http://localhost:3000/api/v1/signin", {
      body: JSON.stringify({
        login: login,
        password: password,
      }),
      method: "POST",
      credentials: "include",
    });

    const setCookieHeader = loginResponse.headers.get("set-cookie");
    if (!setCookieHeader)
      throw new Error("Nenhum cookie foi retornado pelo servidor!");
    const cookies = setCookieHeader
      .split(", ")
      .map((cookie) => cookie.split(";")[0])
      .join("; ");

    return { cookies };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
