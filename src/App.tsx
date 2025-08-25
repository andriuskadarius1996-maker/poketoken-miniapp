import React, { useMemo, useState, useEffect } from "react";

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => (
  <div
    className={
      "rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/70 to-slate-950/90 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] " +
      className
    }
    {...props}
  >
    {children}
  </div>
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", children, ...props }) => (
  <button
    className={
      "px-4 py-2 rounded-xl font-medium tracking-wide transition active:scale-[0.98] " +
      "bg-gradient-to-r from-cyan-500/90 to-emerald-500/90 text-white shadow-md shadow-cyan-500/10 hover:shadow-cyan-400/30 " +
      className
    }
    {...props}
  >
    {children}
  </button>
);

const GhostButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", children, ...props }) => (
  <button
    className={
      "px-3 py-2 rounded-xl border border-white/10 text-slate-200/90 hover:text-white hover:border-white/20 transition " +
      className
    }
    {...props}
  >
    {children}
  </button>
);

const Tag: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className = "", children, ...props }) => (
  <span
    className={
      "inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[12px] text-slate-200/90 " +
      className
    }
    {...props}
  >
    {children}
  </span>
);

const AVATAR_TIERS = [
  { key: "basic", label: "Basic Trainer", levelMin: 1, levelMax: 9, bonus: "+0%", chest: "+0%" },
  { key: "pro", label: "Pro Trainer", levelMin: 10, levelMax: 19, bonus: "+2% staking", chest: "+1% chest" },
  { key: "elite", label: "Elite Trainer", levelMin: 20, levelMax: 29, bonus: "+5% staking", chest: "+3% chest" },
  { key: "pikachu", label: "Pikachu (Special)", levelMin: 30, levelMax: 99, bonus: "+10% staking", chest: "+7% chest", requiresTokens: 10000 },
] as const;

const SHOP_ITEMS = [
  { id: "chest", name: "Lucky Chest", priceTON: 1, desc: "Random reward: PokeToken, XP, boosts, or seasonal frames.", limitPerDay: 5 },
  { id: "stake1", name: "Staking Boost x2 (1h)", priceTON: 0.5, desc: "Double your PokeToken income for 1 hour.", limitPerDay: 5 },
  { id: "stake6", name: "Staking Boost x2 (6h)", priceTON: 1, desc: "Double income for 6 hours.", limitPerDay: 3 },
  { id: "stake12", name: "Staking Boost x2 (12h)", priceTON: 2, desc: "Double income for 12 hours.", limitPerDay: 2 },
  { id: "xp1h", name: "XP Boost x2 (1h)", priceTON: 0.5, desc: "Double XP from quests for 1 hour.", limitPerDay: 5 },
  { id: "drop24", name: "Chest Drop +5% (24h)", priceTON: 0.5, desc: "Increases free chest chance for today.", limitPerDay: 1 },
] as const;

const PRIZE_SPLIT = [
  { place: "1st", reward: "10 SOL" },
  { place: "2–10", reward: "4 SOL each" },
  { place: "11–50", reward: "1.35 SOL each" },
];

const fakeNames = [
  "Nova", "Spectre", "Crypton", "Zephyr", "Aurora", "Nyx", "Vertex", "Blitz", "Astra", "Quark",
  "Ion", "Ember", "Vector", "Solace", "Echo", "Shade", "Vortex", "Pulse", "Flux", "Orbit",
  "Comet", "Nimbus", "Rift", "Cipher", "Drift", "Glitch", "Neon", "Pyre", "Zenith", "Ray",
  "NovaX", "Helix", "Pylon", "Volt", "Rune", "Kairo", "Onyx", "RuneX", "Zara", "Mako",
  "Lyra", "Kite", "Quartz", "Scion", "Delta", "Sigma", "Eon", "Myriad", "Talon", "Rogue"
];

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function useFakeLeaderboard() {
  return React.useMemo(() => {
    const rows = Array.from({ length: 50 }).map((_, i) => {
      const name = fakeNames[i] ?? `Player${i+1}`;
      const tokens = rand(500, 50000);
      const level = rand(3, 34);
      let tier: typeof AVATAR_TIERS[number]["key"] = "basic";
      if (level >= 10 && level <= 19) tier = "pro";
      else if (level >= 20 && level <= 29) tier = "elite";
      else if (level >= 30) tier = "pikachu";
      const hasFrameTier = Math.random() < 0.2 ? rand(1,3) : 0;
      return { rank: i + 1, name, tokens, level, tier, frameTier: hasFrameTier };
    });
    rows.sort((a, b) => b.tokens - a.tokens);
    rows.forEach((r, idx) => r.rank = idx + 1);
    return rows;
  }, []);
}

