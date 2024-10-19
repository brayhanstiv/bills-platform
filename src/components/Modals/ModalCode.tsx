import {
  Button,
  Code,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Invoice } from "../../common/types";

type ModeCodeProps = {
  isOpen: boolean;
  invoice: Invoice;
  onClose: () => void;
};

const ModalCode = (props: ModeCodeProps) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size='4xl'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>File content</ModalHeader>
            <ModalBody>
              <Code className='whitespace-pre-wrap'>
                {`id: ${props.invoice?.id}\ninvoice_number: ${props.invoice?.invoice_number}\nissue_date: ${props.invoice?.issue_date}\ndeferred_credit: ${props.invoice?.deferred_credit}\ndiscounts: ${props.invoice?.discounts}\ndue_date: ${props.invoice?.due_date}\nexemptions: ${props.invoice?.exemptions}\nissuer: ${props.invoice?.issuer}\npayer: ${props.invoice?.payer}\npayment_method: ${props.invoice?.payment_method}\nnet_total: ${props.invoice?.net_total}\nother_taxes: ${props.invoice?.other_taxes}\nreading_date: ${props.invoice?.reading_date}\ntax_issuer_id: ${props.invoice?.tax_issuer_id}\ntax_payer_id: ${props.invoice?.tax_payer_id}\ntotal: ${props.invoice?.total}\nvat: ${props.invoice?.vat}`}
              </Code>
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalCode;
