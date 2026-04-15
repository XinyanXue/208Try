import { useState } from "react";
import { useNavigate } from "react-router";
import { PhoneShell, StatusBar, ComicCard, Burst } from "./PhoneShell";
import { BottomNav } from "./BottomNav";
import { useFavorites } from "../context/FavoritesContext";
import { useCamera } from "../context/CameraContext";
import {
  IconStamp, IconHeart, IconSparkle,
  IconClock, IconPin, IconCheck,
} from "./ComicIcons";

const C = {
  navy: "#0E1B4D", royal: "#2350D8", sky: "#4B9EF7", pale: "#A8D4FF",
  ice: "#DCF0FF", cream: "#FFFBF0", yellow: "#FFD93D", coral: "#FF6B6B",
  mint: "#5EEAA8", purple: "#7B5CF5", white: "#FFFFFF",
};

const allStamps = [
  { id: 1,  name: "图书馆",   emoji: "📚", color: C.royal  },
  { id: 2,  name: "中心广场", emoji: "🌸", color: C.purple },
  { id: 3,  name: "东门",     emoji: "🚪", color: C.sky    },
  { id: 4,  name: "体育馆",   emoji: "🏃", color: C.navy   },
  { id: 5,  name: "食堂",     emoji: "🍜", color: C.royal  },
  { id: 6,  name: "南湖",     emoji: "💧", color: C.sky    },
  { id: 7,  name: "艺术中心", emoji: "🎨", color: C.purple },
  { id: 8,  name: "科研楼",   emoji: "🔬", color: C.royal  },
  { id: 9,  name: "创客空间", emoji: "⚙️", color: C.navy   },
  { id: 10, name: "校史馆",   emoji: "🏺", color: C.purple },
  { id: 11, name: "学生宿舍", emoji: "🏠", color: C.sky    },
  { id: 12, name: "行政楼",   emoji: "🏛️", color: C.royal  },
];

type TabKey = "stamps" | "favorites";

const typeLabel: Record<string, string> = { recommended: "推荐", mystery: "盲盒", custom: "自定义" };
const typeColor: Record<string, string> = { recommended: C.sky, mystery: C.purple, custom: C.sky };

