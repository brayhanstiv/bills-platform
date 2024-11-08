// Packages
import { useNavigate } from "react-router-dom";
import InvoiceCard from "../../components/Cards/CardInvoice";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <section className="flex justify-center items-center gap-4 min-h-screen">
      <InvoiceCard
        title={"Recaudo"}
        icon={"hugeicons:invoice"}
        onPress={() => navigate("/admin/treasuries/home")}
      />
      <InvoiceCard
        title={"Facturas"}
        icon={"hugeicons:invoice-03"}
        onPress={() => navigate("/admin/invoices/home")}
      />
    </section>
  );
};

export default HomePage;
