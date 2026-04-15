import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { PhoneShell, StatusBar, ComicCard, Burst, SpeechBubble } from "./PhoneShell";
import { BottomNav } from "./BottomNav";
import { useFavorites } from "../context/FavoritesContext";
import { useCamera } from "../context/CameraContext";
import {
  IconBell, IconHeart, IconStamp, IconSparkle,
  IconChevronRight, IconClock, IconPin, IconTrash, IconBack,
} from "./ComicIcons";

const C = {
  navy: "#0E1B4D", royal: "#2350D8", sky: "#4B9EF7", pale: "#A8D4FF",
  ice: "#DCF0FF", cream: "#FFFBF0", yellow: "#FFD93D", coral: "#FF6B6B",
  mint: "#5EEAA8", purple: "#7B5CF5", white: "#FFFFFF",
};

/* ── Classroom database ── */
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
  { id: 1,  room: "SA101", building: "科技楼A (SA)",  floor: 1, duration: "约3分钟",
    steps: ["📍 从您当前位置出发", "➡️ 向东直行约60米", "🏛️ 到达SA楼正门"],
    floorGuide: "1楼教室，进门后沿主走廊直行，右侧第2间即为SA101。",
    access: "none", accessDetail: "无需乘梯，1楼直接进入" },
  { id: 2,  room: "SA203", building: "科技楼A (SA)",  floor: 2, duration: "约4分钟",
    steps: ["📍 从您当前位置出发", "➡️ 向东直行约60米", "🏛️ 到达SA楼正门", "⬆️ 前往2楼"],
    floorGuide: "2楼教室，出电梯左转，走廊第3间。",
    access: "elevator", accessDetail: "推荐乘坐SA楼中央电梯（正门左侧）至2楼" },
  { id: 3,  room: "SA305", building: "科技楼A (SA)",  floor: 3, duration: "约5分钟",
    steps: ["📍 从您当前位置出发", "➡️ 向东直行约60米", "🏛️ 到达SA楼正门", "⬆️ 前往3楼"],
    floorGuide: "3楼教室，出电梯右转，走廊尽头。",
    access: "elevator", accessDetail: "乘坐SA楼中央电梯至3楼，出门右转" },
  { id: 4,  room: "SB101", building: "科技楼B (SB)",  floor: 1, duration: "约4分钟",
    steps: ["📍 从您当前位置出发", "⬆️ 向北走约80米", "↩️ 在SB楼处左转", "🏛️ 到达SB楼正门"],
    floorGuide: "1楼教室，进门后右侧走廊。",
    access: "none", accessDetail: "无需乘梯，1楼直接进入" },
  { id: 5,  room: "SB302", building: "科技楼B (SB)",  floor: 3, duration: "约6分钟",
    steps: ["📍 从您当前位置出发", "⬆️ 向北走约80米", "↩️ 在SB楼处左转", "🏛️ 到达SB楼正门", "⬆️ 前往3楼"],
    floorGuide: "3楼教室，出电梯左转，第2间。",
    access: "elevator", accessDetail: "乘坐SB楼北侧电梯（正门进入右转）至3楼" },
  { id: 6,  room: "CB101", building: "中心楼 (CB)",   floor: 1, duration: "约5分钟",
    steps: ["📍 从您当前位置出发", "⬆️ 直行至中心广场", "↩️ 右转进入CB楼"],
    floorGuide: "1楼教室，正门后左侧走廊。",
    access: "none", accessDetail: "无需乘梯，1楼直接进入" },
  { id: 7,  room: "CB302", building: "中心楼 (CB)",   floor: 3, duration: "约7分钟",
    steps: ["📍 从您当前位置出发", "⬆️ 直行至中心广场", "↩️ 右转进入CB楼", "⬆️ 前往3楼"],
    floorGuide: "3楼教室，出电梯直走，左侧第4间。",
    access: "elevator", accessDetail: "乘坐CB楼中央电梯（大厅正中）至3楼" },
  { id: 8,  room: "EE101", building: "电子楼 (EE)",   floor: 1, duration: "约4分钟",
    steps: ["📍 从您当前位置出发", "➡️ 向东北方向行走约100米", "🏛️ 到达EE楼正门"],
    floorGuide: "1楼教室，正门进入后左转走廊。",
    access: "none", accessDetail: "无需乘梯，1楼直接进入" },
  { id: 9,  room: "EE204", building: "电子楼 (EE)",   floor: 2, duration: "约5分钟",
    steps: ["📍 从您当前位置出发", "➡️ 向东北方向行走约100米", "🏛️ 到达EE楼正门", "⬆️ 前往2楼"],
    floorGuide: "2楼教室，出楼梯右转，第2间。",
    access: "stairs", accessDetail: "建议走EE楼北侧楼梯（正门右转）至2楼，无电梯" },
  { id: 10, room: "MS101", building: "数学楼 (MS)",   floor: 1, duration: "约5分钟",
    steps: ["📍 从您当前位置出发", "⬆️ 向图书馆方向直行约120米", "🏛️ 到达MS楼侧门"],
    floorGuide: "1楼教室，侧门进入后直行右转。",
    access: "none", accessDetail: "无需乘梯，1楼直接进入" },
  { id: 11, room: "MS401", building: "数学楼 (MS)",   floor: 4, duration: "约8分钟",
    steps: ["📍 从您当前位置出发", "⬆️ 向图书馆方向直行约120米", "🏛️ 到达MS楼侧门", "⬆️ 前往4楼"],
    floorGuide: "4楼教室，出电梯左转，走廊第1间。",
    access: "elevator", accessDetail: "乘坐MS楼主电梯（正门大厅）至4楼（推荐）或走北侧楼梯" },
  { id: 12, room: "LB201", building: "图书馆 (LB)",   floor: 2, duration: "约6分钟",
    steps: ["📍 从您当前位置出发", "⬆️ 直行约130米", "🏛️ 到达图书馆正门", "⬆️ 前往2楼"],
    floorGuide: "2楼阅览室，出电梯后右转即是。",
    access: "elevator", accessDetail: "乘坐图书馆主电梯（大厅右侧）至2楼" },
  { id: 13, room: "IB305", building: "国际楼 (IB)",   floor: 3, duration: "约7分钟",
    steps: ["📍 从您当前位置出发", "↩️ 向南行走约100米", "🏛️ 到达IB楼正门", "⬆️ 前往3楼"],
    floorGuide: "3楼会议室，出电梯右转，尽头左侧。",
    access: "elevator", accessDetail: "乘坐IB楼南侧电梯至3楼，出门右转" },
  { id: 14, room: "ES201", building: "工程楼 (ES)",   floor: 2, duration: "约5分钟",
    steps: ["📍 从您当前位置出发", "➡️ 右转约80米", "🏛️ 到达ES楼正门", "⬆️ 前往2楼"],
    floorGuide: "2楼实验室，出楼梯左转，第4间。",
    access: "stairs", accessDetail: "ES楼走主楼梯（正门右侧）至2楼，暂无电梯" },
];

