import { useRouter } from "next/navigation";

// heroui components
import { Tooltip } from "@heroui/react";

//icons
import { DeleteIcon } from "@/assets/icons/DeleteIcon";
import { EyeIcon } from "@/assets/icons/EyeIcon";

//custom components
import { UpdateWorkerModal } from "./UpdateWorkerModal";

export const ActionsToolTips = ({
  workerId,
  isWorkerEditable,
  baseRoute,
  isDemo,
}: {
  workerId: string;
  isWorkerEditable: boolean;
  baseRoute: string;
  isDemo?: boolean;
}) => {
  const router = useRouter();
  return (
    <div className="relative flex flex-col sm:flex-row items-center justify-center gap-2 ">
      <Tooltip content="Details">
        <span
          onClick={() =>
            router.push(`${baseRoute}/${workerId}${isDemo ? "?demo=true" : ""}`)
          }
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
        >
          <EyeIcon />
        </span>
      </Tooltip>
      {isWorkerEditable && (
        <>
          <UpdateWorkerModal
            workerId={workerId}
            isButton={false}
            isDemo={isDemo}
          />
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Tooltip>
        </>
      )}
    </div>
  );
};
