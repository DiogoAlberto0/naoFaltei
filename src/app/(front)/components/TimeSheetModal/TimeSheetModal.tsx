//heroui
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { useDisclosure } from "@heroui/react";

//components
import { ModalFullSize } from "../Modal/ModalFullSize";
import { FullScreenIconButton } from "../Buttons/FullScreenIconButton";

export const TimeSheetModal = ({}: {}) => {
  const registers = [];

  for (let index = 0; index < 50; index++) {
    registers.push(index);
  }

  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  return (
    <>
      <FullScreenIconButton onPress={onOpen} />

      <ModalFullSize
        title="Folha de ponto do Diogo Alberto. Data: 10/02/2025 - 10/03/2025"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <Table className="max-h-full" isStriped>
          <TableHeader>
            <TableColumn>Data</TableColumn>
            <TableColumn>D. Semana</TableColumn>
            <TableColumn>Entrada</TableColumn>
            <TableColumn>Saida</TableColumn>
            <TableColumn>H/ descanso</TableColumn>
            <TableColumn>H. trabalhadas</TableColumn>
          </TableHeader>
          <TableBody>
            {registers.map((id) => (
              <TableRow key={id}>
                <TableCell>14/01/2025</TableCell>
                <TableCell>Segunda</TableCell>
                <TableCell>10:30</TableCell>
                <TableCell>20:00</TableCell>
                <TableCell>1:30</TableCell>
                <TableCell>8:00</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ModalFullSize>
    </>
  );
};
