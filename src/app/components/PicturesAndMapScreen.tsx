import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import campusMapImage from "../../../campus-map.jpg";
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

const campusMapHotspots = [
  { id: "ls", label: "LS", fullName: "Life Sciences", x: 32, y: 22, color: "#2d8f47" },
  { id: "fb", label: "FB", fullName: "Foundation Building", x: 41, y: 42, color: "#5ba3d4" },
  { id: "cb", label: "CB", fullName: "Central Building", x: 42, y: 56, color: "#17316f" },
  { id: "sa", label: "SA", fullName: "Science Building A", x: 54, y: 51, color: "#6abf69" },
  { id: "sb", label: "SB", fullName: "Science Building B", x: 54, y: 55, color: "#6abf69" },
  { id: "sc", label: "SC", fullName: "Science Building C", x: 54, y: 59, color: "#6abf69" },
  { id: "sd", label: "SD", fullName: "Science Building D", x: 54, y: 63, color: "#6abf69" },
  { id: "pb", label: "PB", fullName: "Public Building", x: 61, y: 53, color: "#e8a23a" },
  { id: "ma", label: "MA", fullName: "Mathematics Building A", x: 67, y: 53, color: "#7e57c2" },
  { id: "mb", label: "MB", fullName: "Mathematics Building B", x: 67, y: 57, color: "#7e57c2" },
  { id: "ee", label: "EE", fullName: "Electrical & Electronic", x: 61, y: 63, color: "#26a69a" },
  { id: "eb", label: "EB", fullName: "Engineering Building", x: 68, y: 61, color: "#3d8f5a" },
  { id: "ir", label: "IR", fullName: "International Research Centre", x: 54, y: 73, color: "#c62828" },
  { id: "ia", label: "IA", fullName: "International Academic Exchange", x: 63, y: 75, color: "#ef6c2a" },
  { id: "hs", label: "HS", fullName: "Humanities & Social Sciences", x: 63, y: 83, color: "#8d6e63" },
  { id: "es", label: "ES", fullName: "Emerging Sciences", x: 53, y: 92, color: "#d84315" },
  { id: "db", label: "DB", fullName: "Design Building", x: 65, y: 90, color: "#795548" },
  { id: "bs", label: "BS", fullName: "International Business School", x: 51, y: 83, color: "#c62828" },
  { id: "as", label: "AS", fullName: "Film & Creative Technology", x: 45, y: 71, color: "#f9a825" },
  { id: "gym", label: "GYM", fullName: "Gymnasium", x: 73, y: 75, color: "#263238" },
];

interface CampusLocationInfo {
  type: string;
  title: string;
  subtitle: string;
  desc: string;
  story: string;
  tags: string[];
  bestFor: string;
  time: string;
  access: string;
}

