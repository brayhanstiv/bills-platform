// Packages
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

type ConfirmModalProps = {
  type: "error" | "success";
  title: string;
  isOpen: boolean;
  onClose: () => void;
};

const ModalResponse = (props: ConfirmModalProps) => {
  return (
    <Modal
      size={"md"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      isDismissable={false}
    >
      <ModalContent>
        <>
          <ModalHeader className='flex flex-col justify-center items-center'>
            <Icon
              className={
                props.type === "error" ? "text-red-500" : "text-green-500"
              }
              icon={
                props.type === "error"
                  ? "solar:close-circle-linear"
                  : "solar:check-circle-linear"
              }
              width={80}
            />
          </ModalHeader>
          <ModalBody className='flex flex-col items-center capitalize'>
            {props.title}
          </ModalBody>
          <ModalFooter>
            <Button
              className={`${
                props.type === "error" ? "bg-red-500" : "bg-green-500"
              } text-white`}
              onPress={props.onClose}
            >
              Ok
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default ModalResponse;
