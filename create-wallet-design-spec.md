# Create Wallet — Redesign Spec (3 options)

> ออกแบบใหม่ของหน้า "สร้างบัญชีทั่วไป" — แทนของเดิมที่เป็นฟอร์มยาว 1 หน้า
> Reference เดิม: `uploads/create_general_wallet_part1.png`, `_part2.png`
> Mockups: เปิด `mint_design/index.html` → section **v4 · Create Wallet · 3 design options**

---

## Pain points ของ old design (PO + UX สรุปร่วม)

| # | Pain | Impact |
|---|------|--------|
| 1 | ฟอร์มยาว — 5 sections ในหน้าเดียว ต้อง scroll ผ่าน 2-3 จอกว่าจะถึง "บันทึก" | First-time user ลังเล / abandon |
| 2 | Wallet type chips wrap เป็น 3 แถว 6 ตัวเลือก กินที่บน fold | ดูรกตา, hierarchy ไม่ชัด |
| 3 | ไอคอน vs สี แยกกัน 2 จุด (ไอคอน = ปุ่มใหญ่บน, สี = dropdown กลางฟอร์ม) → ไม่เห็น preview ตอนเลือก | User เลือกซ้ำหลายรอบ |
| 4 | AI Goal section อยู่ติดกับ form หลัก = ดู mandatory ทั้งที่ optional | User คิดว่าต้องตั้งเป้าหมาย → abandon |
| 5 | ปุ่มบันทึก fixed bg เขียวเข้ม + ไม่มี progress feedback | ไม่รู้สึกว่ามี "ขั้นตอน" |

---

## Design system constraints

- Tokens: `tokens.js` (MINT.primary400 = `#38B2AC`, wallet colors, n100-900)
- Font: Sarabun
- Cards: 16-radius, soft shadow `0 1px 2px / 0 2px 8px rgba(0,0,0,0.03)`
- CTA: full-width 50h, radius 14, primary400 + teal glow shadow
- iPhone frame: 390×844

---

## 3 Design options

### A · Wizard 3-step (Progressive Disclosure)

**Flow:** เลือกประเภท → ตั้งชื่อ+icon+สี (live preview) → ยอด + AI (optional)

**Key moves:**
- 6 wallet types เป็น **2×3 grid tiles** (มี icon + label + descriptor) → เห็นทุกตัวในจอเดียว
- Step 2 มี **LIVE PREVIEW card บนสุด** — เปลี่ยน icon/สี/ชื่อ เห็นผลทันทีในรูปแบบที่ออกจริง
- Color swatch single row (6 สี) ติดกับ icon strip — เลือกพร้อมกันใน thumb zone
- Step 3 ใช้ **hero amount field** (เหมือน add-transaction) + chip suggestions `฿ 0 · 5,000 · 10,000 · 50,000`
- AI goal = **toggle card** (default off) → ผู้ใช้จะเปิดเมื่อพร้อม
- Progress bar 3 step + indicator `1/3` มุมขวาบน

**Best for:** First-time user / non-technical / ครอบครัวพ่อแม่

**Pros:**
- ลด cognitive load มากที่สุด — focus ทีละเรื่อง
- AI optional ชัดเจน 100% (อยู่ step สุดท้าย พร้อม toggle)
- Validation per-step → ป้องกัน error ตอน submit

**Cons:**
- ช้ากว่า single page สำหรับ power user (3 taps แทน scroll)
- ต้องเขียน Cubit state ที่ persist ข้าม step

---

### B · Smart Single Page (Preset-Driven) ⭐ Balance pick

**Flow:** เลือก preset (1 row scroll) → fill ชื่อ/icon/สี อัตโนมัติ → เปลี่ยน inline → save

**Key moves:**
- **Hero live preview card** บนสุด — gradient bg ตามสี preset, แสดงชื่อ+ยอด real-time
- Preset chips **horizontal scroll 1 row** (เทียบกับ 3 แถว wrap ของ old) — แต่ละ chip = icon+ชื่อ
- เลือก preset → auto-fill ชื่อ + icon + สี → user แก้ไขใน form ด้านล่างได้
- "ปรับแต่งเพิ่มเติม" = **collapsible** (default ปิด) — เก็บ color swatches + currency ไว้ข้างใน
- Initial balance = card ใหญ่ตัวเลขชัด (กลาง form)
- AI goal = opt-in card แยก ใต้ form (toggle เปิด → input ขยายลงมา)

**Best for:** Returning user / Mint power user / use case ส่วนใหญ่

**Pros:**
- 1 scroll = เห็นจบ ดีต่อ orientation
- Preset = "Path of least resistance" — first-time user ก็เลือก preset ได้
- ลด chips จาก 3 แถว → 1 แถว scroll (เห็นน้อยกว่าแต่ swipe ได้)
- Advanced section collapse = ไม่กิน space

