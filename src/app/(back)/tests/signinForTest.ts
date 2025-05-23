export const signinForTest = async ({
  login,
  password,
  isRoot = false,
}: {
  login: string;
  password: string;
  isRoot?: boolean;
}) => {
  try {
    const loginResponse = await fetch("http://localhost:3000/api/v1/signin", {
      body: JSON.stringify({
        login: login,
        password: password,
        root: isRoot,
      }),
      method: "POST",
      credentials: "include",
    });

    const data = await loginResponse.json();
    const setCookieHeader = loginResponse.headers.get("set-cookie");
    if (!setCookieHeader)
      throw new Error(data.message || "Ocorreu um erro ao fazer login");
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