const navCards = [
  { id: "pictures", label: "图片 & 地图", emoji: "🗺️", path: "/pictures",     bg: C.pale,       tagBg: C.sky,   tag: "MAPS"  },
  { id: "route",    label: "路线探索",    emoji: "🧭", path: "/route",          bg: C.ice,        tagBg: C.royal, tag: "ROUTE" },
  { id: "mystery",  label: "盲盒路线",    emoji: "🎲", path: "/mystery-route",  bg: C.mint+"55",  tagBg: C.purple,tag: "LUCKY" },
  { id: "custom",   label: "自定义路线",  emoji: "🧩", path: "/custom-route",   bg: C.cream,      tagBg: C.sky,   tag: "DIY"   },
];

const stampData = [
  { id: 1, name: "图书馆",   emoji: "📚", color: C.royal  },
  { id: 2, name: "中心广场", emoji: "🌸", color: C.purple },
  { id: 3, name: "东门",     emoji: "🚪", color: C.sky    },
  { id: 4, name: "体育馆",   emoji: "🏃", color: C.navy   },
  { id: 5, name: "食堂",     emoji: "🍜", color: C.royal  },
  { id: 6, name: "南湖",     emoji: "💧", color: C.sky    },
];

const typeLabel: Record<string, string> = { recommended: "推荐", mystery: "盲盒", custom: "自定义" };
const typeColor: Record<string, string> = { recommended: C.sky, mystery: C.purple, custom: C.sky };

