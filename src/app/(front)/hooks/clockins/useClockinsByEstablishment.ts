import { fetcher } from "@/src/utils/fetcher";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { IRegister } from "./clockins.types";

interface IMetaInfos {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

interface IListClockinResponse {
  lastRegisters: IRegister[];
  meta: IMetaInfos;
}

interface IUseClockinsByEstablishmentProps {
  establishmentId: string;
  maxRegisters: number;
  isDemo?: boolean;
}
export const useClockinsByEstablishment = ({
  establishmentId,
  maxRegisters,
  isDemo = false,
}: IUseClockinsByEstablishmentProps) => {
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState<number | null>(null);

  const { data, error, isLoading } = useSWR<IListClockinResponse>(
    isDemo
      ? null
      : `/api/v1/clockin/listByEstablishment?establishmentId=${establishmentId}&pageSize=${maxRegisters}&page=${page}`,
    fetcher,
  );

  useEffect(() => {
    if (data?.meta.totalPages && totalPages === null) {
      setTotalPages(data.meta.totalPages);
    }
  }, [data, totalPages]);

  return {
    page,
    setPage,
    totalPages,
    data,
    error,
    isLoading,
  };
};
