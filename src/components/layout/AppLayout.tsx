import { FileAudio, ListChecks, LogOut, MessageSquareText, Settings, Upload } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLogOut } from "@/hooks/useProfile";

export function AppLayout() {
  const { session } = useAuth();
  const { mutate: logOut } = useLogOut()
  const navigate = useNavigate();

  async function handleSignOut() {
    logOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#f8faf7] text-ink">
      <header className="border-b border-stone-200 bg-white/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <NavLink to="/meetings" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-moss text-white">
              <FileAudio size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">Smart Meeting Assistant</h1>
              <p className="text-sm text-stone-500">{session?.user.name}</p>
            </div>
          </NavLink>

          <div className="flex flex-wrap items-center gap-2">
            <NavItem to="/meetings" icon={<ListChecks size={18} />} label="Meetings" />
            <NavItem to="/upload" icon={<Upload size={18} />} label="Upload" />
            <NavItem to="/ask" icon={<MessageSquareText size={18} />} label="Ask" />
            <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
            <button
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
              onClick={() => void handleSignOut()}
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `focus-ring inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium ${
          isActive ? "bg-ink text-white" : "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