const campusLocationInfo: Record<string, CampusLocationInfo> = {
  ls: {
    type: "📍 North campus",
    title: "Life Sciences Building",
    subtitle: "Life Sciences",
    desc: "A seven-storey hub for industry-integrated education, combining authentic industrial scenarios with immersive virtual teaching environments.",
    story: "The LS building is divided into the north building and the south building. LSS is the south building and LSN is the north building.",
    tags: ["Lab", "North Campus", "Science"],
    bestFor: "STEM labs · research visits",
    time: "5–8 min",
    access: "Verify lifts and ramps on site",
  },
  fb: {
    type: "📍 Central campus",
    title: "Foundation Building",
    subtitle: "Foundation Building",
    desc: "A core facility supporting undergraduate general education and foundational discipline teaching, and a major venue for EAP classes.",
    story: "FB offers many small classrooms and open discussion areas. The ground floor also houses a convenience store and a Subway.",
    tags: ["Teaching", "Core Courses", "Landmark"],
    bestFor: "New students · core courses",
    time: "5–10 min",
    access: "Verify lifts and ramps on site",
  },
  cb: {
    type: "📍 Landmark",
    title: "Central Building",
    subtitle: "Central Building",
    desc: "As the campus core functional zone, it brings together career development services, academic support, and student leisure.",
    story: "The library floors provide study desks, and the building includes key student services such as counselling, IT helpdesk, career center, and one-stop service.",
    tags: ["Iconic", "Campus Story", "Photo Spot"],
    bestFor: "All visitors · main story stop",
    time: "8–12 min",
    access: "Lifts and ramps—verify on site",
  },
  sa: {
    type: "📍 Science cluster",
    title: "Science Building A",
    subtitle: "Science A",
    desc: "Primarily accommodates the School of Science while providing laboratories, offices, and lecture theatres for multi-disciplinary use.",
    story: "For rooms on the first floor, the west entrance (facing CB) is more direct. The east entrance leads directly to elevators.",
    tags: ["Science", "Cluster A"],
    bestFor: "STEM classes",
    time: "5–8 min",
    access: "Verify on site",
  },
  sb: {
    type: "📍 Science cluster",
    title: "Science Building B",
    subtitle: "Science B",
    desc: "Primarily accommodates the School of Science while providing laboratories, offices, and lecture theatres for multi-disciplinary use.",
    story: "For first-floor rooms, the east entrance (facing North Foundation) is more direct. The west entrance leads to elevators.",
    tags: ["Science", "Cluster B"],
    bestFor: "Labs and seminars",
    time: "5–8 min",
    access: "Verify on site",
  },
  sc: {
    type: "📍 Science cluster",
    title: "Science Building C",
    subtitle: "Science C",
    desc: "Primarily accommodates the School of Science while providing laboratories, offices, and lecture theatres for multi-disciplinary use.",
    story: "For first-floor rooms, enter from the west side facing CB. The east entrance connects more directly to elevators.",
    tags: ["Science", "Cluster C"],
    bestFor: "Group work · study hops",
    time: "5–8 min",
    access: "Verify on site",
  },
  sd: {
    type: "📍 Science cluster",
    title: "Science Building D",
    subtitle: "Science D",
    desc: "Primarily accommodates the School of Science while providing laboratories, offices, and lecture theatres for multi-disciplinary use.",
    story: "For first-floor rooms, the east entrance (towards North Foundation) is usually easier. The west entrance leads to elevators.",
    tags: ["Science", "Cluster D"],
    bestFor: "Moving between clusters",
    time: "5–8 min",
    access: "Verify on site",
  },
  pb: {
    type: "📍 Public services",
    title: "Public Building",
    subtitle: "Public Building",
    desc: "Functions as a central academic facility featuring large-capacity lecture theatres, classrooms, offices, and meeting rooms.",
    story: "The entrance is located on the east side, adjacent to the shop.",
    tags: ["Public", "Events", "Services"],
    bestFor: "Guests · event info",
    time: "6–10 min",
    access: "Verify on site",
  },
  ma: {
    type: "📍 Mathematics",
    title: "Mathematics Building A",
    subtitle: "Mathematics A",
    desc: "Contains offices, classrooms, and lecture theatres, primarily supporting the School of Mathematics and Physics.",
    story: "MA and MB are interconnected, allowing access to the other building from every floor.",
    tags: ["Math", "Academic"],
    bestFor: "Math and statistics",
    time: "5–8 min",
    access: "Verify on site",
  },
  mb: {
    type: "📍 Mathematics",
    title: "Mathematics Building B",
    subtitle: "Mathematics B",
    desc: "Contains offices, classrooms, and lecture theatres, primarily supporting the School of Mathematics and Physics.",
    story: "MA and MB are interconnected, allowing access to the other building from every floor.",
    tags: ["Math", "Academic"],
    bestFor: "Seminars · office hours",
    time: "5–8 min",
    access: "Verify on site",
  },
  ee: {
    type: "📍 Engineering",
    title: "Electrical & Electronic Engineering",
    subtitle: "EEE Building",
    desc: "Features engineering laboratories, classrooms, and lecture halls, serving as a primary facility for the School of Advanced Technology.",
    story: "EE and EB are connected. Transit to the adjacent building is available on specific floors.",
    tags: ["EEE", "Lab", "Innovation"],
    bestFor: "Engineering visits · lab tours",
    time: "8–12 min",
    access: "Lab areas may need booking—verify",
  },
  eb: {
    type: "📍 Engineering",
    title: "Engineering Building",
    subtitle: "Engineering Building",
    desc: "Provides classrooms and lecture theatres alongside specialized studios for Civil Engineering and Industrial Design.",
    story: "EE and EB are connected. Transit to the adjacent building is available on specific floors.",
    tags: ["Engineering", "Project-based"],
    bestFor: "Project studios · workshops",
    time: "8–12 min",
    access: "Verify on site",
  },
  ir: {
    type: "📍 South Campus",
    title: "International Research Centre",
    subtitle: "International Research Centre",
    desc: "A functional building for scientific cooperation and international exchange, often used by research groups and visiting scholars.",
    story: "The entrance is located on the east-south side, near the right side of the underground passage.",
    tags: ["Research", "International"],
    bestFor: "Academic visits and activity discussions",
    time: "6–10 min",
    access: "All floors",
  },
  ia: {
    type: "📍 South Campus",
    title: "International Academic Exchange & Collaboration Centre",
    subtitle: "International Academic Exchange",
    desc: "An important venue for hosting conferences, receptions, and cross-cultural academic activities.",
    story: "The entrance is located on the west-south side, near the left side of the underground passage.",
    tags: ["Conference", "Bilingual", "Guests"],
    bestFor: "International visitor & conference reception",
    time: "6–10 min",
    access: "All floors",
  },
  hs: {
    type: "📍 South Campus",
    title: "Humanities & Social Sciences Building",
    subtitle: "Humanities & Social Sciences",
    desc: "A key humanities teaching area with seminar-style spaces and social science learning support.",
    story: "This area often hosts reading clubs and debate activities.",
    tags: ["Humanities", "Seminar", "Culture"],
    bestFor: "Humanities courses",
    time: "6–10 min",
    access: "All floors",
  },
  es: {
    type: "📍 South Campus",
    title: "Emerging & Interdisciplinary Sciences Building",
    subtitle: "Emerging & Interdisciplinary Science",
    desc: "An interdisciplinary exploration space emphasizing cross-disciplinary collaboration.",
    story: "The entrance is located on the east-north side.",
    tags: ["Interdisciplinary", "Future"],
    bestFor: "Environmental and interdisciplinary majors",
    time: "6–10 min",
    access: "All floors",
  },
  db: {
    type: "📍 South Campus",
    title: "Design Building",
    subtitle: "Design Building",
    desc: "Workshops, exhibition areas, and review spaces for design-major students.",
    story: "The entrance is on the west-north side, behind HS.",
    tags: ["Design", "Studio", "Exhibition"],
    bestFor: "Design majors & exhibitions",
    time: "8–14 min",
    access: "Studio areas follow department rules",
  },
  bs: {
    type: "📍 South Campus",
    title: "International Business School Suzhou",
    subtitle: "IBSS at XJTLU",
    desc: "A key building for business education and case teaching, connecting industry practice with international curricula.",
    story: "Main entrance is on the east side; north and south entries are also available.",
    tags: ["Business", "Case Study", "Career"],
    bestFor: "Business students & career exploration",
    time: "8–12 min",
    access: "All floors",
  },
  as: {
    type: "📍 South Campus",
    title: "Film & Creative Technology",
    subtitle: "Film and Creative Technology Building",
    desc: "A practical teaching space integrating film, creativity, and technology for media-related majors.",
    story: "The entrance is located on the east-south side, behind IR.",
    tags: ["Media", "Creative", "Studio"],
    bestFor: "Film, TV, and creative courses",
    time: "8–12 min",
    access: "Most floors open; some rooms may be closed",
  },
  gym: {
    type: "🎮 South Campus",
    title: "Gymnasium",
    subtitle: "GYM",
    desc: "A large indoor sports and event venue, supporting campus sports culture and collective activities.",
    story: "Entrances are available on both west and east sides.",
    tags: ["Sports", "Events", "Wellness"],
    bestFor: "Sports and event viewing",
    time: "20–40 min",
    access: "By appointment",
  },
};

