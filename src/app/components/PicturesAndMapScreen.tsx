import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { PhoneShell, StatusBar, ComicCard, Burst } from "./PhoneShell";
import { BottomNav } from "./BottomNav";
import { IconBack, IconChevronLeft, IconChevronRight, IconPin, IconNavigation, IconChevronRight as IconArrow } from "./ComicIcons";

const C = {
  navy: "#0E1B4D", royal: "#2350D8", sky: "#4B9EF7", pale: "#A8D4FF",
  ice: "#DCF0FF", cream: "#FFFBF0", yellow: "#FFD93D", coral: "#FF6B6B",
  mint: "#5EEAA8", purple: "#7B5CF5", white: "#FFFFFF",
};

/* ── Classroom database (shared) ── */
interface Classroom {
  id: number;
  room: string;
  building: string;
  floor: number;
  steps: string[];
  floorGuide: string;
  access: "elevator" | "stairs" | "none";
  accessDetail: string;
  duration: string;
}

const classrooms: Classroom[] = [
  { id: 1,  room: "SA101", building: "科技楼A (SA)", floor: 1, duration: "约3分钟",
    steps: ["📍 从您当前位置出发", "➡️ 向东直行约60米", "🏛️ 到达SA楼正门"],
    floorGuide: "1楼教室，进门后沿主走廊直行，右侧第2间即为SA101。",
    access: "none", accessDetail: "无需乘梯，1楼直接进入" },
  { id: 2,  room: "SA203", building: "科技楼A (SA)", floor: 2, duration: "约4分钟",
    steps: ["📍 从您当前位置出发", "➡️ 向东直行约60米", "🏛️ 到达SA楼正门", "⬆️ 前往2楼"],
    floorGuide: "2楼教室，出电梯左转，走廊第3间。",
    access: "elevator", accessDetail: "推荐乘坐SA楼中央电梯（正门左侧）至2楼" },
  { id: 3,  room: "SA305", building: "科技楼A (SA)", floor: 3, duration: "约5分钟",
    steps: ["📍 从您当前位置出发", "➡️ 向东直行约60米", "🏛️ 到达SA楼正门", "⬆️ 前往3楼"],
    floorGuide: "3楼教室，出电梯右转，走廊尽头。",
    access: "elevator", accessDetail: "乘坐SA楼中央电梯至3楼，出门右转" },
  { id: 4,  room: "SB101", building: "科技楼B (SB)", floor: 1, duration: "约4分钟",
    steps: ["📍 从您当前位置出发", "⬆️ 向北走约80米", "↩️ 在SB楼处左转", "🏛️ 到达SB楼正门"],
    floorGuide: "1楼教室，进门后右侧走廊。",
    access: "none", accessDetail: "无需乘梯，1楼直接进入" },
  { id: 5,  room: "SB302", building: "科技楼B (SB)", floor: 3, duration: "约6分钟",
    steps: ["📍 从您当前位置出发", "⬆️ 向北走约80米", "↩️ 在SB楼处左转", "🏛️ 到达SB楼正门", "⬆️ 前往3楼"],
    floorGuide: "3楼教室，出电梯左转，第2间。",
    access: "elevator", accessDetail: "乘坐SB楼北侧电梯（正门进入右转）至3楼" },
  { id: 6,  room: "CB101", building: "中心楼 (CB)",  floor: 1, duration: "约5分钟",
    steps: ["📍 从您当前位置出发", "⬆️ 直行至中心广场", "↩️ 右转进入CB楼"],
    floorGuide: "1楼教室，正门后左侧走廊。",
    access: "none", accessDetail: "无需乘梯，1楼直接进入" },
  { id: 7,  room: "CB302", building: "中心楼 (CB)",  floor: 3, duration: "约7分钟",
    steps: ["📍 从您当前位置出发", "⬆️ 直行至中心广场", "↩️ 右转进入CB楼", "⬆️ 前往3楼"],
    floorGuide: "3楼教室，出电梯直走，左侧第4间。",
    access: "elevator", accessDetail: "乘坐CB楼中央电梯（大厅正中）至3楼" },
  { id: 8,  room: "EE101", building: "电子楼 (EE)",  floor: 1, duration: "约4分钟",
    steps: ["📍 从您当前位置出发", "➡️ 向东北方向行走约100米", "🏛️ 到达EE楼正门"],
    floorGuide: "1楼教室，正门进入后左转走廊。",
    access: "none", accessDetail: "无需乘梯，1楼直接进入" },
  { id: 9,  room: "EE204", building: "电子楼 (EE)",  floor: 2, duration: "约5分钟",
    steps: ["📍 从您当前位置出发", "➡️ 向东北方向行走约100米", "🏛️ 到达EE楼正门", "⬆️ 前往2楼"],
    floorGuide: "2楼教室，出楼梯右转，第2间。",
    access: "stairs", accessDetail: "建议走EE楼北侧楼梯（正门右转）至2楼，无电梯" },
  { id: 10, room: "MS101", building: "数学楼 (MS)",  floor: 1, duration: "约5分钟",
    steps: ["📍 从您当前位置出发", "⬆️ 向图书馆方向直行约120米", "🏛️ 到达MS楼侧门"],
    floorGuide: "1楼教室，侧门进入后直行右转。",
    access: "none", accessDetail: "无需乘梯，1楼直接进入" },
  { id: 11, room: "MS401", building: "数学楼 (MS)",  floor: 4, duration: "约8分钟",
    steps: ["📍 从您当前位置出发", "⬆️ 向图书馆方向直行约120米", "🏛️ 到达MS楼侧门", "⬆️ 前往4楼"],
    floorGuide: "4楼教室，出电梯左转，走廊第1间。",
    access: "elevator", accessDetail: "乘坐MS楼主电梯（正门大厅）至4楼（推荐）或走北侧楼梯" },
  { id: 12, room: "LB201", building: "图书馆 (LB)",  floor: 2, duration: "约6分钟",
    steps: ["📍 从您当前位置出发", "⬆️ 直行约130米", "🏛️ 到达图书馆正门", "⬆️ 前往2楼"],
    floorGuide: "2楼阅览室，出电梯后右转即是。",
    access: "elevator", accessDetail: "乘坐图书馆主电梯（大厅右侧）至2楼" },
  { id: 13, room: "IB305", building: "国际楼 (IB)",  floor: 3, duration: "约7分钟",
    steps: ["📍 从您当前位置出发", "↩️ 向南行走约100米", "🏛️ 到达IB楼正门", "⬆️ 前往3楼"],
    floorGuide: "3楼会议室，出电梯右转，尽头左侧。",
    access: "elevator", accessDetail: "乘坐IB楼南侧电梯至3楼，出门右转" },
  { id: 14, room: "ES201", building: "工程楼 (ES)",  floor: 2, duration: "约5分钟",
    steps: ["📍 从您当前位置出发", "➡️ 右转约80米", "🏛️ 到达ES楼正门", "⬆️ 前往2楼"],
    floorGuide: "2楼实验室，出楼梯左转，第4间。",
    access: "stairs", accessDetail: "ES楼走主楼梯（正门右侧）至2楼，暂无电梯" },
];

