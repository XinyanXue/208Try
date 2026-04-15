import { useState } from "react";
import { useNavigate } from "react-router";
import { PhoneShell, StatusBar, ComicCard, Burst } from "./PhoneShell";
import { BottomNav } from "./BottomNav";
import { useFavorites } from "../context/FavoritesContext";
import {
  IconPlay, IconReset, IconPin, IconHeart, IconBack,
} from "./ComicIcons";

const C = {
  navy: "#0E1B4D", royal: "#2350D8", sky: "#4B9EF7", pale: "#A8D4FF",
  ice: "#DCF0FF", cream: "#FFFBF0", yellow: "#FFD93D", coral: "#FF6B6B",
  mint: "#5EEAA8", purple: "#7B5CF5", white: "#FFFFFF",
};

const options = [
  { id: "a", emoji: "🔋", title: "充电模式", desc: "安静充实，享受独处",  bg: C.pale,   border: C.royal  },
  { id: "b", emoji: "🌿", title: "漫步模式", desc: "放慢脚步，感受自然",  bg: C.mint,   border: C.navy   },
  { id: "c", emoji: "🏃", title: "运动模式", desc: "精力充沛，释放活力",  bg: C.yellow, border: C.navy   },
  { id: "d", emoji: "🎨", title: "探索模式", desc: "好奇心旺盛，发现惊喜",bg: "#E8D5FF",border: C.purple },
];

const routeResults: Record<string, { id: string; title: string; emoji: string; tagline: string; bg: string; stopDot: string; stops: { name: string; note: string }[] }> = {
  a: { id: "mystery-a", title: "图书馆知识之旅", emoji: "📚", tagline: "静下心，在知识的海洋中徜徉", bg: C.pale,   stopDot: C.royal,  stops: [{ name: "东门入口", note: "出发点" }, { name: "学术资源中心", note: "3 min" }, { name: "图书馆", note: "5 min" }, { name: "自习室", note: "3 min" }] },
  b: { id: "mystery-b", title: "自然风光之旅",   emoji: "🌿", tagline: "漫步绿意盎然，感受校园的温柔", bg: C.mint,   stopDot: C.navy,   stops: [{ name: "南湖湖畔", note: "出发点" }, { name: "校园花园", note: "5 min" }, { name: "林荫小道", note: "4 min" }, { name: "中心广场", note: "6 min" }] },
  c: { id: "mystery-c", title: "活力健身之旅",   emoji: "⚡", tagline: "动起来！感受校园活力四射",   bg: C.yellow, stopDot: C.navy,   stops: [{ name: "体育馆", note: "出发点" }, { name: "田径跑道", note: "2 min" }, { name: "篮球场", note: "3 min" }, { name: "游泳馆", note: "4 min" }] },
  d: { id: "mystery-d", title: "文艺创意之旅",   emoji: "🎨", tagline: "发现校园里的艺术气息",       bg: "#E8D5FF",stopDot: C.purple, stops: [{ name: "艺术中心", note: "出发点" }, { name: "校史馆", note: "5 min" }, { name: "创客空间", note: "4 min" }, { name: "科研楼", note: "7 min" }] },
};

type Phase = "question" | "revealing" | "result";