export function ProfileScreen() {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavorites();
  const { stampCheckedCount, photos, openCamera } = useCamera();
  const [activeTab, setActiveTab] = useState<TabKey>("stamps");

  /* first N stamps are checked (4 pre-checked + 1 per photo) */
  const stamps = allStamps.map((s, i) => ({ ...s, checked: i < stampCheckedCount }));

  return (
    <PhoneShell bg={C.ice}>
      <StatusBar />

      {/* ── Header ── */}
      <div style={{ backgroundColor: C.royal, borderBottom: `3px solid ${C.navy}`, padding: "8px 20px 18px", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "100px", height: "100px", borderRadius: "50%", backgroundColor: C.sky, border: `2px solid ${C.navy}`, opacity: 0.4 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: "64px", height: "64px", backgroundColor: C.pale, border: `3px solid ${C.navy}`, borderRadius: "20px", boxShadow: `3px 3px 0 ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "34px" }}>
                🎓
              </div>
              <div style={{ position: "absolute", bottom: "-4px", right: "-4px" }}>
                <Burst size={22} color={C.yellow} text="LV3" textColor={C.navy} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "18px", fontWeight: 900, color: C.white, textShadow: `2px 2px 0 ${C.navy}` }}>小璐同学</p>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>XJTLU · 大一新生 🌱</p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { label: "已集章",   value: `${stampCheckedCount}`, bg: C.pale, color: C.royal },
              { label: "已拍照",   value: `${photos.length}`,     bg: C.ice,  color: C.royal },
              { label: "收藏路线", value: `${favorites.length}`,  bg: C.mint, color: C.navy  },
            ].map((s) => (
              <div key={s.label} style={{ flex: 1, backgroundColor: s.bg, border: `2px solid ${C.navy}`, borderRadius: "12px", boxShadow: `2px 2px 0 ${C.navy}`, padding: "8px 0", textAlign: "center" }}>
                <p style={{ fontSize: "20px", fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: "10px", fontWeight: 700, color: C.navy, marginTop: "2px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab bar (2 tabs only) ── */}
      <div style={{ display: "flex", borderBottom: `2.5px solid ${C.navy}`, backgroundColor: C.cream, flexShrink: 0 }}>
        {([
          { key: "stamps"    as TabKey, label: "集章",    icon: <IconStamp size={15} filled={activeTab === "stamps"} /> },
          { key: "favorites" as TabKey, label: "收藏路线", icon: <IconHeart size={15} filled={activeTab === "favorites"} color={C.coral} /> },
        ]).map((tab, i) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: "10px 0",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
              backgroundColor: activeTab === tab.key ? C.ice : C.cream,
              borderBottom: activeTab === tab.key ? `3px solid ${C.royal}` : "3px solid transparent",
              borderRight: i < 1 ? `2px solid ${C.navy}` : "none",
              fontSize: "12px", fontWeight: 800,
              color: activeTab === tab.key ? C.royal : "#4B6898",
              cursor: "pointer",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: "90px" }}>

        {/* ── STAMPS TAB ── */}
        {activeTab === "stamps" && (
          <>
            <ComicCard style={{ padding: "14px", marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 800, color: C.navy }}>打卡总进度</span>
                <span style={{ fontSize: "13px", fontWeight: 900, color: C.royal }}>{stampCheckedCount} / {stamps.length}</span>
              </div>
              <div style={{ width: "100%", height: "14px", backgroundColor: C.ice, border: `2px solid ${C.navy}`, borderRadius: "20px", overflow: "hidden" }}>
                <div style={{ height: "100%", backgroundColor: C.royal, width: `${(stampCheckedCount / stamps.length) * 100}%`, transition: "width 0.4s ease", borderRight: stampCheckedCount < stamps.length ? `2px solid ${C.navy}` : "none" }} />
              </div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#4B6898", marginTop: "6px" }}>
                还差 {stamps.length - stampCheckedCount} 个完成全部旅程 🚀
              </p>
            </ComicCard>

            {/* Hint: take photos to unlock stamps */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: C.yellow + "55", border: `1.5px solid ${C.yellow}`, borderRadius: "12px", padding: "8px 12px", marginBottom: "12px" }}>
              <span style={{ fontSize: "18px" }}>📷</span>
              <p style={{ fontSize: "11px", fontWeight: 700, color: C.navy, lineHeight: 1.5 }}>
                每拍一张楼照片，自动解锁对应印章<br />
                <span style={{ color: C.royal }}>点下方「拍照」按钮打卡</span>
              </p>
              <button
                onClick={openCamera}
                style={{ marginLeft: "auto", padding: "4px 12px", backgroundColor: C.royal, border: `1.5px solid ${C.navy}`, borderRadius: "8px", boxShadow: `2px 2px 0 ${C.navy}`, color: C.white, fontSize: "11px", fontWeight: 900, cursor: "pointer", flexShrink: 0 }}
              >
                去拍照
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
              {stamps.map((stamp) => (
                <div
                  key={stamp.id}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}
                >
                  <div style={{
                    width: "60px", height: "60px", position: "relative",
                    backgroundColor: stamp.checked ? stamp.color + "18" : "#F8FAFC",
                    border: stamp.checked ? `2.5px solid ${stamp.color}` : `2.5px dashed ${C.pale}`,
                    borderRadius: "14px",
                    boxShadow: stamp.checked ? `3px 3px 0 ${stamp.color}` : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: "26px", opacity: stamp.checked ? 1 : 0.25 }}>{stamp.emoji}</span>
                    {stamp.checked && (
                      <div style={{ position: "absolute", bottom: "2px", right: "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: stamp.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <IconCheck size={10} color="white" />
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: stamp.checked ? 800 : 500, color: stamp.checked ? stamp.color : "#94A3B8", textAlign: "center" }}>
                    {stamp.name}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/route")}
              style={{
                width: "100%", marginTop: "16px", height: "50px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                backgroundColor: C.royal, border: `2.5px solid ${C.navy}`,
                borderRadius: "14px", boxShadow: `4px 4px 0 ${C.navy}`,
                color: C.white, fontSize: "15px", fontWeight: 900, cursor: "pointer",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
            >
              <IconSparkle size={18} color="white" />
              开始新路线探索
            </button>
          </>
        )}

        {/* ── FAVORITES TAB ── */}
        {activeTab === "favorites" && (
          <>
            {favorites.length === 0 ? (
              <ComicCard style={{ padding: "24px", textAlign: "center", backgroundColor: C.cream }}>
                <span style={{ fontSize: "40px", display: "block", marginBottom: "10px" }}>💫</span>
                <p style={{ fontSize: "14px", fontWeight: 800, color: C.navy }}>还没有收藏的路线</p>
                <p style={{ fontSize: "12px", fontWeight: 500, color: "#4B6898", marginTop: "4px", marginBottom: "14px" }}>去探索并收藏你喜欢的路线吧！</p>
                <button
                  onClick={() => navigate("/route")}
                  style={{ padding: "8px 20px", backgroundColor: C.royal, border: `2px solid ${C.navy}`, borderRadius: "10px", boxShadow: `2px 2px 0 ${C.navy}`, color: C.white, fontSize: "13px", fontWeight: 800, cursor: "pointer" }}
                >
                  去探索路线 →
                </button>
              </ComicCard>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {favorites.map((fav) => (
                  <ComicCard key={fav.id} style={{ padding: "14px", backgroundColor: fav.bg || C.pale }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "50px", height: "50px", backgroundColor: C.white, border: `2.5px solid ${C.navy}`, borderRadius: "14px", boxShadow: `2px 2px 0 ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>
                        {fav.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "14px", fontWeight: 900, color: C.navy }}>{fav.title}</span>
                          <span style={{ backgroundColor: typeColor[fav.type] || C.sky, border: `1.5px solid ${C.navy}`, borderRadius: "6px", padding: "0 6px", fontSize: "10px", fontWeight: 900, color: C.white }}>
                            {typeLabel[fav.type] || fav.type}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
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
                        <p style={{ fontSize: "10px", fontWeight: 600, color: "#4B6898", marginTop: "3px" }}>
                          {fav.stops.slice(0, 3).join(" → ")}{fav.stops.length > 3 ? "…" : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFavorite(fav.id)}
                        style={{ width: "32px", height: "32px", backgroundColor: C.white, border: `2px solid ${C.navy}`, borderRadius: "8px", boxShadow: `2px 2px 0 ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                      >
                        <IconHeart size={16} filled color={C.coral} />
                      </button>
                    </div>
                  </ComicCard>
                ))}

                <button
                  onClick={() => navigate("/route")}
                  style={{ width: "100%", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", backgroundColor: C.white, border: `2px solid ${C.navy}`, borderRadius: "12px", boxShadow: `2px 2px 0 ${C.navy}`, color: C.navy, fontSize: "13px", fontWeight: 800, cursor: "pointer" }}
                >
                  <IconSparkle size={16} />
                  探索更多路线
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav activeTab="Profile" />
    </PhoneShell>
  );
}
