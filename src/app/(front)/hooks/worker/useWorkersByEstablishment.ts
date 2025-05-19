//types
import { IWorkerByEstablishment } from "./worker.type";

import { fetcher } from "@/src/utils/fetcher";
import { useState, useEffect } from "react";
import useSWR from "swr";

export interface IMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
export const useWorkersByEstablishment = ({
  establishmentId,
  isDemo = false,
}: {
  establishmentId: string;
  isDemo?: boolean;
}) => {
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState<number | null>(null);

  const { data, isLoading, error, mutate } = useSWR<{
    workers: IWorkerByEstablishment[];
    meta: IMeta;
  }>(
    isDemo
      ? null
      : `/api/v1/worker/list?establishmentId=${establishmentId}&page=${page}&pageSize=${7}`,
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
    data,
    error,
    mutate,
    isLoading,
    totalPages,
  };
};