export function MysteryRouteScreen() {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("question");

  const handleSelect = (id: string) => {
    setSelected(id);
    setPhase("revealing");
    setTimeout(() => setPhase("result"), 1800);
  };
  const handleReset = () => { setSelected(null); setPhase("question"); };

  const result = selected ? routeResults[selected] : null;
  const selOpt = options.find((o) => o.id === selected);
  const fav = result ? isFavorite(result.id) : false;

  return (
    <PhoneShell bg={C.ice}>
      <StatusBar />

      {/* Header */}
      <div style={{ backgroundColor: C.purple, borderBottom: `3px solid ${C.navy}`, padding: "8px 20px 22px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #ffffff22 1.2px, transparent 1.2px)", backgroundSize: "14px 14px" }} />
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "100px", height: "100px", borderRadius: "50%", backgroundColor: C.sky, border: `2px solid ${C.navy}`, opacity: 0.4 }} />
        <div style={{ position: "absolute", bottom: "10px", right: "16px" }}><Burst size={48} color={C.yellow} text="LUCKY" textColor={C.navy} /></div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <button onClick={() => navigate("/route")} style={{ width: "32px", height: "32px", backgroundColor: "rgba(255,255,255,0.2)", border: `2px solid rgba(255,255,255,0.4)`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconBack />
            </button>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>路线探索</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 900, color: C.white, textShadow: `2px 2px 0 ${C.navy}` }}>🎲 盲盒路线</h1>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginTop: "2px" }}>测出你今天的专属路线</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "90px" }}>

        {/* QUESTION */}
        {phase === "question" && (
          <>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div style={{ display: "inline-block", backgroundColor: C.yellow, border: `2.5px solid ${C.navy}`, borderRadius: "12px", padding: "8px 16px", boxShadow: `3px 3px 0 ${C.navy}` }}>
                <p style={{ fontSize: "16px", fontWeight: 900, color: C.navy }}>今天的你，是哪种状态？✨</p>
              </div>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#4B6898", marginTop: "8px" }}>选一个最接近此刻心情的选项</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  style={{
                    backgroundColor: opt.bg, border: `2.5px solid ${opt.border}`, borderRadius: "16px",
                    boxShadow: `4px 4px 0 ${opt.border}`, padding: "16px 12px",
                    textAlign: "left", cursor: "pointer",
                    display: "flex", flexDirection: "column", gap: "6px", minHeight: "120px",
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
                >
                  <span style={{ fontSize: "34px" }}>{opt.emoji}</span>
                  <p style={{ fontSize: "14px", fontWeight: 900, color: C.navy }}>{opt.title}</p>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#4B6898", lineHeight: 1.4 }}>{opt.desc}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* REVEALING */}
        {phase === "revealing" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "480px", gap: "20px" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", width: "120px", height: "120px", border: `4px dashed ${C.pale}`, borderRadius: "50%", animation: "spin 1.6s linear infinite" }} />
              <div style={{ position: "absolute", width: "90px", height: "90px", border: `4px dashed ${C.yellow}`, borderRadius: "50%", animation: "spin 1s linear infinite reverse" }} />
              <div style={{ width: "68px", height: "68px", backgroundColor: C.purple, border: `3px solid ${C.navy}`, borderRadius: "50%", boxShadow: `4px 4px 0 ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "34px" }}>🎲</div>
            </div>
            <ComicCard style={{ padding: "12px 20px", textAlign: "center" }}>
              <p style={{ fontSize: "17px", fontWeight: 900, color: C.navy }}>正在生成专属路线…</p>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#4B6898", marginTop: "4px" }}>根据你的心情分析中</p>
            </ComicCard>
            <div style={{ display: "flex", gap: "8px" }}>
              {[C.royal, C.purple, C.yellow].map((c, i) => (
                <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: c, border: `2px solid ${C.navy}`, animation: `bounce 0.6s ease-in-out ${i * 0.15}s infinite alternate` }} />
              ))}
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-8px); } }`}</style>
          </div>
        )}

        {/* RESULT */}
        {phase === "result" && result && selOpt && (
          <>
            <div style={{
              backgroundColor: result.bg, border: `2.5px solid ${C.navy}`, borderRadius: "16px",
              boxShadow: `5px 5px 0 ${C.navy}`, padding: "18px", marginBottom: "12px",
              textAlign: "center", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "8px", right: "12px" }}><Burst size={40} color={C.yellow} /></div>
              <span style={{ fontSize: "46px" }}>{result.emoji}</span>
              <p style={{ fontSize: "20px", fontWeight: 900, color: C.navy, marginTop: "6px" }}>{result.title}</p>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#4B6898", marginTop: "4px", marginBottom: "10px" }}>{result.tagline}</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: C.white, border: `2px solid ${C.navy}`, borderRadius: "20px", padding: "3px 12px", boxShadow: `2px 2px 0 ${C.navy}` }}>
                <span style={{ fontSize: "14px" }}>{selOpt.emoji}</span>
                <span style={{ fontSize: "12px", fontWeight: 800, color: C.navy }}>{selOpt.title}</span>
              </div>
            </div>

            {/* Stops */}
            <ComicCard style={{ padding: "14px", marginBottom: "12px" }}>
              <p style={{ fontSize: "14px", fontWeight: 800, color: C.navy, marginBottom: "12px" }}>📍 路线详情</p>
              {result.stops.map((stop, idx) => (
                <div key={stop.name} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "22px" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: result.stopDot, border: `2px solid ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px", flexShrink: 0 }}>
                      <span style={{ fontSize: "10px", fontWeight: 900, color: C.white }}>{idx + 1}</span>
                    </div>
                    {idx < result.stops.length - 1 && <div style={{ width: "2px", height: "24px", backgroundColor: C.navy + "30" }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: "6px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: C.navy }}>{stop.name}</p>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "#4B6898" }}>{stop.note}</p>
                  </div>
                  <IconPin size={13} color={result.stopDot} />
                </div>
              ))}
            </ComicCard>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => navigate("/profile")}
                style={{ flex: 1, height: "50px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: C.royal, border: `2.5px solid ${C.navy}`, borderRadius: "14px", boxShadow: `4px 4px 0 ${C.navy}`, color: C.white, fontSize: "15px", fontWeight: 900, cursor: "pointer" }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
              >
                <IconPlay size={15} />
                开始导览
              </button>
              <button
                onClick={() => result && toggleFavorite({
                  id: result.id, title: result.title, emoji: result.emoji,
                  type: "mystery", stops: result.stops.map((s) => s.name),
                  bg: result.bg, tagBg: C.purple, tagLabel: "盲盒",
                })}
                style={{ width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: fav ? "#FFF0F0" : C.white, border: `2.5px solid ${C.navy}`, borderRadius: "14px", boxShadow: `4px 4px 0 ${C.navy}`, cursor: "pointer" }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
              >
                <IconHeart size={20} filled={fav} color={C.coral} />
              </button>
              <button
                onClick={handleReset}
                style={{ width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: C.yellow, border: `2.5px solid ${C.navy}`, borderRadius: "14px", boxShadow: `4px 4px 0 ${C.navy}`, cursor: "pointer" }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
              >
                <IconReset size={20} />
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNav activeTab="Route" />
    </PhoneShell>
  );
}
