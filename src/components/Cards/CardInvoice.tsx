// Packages
import { Icon } from "@iconify/react/dist/iconify.js";
import { Card, CardBody } from "@nextui-org/react";

type InvoiceCardProps = {
  title: string;
  icon: string;
  onPress: () => void;
};

const InvoiceCard = (props: InvoiceCardProps) => {
  return (
    <Card
      className='min-w-[40%] cursor-pointer'
      isPressable
      onPress={props.onPress}
    >
      <CardBody className='flex items-center'>
        <Icon icon={props.icon} width={100} />
        <h1 className='font-semibold text-3xl'>{props.title}</h1>
      </CardBody>
    </Card>
  );
};

export default InvoiceCard;
