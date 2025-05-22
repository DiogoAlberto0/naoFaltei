import { prisma } from "@/prisma/prisma";

// error
import { InputError } from "@/src/Errors/errors";

// utils
import { cpfUtils } from "@/src/utils/cpf";
import { emailUtils } from "@/src/utils/email";
import { groupByPeriod } from "@/src/utils/groupby";
import { loginUtils } from "@/src/utils/login";

const findUniqueBy = ({ id, login }: { id?: string; login?: string }) => {
  if (id) {
    return prisma.workers.findUnique({
      where: { id },
    });
  }

  if (login) {
    return prisma.workers.findUnique({
      where: { login: loginUtils.normalize(login) },
    });
  }
};

const findBy = async ({
  cpf,
  email,
  name,
}: {
  email?: string;
  name?: string;
  cpf?: string;
}) => {
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

  if (filters.length === 0) return null;

  return prisma.workers.findFirst({
    where: {
      OR: filters,
    },
  });
};

const count = async (props?: { establishmentId?: string }) => {
  return await prisma.workers.count({
    where: {
      is_active: true,
      establishment: {
        id: props?.establishmentId,
      },
    },
  });
};

const validateWorker = async (workerId: string) => {
  const worker = await findUniqueBy({ id: workerId });

  if (!worker)
    throw new InputError({
      message: "Funcionário não encontrado",
      action:
        "Verifique se os dados do funcionário foram informados corretamente",
      status_code: 400,
    });
};

const listByEstablishment = async ({
  establishmentId,
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
  establishmentId: string;
}) => {
  const workers = await prisma.workers.findMany({
    where: {
      establishment_id: {
        equals: establishmentId,
      },
    },
    orderBy: {
      name: "asc",
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
    select: {
      id: true,
      name: true,
      email: true,
      worker_clockin: {
        select: {
          is_entry: true,
        },
        orderBy: {
          clocked_at: "desc",
        },
        take: 1,
      },
    },
  });

  return workers;
};

const countPeriod = async ({
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
  const result = await prisma.workers.findMany({
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

  return groupByPeriod(result, (result) => new Date(result.created_at), period);
};

export {
  findBy,
  findUniqueBy,
  count,
  validateWorker,
  listByEstablishment,
  countPeriod,
};