**Cons:**
- ถ้ายัด field เยอะเข้าไป จะกลายเป็น old design ใหม่
- Live preview + form 2 ที่ → ต้องระวัง state sync

---

### C · Conversational Setup (AI chat)

**Flow:** AI ถามทีละขั้น → user ตอบด้วย chips/พิมพ์ → summary card → confirm

**Key moves:**
- Header = **Mint AI avatar + "Mint AI ช่วยคุณตั้งค่า"** (สอดคล้อง `v3-ai-chat.jsx`)
- AI bubble (white) vs User bubble (teal) — pattern เดียวกับ chat screen ที่มี
- ทุกคำถามมี **quick reply chips** (preset answers) → user ไม่ต้องพิมพ์
- มี "ข้าม" button มุมขวาบน → fallback ไปฟอร์มปกติสำหรับ power user
- Summary card ก่อนกด "สร้างกระเป๋า" → 3 inline edit (เปลี่ยนชื่อ/สี/ยอด)
- AI goal สอดอยู่ในบทสนทนาธรรมชาติ ("อยากให้ Mint ช่วยตั้งเป้าหมายไหม?")

**Best for:** Brand differentiation, "Mint AI-first" positioning

**Pros:**
- รู้สึก premium / มี personality — แตกต่างจาก finance app ทั่วไป
- เหมาะกับ first-time user มาก — เหมือนมี advisor นำทาง
- AI goal feel ธรรมชาติ ไม่ใช่ optional field

**Cons:**
- **ช้าที่สุด** สำหรับ returning user
- ต้องเขียน chat state machine (มี depth)
- Risk: ถ้า AI ลื่นไม่ดี = annoying
- การแก้ field กลับไปแก้ลำบาก (ต้อง scroll up chat → tap edit)

---

## เปรียบเทียบ (decision matrix)

| Criterion | A · Wizard | B · Smart Page | C · Chat |
|---|:---:|:---:|:---:|
| Speed (returning user) | ⚪ | ✅ | ⚪⚪ |
| First-time clarity | ✅ | ⚪ | ✅ |
| AI goal optional ชัดเจน | ✅✅ | ✅ | ✅ |
| Reduce vertical scroll | ✅ | ✅ | ⚪ |
| Brand differentiation | ⚪ | ⚪ | ✅✅ |
| Dev complexity (Cubit) | ⚪⚪ | ✅ | ⚪⚪⚪ |
| Match existing patterns | ✅ | ✅✅ | ⚪ (มี chat แต่ยังไม่ใช้ form) |

---

## คำแนะนำของ PO + UX

**Pick B (Smart Single Page)** — best balance ระหว่าง speed + clarity + match กับ pattern ที่มีอยู่
- เร็วพอสำหรับ daily user
- Preset = ตอบ pain "wallet type ดูรก" และ "icon/สี แยกกัน" ในตัวเดียว
- AI opt-in card = ตอบ pain "AI optional ไม่ชัด"
- Dev cost ต่ำ — reuse component pattern จาก v4-wallet-detail / add-transaction
- ถ้าอยาก "wow" → ค่อย iterate ไป C ภายหลัง โดย B เป็น baseline

**ทางเลือกที่ 2: A (Wizard)** ถ้า target user เป็น "พ่อแม่/ครอบครัว/non-tech" เน้น
**ทางเลือกที่ 3: C (Chat)** ถ้าทีม commit AI-first brand จริงจัง และมี budget ทำ chat state machine

---

## Next steps (หลัง user เลือก)

1. ลงรายละเอียดเพิ่ม (validation, error states, edit existing wallet)
2. Port → Flutter ด้วย `/jsx-to-flutter`
3. Wire กับ existing Cubit / use case ใน `lib/presentation/features/wallet/`

---

# Icon & Color Picker Redesign

> ใช้คู่กับ Create Wallet ด้านบน
> Mockups: section **"v4 — Icon & Color Picker Redesign"** (4 artboards)

## Pain points ของ picker เดิม

| # | Pain | Severity |
|---|------|----------|
| 1 | Standard + Essential Pack แสดง broken/placeholder icons | 🔴 trust killer |
| 2 | Icon + Color เปิด 2 bottom sheets แยก → user ต้อง toggle 2 รอบ | 🔴 friction |
| 3 | 3 tabs (ไอคอน / ของฉัน / แพ็คเกจ) สับสน — "ของฉัน" เกือบว่าง, "แพ็คเกจ" ปนกับ picker | 🔴 IA broken |
| 4 | Color picker 24 สี ไม่มี group + สีอ่อนเกินจน contrast แย่ | 🟡 a11y + scan time |
| 5 | Color ต้องกด "ยืนยัน" เพิ่ม 1 tap (inconsistent กับ icon) | 🟡 friction |
| 6 | ไม่มี search bar / "ใช้บ่อย" → scale ไม่ได้เมื่อมี pack เยอะ | 🟢 future-proof |
| 7 | Icon picker ไม่มี live preview ของ wallet ที่กำลังสร้าง | 🟡 trial-and-error |

