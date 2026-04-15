import { useState } from "react";
import { useNavigate } from "react-router";
import { PhoneShell, StatusBar, ComicCard, Burst } from "./PhoneShell";
import { BottomNav } from "./BottomNav";
import { useFavorites } from "../context/FavoritesContext";
import {
  IconHeart, IconBack, IconPlay, IconClock, IconPin, IconSparkle,
} from "./ComicIcons";

const C = {
  navy: "#0E1B4D", royal: "#2350D8", sky: "#4B9EF7", pale: "#A8D4FF",
  ice: "#DCF0FF", cream: "#FFFBF0", yellow: "#FFD93D", coral: "#FF6B6B",
  mint: "#5EEAA8", purple: "#7B5CF5", white: "#FFFFFF",
};

const routes = [
  {
    id: "freshman", title: "新生入门路线", duration: "30 min",
    stops: ["东门入口", "行政楼", "图书馆", "中心广场"],
    emoji: "🌱", bg: C.pale, tagBg: C.sky,
  },
  {
    id: "parent", title: "家长来访路线", duration: "40 min",
    stops: ["主校门", "教学楼群", "学生宿舍", "体育馆", "食堂"],
    emoji: "🏫", bg: C.cream, tagBg: C.yellow,
  },
  {
    id: "deep", title: "深度探索路线", duration: "35 min",
    stops: ["校史馆", "艺术中心", "南湖", "科研楼"],
    emoji: "✨", bg: C.mint + "55", tagBg: C.mint,
  },
];

