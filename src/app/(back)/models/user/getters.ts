import { prisma } from "@/prisma/prisma";

// errors
import { InputError } from "@/src/Errors/errors";

// utils
import { cpfUtils } from "@/src/utils/cpf";
import { emailUtils } from "@/src/utils/email";
import { countGroupedByPeriod } from "@/src/utils/groupby";

const findBy = async ({
  id,
  cpf,
  email,
  name,
  login,
}: {
  id?: string;
  email?: string;
  name?: string;
  cpf?: string;
  login?: string;
}) => {
  if (id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  const filters = [];

  if (email) {
    filters.push({ email: emailUtils.normalize(email) });
  }

  if (cpf) {
    filters.push({ cpf: cpfUtils.clean(cpf) });
  }

  if (name) {
    filters.push({ name });
  }

  if (login) {
    filters.push({ name });
  }

  if (filters.length === 0) return null;

  return prisma.user.findFirst({
    where: {
      OR: filters,
    },
  });
};
const validateUser = async (userId: string) => {
  const user = await findBy({ id: userId });

  if (!user)
    throw new InputError({
      message: "Gerente não encontrado",
      action: "Verifique se os dados do gerente foram informados corretamente",
      status_code: 400,
    });
};

export const countPeriod = async ({
  period,
  inicialDate,
  finalDate,
}: {
  period: "day" | "month" | "week";
  inicialDate?: Date;
  finalDate?: Date;
}) => {
  const lte = finalDate
    ? new Date(finalDate.setUTCHours(23, 59, 59, 999))
    : undefined;
  const gt = inicialDate
    ? new Date(inicialDate.setUTCHours(0, 0, 0, 0))
    : undefined;
  const result = await prisma.user.findMany({
    select: {
      created_at: true,
    },
    orderBy: {
      created_at: "asc",
    },
    where: {
      created_at: {
        lte,
        gt,
      },
    },
  });

  return countGroupedByPeriod(
    result,
    (result) => new Date(result.created_at),
    period,
  );
};

const count = async () => {
  return await prisma.user.count();
};

export { findBy, validateUser, count };
