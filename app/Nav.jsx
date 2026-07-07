import { useEffect, useState } from "react";
import { FaSave, FaSignOutAlt, FaTimes, FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/contextos/authContext";
import { getUserDisplayName } from "@/utils/user";
import Periodos from "./periodos/Periodos";

export default function Nav({
  showPeriodosMenu,
  setShowPeriodosMenu,
  currentPeriodo,
}) {
  const { user, updateProfile, logout, error, mensaje } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profileForm, setProfileForm] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    telefono: "",
  });

  useEffect(() => {
    setProfileForm({
      nombre: user?.nombre ?? "",
      apellido1: user?.apellido1 ?? "",
      apellido2: user?.apellido2 ?? "",
      telefono: user?.telefono ?? "",
    });
  }, [user]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    await updateProfile(profileForm);
  };

  const displayName = getUserDisplayName(user);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-full md:w-3/4
      bg-slate-950 shadow-lg z-40 transition-transform duration-300 overflow-y-auto
      ${showPeriodosMenu ? "translate-x-0" : "-translate-x-full"}`}
    >
      <button
        className="absolute top-4 right-4 text-gray-200"
        onClick={() => setShowPeriodosMenu(false)}
        type="button"
      >
        <FaTimes size={24} />
      </button>

      <div className="px-6 pt-5 pb-2 text-gray-100">
        <button
          className="flex items-center gap-3 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-3 shadow-md transition w-full md:w-auto"
          onClick={() => setShowUserMenu((current) => !current)}
          type="button"
        >
          <FaUserCircle className="text-blue-300" size={28} />
          <div className="text-left">
            <div className="text-xs uppercase text-slate-400">Usuario</div>
            <div className="font-bold">{displayName}</div>
          </div>
        </button>

        {showUserMenu ? (
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl max-w-xl">
            <form className="grid gap-3" onSubmit={handleProfileSubmit}>
              <div className="grid md:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-sm">
                  Nombre
                  <input
                    className="input"
                    name="nombre"
                    onChange={handleProfileChange}
                    value={profileForm.nombre}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Apellido 1
                  <input
                    className="input"
                    name="apellido1"
                    onChange={handleProfileChange}
                    value={profileForm.apellido1}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Apellido 2
                  <input
                    className="input"
                    name="apellido2"
                    onChange={handleProfileChange}
                    value={profileForm.apellido2}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Teléfono
                  <input
                    className="input"
                    name="telefono"
                    onChange={handleProfileChange}
                    value={profileForm.telefono}
                  />
                </label>
              </div>
              <div className="text-xs text-slate-400">{user?.email}</div>
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              {mensaje ? (
                <p className="text-sm text-emerald-400">{mensaje}</p>
              ) : null}
              <div className="flex flex-wrap gap-2 justify-end">
                <button className="btn flex items-center gap-2" type="submit">
                  <FaSave /> Guardar
                </button>
                <button
                  className="btn_cncl flex items-center gap-2"
                  onClick={logout}
                  type="button"
                >
                  <FaSignOutAlt /> Cerrar sesión
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>

      <Periodos currentPeriodo={currentPeriodo} />
    </div>
  );
}