export function RouteScreen() {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <PhoneShell bg={C.ice}>
      <StatusBar />

      {/* Header */}
      <div style={{ backgroundColor: C.royal, borderBottom: `3px solid ${C.navy}`, padding: "8px 20px 22px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #ffffff22 1.2px, transparent 1.2px)", backgroundSize: "14px 14px" }} />
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "100px", height: "100px", borderRadius: "50%", backgroundColor: C.sky, border: `2px solid ${C.navy}`, opacity: 0.5 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <button onClick={() => navigate("/home")} style={{ width: "32px", height: "32px", backgroundColor: "rgba(255,255,255,0.2)", border: `2px solid rgba(255,255,255,0.4)`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconBack />
            </button>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>UniBuddy</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 900, color: C.white, textShadow: `2px 2px 0 ${C.navy}` }}>🗺️ 路线探索</h1>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginTop: "2px" }}>选择你今天的校园旅程</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "90px" }}>

        {/* Mystery Route */}
        <button
          onClick={() => navigate("/mystery-route")}
          style={{
            width: "100%", textAlign: "left", cursor: "pointer",
            backgroundColor: C.purple, border: `2.5px solid ${C.navy}`, borderRadius: "16px",
            boxShadow: `4px 4px 0 ${C.navy}`, padding: "14px", marginBottom: "10px",
            position: "relative", overflow: "hidden",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
        >
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #ffffff18 1.2px, transparent 1.2px)", backgroundSize: "12px 12px" }} />
          <div style={{ position: "absolute", top: "6px", right: "8px" }}><Burst size={36} color={C.yellow} text="LUCKY" textColor={C.navy} /></div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "26px" }}>🎲</span>
              <span style={{ fontSize: "18px", fontWeight: 900, color: C.white, textShadow: `2px 2px 0 ${C.navy}` }}>盲盒路线</span>
              <span style={{ backgroundColor: C.yellow, border: `1.5px solid ${C.navy}`, borderRadius: "6px", padding: "1px 7px", fontSize: "10px", fontWeight: 900, color: C.navy }}>NEW</span>
            </div>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>回答问题，解锁专属惊喜路线 ✨</p>
          </div>
        </button>

        {/* Custom Route */}
        <button
          onClick={() => navigate("/custom-route")}
          style={{
            width: "100%", textAlign: "left", cursor: "pointer",
            backgroundColor: C.sky, border: `2.5px solid ${C.navy}`, borderRadius: "16px",
            boxShadow: `4px 4px 0 ${C.navy}`, padding: "14px", marginBottom: "16px",
            position: "relative", overflow: "hidden",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
        >
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #ffffff18 1.2px, transparent 1.2px)", backgroundSize: "12px 12px" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "26px" }}>🧩</span>
              <span style={{ fontSize: "18px", fontWeight: 900, color: C.white, textShadow: `2px 2px 0 ${C.navy}` }}>自定义路线</span>
            </div>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>自由选择建筑，智能生成最优路径 🔧</p>
          </div>
        </button>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <div style={{ width: "4px", height: "18px", backgroundColor: C.yellow, border: `1.5px solid ${C.navy}`, borderRadius: "2px" }} />
          <span style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>推荐路线</span>
          <IconSparkle size={16} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {routes.map((route) => {
            const isExpanded = expanded === route.id;
            const fav = isFavorite(route.id);
            return (
              <div key={route.id}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : route.id)}
                  style={{
                    width: "100%", textAlign: "left",
                    backgroundColor: route.bg,
                    border: `2.5px solid ${C.navy}`,
                    borderRadius: isExpanded ? "14px 14px 0 0" : "14px",
                    boxShadow: isExpanded ? `2px 2px 0 ${C.navy}` : `4px 4px 0 ${C.navy}`,
                    padding: "12px 14px",
                    display: "flex", alignItems: "center", gap: "12px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ width: "44px", height: "44px", backgroundColor: C.white, border: `2px solid ${C.navy}`, borderRadius: "12px", boxShadow: `2px 2px 0 ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                    {route.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "14px", fontWeight: 800, color: C.navy }}>{route.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
                      <IconClock size={12} color={C.royal} />
                      <span style={{ fontSize: "11px", fontWeight: 700, color: C.royal }}>{route.duration}</span>
                      <IconPin size={12} color={C.royal} />
                      <span style={{ fontSize: "11px", fontWeight: 700, color: C.royal }}>{route.stops.length} 站</span>
                    </div>
                  </div>
                  <div style={{
                    width: "28px", height: "28px", backgroundColor: C.navy, borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                  </div>
                </button>

                {isExpanded && (
                  <div style={{ backgroundColor: C.white, border: `2.5px solid ${C.navy}`, borderTop: "none", borderBottomLeftRadius: "14px", borderBottomRightRadius: "14px", boxShadow: `4px 4px 0 ${C.navy}`, padding: "14px" }}>
                    {/* stops */}
                    <div style={{ backgroundColor: C.ice, border: `2px solid ${C.navy}`, borderRadius: "10px", padding: "10px 12px", marginBottom: "10px" }}>
                      {route.stops.map((stop, idx) => (
                        <div key={stop} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "14px" }}>
                            <div style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: C.royal, border: `2px solid ${C.navy}`, marginTop: "3px", flexShrink: 0 }} />
                            {idx < route.stops.length - 1 && <div style={{ width: "2px", height: "18px", backgroundColor: C.navy + "40" }} />}
                          </div>
                          <p style={{ fontSize: "13px", fontWeight: 700, color: C.navy, paddingBottom: idx < route.stops.length - 1 ? "2px" : 0 }}>{stop}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => navigate("/profile")}
                        style={{ flex: 1, height: "40px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", backgroundColor: C.royal, border: `2px solid ${C.navy}`, borderRadius: "10px", boxShadow: `3px 3px 0 ${C.navy}`, color: C.white, fontSize: "13px", fontWeight: 800, cursor: "pointer" }}
                      >
                        <IconPlay size={14} />
                        开始导览
                      </button>
                      <button
                        onClick={() => toggleFavorite({
                          id: route.id, title: route.title, emoji: route.emoji,
                          type: "recommended", duration: route.duration,
                          stops: route.stops, bg: route.bg, tagBg: route.tagBg, tagLabel: "推荐",
                        })}
                        style={{
                          width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center",
                          backgroundColor: fav ? "#FFF0F0" : C.white,
                          border: `2px solid ${C.navy}`, borderRadius: "10px", boxShadow: `3px 3px 0 ${C.navy}`, cursor: "pointer",
                        }}
                      >
                        <IconHeart size={17} filled={fav} color={C.coral} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav activeTab="Route" />
    </PhoneShell>
  );
}
