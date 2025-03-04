import { execSync, spawn } from "child_process";

function startServices() {
  console.log("🚀 Starting services...");
  execSync("npm run services:up", { stdio: "inherit" });
  console.log("✅ Services are up.");
}

const waitForPostgres = () => {
  const MAX_RETRIES = 30;
  const INTERVAL = 1000; // 1 segundo
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const stdout = execSync(
        "docker exec dev_postgres pg_isready --host localhost",
        { encoding: "utf-8", stdio: "pipe" }
      );
      if (stdout.includes("accepting connections")) {
        console.log("✅ Postgres is ready!");
        break;
      }
    } catch (error) {
      JSON.stringify(error);
      console.log("⏳ Waiting for postgres container to be ready...");
    }
    attempts++;
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, INTERVAL);
  }
};

function applyMigrations() {
  console.log("🔄 Applying migrations...");
  execSync("npx prisma migrate dev", { stdio: "inherit" });
  console.log("✅ Migrations applied.");
}
function startNextServer() {
  console.log("🚀 Starting Next.js server...");

  const serverProcess = spawn("npx", ["next", "dev", "--turbopack"], {
    shell: true,
    stdio: "ignore",
  });

  return serverProcess;
}

function stopNextServer() {
  execSync("fuser -n tcp 3000 | xargs kill -9", { stdio: "ignore" });
  console.log("🛑 Processo na porta 3000 finalizado.");
}

async function waitForServer() {
  console.log("⏳ Waiting for Next.js server to be ready...");

  const MAX_RETRIES = 30;
  const INTERVAL = 3000; // 3 segundos
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status === 200) {
        console.log("✅ Server is ready!");
        return;
      }
    } catch (error) {
      JSON.stringify(error);
      console.log(
        `❌ Server not ready yet. Retrying... (${attempts + 1}/${MAX_RETRIES})`
      );
    }

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, INTERVAL));
  }

  throw new Error("❌ Server did not start in time!");
}

function runTests() {
  console.log("🧪 Running tests...");
  execSync("npx vitest run", { stdio: "inherit" });
  console.log("✅ Tests completed.");
}

async function main() {
  try {
    startServices();
    waitForPostgres();
    applyMigrations();

    const nextProcess = startNextServer();
    await waitForServer();

    runTests();

    nextProcess.kill();
    stopNextServer();
  } catch (error) {
    console.error("🚨 CI script failed:", error);
    process.exit(1);
  }
}

main();
