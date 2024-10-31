// Packages
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";

type ModalUploadProps = {
  isOpen: boolean;
  loading: boolean;
  file: File | undefined;
  setFile: (event: File) => void;
  handleUpload: () => void;
  onClose: () => void;
};

const ModalUpload = (props: ModalUploadProps) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size='4xl'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Selecciona archivo</ModalHeader>
            <ModalBody className='flex flex-col items-center'>
              <section>
                <input
                  type='file'
                  accept='file/*'
                  onChange={(e) => props.setFile(e.target.files![0])}
                />
                {props.file && (
                  <ul className='my-4'>
                    {/* {[...props.files].map((f, i) => (
                      <li key={i}>
                        {f.name} - {f.type}
                      </li>
                    ))} */}
                    <li>
                      {props.file.name} - {props.file.type}
                    </li>
                  </ul>
                )}
              </section>
            </ModalBody>
            <ModalFooter>
              <Button color='danger' size='md' onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color='primary'
                isDisabled={props.loading ? true : false}
                size='md'
                onPress={props.handleUpload}
              >
                {props.loading && <Spinner size='sm' color='white' />}
                {props.loading ? "Subiendo" : "Subir archivo"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalUpload;
