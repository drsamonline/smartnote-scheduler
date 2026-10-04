import { useState } from "react";
import { BrutalistDashboard } from "@/components/BrutalistDashboard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loadPreferences, savePreferences, type AppPreferences, type SortPreference } from "@/lib/preferences";

const shortcuts = [
  ["N", "Focus the new-note composer"],
  ["⌘ / CTRL + ENTER", "Create the current note"],
  ["?", "Show keyboard shortcuts"],
  ["G then H", "Go to all notes"],
  ["G then S", "Open Settings"],
  ["G then F", "Open Search"],
];

export default function Settings() {
  const [preferences, setPreferences] = useState<AppPreferences>(() => loadPreferences());
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    savePreferences(preferences);
    setSaved(true);
  };

  return (
    <BrutalistDashboard>
      <div className="min-h-screen bg-black text-white">
        <header className="border-b-2 border-white p-8 md:p-12 bg-gradient-to-br from-black via-black to-red-950/30">
          <p className="text-red-500 text-xs font-bold tracking-[0.35em] mb-4">CONTROL / 04</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">SETTINGS<span className="text-red-600">.</span></h1>
          <div className="h-1 bg-red-600 w-24 mt-5 mb-4" />
          <p className="text-gray-300 text-lg">Tune your capture system.</p>
        </header>

        <main className="p-8 md:p-12 space-y-10 max-w-5xl">
          <section className="border-2 border-white p-6 md:p-8">
            <p className="text-red-500 text-xs font-bold tracking-[0.3em] mb-2">DISPLAY / 01</p>
            <h2 className="text-3xl font-bold mb-6">WORKSPACE DEFAULTS</h2>
            <div className="space-y-5">
              <label className="flex items-center justify-between gap-4 border-b border-white/20 pb-5">
                <span><strong className="block text-lg">Show stats on launch</strong><span className="text-sm text-gray-500">Keep your dashboard metrics visible.</span></span>
                <input type="checkbox" checked={preferences.showStats} onChange={(e) => update("showStats", e.target.checked)} className="h-5 w-5 accent-red-600" />
              </label>
              <label className="flex items-center justify-between gap-4 border-b border-white/20 pb-5">
                <span><strong className="block text-lg">Hide completed notes</strong><span className="text-sm text-gray-500">Start with a focused pending queue.</span></span>
                <input type="checkbox" checked={preferences.hideCompleted} onChange={(e) => update("hideCompleted", e.target.checked)} className="h-5 w-5 accent-red-600" />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span><strong className="block text-lg">Default sort</strong><span className="text-sm text-gray-500">Choose the first ordering you see.</span></span>
                <Select value={preferences.sortBy} onValueChange={(value) => update("sortBy", value as SortPreference)}>
                  <SelectTrigger className="w-48 bg-gray-950 border-2 border-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-gray-950 border-2 border-white text-white">
                    <SelectItem value="date">DATE</SelectItem>
                    <SelectItem value="priority">PRIORITY</SelectItem>
                    <SelectItem value="category">CATEGORY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSave} className="mt-8 bg-red-600 hover:bg-red-500 font-bold px-8 py-3">
              {saved ? "SAVED" : "SAVE SETTINGS"}
            </Button>
          </section>

          <section className="border-2 border-white p-6 md:p-8">
            <p className="text-red-500 text-xs font-bold tracking-[0.3em] mb-2">CREDITS / 02</p>
            <h2 className="text-3xl font-bold mb-5">AUTHOR INFO</h2>
            <div className="border-l-2 border-red-600 pl-4">
              <p className="text-xs tracking-[0.3em] text-gray-500">DESIGNED AND BUILT BY</p>
              <p className="text-2xl font-bold mt-1">DR SOHIL MOMIN</p>
              <p className="text-sm text-gray-500 mt-1">SmartNote Scheduler · AI note operating system</p>
            </div>
          </section>

          <section className="border-2 border-white p-6 md:p-8">
            <p className="text-red-500 text-xs font-bold tracking-[0.3em] mb-2">COMMANDS / 03</p>
            <h2 className="text-3xl font-bold mb-5">KEYBOARD SHORTCUTS</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {shortcuts.map(([key, description]) => <div key={key} className="flex items-center gap-4 border border-white/20 p-3"><kbd className="bg-white text-black px-2 py-1 text-xs font-bold whitespace-nowrap">{key}</kbd><span className="text-gray-300 text-sm">{description}</span></div>)}
            </div>
          </section>
        </main>
      </div>
    </BrutalistDashboard>
  );
}
