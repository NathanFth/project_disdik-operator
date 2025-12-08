"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, LogOut, LayoutDashboard, Plus, List } from "lucide-react";
import { auth, MENU_BY_ROLE } from "../../lib/auth";

/**
 * CommandPalette (controlled)
 * - Dapat dibuka via tombol (prop open/onOpenChange) atau via shortcut:
 *   Mac: ⌘K • Windows/Linux: Ctrl+/ (cadangan Ctrl+Shift+K)
 */
export default function CommandPalette({ open: openProp, onOpenChange }) {
  const router = useRouter();

  // mode controlled/uncontrolled
  const isControlled = typeof openProp === "boolean";
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? openProp : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;

  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);

  // Ambil menu sesuai role user
  useEffect(() => {
    const u = auth.getUser();
    if (!u?.role) return;
    const roleMenus = MENU_BY_ROLE[u.role] ?? [];
    const mapped = roleMenus.map((m) => ({
      ...m,
      iconComp:
        m.icon === "LayoutDashboard" ? LayoutDashboard :
        m.icon === "Plus" ? Plus :
        List,
    }));
    setItems(mapped);
  }, []);

  // Shortcut global
  useEffect(() => {
    const isTextInput = (el) => {
      if (!el) return false;
      const tag = el.tagName?.toLowerCase();
      const editable = el.getAttribute?.("contenteditable");
      return (
        tag === "input" ||
        tag === "textarea" ||
        editable === "" ||
        editable === "true"
      );
    };

    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (isTextInput(e.target)) return;

      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const macCombo = isMac && e.metaKey && key === "k";
      const winComboMain = !isMac && e.ctrlKey && key === "/";
      const winComboAlt = !isMac && e.ctrlKey && e.shiftKey && key === "k";

      if (macCombo || winComboMain || winComboAlt) {
        e.preventDefault();
        e.stopPropagation();
        setOpen?.(!open);
      }
      if (key === "escape") setOpen?.(false);
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [open, setOpen]);

  const go = useCallback((href) => {
    setOpen?.(false);
    router.push(href);
  }, [router, setOpen]);

  const doLogout = useCallback(() => {
    auth.logout();
    setOpen?.(false);
    router.push("/login");
  }, [router, setOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 p-4 md:p-8"
      onClick={() => setOpen?.(false)}
    >
      <div
        className="mx-auto max-w-xl rounded-2xl border bg-card text-card-foreground shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Global Command" className="w-full">
          <div className="flex items-center gap-2 px-3 py-2 border-b">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Command.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Cari perintah atau halaman… (⌘K • Ctrl+/)"
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>

          <Command.List className="max-h-[50vh] overflow-auto">
            <Command.Empty className="p-4 text-sm text-muted-foreground">
              Tidak ada hasil.
            </Command.Empty>

            {/* Navigasi sesuai role */}
            <Command.Group heading="Navigasi">
              {items.map((item) => {
                const Ico = item.iconComp ?? List;
                return (
                  <Command.Item
                    key={item.href}
                    onSelect={() => go(item.href)}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground rounded-lg m-1"
                  >
                    <Ico className="h-4 w-4" />
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {item.href}
                    </span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            {/* Aksi cepat */}
            <Command.Group heading="Aksi">
              <Command.Item
                onSelect={() => go("/dashboard")}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground rounded-lg m-1"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="font-medium">Buka Dashboard</span>
              </Command.Item>

              <Command.Item
                onSelect={doLogout}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground rounded-lg m-1 text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Logout</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