type MapTab = "地图" | "实时定位";

export function PicturesAndMapScreen() {
  const navigate = useNavigate();
  const [cur, setCur] = useState(0);
  const [mapTab, setMapTab] = useState<MapTab>("地图");
  const [activeHotspotId, setActiveHotspotId] = useState("cb");
  const [locationStatus, setLocationStatus] = useState("点击“开始定位”获取实时位置");

  /* search state */
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Classroom | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const leafletHostRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const firstFixRef = useRef(false);

  const XJTLU_CENTER: [number, number] = [31.2718, 120.7415];

  const ensureLeafletMap = () => {
    if (leafletMapRef.current) return leafletMapRef.current;
    if (!leafletHostRef.current) return null;

    const map = L.map(leafletHostRef.current, { scrollWheelZoom: true }).setView(XJTLU_CENTER, 16);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker(XJTLU_CENTER).addTo(map).bindPopup("XJTLU 校园参考点");
    leafletMapRef.current = map;
    return map;
  };

  const stopTracking = (message = "已停止定位") => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    firstFixRef.current = false;
    setLocationStatus(message);
  };

  const updateUserPosition = (lat: number, lng: number, accuracy: number) => {
    const map = leafletMapRef.current;
    if (!map) return;

    const acc = Math.max(Number(accuracy) || 0, 5);
    if (userMarkerRef.current && accuracyCircleRef.current) {
      userMarkerRef.current.setLatLng([lat, lng]);
      accuracyCircleRef.current.setLatLng([lat, lng]);
      accuracyCircleRef.current.setRadius(acc);
    } else {
      userMarkerRef.current = L.circleMarker([lat, lng], {
        radius: 7,
        color: "#17316f",
        fillColor: "#5aa6ff",
        fillOpacity: 0.95,
        weight: 2,
      }).addTo(map);
      accuracyCircleRef.current = L.circle([lat, lng], {
        radius: acc,
        color: "#5aa6ff",
        fillColor: "#5aa6ff",
        fillOpacity: 0.12,
        weight: 1,
      }).addTo(map);
    }

    if (!firstFixRef.current) {
      map.setView([lat, lng], Math.max(map.getZoom(), 17));
      firstFixRef.current = true;
    } else {
      map.panTo([lat, lng], { animate: false });
    }
    setLocationStatus(`实时定位中，精度约 ${Math.round(acc)} 米`);
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setLocationStatus("当前浏览器不支持定位功能");
      return;
    }

    const map = ensureLeafletMap();
    if (!map) return;
    if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
    firstFixRef.current = false;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        updateUserPosition(latitude, longitude, accuracy);
      },
      (err) => {
        const status =
          err.code === 1
            ? "定位权限被拒绝，请在浏览器中允许定位"
            : err.code === 2
              ? "位置信号不可用，请稍后重试"
              : err.code === 3
                ? "定位超时，请在室外或网络更稳定环境重试"
                : "无法获取实时位置";
        setLocationStatus(status);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 25000 },
    );
    setLocationStatus("正在获取当前位置...");
  };

  useEffect(() => {
    if (mapTab === "实时定位") {
      const map = ensureLeafletMap();
      if (map) {
        window.setTimeout(() => map.invalidateSize(), 120);
      }
    } else {
      stopTracking("已切换回校园地图");
    }
  }, [mapTab]);

  useEffect(() => {
    return () => {
      stopTracking("已停止定位");
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const filtered = query.trim().length > 0
    ? classrooms.filter(
        (c) =>
          c.room.toLowerCase().includes(query.toLowerCase()) ||
          c.building.toLowerCase().includes(query.toLowerCase())
      )
    : classrooms.slice(0, 5);

  const prev = () => setCur((c) => (c - 1 + photos.length) % photos.length);
  const next = () => setCur((c) => (c + 1) % photos.length);
  const activeLocation = campusLocationInfo[activeHotspotId];

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

        <ComicCard style={{ overflow: "hidden", position: "relative", backgroundColor: C.ice, marginBottom: "18px", padding: "10px" }}>
          {mapTab === "地图" ? (
            <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `2px solid ${C.navy}`, boxShadow: `3px 3px 0 ${C.navy}`, backgroundColor: "#E8EEF6" }}>
              <img src={campusMapImage} alt="XJTLU 校园地图" style={{ width: "100%", height: "auto", display: "block" }} />
              {campusMapHotspots.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setActiveHotspotId(spot.id)}
                  aria-label={`${spot.fullName} ${spot.label}`}
                  style={{
                    position: "absolute",
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    transform: "translate(-50%, -50%)",
                    minWidth: "24px",
                    minHeight: "22px",
                    borderRadius: "7px",
                    border: activeHotspotId === spot.id ? `2px solid ${C.yellow}` : "2px solid rgba(255,255,255,0.95)",
                    backgroundColor: spot.color,
                    color: C.white,
                    fontSize: "9px",
                    fontWeight: 900,
                    padding: "0 5px",
                    lineHeight: 1,
                    cursor: "pointer",
                    boxShadow: activeHotspotId === spot.id ? `0 0 0 2px ${C.navy}, 0 6px 14px rgba(0,0,0,0.28)` : "0 4px 12px rgba(0,0,0,0.25)",
                  }}
                >
                  {spot.label}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div
                ref={leafletHostRef}
                style={{
                  width: "100%",
                  height: "220px",
                  borderRadius: "12px",
                  border: `2px solid ${C.navy}`,
                  boxShadow: `3px 3px 0 ${C.navy}`,
                  overflow: "hidden",
                }}
              />
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={startTracking}
                  style={{ flex: 1, height: "36px", borderRadius: "10px", border: `2px solid ${C.navy}`, backgroundColor: C.royal, color: C.white, fontSize: "12px", fontWeight: 800, boxShadow: `2px 2px 0 ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", cursor: "pointer" }}
                >
                  <IconNavigation size={14} color={C.white} />
                  开始定位
                </button>
                <button
                  type="button"
                  onClick={() => stopTracking("已停止定位")}
                  style={{ flex: 1, height: "36px", borderRadius: "10px", border: `2px solid ${C.navy}`, backgroundColor: C.white, color: C.navy, fontSize: "12px", fontWeight: 800, boxShadow: `2px 2px 0 ${C.navy}`, cursor: "pointer" }}
                >
                  停止定位
                </button>
              </div>
              <p style={{ marginTop: "8px", fontSize: "11px", fontWeight: 700, color: "#4B6898" }}>{locationStatus}</p>
            </div>
          )}

          {mapTab === "地图" ? (
            <div style={{ marginTop: "8px", padding: "10px", borderRadius: "10px", backgroundColor: C.white, border: `2px solid ${C.navy}`, boxShadow: `2px 2px 0 ${C.pale}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#4B6898" }}>{activeLocation?.type ?? "📍 Campus"}</span>
                <span style={{ backgroundColor: C.ice, border: `1.5px solid ${C.navy}`, borderRadius: "999px", padding: "2px 8px", fontSize: "10px", fontWeight: 800, color: C.navy }}>
                  {activeLocation?.time ?? "5–10 min"}
                </span>
              </div>
              <p style={{ marginTop: "5px", fontSize: "14px", fontWeight: 900, color: C.navy }}>
                {activeLocation?.title ?? "Campus Building"}
              </p>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#4B6898", marginTop: "2px" }}>
                {activeLocation?.subtitle ?? ""}
              </p>
              <p style={{ marginTop: "7px", fontSize: "11px", lineHeight: 1.45, color: C.navy }}>
                {activeLocation?.desc ?? ""}
              </p>
              <p style={{ marginTop: "6px", fontSize: "11px", lineHeight: 1.45, color: "#355087", fontWeight: 600 }}>
                {activeLocation?.story ?? ""}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                {(activeLocation?.tags ?? []).map((tag) => (
                  <span key={tag} style={{ backgroundColor: C.pale, border: `1.5px solid ${C.navy}`, borderRadius: "999px", padding: "1px 8px", fontSize: "10px", fontWeight: 800, color: C.navy }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: "8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                <div style={{ backgroundColor: C.cream, border: `1.5px solid ${C.pale}`, borderRadius: "8px", padding: "6px 8px" }}>
                  <p style={{ fontSize: "10px", color: "#4B6898", fontWeight: 700 }}>Best for</p>
                  <p style={{ fontSize: "11px", color: C.navy, fontWeight: 800, marginTop: "1px" }}>{activeLocation?.bestFor ?? "-"}</p>
                </div>
                <div style={{ backgroundColor: C.cream, border: `1.5px solid ${C.pale}`, borderRadius: "8px", padding: "6px 8px" }}>
                  <p style={{ fontSize: "10px", color: "#4B6898", fontWeight: 700 }}>Access</p>
                  <p style={{ fontSize: "11px", color: C.navy, fontWeight: 800, marginTop: "1px" }}>{activeLocation?.access ?? "-"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "10px", backgroundColor: C.white, border: `2px solid ${C.pale}` }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: `2px solid ${C.navy}`, backgroundColor: C.royal, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconPin size={12} color={C.white} />
              </div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: C.navy }}>
                地图数据来自 OpenStreetMap，定位需浏览器授权且建议在 HTTPS 环境使用。
              </p>
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
