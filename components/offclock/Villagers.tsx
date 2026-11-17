// Original villagers: the host who greets you inside each house of the
// /off-the-clock village. Decorative (callers mark them aria-hidden).

const WOOD = "#7a5230";
const WOOD_D = "#5a3a20";

type Item = "basket" | "flowers" | "book" | "bread" | "balloon" | "rod" | "can" | "broom";
type Hat = "straw" | "cap" | "bun" | "scarf" | "none";

export type VillagerLook = {
  shirt: string;
  pants: string;
  skin: string;
  hair: string;
  hat?: Hat;
  item?: Item;
  /** a skirt instead of trousers */
  skirt?: boolean;
  /** child-sized */
  small?: boolean;
};

/** One villager, drawn front-on. Stands on the bottom edge of its box. */
export function Villager({ look, height = 108 }: { look: VillagerLook; height?: number }) {
  const { shirt, pants, skin, hair, hat = "none", item, skirt } = look;
  const h = look.small ? height * 0.72 : height;
  return (
    <svg viewBox="-14 -34 68 110" width={(h * 68) / 110} height={h} aria-hidden className="block overflow-visible">
      {/* things held up high */}
      {item === "balloon" && (
        <g className="balloon-drift">
          <path d="M38 34 Q44 10 40 -8" fill="none" stroke="#5c4a36" strokeWidth={1} />
          <ellipse cx={40} cy={-20} rx={10} ry={12} fill="#e8403f" />
          <ellipse cx={37} cy={-24} rx={3} ry={4} fill="#ffffff" opacity={0.5} />
        </g>
      )}
      {item === "rod" && <path d="M38 36 L60 -20 M60 -20 q4 30 2 52" fill="none" stroke={WOOD_D} strokeWidth={2} strokeLinecap="round" />}
      {item === "broom" && (
        <g>
          <path d="M40 16 L44 66" stroke={WOOD} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M39 64 h11 l2 10 h-15 Z" fill="#d2ad3c" />
        </g>
      )}
      {/* legs */}
      {skirt ? (
        <>
          <rect x={13} y={58} width={5} height={10} fill={skin} />
          <rect x={22} y={58} width={5} height={10} fill={skin} />
          <path d="M8 44 h24 l4 18 h-32 Z" fill={pants} />
        </>
      ) : (
        <>
          <rect x={10} y={46} width={9} height={22} rx={2} fill={pants} />
          <rect x={21} y={46} width={9} height={22} rx={2} fill={pants} />
        </>
      )}
      <rect x={9} y={66} width={10} height={6} rx={2.5} fill="#3a2a1c" />
      <rect x={21} y={66} width={10} height={6} rx={2.5} fill="#3a2a1c" />
      {/* arms and body */}
      <rect x={1} y={25} width={8} height={22} rx={4} fill={shirt} />
      <rect x={31} y={25} width={8} height={22} rx={4} fill={shirt} />
      <circle cx={5} cy={48} r={4} fill={skin} />
      <circle cx={35} cy={48} r={4} fill={skin} />
      <rect x={8} y={23} width={24} height={26} rx={5} fill={shirt} />
      <rect x={8} y={23} width={24} height={5} rx={2.5} fill="rgba(255,255,255,0.25)" />
      {hat === "scarf" && <rect x={9} y={21} width={22} height={6} rx={3} fill="#e8403f" />}
      {/* head */}
      <rect x={9} y={0} width={22} height={22} rx={8} fill={skin} />
      <circle cx={16} cy={11} r={1.6} fill="#2a1c12" />
      <circle cx={24} cy={11} r={1.6} fill="#2a1c12" />
      <path d="M16 16 q4 3.5 8 0" fill="none" stroke="#2a1c12" strokeWidth={1.4} strokeLinecap="round" />
      <circle cx={13} cy={15} r={2} fill="#f08a8a" opacity={0.5} />
      <circle cx={27} cy={15} r={2} fill="#f08a8a" opacity={0.5} />
      {/* hair and hats */}
      {hat !== "straw" && hat !== "cap" && <path d="M8 9 q0 -11 12 -11 q12 0 12 11 q-4 -6 -12 -6 q-8 0 -12 6 Z" fill={hair} />}
      {hat === "bun" && <circle cx={20} cy={-5} r={6} fill={hair} />}
      {hat === "straw" && (
        <>
          <ellipse cx={20} cy={3} rx={19} ry={4.5} fill="#e9cf7a" />
          <path d="M9 3 q0 -11 11 -11 q11 0 11 11 Z" fill="#f3dc8f" />
          <rect x={9} y={0} width={22} height={3} fill="#d01012" />
        </>
      )}
      {hat === "cap" && (
        <>
          <path d="M8 6 q0 -9 12 -9 q12 0 12 9 Z" fill="#2a78da" />
          <rect x={22} y={4} width={14} height={3.5} rx={1.7} fill="#1c5fb5" />
        </>
      )}
      {/* things held low */}
      {item === "basket" && (
        <g>
          <path d="M-4 50 q5 -9 10 0" fill="none" stroke={WOOD_D} strokeWidth={2} />
          <path d="M-6 50 h14 l-2 10 h-10 Z" fill="#c98f5a" stroke={WOOD_D} />
          <circle cx={-1} cy={50} r={3} fill="#e8403f" />
          <circle cx={4} cy={50} r={3} fill="#ffd500" />
        </g>
      )}
      {item === "flowers" && (
        <g>
          <path d="M35 48 L33 30 M35 48 L38 28 M35 48 L42 32" stroke="#1a5c32" strokeWidth={1.6} />
          <circle cx={33} cy={28} r={4} fill="#f2b5c4" />
          <circle cx={38} cy={25} r={4} fill="#e8403f" />
          <circle cx={43} cy={30} r={4} fill="#ffd500" />
        </g>
      )}
      {item === "book" && <rect x={30} y={40} width={12} height={15} rx={1.5} fill="#1e3a8a" stroke="#0f1f4d" />}
      {item === "bread" && <rect x={28} y={38} width={20} height={7} rx={3.5} fill="#d8a45c" stroke="#a8744f" transform="rotate(-28 38 42)" />}
      {item === "can" && (
        <g>
          <rect x={-8} y={46} width={12} height={10} rx={2} fill="#7cc4c0" stroke="#4f9a97" />
          <path d="M-8 49 l-8 -4" stroke="#4f9a97" strokeWidth={2.5} strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export const LOOKS = {
  florist: { shirt: "#f2b5c4", pants: "#7a5aa6", skin: "#f0c8a0", hair: "#5a3a20", hat: "bun", item: "flowers", skirt: true },
  baker: { shirt: "#ffffff", pants: "#6f7f8c", skin: "#c68f65", hair: "#2a1c12", hat: "cap", item: "bread" },
  reader: { shirt: "#2f6f6c", pants: "#3f4a57", skin: "#8a5a3c", hair: "#1c1c1c", item: "book" },
  farmer: { shirt: "#4f8a4a", pants: "#7a5230", skin: "#f0c8a0", hair: "#b8862b", hat: "straw", item: "basket" },
  kid: { shirt: "#ffd500", pants: "#0055bf", skin: "#e2b08a", hair: "#3a2a1c", item: "balloon", small: true },
  angler: { shirt: "#d98ba0", pants: "#3f4a57", skin: "#c68f65", hair: "#5a3a20", hat: "straw", item: "rod" },
  gardener: { shirt: "#9a7cc0", pants: "#4f8a4a", skin: "#8a5a3c", hair: "#1c1c1c", hat: "scarf", item: "can", skirt: true },
  sweeper: { shirt: "#e8403f", pants: "#3f4a57", skin: "#f0c8a0", hair: "#7d7568", item: "broom" },
  runner: { shirt: "#2a78da", pants: "#1c1c1c", skin: "#e2b08a", hair: "#3a2a1c", hat: "cap" },
} satisfies Record<string, VillagerLook>;