## Key design moves (ของใหม่)

### 1. แยก 2 contexts ที่ needs ต่างกัน
| Context | จากที่ไหน | UI |
|---|---|---|
| **Picker** | Create/Edit Wallet | Bottom sheet ครบใน 1 แผ่น |
| **Library Manager** | More menu | Full screen page |

### 2. Unified Picker Sheet (artboard 01)
- **Live preview card** บนสุด — เปลี่ยน icon/สี เห็นผลทันทีพร้อมชื่อ + ยอด
- **Color row 8 สี** แนวนอน (paired tokens — เลือกสี = ic+bg เปลี่ยนคู่กัน)
- **Search bar** + **"ใช้บ่อย" pinned**
- Packs **expandable** (collapse เพื่อ scan)
- Icon grid 5 cols — gradient bg ตามสีที่เลือก
- Auto-tint icon grid ตามสีที่เลือก → preview ระดับ atomic

### 3. Library Manager Full Screen (artboard 02)
- Header เต็มจอ + "+" สร้าง custom
- Hero stats: "X packs · Y icons · Z custom"
- 3 sections continuous (ไม่มี tabs):
  - **แพ็คของฉัน** (active, badge "DEFAULT")
  - **ไอคอนของฉัน** (custom emoji/upload, grid + "+")
  - **คลังไอคอนเพิ่มเติม** (store — free / premium พร้อม price tag)
- Premium pack มี border + badge ✦ PREMIUM
- ลบ pack ทำผ่าน dots menu (ไม่ปนกับการเลือก)

### 4. Color Palette (artboard 03) — shared by Wallet + Category
| | OLD | NEW |
|---|---|---|
| จำนวน | 24 (สุ่ม) | **20** (5 ตระกูล × 4) |
| Group | ไม่มี | Paired tokens จัด 5 hue families |
| Use case | Wallet only | **Wallet + Category** |
| Match tokens.js | ❌ | ✅ (8 ตัวเดิม + 12 ตัวใหม่ต้อง register) |
| Contrast | บางสีต่ำมาก | ทั้งหมด WCAG AA |
| Confirm tap | 2 | 1 (auto-apply) |
| Preview | static | dynamic (icon บน bg ทุก swatch) |

### 20 paired tokens · 5 hue families

```
มินต์ & เขียว      มินต์ · เขียว · เซจ · มะนาว
ฟ้า & น้ำเงิน      เทอร์ควอยซ์ · ฟ้า · คราม · กรม
ม่วง & ชมพู         ม่วง · ลาเวนเดอร์ · ชมพู · กุหลาบ
ส้ม & แดง          ส้มแดง · แดง · ส้ม · พีช
เหลือง & น้ำตาล    เหลือง · มัสตาร์ด · น้ำตาล · ทราย
```

**Tokens.js TODO:** 12 สีใหม่ต้องเพิ่ม (walletSage, walletLime, walletTurquoise, walletIndigo, walletNavy, walletLavender, walletRose, walletScarlet, walletOrange, walletPeach, walletMustard, walletSand) — แต่ละตัวมี base + 100 (light tint)

**Why 20 (ไม่ใช่ 8):**
- Category ของ finance app มักมี 16-30 หมวด → 8 สีไม่พอ user งงว่าหมวดไหนคือหมวดไหน
- Wallet ใช้สีไม่กี่ใบอยู่แล้ว → user เลือกจากตระกูลที่ชอบ ไม่ overwhelm
- จัด 5 group ตามตระกูลสี (Gestalt grouping) → scan หาเร็ว · ไม่รู้สึก "มั่ว"

## Priority backlog

| # | Task | Effort | Impact | Ship gate |
|---|---|---|---|---|
| 1 | ซ่อน/แก้ broken icons ใน Standard + Essential pack | S | 🔴 | **before next release** |
| 2 | Implement Unified Picker (รวม icon + color) | M | 🔴 | with Create Wallet redesign |
| 3 | ลด Color จาก 24 → 8 paired + ตัดปุ่ม "ยืนยัน" | S | 🟡 | quick win |
| 4 | สร้าง Library Manager page ใน More menu | M | 🟢 | next sprint |
| 5 | เพิ่ม search bar + "ใช้บ่อย" section | M | 🟢 | with pack growth |

## ข้อสังเกต (PO note)

- **อย่า ship Premium pack จนกว่าจะแก้ broken icons** — user เห็นของฟรียังไม่เสร็จ จะไม่กล้าซื้อ
- Custom emoji เป็น differentiation ที่ดี (เหมือน Notion) — feature นี้ควรโปรโมตตอน onboarding
- ในอนาคต: AI generate icon (sparkles ✦ button ใน custom section) เป็นจุดต่อยอด Mint AI brand

