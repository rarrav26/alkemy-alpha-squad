import { Outlet, useNavigate, Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

function RootLayout() {
  const navigate = useNavigate();

  // Ejemplo de redirección programática para el botón de salir
  const handleLogout = () => {
    // Aquí puedes limpiar tokens o estados de auth
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= CONTENIDO DINÁMICO ================= */}
      {/* El 'flex-1' expande esta sección para empujar el footer hacia abajo */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}
export default RootLayout;
