//fetcher
import { axios } from "@/src/utils/fetcher";

// error
import { InputError } from "@/src/Errors/errors";

// heroui
import { addToast } from "@heroui/toast";

export const registerClockinHandler = async (formData: FormData) => {
  const workerId = formData.get("workerId")?.toString();
  if (!workerId) {
    throw new InputError({
      message: "Falha ao identificar o usuário",
      action: "Recarregue a página",
    });
  }

  const registers: {
    times: string[];
    day: string;
    isFirstEntry: boolean;
  }[] = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("clockGroup-")) {
      const [, id, field] = key.split("-");
      const entry = registers[+id] ?? {
        times: [],
        day: "",
        isFirstEntry: true,
      };

      if (field === "day") entry.day = value.toString();
      else if (field === "isFirstEntry") entry.isFirstEntry = value === "true";
      else if (field === "time") entry.times.push(value.toString());

      registers[+id] = entry;
    }
  }

  const finalRegisters = registers.flatMap(({ day, times, isFirstEntry }) =>
    times.map((time, idx) => ({
      clockedAt: new Date(`${day}T${time}`).toISOString(),
      isEntry: isFirstEntry ? idx % 2 === 0 : idx % 2 !== 0,
    })),
  );

  console.log(finalRegisters);
  const { data } = await axios<{ message: string }>({
    route: "/api/v1/clockin/managerRegister",
    method: "POST",
    body: { workerId, registers: finalRegisters },
  });

  addToast({
    color: "success",
    title: "Folha de ponto atualizada com sucesso",
    description: data.message,
  });
};