export function HomeScreen() {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavorites();
  const { stampCheckedCount } = useCamera();
  const checkedCount = stampCheckedCount;

  // preview: first 6 stamps, derived checked state from context
  const stampPreview = stampData.map((s, i) => ({ ...s, checked: i < checkedCount }));

  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Classroom | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim().length > 0
    ? classrooms.filter(
        (c) =>
          c.room.toLowerCase().includes(query.toLowerCase()) ||
          c.building.toLowerCase().includes(query.toLowerCase())
      )
    : classrooms.slice(0, 6);

  useEffect(() => {
    if (showSearch && !selected) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showSearch, selected]);

  const openSearch = () => { setShowSearch(true); setQuery(""); setSelected(null); };
  const closeSearch = () => { setShowSearch(false); setQuery(""); setSelected(null); };

  return (
    <PhoneShell bg={C.ice}>
      <StatusBar />

      {/* ── Header ── */}
      <div style={{ backgroundColor: C.royal, borderBottom: `3px solid ${C.navy}`, padding: "8px 20px 22px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, #ffffff22 1.2px, transparent 1.2px)", backgroundSize: "14px 14px" }} />
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "100px", height: "100px", borderRadius: "50%", backgroundColor: C.sky, border: `2px solid ${C.navy}`, opacity: 0.5 }} />
        <div style={{ position: "absolute", bottom: "-20px", left: "60px", width: "70px", height: "70px", borderRadius: "50%", backgroundColor: C.pale, border: `2px solid ${C.navy}`, opacity: 0.4 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div>
              <SpeechBubble style={{ marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: C.navy }}>欢迎回来！👋 探索今天的校园吧</span>
              </SpeechBubble>
              <h1 style={{ fontSize: "28px", fontWeight: 900, color: C.white, textShadow: `2px 2px 0 ${C.navy}`, marginTop: "14px" }}>
                UniBuddy
              </h1>
            </div>
            {/* Search button */}
            <button
              onClick={openSearch}
              style={{
                width: "40px", height: "40px",
                backgroundColor: C.white,
                border: `2px solid ${C.navy}`,
                borderRadius: "12px",
                boxShadow: `2px 2px 0 ${C.navy}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M16.5 16.5L21 21" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { label: "景点",  value: "18", bg: C.pale,   color: C.royal },
              { label: "路线",  value: "5",  bg: C.yellow, color: C.navy  },
              { label: "已集章", value: `${checkedCount}`, bg: C.mint, color: C.navy },
            ].map((s) => (
              <div key={s.label} style={{ flex: 1, backgroundColor: s.bg, border: `2px solid ${C.navy}`, borderRadius: "12px", boxShadow: `2px 2px 0 ${C.navy}`, padding: "8px 0", textAlign: "center" }}>
                <p style={{ fontSize: "22px", fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: "11px", fontWeight: 700, color: C.navy, marginTop: "2px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "90px" }}>
        <SectionLabel color={C.yellow} text="功能导航" icon={<IconSparkle size={18} />} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px" }}>
          {navCards.map((card) => (
            <button
              key={card.id}
              onClick={() => navigate(card.path)}
              style={{ backgroundColor: card.bg, border: `2.5px solid ${C.navy}`, borderRadius: "16px", boxShadow: `4px 4px 0 ${C.navy}`, padding: "14px 12px", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: "6px", minHeight: "108px" }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
            >
              <div style={{ display: "inline-block", backgroundColor: card.tagBg, border: `1.5px solid ${C.navy}`, borderRadius: "6px", padding: "1px 7px", fontSize: "10px", fontWeight: 900, color: C.white, letterSpacing: "0.5px", alignSelf: "flex-start" }}>
                {card.tag}
              </div>
              <span style={{ fontSize: "30px" }}>{card.emoji}</span>
              <span style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>{card.label}</span>
            </button>
          ))}
        </div>

        <SectionLabel color={C.sky} text="集章进度" icon={<IconStamp size={18} filled />} />

        <ComicCard style={{ padding: "14px", marginBottom: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>打卡进度</span>
            <span style={{ fontSize: "13px", fontWeight: 900, color: C.royal }}>{checkedCount} / {stampData.length}</span>
          </div>
          <div style={{ width: "100%", height: "12px", backgroundColor: C.ice, border: `2px solid ${C.navy}`, borderRadius: "20px", overflow: "hidden", marginBottom: "12px" }}>
            <div style={{ height: "100%", backgroundColor: C.royal, width: `${(checkedCount / stampData.length) * 100}%`, borderRight: `2px solid ${C.navy}` }} />
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
            {stampPreview.map((stamp) => (
              <div key={stamp.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                <div style={{ width: "38px", height: "38px", backgroundColor: stamp.checked ? stamp.color + "22" : "#F8FAFC", border: stamp.checked ? `2px solid ${stamp.color}` : `2px dashed ${C.pale}`, borderRadius: "10px", boxShadow: stamp.checked ? `2px 2px 0 ${stamp.color}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", opacity: stamp.checked ? 1 : 0.3 }}>
                  {stamp.emoji}
                </div>
                <span style={{ fontSize: "9px", fontWeight: stamp.checked ? 800 : 500, color: stamp.checked ? stamp.color : "#94A3B8", textAlign: "center" }}>{stamp.name}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/profile")}
            style={{ width: "100%", marginTop: "12px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", backgroundColor: C.ice, border: `2px solid ${C.navy}`, borderRadius: "10px", boxShadow: `2px 2px 0 ${C.navy}`, fontSize: "12px", fontWeight: 800, color: C.navy, cursor: "pointer" }}
          >
            查看全部集章 <IconChevronRight size={14} />
          </button>
        </ComicCard>

        <div style={{ marginTop: "18px" }}>
          <SectionLabel color={C.coral} text="收藏的路线" icon={<IconHeart size={18} filled color={C.coral} />} />
          {favorites.length === 0 ? (
            <ComicCard style={{ padding: "20px", textAlign: "center", backgroundColor: C.cream }}>
              <span style={{ fontSize: "32px", display: "block", marginBottom: "8px" }}>💫</span>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#4B6898" }}>还没有收藏的路线</p>
              <p style={{ fontSize: "12px", fontWeight: 500, color: "#94A3B8", marginTop: "4px" }}>去路线页面收藏你喜欢的路线吧</p>
              <button onClick={() => navigate("/route")} style={{ marginTop: "12px", padding: "6px 18px", backgroundColor: C.royal, border: `2px solid ${C.navy}`, borderRadius: "10px", boxShadow: `2px 2px 0 ${C.navy}`, color: C.white, fontSize: "12px", fontWeight: 800, cursor: "pointer" }}>
                去探索路线 →
              </button>
            </ComicCard>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {favorites.map((fav) => (
                <ComicCard key={fav.id} style={{ padding: "14px", backgroundColor: fav.bg || C.pale }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "48px", height: "48px", backgroundColor: C.white, border: `2.5px solid ${C.navy}`, borderRadius: "14px", boxShadow: `2px 2px 0 ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>
                      {fav.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "14px", fontWeight: 900, color: C.navy }}>{fav.title}</span>
                        <span style={{ backgroundColor: typeColor[fav.type] || C.sky, border: `1.5px solid ${C.navy}`, borderRadius: "6px", padding: "0 6px", fontSize: "10px", fontWeight: 900, color: C.white }}>
                          {typeLabel[fav.type] || fav.type}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {fav.duration && (
                          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                            <IconClock size={12} color={C.royal} />
                            <span style={{ fontSize: "11px", fontWeight: 700, color: C.royal }}>{fav.duration}</span>
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                          <IconPin size={12} color={C.royal} />
                          <span style={{ fontSize: "11px", fontWeight: 700, color: C.royal }}>{fav.stops.length} 站</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                      <button onClick={() => navigate("/route")} style={{ width: "32px", height: "32px", backgroundColor: C.royal, border: `2px solid ${C.navy}`, borderRadius: "8px", boxShadow: `2px 2px 0 ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 4L20 12L6 20V4Z" fill="white" /></svg>
                      </button>
                      <button onClick={() => removeFavorite(fav.id)} style={{ width: "32px", height: "32px", backgroundColor: C.white, border: `2px solid ${C.navy}`, borderRadius: "8px", boxShadow: `2px 2px 0 ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <IconTrash size={15} />
                      </button>
                    </div>
                  </div>
                </ComicCard>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: "18px" }}>
          <ComicCard style={{ padding: "14px", backgroundColor: C.cream }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ fontSize: "26px", flexShrink: 0 }}>🏫</span>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 800, color: C.navy, marginBottom: "4px" }}>关于 XJTLU</p>
                <p style={{ fontSize: "12px", fontWeight: 500, color: "#4B6898", lineHeight: "1.6" }}>
                  西交利物浦大学坐落于苏州工业园区，融汇中西方教育精华，是中英合办的国际化研究型大学。
                </p>
              </div>
            </div>
          </ComicCard>
        </div>
      </div>

      <BottomNav activeTab="Home" />

      {/* ── Search Overlay ── */}
      {showSearch && (
        <div style={{ position: "absolute", inset: 0, zIndex: 50, backgroundColor: C.ice, display: "flex", flexDirection: "column" }}>

          {selected ? (
            /* ── Navigation Detail View ── */
            <>
              {/* Nav header */}
              <div style={{ backgroundColor: C.royal, borderBottom: `3px solid ${C.navy}`, padding: "10px 16px 20px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", backgroundColor: C.sky, opacity: 0.3 }} />
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", position: "relative", zIndex: 1 }}>
                  <button
                    onClick={() => setSelected(null)}
                    style={{ width: "34px", height: "34px", backgroundColor: "rgba(255,255,255,0.2)", border: `2px solid rgba(255,255,255,0.4)`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                  >
                    <IconBack size={18} color="white" />
                  </button>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>教室导航</p>
                    <p style={{ fontSize: "20px", fontWeight: 900, color: C.white, textShadow: `1px 1px 0 ${C.navy}` }}>
                      {selected.room}
                    </p>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Burst size={44} color={C.yellow} text={selected.duration.replace("约", "")} textColor={C.navy} />
                  </div>
                </div>
                <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "6px" }}>
                  <span style={{ backgroundColor: C.pale, border: `1.5px solid ${C.navy}`, borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 800, color: C.navy }}>
                    {selected.building}
                  </span>
                  <span style={{ backgroundColor: C.yellow, border: `1.5px solid ${C.navy}`, borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 800, color: C.navy }}>
                    {selected.floor}楼
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "24px" }}>

                {/* Route map visual */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <div style={{ width: "4px", height: "18px", backgroundColor: C.royal, border: `1.5px solid ${C.navy}`, borderRadius: "2px" }} />
                  <span style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>🚶 步行路线</span>
                </div>

                {/* Route path visual */}
                <ComicCard style={{ padding: "14px", marginBottom: "14px", backgroundColor: C.cream }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
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

                {/* Access method card */}
                <ComicCard style={{ padding: "14px", marginBottom: "12px", backgroundColor: selected.access === "elevator" ? C.pale : selected.access === "stairs" ? "#E8D5FF" : C.mint + "55" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "46px", height: "46px", flexShrink: 0,
                      backgroundColor: C.white, border: `2.5px solid ${C.navy}`,
                      borderRadius: "14px", boxShadow: `3px 3px 0 ${C.navy}`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px",
                    }}>
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
                  onClick={closeSearch}
                  style={{ width: "100%", marginTop: "16px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: C.royal, border: `2.5px solid ${C.navy}`, borderRadius: "14px", boxShadow: `4px 4px 0 ${C.navy}`, color: C.white, fontSize: "15px", fontWeight: 900, cursor: "pointer" }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
                >
                  ✅ 开始导航
                </button>
              </div>
            </>
          ) : (
            /* ── Search Panel ── */
            <>
              {/* Search header */}
              <div style={{ backgroundColor: C.royal, borderBottom: `3px solid ${C.navy}`, padding: "10px 16px 16px", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <button
                    onClick={closeSearch}
                    style={{ width: "34px", height: "34px", backgroundColor: "rgba(255,255,255,0.2)", border: `2px solid rgba(255,255,255,0.4)`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                  >
                    <IconBack size={18} color="white" />
                  </button>
                  <p style={{ fontSize: "18px", fontWeight: 900, color: C.white, textShadow: `1px 1px 0 ${C.navy}` }}>搜索教室</p>
                </div>
                {/* Search input */}
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4B6898" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" />
                    </svg>
                  </div>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="输入教室号或楼栋，如 SA101 / 科技楼"
                    style={{
                      width: "100%", height: "44px",
                      backgroundColor: C.white, border: `2.5px solid ${C.navy}`,
                      borderRadius: "14px", boxShadow: `3px 3px 0 ${C.navy}`,
                      paddingLeft: "36px", paddingRight: "12px",
                      fontSize: "13px", fontWeight: 600, color: C.navy,
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#94A3B8" }}
                    >✕</button>
                  )}
                </div>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto px-4 pt-3" style={{ paddingBottom: "20px" }}>
                {query.trim() === "" && (
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", marginBottom: "10px" }}>
                    💡 支持搜索教室号或楼栋名称
                  </p>
                )}
                {filtered.length === 0 ? (
                  <ComicCard style={{ padding: "24px", textAlign: "center", backgroundColor: C.cream }}>
                    <span style={{ fontSize: "36px", display: "block", marginBottom: "8px" }}>🔍</span>
                    <p style={{ fontSize: "14px", fontWeight: 800, color: C.navy }}>未找到相关教室</p>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "#4B6898", marginTop: "4px" }}>请尝试其他关键词</p>
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
                          padding: "12px 14px", cursor: "pointer", textAlign: "left", width: "100%",
                        }}
                        onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
                        onMouseUp={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
                      >
                        <div style={{ width: "44px", height: "44px", backgroundColor: C.pale, border: `2px solid ${C.navy}`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                          🏛️
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                            <span style={{ fontSize: "15px", fontWeight: 900, color: C.navy }}>{room.room}</span>
                            <span style={{ backgroundColor: C.sky, border: `1.5px solid ${C.navy}`, borderRadius: "6px", padding: "0 6px", fontSize: "10px", fontWeight: 900, color: C.white }}>{room.floor}楼</span>
                          </div>
                          <p style={{ fontSize: "12px", fontWeight: 600, color: "#4B6898" }}>{room.building}</p>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: C.royal, marginTop: "2px" }}>⏱ {room.duration}</p>
                        </div>
                        <IconChevronRight size={16} color={C.navy} />
                      </button>
                    ))}
                    {query.trim() === "" && (
                      <p style={{ textAlign: "center", fontSize: "11px", fontWeight: 600, color: "#94A3B8", marginTop: "4px" }}>
                        输入关键词搜索更多教室…
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </PhoneShell>
  );
}

function SectionLabel({ color, text, icon }: { color: string; text: string; icon?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
      <div style={{ width: "4px", height: "18px", backgroundColor: color, border: "1.5px solid #0E1B4D", borderRadius: "2px" }} />
      <span style={{ fontSize: "13px", fontWeight: 800, color: "#0E1B4D" }}>{text}</span>
      {icon}
    </div>
  );
}