export default function App() {
  const [tab, setTab] = useState<"main" | "shop" | "leaderboard" | "ref" | "season">("main");
  const [connected, setConnected] = useState(false);
  const [nickname] = useState("AshKetchum");
  const [xp, setXp] = useState(1234);
  const [level, setLevel] = useState(12);
  const [pokeToken, setPokeToken] = useState(4200);
  const [sol] = useState(0);
  const [dailyInvites, setDailyInvites] = useState(0);
  const [chestsBoughtToday, setChestsBoughtToday] = useState(0);

  const leaderboard = useFakeLeaderboard();

  const avatarTier = useMemo(() => {
    if (level >= 30 && pokeToken >= 10000) return AVATAR_TIERS[3];
    if (level >= 20) return AVATAR_TIERS[2];
    if (level >= 10) return AVATAR_TIERS[1];
    return AVATAR_TIERS[0];
  }, [level, pokeToken]);

  const xpToNext = useMemo(() => {
    const nextLvl = level + 1;
    const need = nextLvl * 150;
    return Math.max(need - xp, 0);
  }, [xp, level]);

  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    const end = new Date(Date.UTC(2026, 2, 31, 23, 59, 59)).getTime();
    const i = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(end - now, 0);
      const d = Math.floor(diff / (1000*60*60*24));
      const h = Math.floor((diff / (1000*60*60)) % 24);
      const m = Math.floor((diff / (1000*60)) % 60);
      setCountdown(`${d}d ${h}h ${m}m`);
    }, 1000);
    return () => clearInterval(i);
  }, []);

  function demoConnectWallet() {
    alert("Demo only: Wallet connection is not enabled.\n\nTo participate in Season 1 and appear on the leaderboard, you will need to connect your TON wallet (Tonkeeper). Fee: 0.5 TON.");
    setConnected(false);
  }

  function demoBuy(itemId: string) {
    if (itemId === "chest") {
      if (chestsBoughtToday >= 5) {
        return alert("Daily chest limit reached (5/5). Try again tomorrow.");
      }
      setChestsBoughtToday(c => c + 1);
      const rewards = [
        { t: "PokeToken", v: rand(200, 2000), apply: () => setPokeToken(p => p + rand(200, 2000)) },
        { t: "XP", v: rand(100, 1000), apply: () => setXp(x => x + rand(100, 1000)) },
        { t: "Boost", v: "Staking x2 (1h)", apply: () => {} },
        { t: "Frame", v: `Seasonal Frame T${rand(1,3)}`, apply: () => {} },
      ];
      const pick = rewards[rand(0, rewards.length - 1)];
      pick.apply();
      alert(`🎁 Lucky Chest\n\nYou received: ${pick.t} ${typeof pick.v === "number" ? "+"+pick.v : "– "+pick.v}`);
      return;
    }
    alert("Demo purchase successful. (No real TON was used.)");
  }

  function addInvite() {
    if (dailyInvites >= 500) return;
    setDailyInvites(n => n + 1);
  }

  function ProgressBar({ value, max }: { value: number; max: number }) {
    const pct = Math.min(100, Math.round((value / max) * 100));
    return (
      <div className="w-full h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    );
  }

  function AvatarSilo({ tier }: { tier: typeof AVATAR_TIERS[number] }) {
    const glow = tier.key === "pikachu" ? "shadow-[0_0_40px] shadow-yellow-400/30" : tier.key === "elite" ? "shadow-[0_0_30px] shadow-cyan-400/20" : tier.key === "pro" ? "shadow-[0_0_20px] shadow-emerald-400/20" : "";
    return (
      <div className={`mx-auto aspect-[1/1] w-36 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-950/90 border border-white/10 relative ${glow}`}>
        <div className="absolute inset-0 grid place-items-center">
          <div className="w-20 h-20 rounded-full border-2 border-white/30" />
          <div className="w-24 h-8 mt-2 rounded-full border-2 border-white/20" />
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-[11px] bg-black/70 border border-white/10 text-white/90">
          {tier.label}
        </div>
      </div>
    );
  }

  function HeaderStats() {
    return (
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3">
          <div className="text-xs text-white/60">PokeToken</div>
          <div className="text-lg font-semibold text-white">{pokeToken.toLocaleString()}</div>
          <Tag className="mt-2">🪙 earning via staking</Tag>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-white/60">XP</div>
          <div className="text-lg font-semibold text-white">{xp.toLocaleString()}</div>
          <Tag className="mt-2">✨ level {level}</Tag>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-white/60">SOL</div>
          <div className="text-lg font-semibold text-white">{sol}</div>
          <Tag className="mt-2">💰 prize pool 100 SOL</Tag>
        </Card>
      </div>
    );
  }

  function StakingSlots() {
    const slots = [
      { name: "Sparko", rate: 3, emoji: "⚡" },
      { name: "Embero", rate: 4, emoji: "🔥" },
      { name: "Aquado", rate: 2, emoji: "💧" },
    ];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {slots.map((s, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold">{s.name}</div>
              <Tag>{s.emoji} {s.rate} / h</Tag>
            </div>
            <div className="mt-3 h-24 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-white/60 text-sm">
              Pokémon Art Placeholder
            </div>
            <div className="mt-3 flex items-center justify-between">
              <GhostButton onClick={() => alert("Demo: staking started.")}>Stake</GhostButton>
              <GhostButton onClick={() => alert("Demo: details…")}>Details</GhostButton>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  function NavBar() {
    const Item: React.FC<{ k: typeof tab; label: string }> = ({ k, label }) => (
      <button
        onClick={() => setTab(k)}
        className={`px-3 py-2 rounded-xl text-sm border transition ${
          tab === k
            ? "border-emerald-400/40 bg-emerald-400/10 text-white"
            : "border-white/10 text-white/70 hover:text-white hover:border-white/20"
        }`}
      >
        {label}
      </button>
    );
    return (
      <div className="flex flex-wrap gap-2">
        <Item k="main" label="Main" />
        <Item k="shop" label="Shop" />
        <Item k="leaderboard" label="Leaderboard" />
        <Item k="ref" label="Referral" />
        <Item k="season" label="Season Info" />
      </div>
    );
  }

  function TabMain() {
    const nextLevelNeed = (level + 1) * 150;
    return (
      <div className="space-y-4">
        <HeaderStats />
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 items-center">
            <AvatarSilo tier={avatarTier} />
            <div>
              <div className="flex items-center gap-2">
                <div className="text-white text-lg font-semibold">{nickname}</div>
                <Tag>Lvl {level}</Tag>
                <Tag>{avatarTier.bonus}</Tag>
                {avatarTier.chest !== "+0%" && <Tag>{avatarTier.chest}</Tag>}
              </div>
              <div className="mt-3 text-white/70 text-sm">{xp.toLocaleString()} / {nextLevelNeed} XP until next level</div>
              <div className="mt-2"><ProgressBar value={xp} max={nextLevelNeed} /></div>
              <div className="mt-3 text-white/60 text-xs">* Avatars progress automatically. Pikachu unlocks at Level 30 + ≥10,000 PokeToken.</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={demoConnectWallet}>Connect Wallet</Button>
                <GhostButton onClick={() => setTab("leaderboard")}>Leaderboard</GhostButton>
                <GhostButton onClick={() => setTab("shop")}>Shop</GhostButton>
                <GhostButton onClick={() => setTab("ref")}>Referral</GhostButton>
                <GhostButton onClick={() => setTab("season")}>Season Info</GhostButton>
              </div>
              {!connected && (
                <div className="mt-3 text-xs text-amber-300/90">
                  Without connecting your TON wallet (Tonkeeper), you won’t participate in Season 1 and won’t appear on the leaderboard. Fee: 0.5 TON
                </div>
              )}
            </div>
          </div>
        </Card>
        <StakingSlots />
      </div>
    );
  }

  function TabShop() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-white text-xl font-semibold">Shop</div>
          <Tag>All payments: TON → admin wallet (demo)</Tag>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SHOP_ITEMS.map((it) => (
            <Card key={it.id} className="p-4 flex flex-col">
              <div className="text-white font-semibold">{it.name}</div>
              <div className="text-white/70 text-sm mt-1">{it.desc}</div>
              <div className="mt-3 flex items-center gap-2">
                <Tag>Price: {it.priceTON} TON</Tag>
                <Tag>+0.20 TON fee</Tag>
                {it.id === "chest" && (
                  <Tag>Daily: {chestsBoughtToday}/{(SHOP_ITEMS.find(s=>s.id==="chest")?.limitPerDay)||5}</Tag>
                )}
              </div>
              <div className="mt-auto pt-4">
                <Button onClick={() => demoBuy(it.id)}>Buy</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  function TierPill({ tier }: { tier: number }) {
    const map: Record<number, string> = {
      1: "bg-amber-500/20 border-amber-500/30 text-amber-200",
      2: "bg-cyan-500/20 border-cyan-500/30 text-cyan-200",
      3: "bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-200",
    };
    return <span className={`px-2 py-1 rounded-md border text-[10px] ${map[tier] || "border-white/10 text-white/60"}`}>Frame T{tier}</span>;
  }

  function TabLeaderboard() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-xl font-semibold">Leaderboard</div>
            <div className="text-white/60 text-sm">Season 1 Prize Pool: <span className="text-emerald-300 font-semibold">100 SOL</span> • Ends: Q1 2026</div>
          </div>
          {!connected && (
            <Tag>Connect wallet to participate</Tag>
          )}
        </div>
        <Card className="p-0 overflow-hidden">
          <div className="grid grid-cols-[60px_1fr_120px_80px_100px] gap-0 text-xs text-white/60 px-4 py-2 border-b border-white/10">
            <div>#</div>
            <div>Player</div>
            <div>PokeToken</div>
            <div>Level</div>
            <div>Tier</div>
          </div>
          <div className="max-h-[400px] overflow-auto">
            {leaderboard.map((row) => (
              <div key={row.rank} className="grid grid-cols-[60px_1fr_120px_80px_100px] items-center px-4 py-2 border-b border-white/5 text-white/90">
                <div className="text-white/60">{row.rank}</div>
                <div className="flex items-center gap-2">
                  {row.frameTier ? <TierPill tier={row.frameTier} /> : <span className="text-white/30 text-[10px] border border-white/10 px-2 py-0.5 rounded-md">No Frame</span>}
                  <span className="font-medium">{row.name}</span>
                </div>
                <div>{row.tokens.toLocaleString()}</div>
                <div>{row.level}</div>
                <div className="text-[12px] uppercase text-white/70">{row.tier}</div>
              </div>
            ))}
          </div>
        </Card>
        {!connected && (
          <div className="text-xs text-amber-300/90">Players without a connected TON wallet are not shown on the leaderboard.</div>
        )}
      </div>
    );
  }

  function TabReferral() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-white text-xl font-semibold">Referral</div>
          <Tag>Daily limit: {dailyInvites}/500</Tag>
        </div>
        <Card className="p-4 space-y-3">
          <div className="text-white/80">Invite friends to get a small staking boost. First 5 invites today give a special reward. Program resets every 24h.</div>
          <div className="flex flex-wrap gap-2 items-center">
            <GhostButton onClick={() => {
              navigator.clipboard?.writeText("https://t.me/poketoken_bot?start=DEMO123");
              alert("Demo: Invite link copied to clipboard.");
            }}>Copy Invite Link</GhostButton>
            <GhostButton onClick={addInvite}>Simulate Invite +1</GhostButton>
            <Tag>{dailyInvites < 5 ? "Special reward still available" : "Special reward claimed today"}</Tag>
          </div>
          <div className="text-xs text-white/60">Boost is capped to keep the game fair. Inviting many users helps but doesn’t guarantee top ranks.</div>
        </Card>
      </div>
    );
  }

  function TabSeason() {
    return (
      <div className="space-y-4">
        <div className="text-white text-xl font-semibold">Season 1</div>
        <Card className="p-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-white/60 text-sm">Countdown</div>
              <div className="text-2xl font-semibold text-white mt-1">{countdown}</div>
              <div className="text-white/70 text-sm mt-2">Season ends in Q1 2026. Rewards will be distributed to connected TON wallets only.</div>
              <div className="mt-3 text-xs text-white/50">Leaderboard ranks are based on total PokeToken collected during the season.</div>
            </div>
            <div>
              <div className="text-white/60 text-sm">Prize Pool Split (100 SOL)</div>
              <div className="mt-2 space-y-2">
                {PRIZE_SPLIT.map((row, i) => (
                  <div key={i} className="flex items-center justify-between border border-white/10 rounded-xl px-3 py-2 text-white/90">
                    <span>{row.place}</span>
                    <span className="font-semibold text-emerald-300">{row.reward}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-white/60">Frames are seasonal only. Drop chances are hidden. Tier 1 via progress; Tier 2–3 via chests.</div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500" />
            <div>
              <div className="text-white font-semibold leading-tight">PokeToken</div>
              <div className="text-xs text-white/60 leading-tight">Season 1 • Crypto UI Demo</div>
            </div>
          </div>
          <NavBar />
        </div>

        {tab === "main" && <TabMain />}
        {tab === "shop" && <TabShop />}
        {tab === "leaderboard" && <TabLeaderboard />}
        {tab === "ref" && <TabReferral />}
        {tab === "season" && <TabSeason />}

        <div className="mt-10 text-center text-[11px] text-white/40">
          Demo only • No real wallets or payments • Visual prototype for Telegram Mini App
        </div>
      </div>
    </div>
  );
}
