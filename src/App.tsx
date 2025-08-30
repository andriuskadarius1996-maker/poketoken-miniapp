import React, { useState } from 'react'
import pikachu1024 from './assets/avatars_main/pikachu_vortex_1024.png'

type Tab = 'Main' | 'Stake' | 'Shop' | 'Referral' | 'Leaderboard' | 'Season Info' | 'Daily Check'

export default function App() {
  const [tab, setTab] = useState<Tab>('Main')
  const tabs: Tab[] = ['Main','Stake','Shop','Referral','Leaderboard','Season Info','Daily Check']

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
        <h1 className="text-xl font-bold">POKE TOKEN — Season 1</h1>
        <span className="text-xs rounded-full border border-yellow-400/60 px-2 py-1">Pikachu Vortex</span>
      </header>

      <nav className="px-4 py-3 flex gap-2 flex-wrap border-b border-neutral-900">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-sm border ${tab===t ? 'border-yellow-400 text-yellow-200' : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'}`}
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="p-6">
        {tab === 'Main' && (
          <section className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-lg font-semibold mb-2">Pikachu — Level 30 (Vortex skin)</h2>
              <p className="text-sm text-neutral-300 mb-4">Galutinis avataras su elektriniu sukūriu. Pasikeitus į 30 lvl, rodomas šis skin.</p>
              <ul className="text-sm list-disc ml-5 space-y-1 text-neutral-300">
                <li>XP Boost: x2 / 9h (pratęsia laiką)</li>
                <li>Referral: +10 XP, +50 PT, limitas 500 XP/d</li>
                <li>Staking: Pikachu bazinis 10 PT/h (+1 per upgrade)</li>
                <li>Mokesčių tekstai slepiami UI</li>
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="p-3 rounded-2xl bg-neutral-900 border border-yellow-400/20 vortex-glow">
                <img src={pikachu1024} alt="Pikachu Vortex" className="w-72 h-72 object-cover rounded-2xl" />
              </div>
            </div>
          </section>
        )}
        {tab !== 'Main' && (
          <div className="text-neutral-300">Šis skyrius paruoštas — logika lieka kaip dabartiniame projekte. (UI prototipas)</div>
        )}
      </main>
    </div>
  )
}