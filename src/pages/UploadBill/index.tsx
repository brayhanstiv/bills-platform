// Packages
import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Card } from "@nextui-org/react";

const UploadBillPage = () => {
  const [selectedFile, setSelectedFile] = React.useState<string | Blob>();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files![0]);
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile!);
      const url =
        "https://backendfacturacion-dot-chat-socialcog.ue.r.appspot.com/Invoices/";
      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await Toast.fire({
        icon: "success",
        title: "Se subió la factura correctamente",
      });
    } catch (error) {
      console.log("Unexpected error " + error);
      await Toast.fire({
        icon: "error",
        title: "No se pudo subir la factura correctamente",
      });
    }
  };

  return (
    <section className='flex justify-center'>
      <Card className='flex flex-col gap-4 p-2 w-[30vw]'>
        <input type='file' accept='file/*' onChange={handleFileUpload} />
        <Button size='sm' variant='flat' onPress={handleUpload}>
          Subir factura
        </Button>
      </Card>
    </section>
  );
};

export default UploadBillPage;
