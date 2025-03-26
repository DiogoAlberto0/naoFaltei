"use client";
import { RegistersTable } from "@/src/components/RegistersTable/RegistersTable";
import { Button, DatePicker } from "@heroui/react";

const TimeSheetPage = () => {
  return (
    <main className="h-full w-full flex flex-col justify-between gap-2 max-h-full max-w-full overflow-auto p-2">
      <h1 className="w-full text-center text-2xl">Folha de ponto</h1>
      <div className="flex flex-col gap-2">
        <DatePicker
          label="Selecione um mês de busca: "
          labelPlacement="outside"
          showMonthAndYearPickers
          className="w-full"
        />
        <Button color="primary">Buscar</Button>
      </div>
      <RegistersTable
        title="Mês: Jan. Ano: 2024"
        detailed
        maxRegisters={10}
        overflowAuto={false}
      />
    </main>
  );
};

export default TimeSheetPage;