const photos = [
  { id: 1, title: "中心广场",  url: "https://images.unsplash.com/photo-1601540738325-c8847a21d858?w=800&q=80", tag: "广场" },
  { id: 2, title: "图书馆",    url: "https://images.unsplash.com/photo-1664273891579-22f28332f3c4?w=800&q=80", tag: "学术" },
  { id: 3, title: "校园小径",  url: "https://images.unsplash.com/photo-1767494308912-5af1a35eecbf?w=800&q=80", tag: "自然" },
  { id: 4, title: "教学楼",    url: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80", tag: "建筑" },
  { id: 5, title: "运动场",    url: "https://images.unsplash.com/photo-1766459710529-c9fdb8023ecb?w=800&q=80", tag: "运动" },
];

const mapPins = [
  { id: 1, label: "图书馆",   x: 38, y: 28, color: C.royal  },
  { id: 2, label: "中心广场", x: 55, y: 46, color: C.sky    },
  { id: 3, label: "教学楼",   x: 24, y: 55, color: C.purple },
  { id: 4, label: "食堂",     x: 70, y: 60, color: C.coral  },
  { id: 5, label: "体育馆",   x: 48, y: 72, color: C.mint   },
];

type MapTab = "地图" | "实时定位";

export function PicturesAndMapScreen() {
  const navigate = useNavigate();
  const [cur, setCur] = useState(0);
  const [mapTab, setMapTab] = useState<MapTab>("地图");

  /* search state */
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Classroom | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim().length > 0
    ? classrooms.filter(
        (c) =>
          c.room.toLowerCase().includes(query.toLowerCase()) ||
          c.building.toLowerCase().includes(query.toLowerCase())
      )
    : classrooms.slice(0, 5);

  const prev = () => setCur((c) => (c - 1 + photos.length) % photos.length);
  const next = () => setCur((c) => (c + 1) % photos.length);

  return (
    <PhoneShell bg={C.ice}>
      <StatusBar />

      {/* Header */}
      <div style={{ backgroundColor: C.sky, borderBottom: `3px solid ${C.navy}`, padding: "8px 20px 22px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #ffffff22 1.2px, transparent 1.2px)", backgroundSize: "14px 14px" }} />
        <div style={{ position: "absolute", bottom: "8px", right: "20px" }}><Burst size={44} color={C.yellow} text="📸" /></div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <button onClick={() => navigate("/home")} style={{ width: "32px", height: "32px", backgroundColor: "rgba(255,255,255,0.3)", border: `2px solid rgba(255,255,255,0.5)`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconBack size={18} color="white" />
            </button>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>UniBuddy</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 900, color: C.white, textShadow: `2px 2px 0 ${C.navy}` }}>📸 图片 & 地图</h1>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.85)", marginTop: "2px" }}>校园风光与导航</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "90px" }}>

        {/* ── Gallery ── */}
        <SectionLabel color={C.yellow} text="校园图片" />

        <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", height: "192px", border: `2.5px solid ${C.navy}`, boxShadow: `4px 4px 0 ${C.navy}`, marginBottom: "10px" }}>
          <img src={photos[cur].url} alt={photos[cur].title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: C.yellow, border: `2px solid ${C.navy}`, borderRadius: "8px", padding: "2px 8px", fontSize: "11px", fontWeight: 900, color: C.navy, boxShadow: `2px 2px 0 ${C.navy}` }}>
            {photos[cur].tag}
          </div>
          <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", padding: "10px 14px", background: "linear-gradient(transparent, rgba(14,27,77,0.85))" }}>
            <span style={{ fontSize: "14px", fontWeight: 800, color: C.white }}>{photos[cur].title}</span>
          </div>
          <button onClick={prev} style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", width: "30px", height: "30px", backgroundColor: C.white, border: `2px solid ${C.navy}`, borderRadius: "8px", boxShadow: `2px 2px 0 ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <IconChevronLeft size={16} />
          </button>
          <button onClick={next} style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", width: "30px", height: "30px", backgroundColor: C.white, border: `2px solid ${C.navy}`, borderRadius: "8px", boxShadow: `2px 2px 0 ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <IconChevronRight size={16} />
          </button>
        </div>

        {/* Thumbnails */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
          {photos.map((p, i) => (
            <button key={p.id} onClick={() => setCur(i)} style={{ flex: 1, height: "48px", borderRadius: "10px", overflow: "hidden", border: i === cur ? `2.5px solid ${C.navy}` : `2px solid ${C.pale}`, opacity: i === cur ? 1 : 0.55, boxShadow: i === cur ? `2px 2px 0 ${C.navy}` : "none", cursor: "pointer", padding: 0 }}>
              <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "16px" }}>
          {photos.map((_, i) => (
            <button key={i} onClick={() => setCur(i)} style={{ width: i === cur ? "22px" : "8px", height: "8px", borderRadius: "20px", backgroundColor: i === cur ? C.royal : C.pale, border: `1.5px solid ${C.navy}`, transition: "width 0.2s", cursor: "pointer" }} />
          ))}
        </div>

        {/* ── Map ── */}
        <SectionLabel color={C.sky} text="校园地图" />

        <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
          {(["地图", "实时定位"] as MapTab[]).map((tab) => (
            <button key={tab} onClick={() => setMapTab(tab)} style={{ flex: 1, height: "38px", borderRadius: "12px", cursor: "pointer", backgroundColor: mapTab === tab ? C.royal : C.white, color: mapTab === tab ? C.white : "#4B6898", border: `2.5px solid ${C.navy}`, boxShadow: mapTab === tab ? `3px 3px 0 ${C.navy}` : `2px 2px 0 ${C.pale}`, fontSize: "13px", fontWeight: 800 }}>
              {tab}
            </button>
          ))}
        </div>

        <ComicCard style={{ height: "200px", overflow: "hidden", position: "relative", backgroundColor: C.ice, marginBottom: "18px" }}>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 390 200" preserveAspectRatio="none">
            <line x1="50" y1="0" x2="50" y2="200" stroke={C.pale} strokeWidth="10" />
            <line x1="340" y1="0" x2="340" y2="200" stroke={C.pale} strokeWidth="10" />
            <line x1="0" y1="50" x2="390" y2="50" stroke={C.pale} strokeWidth="10" />
            <line x1="0" y1="160" x2="390" y2="160" stroke={C.pale} strokeWidth="10" />
            <line x1="50" y1="0" x2="50" y2="200" stroke={C.navy} strokeWidth="1.5" strokeDasharray="4,4" />
            <line x1="340" y1="0" x2="340" y2="200" stroke={C.navy} strokeWidth="1.5" strokeDasharray="4,4" />
            <line x1="0" y1="50" x2="390" y2="50" stroke={C.navy} strokeWidth="1.5" strokeDasharray="4,4" />
            <line x1="0" y1="160" x2="390" y2="160" stroke={C.navy} strokeWidth="1.5" strokeDasharray="4,4" />
            <rect x="64" y="62" width="262" height="87" rx="12" fill={C.white} stroke={C.navy} strokeWidth="2" />
            <rect x="78" y="74" width="54" height="32" rx="6" fill={C.pale} stroke={C.navy} strokeWidth="1.5" />
            <rect x="156" y="68" width="74" height="42" rx="6" fill={C.sky} stroke={C.navy} strokeWidth="1.5" opacity="0.7" />
            <rect x="254" y="78" width="56" height="28" rx="6" fill={C.pale} stroke={C.navy} strokeWidth="1.5" />
            <rect x="96" y="116" width="38" height="26" rx="6" fill={C.mint} stroke={C.navy} strokeWidth="1.5" opacity="0.7" />
            <rect x="210" y="112" width="48" height="30" rx="6" fill={C.yellow} stroke={C.navy} strokeWidth="1.5" opacity="0.7" />
            <path d="M195 62 L195 148" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4,4" />
            <path d="M64 105 L326 105" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4,4" />
          </svg>
          {mapPins.map((pin) => (
            <div key={pin.id} style={{ position: "absolute", left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%,-100%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: pin.color, border: `2px solid ${C.navy}`, boxShadow: `2px 2px 0 ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconPin size={11} color="white" />
              </div>
              <div style={{ backgroundColor: C.white, border: `1.5px solid ${C.navy}`, borderRadius: "6px", padding: "1px 6px", marginTop: "2px", fontSize: "9px", fontWeight: 800, color: pin.color, whiteSpace: "nowrap", boxShadow: `1px 1px 0 ${C.navy}` }}>
                {pin.label}
              </div>
            </div>
          ))}
          {mapTab === "实时定位" && (
            <div style={{ position: "absolute", inset: 0, backgroundColor: `${C.royal}22`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <div style={{ width: "56px", height: "56px", backgroundColor: C.white, border: `3px solid ${C.royal}`, boxShadow: `3px 3px 0 ${C.navy}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 1.2s ease-in-out infinite alternate" }}>
                <IconNavigation size={24} color={C.royal} />
              </div>
              <div style={{ backgroundColor: C.royal, border: `2px solid ${C.navy}`, borderRadius: "20px", padding: "4px 14px", fontSize: "12px", fontWeight: 800, color: C.white, boxShadow: `2px 2px 0 ${C.navy}` }}>
                正在定位中…
              </div>
              <style>{`@keyframes pulse { from { transform: scale(1); } to { transform: scale(1.1); } }`}</style>
            </div>
          )}
        </ComicCard>

        {/* ── Classroom Search Section ── */}
        <SectionLabel color={C.coral} text="搜索教室" />

        {/* Search bar */}
        <div style={{ position: "relative", marginBottom: "10px" }}>
          <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4B6898" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" />
            </svg>
          </div>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入教室号或楼栋，如 SA101 / 科技楼"
            style={{
              width: "100%", height: "46px",
              backgroundColor: C.white,
              border: `2.5px solid ${C.navy}`,
              borderRadius: "14px",
              boxShadow: `3px 3px 0 ${C.navy}`,
              paddingLeft: "36px", paddingRight: query ? "36px" : "14px",
              fontSize: "13px", fontWeight: 600, color: C.navy,
              outline: "none", boxSizing: "border-box",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: "#94A3B8", padding: "4px" }}
            >✕</button>
          )}
        </div>

        {/* Hint */}
        {query.trim() === "" && (
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "8px" }}>
            💡 显示常用教室 · 输入关键词精准搜索
          </p>
        )}

        {/* Results list */}
        {filtered.length === 0 ? (
          <ComicCard style={{ padding: "20px", textAlign: "center", backgroundColor: C.cream }}>
            <span style={{ fontSize: "32px", display: "block", marginBottom: "6px" }}>🔍</span>
            <p style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>未找到相关教室</p>
            <p style={{ fontSize: "11px", fontWeight: 500, color: "#4B6898", marginTop: "4px" }}>请尝试其他关键词</p>
          </ComicCard>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filtered.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelected(room)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  backgroundColor: C.white, border: `2.5px solid ${C.navy}`,
                  borderRadius: "14px", boxShadow: `3px 3px 0 ${C.navy}`,
                  padding: "10px 12px", cursor: "pointer", textAlign: "left", width: "100%",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
              >
                {/* icon */}
                <div style={{ width: "40px", height: "40px", backgroundColor: C.pale, border: `2px solid ${C.navy}`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                  🏛️
                </div>
                {/* info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 900, color: C.navy }}>{room.room}</span>
                    <span style={{ backgroundColor: C.sky, border: `1.5px solid ${C.navy}`, borderRadius: "6px", padding: "0 6px", fontSize: "10px", fontWeight: 900, color: C.white }}>{room.floor}楼</span>
                    <span style={{ backgroundColor: room.access === "elevator" ? C.pale : room.access === "stairs" ? "#E8D5FF" : C.mint + "88", border: `1.5px solid ${C.navy}`, borderRadius: "6px", padding: "0 6px", fontSize: "10px", fontWeight: 800, color: C.navy }}>
                      {room.access === "elevator" ? "🛗 电梯" : room.access === "stairs" ? "🪜 楼梯" : "🚶 直达"}
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#4B6898" }}>{room.building}</p>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: C.royal, marginTop: "1px" }}>⏱ {room.duration}</p>
                </div>
                <IconArrow size={15} color={C.navy} />
              </button>
            ))}
            {query.trim() === "" && (
              <p style={{ textAlign: "center", fontSize: "11px", fontWeight: 600, color: "#94A3B8", paddingBottom: "4px" }}>
                输入关键词搜索更多教室…
              </p>
            )}
          </div>
        )}
      </div>

      <BottomNav activeTab="Map" />

      {/* ── Navigation Detail Overlay ── */}
      {selected && (
        <div style={{ position: "absolute", inset: 0, zIndex: 50, backgroundColor: C.ice, display: "flex", flexDirection: "column" }}>

          {/* Nav header */}
          <div style={{ backgroundColor: C.royal, borderBottom: `3px solid ${C.navy}`, padding: "10px 16px 20px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #ffffff18 1.2px, transparent 1.2px)", backgroundSize: "14px 14px" }} />
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", backgroundColor: C.sky, opacity: 0.3 }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <button
                onClick={() => setSelected(null)}
                style={{ width: "34px", height: "34px", backgroundColor: "rgba(255,255,255,0.2)", border: `2px solid rgba(255,255,255,0.4)`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
              >
                <IconBack size={18} color="white" />
              </button>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>教室导航</p>
                <p style={{ fontSize: "20px", fontWeight: 900, color: C.white, textShadow: `1px 1px 0 ${C.navy}` }}>{selected.room}</p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Burst size={44} color={C.yellow} text={selected.duration.replace("约", "")} textColor={C.navy} />
              </div>
            </div>
            <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "6px" }}>
              <span style={{ backgroundColor: C.pale, border: `1.5px solid ${C.navy}`, borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 800, color: C.navy }}>{selected.building}</span>
              <span style={{ backgroundColor: C.yellow, border: `1.5px solid ${C.navy}`, borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 800, color: C.navy }}>{selected.floor}楼</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "24px" }}>

            {/* Walk route */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <div style={{ width: "4px", height: "18px", backgroundColor: C.royal, border: `1.5px solid ${C.navy}`, borderRadius: "2px" }} />
              <span style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>🚶 步行路线</span>
            </div>

            <ComicCard style={{ padding: "14px", marginBottom: "14px", backgroundColor: C.cream }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {selected.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        backgroundColor: i === 0 ? C.mint : i === selected.steps.length - 1 ? C.royal : C.pale,
                        border: `2px solid ${C.navy}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px", fontWeight: 900,
                        color: i === selected.steps.length - 1 ? C.white : C.navy,
                      }}>
                        {i === 0 ? "📍" : i === selected.steps.length - 1 ? "🏛️" : `${i}`}
                      </div>
                      {i < selected.steps.length - 1 && (
                        <div style={{ width: "2px", height: "24px", backgroundColor: C.pale, margin: "3px 0" }} />
                      )}
                    </div>
                    <div style={{ paddingTop: "4px", paddingBottom: i < selected.steps.length - 1 ? "8px" : "0" }}>
                      <p style={{ fontSize: "13px", fontWeight: i === 0 || i === selected.steps.length - 1 ? 800 : 600, color: C.navy }}>
                        {step.replace(/^[^\s]+\s/, "")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ComicCard>

            {/* Floor guide */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <div style={{ width: "4px", height: "18px", backgroundColor: C.yellow, border: `1.5px solid ${C.navy}`, borderRadius: "2px" }} />
              <span style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>🏢 楼内导航</span>
            </div>

            {/* Access card */}
            <ComicCard style={{ padding: "14px", marginBottom: "12px", backgroundColor: selected.access === "elevator" ? C.pale : selected.access === "stairs" ? "#E8D5FF" : C.mint + "55" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "46px", height: "46px", flexShrink: 0, backgroundColor: C.white, border: `2.5px solid ${C.navy}`, borderRadius: "14px", boxShadow: `3px 3px 0 ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                  {selected.access === "elevator" ? "🛗" : selected.access === "stairs" ? "🪜" : "🚶"}
                </div>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#4B6898" }}>
                    {selected.access === "elevator" ? "推荐乘坐电梯" : selected.access === "stairs" ? "推荐走楼梯" : "无需乘梯"}
                  </p>
                  <p style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>{selected.accessDetail}</p>
                </div>
              </div>
            </ComicCard>

            {/* Room guide */}
            <ComicCard style={{ padding: "14px", backgroundColor: C.ice }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "22px", flexShrink: 0 }}>📌</span>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#4B6898", marginBottom: "4px" }}>到达教室</p>
                  <p style={{ fontSize: "13px", fontWeight: 800, color: C.navy, lineHeight: 1.5 }}>{selected.floorGuide}</p>
                </div>
              </div>
            </ComicCard>

            <button
              onClick={() => setSelected(null)}
              style={{ width: "100%", marginTop: "16px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: C.royal, border: `2.5px solid ${C.navy}`, borderRadius: "14px", boxShadow: `4px 4px 0 ${C.navy}`, color: C.white, fontSize: "15px", fontWeight: 900, cursor: "pointer" }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
            >
              ✅ 已记住，返回地图
            </button>
          </div>
        </div>
      )}
    </PhoneShell>
  );
}

function SectionLabel({ color, text }: { color: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
      <div style={{ width: "4px", height: "18px", backgroundColor: color, border: "1.5px solid #0E1B4D", borderRadius: "2px" }} />
      <span style={{ fontSize: "13px", fontWeight: 800, color: "#0E1B4D" }}>{text}</span>
    </div>
  );
}
