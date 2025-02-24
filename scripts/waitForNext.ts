const waitForNext = async () => {
  console.log("Aguardando o servidor next:");

  let status = 0;

  process.stdout.write("[ ");
  while (status != 200) {
    try {
      status = (await fetch("http://localhost:3000/api/v1/status")).status;
    } catch (error) {
    } finally {
      process.stdout.write("=");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  process.stdout.write(" ]\n");
  console.log("Servidor iniciado");
  return 0;
};

waitForNext().then();
