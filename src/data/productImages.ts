export interface FlatVisualTheme {
  type: string;
  category: string;
  badge: string;
  accentColor: string;
  bgGradient: string; // CSS background style matching the artwork
  bgClass?: string;
  badgeBg: string;
  badgeText: string;
  svgDataUri: string;
}

// Helper to convert SVG markup to safe Data URI
function svgToUri(svgString: string): string {
  const cleaned = svgString.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleaned)}`;
}

// Flat Minimalist Vector Artworks with clean modern geometry and vibrant colors
export const FLAT_ILLUSTRATIONS = {
  // 1. Minuman Kaleng Dingin / Soda / Isotonik
  beverageCan: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <linearGradient id="canBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="50%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="canRim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f1f5f9"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>
      <!-- Water Droplets Splash -->
      <path d="M190,55 C185,45 180,50 185,60 C188,66 195,65 190,55 Z" fill="#6366f1" />
      <path d="M225,40 C220,30 215,35 220,45 C223,51 230,50 225,40 Z" fill="#818cf8" />
      <path d="M245,65 C240,55 235,60 240,70 C243,76 250,75 245,65 Z" fill="#6366f1" />
      <circle cx="145" cy="115" r="4.5" fill="#818cf8"/>
      <circle cx="260" cy="120" r="4.5" fill="#818cf8"/>

      <!-- Can Top Rim -->
      <ellipse cx="200" cy="100" rx="60" ry="20" fill="url(#canRim)" stroke="#0f172a" stroke-width="4"/>
      <ellipse cx="200" cy="98" rx="50" ry="14" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>
      
      <!-- Pull Tab -->
      <ellipse cx="200" cy="96" rx="18" ry="7" fill="#64748b"/>
      <path d="M195,96 L185,93 C180,91 180,101 185,99 L195,96" fill="#94a3b8" stroke="#334155" stroke-width="2"/>
      <circle cx="200" cy="96" r="3" fill="#0f172a"/>

      <!-- Can Main Cylinder Body -->
      <rect x="140" y="100" width="120" height="200" rx="28" fill="url(#canBody)" stroke="#0f172a" stroke-width="5"/>
      <ellipse cx="200" cy="100" rx="60" ry="18" fill="#475569" opacity="0.6"/>

      <!-- Dynamic Diagonal Graphic Strip on Can -->
      <path d="M140,170 Q170,185 200,165 T260,175 L260,230 Q230,215 200,235 T140,220 Z" fill="#ef4444" stroke="#991b1b" stroke-width="3"/>
      
      <!-- Minimalist Reflections -->
      <path d="M152,115 L152,280" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.3"/>
      <path d="M160,120 L160,270" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.15"/>
      
      <!-- Condensed Dew Drops -->
      <ellipse cx="170" cy="140" rx="3.5" ry="5.5" fill="#818cf8" opacity="0.8"/>
      <ellipse cx="230" cy="250" rx="3.5" ry="5.5" fill="#818cf8" opacity="0.8"/>
    </svg>
  `),

  // 2. Mie Instan / Noodle Bowl dengan Sumpit & Telur
  noodleBowl: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Chopsticks lifting noodles -->
      <line x1="170" y1="85" x2="310" y2="73" stroke="#991b1b" stroke-width="7" stroke-linecap="round"/>
      <line x1="170" y1="97" x2="310" y2="83" stroke="#7f1d1d" stroke-width="6" stroke-linecap="round"/>

      <!-- Hanging Wavy Noodles -->
      <path d="M185,90 Q175,125 195,150 T180,195" fill="none" stroke="#fbbf24" stroke-width="12" stroke-linecap="round"/>
      <path d="M198,90 Q208,120 190,155 T202,200" fill="none" stroke="#f59e0b" stroke-width="10" stroke-linecap="round"/>
      <path d="M210,90 Q220,130 205,165 T218,200" fill="none" stroke="#fcd34d" stroke-width="8" stroke-linecap="round"/>

      <!-- Noodle mound inside bowl -->
      <ellipse cx="200" cy="205" rx="100" ry="35" fill="#f59e0b"/>
      
      <!-- Toppings: Meat, greens, boiled egg -->
      <circle cx="150" cy="190" r="18" fill="#78350f" stroke="#451a03" stroke-width="2"/>
      <ellipse cx="235" cy="180" rx="20" ry="14" fill="#16a34a" stroke="#14532d" stroke-width="2"/>
      
      <!-- Half Boiled Egg -->
      <ellipse cx="200" cy="188" rx="18" ry="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
      <ellipse cx="200" cy="190" rx="9" ry="8" fill="#ea580c"/>

      <!-- White Ceramic Rooster Bowl -->
      <path d="M100,205 C105,290 145,310 200,310 C255,310 295,290 300,205 Z" fill="#ffffff" stroke="#0f172a" stroke-width="5"/>
      <ellipse cx="200" cy="205" rx="100" ry="18" fill="#ffffff" stroke="#0f172a" stroke-width="5"/>
      <rect x="170" y="308" width="60" height="12" rx="4" fill="#e2e8f0" stroke="#0f172a" stroke-width="4"/>

      <!-- Rooster Motif Graphic -->
      <path d="M150,265 C145,245 155,235 160,250 C165,235 175,245 170,265 Z" fill="#15803d"/>
      <ellipse cx="195" cy="265" rx="18" ry="12" fill="#0f172a"/>
      <circle cx="185" cy="254" r="7" fill="#dc2626"/>
      <polygon points="178,255 172,257 178,260" fill="#f59e0b"/>
    </svg>
  `),

  // 3. Burger & Fast Food
  burger: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Top Bun with sesame seeds -->
      <path d="M100,180 C100,90 300,90 300,180 Z" fill="#f59e0b" stroke="#451a03" stroke-width="7" stroke-linejoin="round"/>
      <path d="M110,175 C115,115 285,115 290,175 Z" fill="#fbbf24" opacity="0.6"/>
      <circle cx="150" cy="135" r="5" fill="#fef3c7" opacity="0.9"/>
      <circle cx="180" cy="120" r="4.5" fill="#fef3c7" opacity="0.9"/>
      <circle cx="210" cy="130" r="5" fill="#fef3c7" opacity="0.9"/>
      <circle cx="240" cy="145" r="4" fill="#fef3c7" opacity="0.9"/>

      <!-- Crisp Lettuce -->
      <path d="M90,185 Q115,175 140,188 Q165,175 190,188 Q215,175 240,188 Q265,175 290,188 Q305,178 315,185 L315,200 Q200,205 90,200 Z" fill="#84cc16" stroke="#451a03" stroke-width="6"/>

      <!-- Tomato Layer -->
      <rect x="95" y="198" width="210" height="24" rx="10" fill="#dc2626" stroke="#451a03" stroke-width="6"/>

      <!-- Melted Cheese with Drip -->
      <path d="M100,225 L300,225 L285,245 L210,245 L190,275 L170,245 L105,245 Z" fill="#eab308" stroke="#451a03" stroke-width="6" stroke-linejoin="round"/>

      <!-- Beef Patty -->
      <rect x="90" y="222" width="220" height="30" rx="12" fill="#582a12" stroke="#451a03" stroke-width="7"/>

      <!-- Bottom Bun -->
      <path d="M100,255 C100,255 100,305 200,305 C300,305 300,255 300,255 Z" fill="#f59e0b" stroke="#451a03" stroke-width="7" stroke-linejoin="round"/>
    </svg>
  `),

  // 4. Kopi Panas / Espresso Latte Art Mug
  coffee: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Steam -->
      <path d="M175,85 Q165,60 180,40 T175,20" fill="none" stroke="#d97706" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
      <path d="M200,80 Q190,55 205,35 T200,15" fill="none" stroke="#d97706" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
      <path d="M225,85 Q215,60 230,40 T225,20" fill="none" stroke="#d97706" stroke-width="4" stroke-linecap="round" opacity="0.6"/>

      <!-- Mug Body -->
      <path d="M130,120 L145,280 C150,310 250,310 255,280 L270,120 Z" fill="#1e1b4b" stroke="#312e81" stroke-width="6"/>
      <ellipse cx="200" cy="120" rx="70" ry="18" fill="#4338ca" stroke="#312e81" stroke-width="5"/>
      <ellipse cx="200" cy="120" rx="58" ry="13" fill="#451a03"/>
      
      <!-- Latte Art Heart -->
      <path d="M190,118 C185,112 178,114 185,123 L200,128 L215,123 C222,114 215,112 210,118 Z" fill="#fef3c7"/>

      <!-- Handle -->
      <path d="M265,150 C315,155 315,235 255,245" fill="none" stroke="#1e1b4b" stroke-width="16" stroke-linecap="round"/>
      <path d="M265,150 C315,155 315,235 255,245" fill="none" stroke="#4338ca" stroke-width="8" stroke-linecap="round"/>

      <!-- Coffee Bean Icon -->
      <circle cx="200" cy="210" r="28" fill="#312e81"/>
      <ellipse cx="200" cy="210" rx="16" ry="11" fill="#78350f" transform="rotate(-25 200 210)"/>
      <path d="M192,203 Q200,210 208,217" stroke="#451a03" stroke-width="3" fill="none"/>
    </svg>
  `),

  // 4b. Kopi Sachet / Renceng Pouch
  coffeeSachet: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <linearGradient id="coffeeSachetBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#78350f"/>
          <stop offset="50%" stop-color="#451a03"/>
          <stop offset="100%" stop-color="#1c0a00"/>
        </linearGradient>
      </defs>
      <!-- Sachet Pouch Contour -->
      <rect x="130" y="90" width="140" height="220" rx="10" fill="url(#coffeeSachetBg)" stroke="#1c0a00" stroke-width="6"/>
      <path d="M125,85 L275,85 L275,98 L125,98 Z" fill="#b45309" stroke="#1c0a00" stroke-width="3"/>
      <path d="M125,302 L275,302 L275,315 L125,315 Z" fill="#b45309" stroke="#1c0a00" stroke-width="3"/>
      
      <!-- Coffee Bean Badge -->
      <circle cx="200" cy="180" r="36" fill="#fef08a" stroke="#d97706" stroke-width="4"/>
      <ellipse cx="200" cy="180" rx="20" ry="14" fill="#451a03" transform="rotate(-25 200 180)"/>
      <path d="M192,173 Q200,180 208,187" stroke="#fef08a" stroke-width="3" fill="none"/>
      
      <text x="200" y="245" font-family="'Outfit', sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">KOPI SACHET</text>
      <text x="200" y="265" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="10" fill="#fde68a" text-anchor="middle">3 IN 1 INSTAN</text>
    </svg>
  `),

  // 5. Susu Segar Kotak / Kental Manis
  milk: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Milk Carton 3D Geometry -->
      <polygon points="150,110 200,60 250,110 200,130" fill="#60a5fa" stroke="#1e3a8a" stroke-width="5"/>
      <polygon points="250,110 200,60 270,75 300,120" fill="#3b82f6" stroke="#1e3a8a" stroke-width="5"/>

      <!-- Main Front -->
      <rect x="150" y="125" width="100" height="175" rx="6" fill="#ffffff" stroke="#1e3a8a" stroke-width="6"/>
      <polygon points="250,125 300,115 300,270 250,300" fill="#dbeafe" stroke="#1e3a8a" stroke-width="6"/>

      <!-- Cow Spots -->
      <path d="M165,170 Q180,160 190,175 Q185,195 165,190 Z" fill="#1e3a8a"/>
      <path d="M210,210 Q235,195 240,225 Q220,240 210,210 Z" fill="#1e3a8a"/>
      <path d="M160,250 Q180,240 185,265 Q170,280 160,250 Z" fill="#1e3a8a"/>

      <rect x="160" y="138" width="80" height="24" rx="4" fill="#2563eb"/>
      <text x="200" y="155" font-family="'Outfit', sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">SUSU MURNI</text>

      <!-- Milk Droplets -->
      <circle cx="120" cy="270" r="7" fill="#ffffff" stroke="#93c5fd" stroke-width="2"/>
      <circle cx="280" cy="290" r="6" fill="#ffffff" stroke="#93c5fd" stroke-width="2"/>
    </svg>
  `),

  // 6. Air Mineral / Botol Air Segar (Aqua, Le Minerale, Cleo)
  mineralWater: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Mountain Peak Line in Background -->
      <polygon points="120,180 180,110 220,150 260,95 310,180" fill="#bae6fd" opacity="0.7"/>
      <polygon points="170,122 180,110 195,128 185,133" fill="#ffffff"/>
      <polygon points="250,110 260,95 275,116 265,120" fill="#ffffff"/>

      <!-- Water Bottle -->
      <rect x="155" y="130" width="90" height="180" rx="20" fill="#e0f2fe" stroke="#0284c7" stroke-width="5"/>
      <rect x="180" y="85" width="40" height="45" rx="6" fill="#0284c7" stroke="#0369a1" stroke-width="3"/>
      <!-- Bottle Cap -->
      <rect x="175" y="65" width="50" height="22" rx="5" fill="#0284c7" stroke="#0369a1" stroke-width="4"/>

      <!-- Water Level Gradient -->
      <rect x="162" y="150" width="76" height="150" rx="14" fill="#38bdf8" opacity="0.6"/>

      <!-- Water Waves & Droplets -->
      <path d="M162,170 Q180,160 200,170 T238,170" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
      <circle cx="200" cy="220" r="16" fill="#ffffff" opacity="0.9"/>
      <path d="M200,208 C192,218 190,228 200,234 C210,228 208,218 200,208 Z" fill="#0284c7"/>

      <circle cx="120" cy="280" r="6" fill="#38bdf8"/>
      <circle cx="280" cy="270" r="8" fill="#38bdf8"/>
    </svg>
  `),

  // 7. Teh Segar / Botol Teh Kemasan (Teh Botol, Teh Pucuk, Nu Green Tea)
  teaDrink: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Fresh Tea Leaves in Aura -->
      <path d="M130,110 C110,80 150,60 165,85 C150,95 140,110 130,110 Z" fill="#15803d"/>
      <path d="M270,105 C290,75 250,55 235,80 C250,90 260,105 270,105 Z" fill="#15803d"/>

      <!-- Tea Bottle Silhouette -->
      <path d="M160,120 C160,95 180,95 180,80 L220,80 C220,95 240,95 240,120 L250,290 C250,310 150,310 150,290 Z" fill="#d97706" stroke="#451a03" stroke-width="6"/>
      <!-- Bottle Cap -->
      <rect x="180" y="60" width="40" height="20" rx="4" fill="#dc2626" stroke="#451a03" stroke-width="4"/>

      <!-- Amber Tea Liquid Highlighting -->
      <path d="M160,135 L240,135 L242,285 C242,300 158,300 158,285 Z" fill="#b45309"/>
      
      <!-- Leaf Label Graphic on Bottle -->
      <ellipse cx="200" cy="205" rx="32" ry="32" fill="#fef3c7" stroke="#451a03" stroke-width="3"/>
      <path d="M200,185 C185,195 185,215 200,225 C215,215 215,195 200,185 Z" fill="#16a34a"/>
      <line x1="200" y1="190" x2="200" y2="220" stroke="#ffffff" stroke-width="2"/>

      <text x="200" y="260" font-family="'Outfit', sans-serif" font-weight="900" font-size="12" fill="#ffffff" text-anchor="middle">TEH MELATI</text>
    </svg>
  `),

  // 8. Keripik Kentang / Snack Gurih Renyah (Chitato, Lay's, Taro, Qtela)
  chipsSnack: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Floating Crispy Potato Chip in Top Right -->
      <g transform="rotate(25 280 120)">
        <ellipse cx="280" cy="120" rx="35" ry="22" fill="#facc15" stroke="#b45309" stroke-width="4"/>
        <path d="M260,118 Q280,128 300,118" stroke="#ca8a04" stroke-width="3" fill="none"/>
      </g>
      <circle cx="330" cy="95" r="4" fill="#eab308"/>
      <circle cx="310" cy="160" r="3" fill="#eab308"/>

      <!-- Foil Snack Pillow Pouch -->
      <path d="M125,100 L275,100 L260,310 L140,310 Z" fill="#dc2626" stroke="#451a03" stroke-width="6"/>
      <!-- Zigzag top/bottom seals -->
      <path d="M120,95 L280,95 L280,105 L120,105 Z" fill="#b91c1c" stroke="#451a03" stroke-width="3"/>
      <path d="M135,305 L265,305 L265,315 L135,315 Z" fill="#b91c1c" stroke="#451a03" stroke-width="3"/>

      <!-- Center Dynamic Graphic Splash -->
      <ellipse cx="200" cy="200" rx="45" ry="40" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
      <!-- Crinkled potato chip inside badge -->
      <ellipse cx="200" cy="200" rx="28" ry="18" fill="#f59e0b"/>
      <path d="M185,198 Q200,206 215,198" stroke="#78350f" stroke-width="3" fill="none"/>

      <text x="200" y="270" font-family="'Outfit', sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">CRUNCH CHIPS</text>
    </svg>
  `),

  // 9. Cokelat Batangan / Permen Manis (SilverQueen, Cadbury, KitKat)
  chocolateBar: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Tilted Chocolate Bar with Opened Golden Foil -->
      <g transform="rotate(-15 200 200)">
        <!-- Chocolate Blocks (Top Revealed) -->
        <rect x="130" y="90" width="140" height="90" rx="6" fill="#451a03" stroke="#1c0a00" stroke-width="6"/>
        <!-- Individual segments -->
        <rect x="140" y="100" width="55" height="35" rx="4" fill="#78350f"/>
        <rect x="205" y="100" width="55" height="35" rx="4" fill="#78350f"/>
        <rect x="140" y="140" width="55" height="35" rx="4" fill="#78350f"/>
        <rect x="205" y="140" width="55" height="35" rx="4" fill="#78350f"/>

        <!-- Cashew Nut on Chocolate -->
        <path d="M155,115 C150,110 165,105 175,112 C170,122 155,122 155,115 Z" fill="#fde68a"/>
        <path d="M225,155 C220,150 235,145 245,152 C240,162 225,162 225,155 Z" fill="#fde68a"/>

        <!-- Crinkled Silver/Gold Foil Wrap -->
        <polygon points="120,175 140,165 200,180 260,160 280,175 270,195 130,195" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>

        <!-- Red Wrapper Sleeve -->
        <rect x="120" y="185" width="160" height="120" rx="8" fill="#dc2626" stroke="#451a03" stroke-width="6"/>
        <text x="200" y="245" font-family="'Outfit', sans-serif" font-weight="900" font-size="16" fill="#ffffff" text-anchor="middle">CHOCO BAR</text>
        <text x="200" y="265" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="11" fill="#fef08a" text-anchor="middle">CASHEW NUT</text>
      </g>
    </svg>
  `),

  // 10. Kecap Manis & Saus Sambal / Bumbu Dapur (Bango, ABC, Sedap, Sasa)
  soySauceChili: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Red Chili Pepper in Background -->
      <path d="M120,130 Q100,80 150,85 Q130,120 120,130 Z" fill="#15803d"/>
      <path d="M120,130 Q90,200 130,240 Q105,190 120,130 Z" fill="#ef4444" stroke="#991b1b" stroke-width="4"/>

      <!-- Kecap Manis Bottle -->
      <path d="M170,110 L170,75 L230,75 L230,110 L250,150 L250,295 C250,310 150,310 150,295 L150,150 Z" fill="#18181b" stroke="#09090b" stroke-width="6"/>
      <rect x="175" y="55" width="50" height="22" rx="4" fill="#fbbf24" stroke="#09090b" stroke-width="4"/>

      <!-- Label -->
      <rect x="160" y="160" width="80" height="95" rx="10" fill="#15803d" stroke="#166534" stroke-width="3"/>
      <!-- Black Soybean Graphic -->
      <ellipse cx="200" cy="195" rx="16" ry="20" fill="#09090b" stroke="#facc15" stroke-width="2"/>
      <path d="M196,188 Q200,195 204,202" stroke="#facc15" stroke-width="2" fill="none"/>

      <text x="200" y="235" font-family="'Outfit', sans-serif" font-weight="900" font-size="12" fill="#ffffff" text-anchor="middle">KECAP MANIS</text>
    </svg>
  `),

  // 11. Biskuit & Wafer Crispy
  waferSnack: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Layered Crispy Wafer Block 1 -->
      <g transform="rotate(-15 180 200)">
        <rect x="110" y="130" width="160" height="70" rx="8" fill="#d97706" stroke="#451a03" stroke-width="6"/>
        <line x1="130" y1="130" x2="130" y2="200" stroke="#b45309" stroke-width="3"/>
        <line x1="160" y1="130" x2="160" y2="200" stroke="#b45309" stroke-width="3"/>
        <line x1="190" y1="130" x2="190" y2="200" stroke="#b45309" stroke-width="3"/>
        <line x1="220" y1="130" x2="220" y2="200" stroke="#b45309" stroke-width="3"/>
        <line x1="250" y1="130" x2="250" y2="200" stroke="#b45309" stroke-width="3"/>
        <line x1="110" y1="165" x2="270" y2="165" stroke="#451a03" stroke-width="8"/>
      </g>

      <!-- Layered Crispy Wafer Block 2 -->
      <g transform="rotate(20 220 230)">
        <rect x="130" y="190" width="160" height="70" rx="8" fill="#f59e0b" stroke="#451a03" stroke-width="6"/>
        <line x1="130" y1="225" x2="290" y2="225" stroke="#451a03" stroke-width="8"/>
      </g>

      <!-- Chocolate Splash and Sparkles -->
      <circle cx="95" cy="180" r="8" fill="#451a03"/>
      <circle cx="310" cy="140" r="7" fill="#451a03"/>
      <polygon points="120,90 125,100 135,105 125,110 120,120 115,110 105,105 115,100" fill="#fbbf24"/>
      <polygon points="280,80 284,90 294,94 284,98 280,108 276,98 266,94 276,90" fill="#fbbf24"/>
    </svg>
  `),

  // 12. Roti Tawar & Selai Strawberry
  breadToast: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Sliced Toast Bread Crust -->
      <path d="M120,120 C90,140 100,190 95,300 C95,315 305,315 305,300 C300,190 310,140 280,120 C250,100 220,130 200,110 C180,130 150,100 120,120 Z" fill="#b45309" stroke="#451a03" stroke-width="7"/>
      
      <!-- Inner White Soft Toast -->
      <path d="M132,135 C108,155 115,195 110,290 C110,298 290,298 290,290 C285,195 292,155 268,135 C242,118 218,142 200,126 C182,142 158,118 132,135 Z" fill="#fef3c7"/>

      <!-- Strawberry Jam Spread in Center -->
      <path d="M145,170 Q190,150 250,180 Q260,230 240,260 Q180,280 140,240 Z" fill="#e11d48" stroke="#9f1239" stroke-width="4"/>
      <rect x="180" y="195" width="40" height="28" rx="6" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    </svg>
  `),

  // 13. Es Krim Cone & Popsicle
  iceCream: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Waffle Cone -->
      <polygon points="140,200 260,200 200,350" fill="#d97706" stroke="#451a03" stroke-width="6"/>
      <line x1="160" y1="210" x2="225" y2="290" stroke="#92400e" stroke-width="3"/>
      <line x1="180" y1="200" x2="245" y2="250" stroke="#92400e" stroke-width="3"/>
      <line x1="240" y1="210" x2="175" y2="290" stroke="#92400e" stroke-width="3"/>

      <!-- Matcha Scoop -->
      <circle cx="200" cy="180" r="55" fill="#10b981" stroke="#065f46" stroke-width="5"/>

      <!-- Strawberry Swirl Top Scoop -->
      <circle cx="200" cy="125" r="45" fill="#f43f5e" stroke="#9f1239" stroke-width="5"/>
      <path d="M175,115 Q200,80 225,115" stroke="#ffffff" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.6"/>

      <!-- Cherry On Top -->
      <circle cx="200" cy="70" r="16" fill="#dc2626" stroke="#7f1d1d" stroke-width="3"/>
      <path d="M200,60 Q220,35 240,40" stroke="#15803d" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>
  `),

  // 14. Minyak Goreng Sawit Pouch Refill
  cookingOil: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Standing Pouch Contour -->
      <path d="M140,70 L260,70 L285,310 C285,325 115,325 115,310 Z" fill="#eab308" stroke="#451a03" stroke-width="6" stroke-linejoin="round"/>
      <path d="M130,120 Q200,90 270,120 L278,290 Q200,315 122,290 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
      <rect x="145" y="55" width="30" height="18" rx="4" fill="#dc2626" stroke="#451a03" stroke-width="4"/>

      <!-- Golden Oil Drop Badge -->
      <circle cx="200" cy="190" r="45" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
      <path d="M200,160 C185,185 180,205 200,215 C220,205 215,185 200,160 Z" fill="#ea580c" stroke="#9a3412" stroke-width="3"/>
      <path d="M175,215 Q200,230 225,215" stroke="#15803d" stroke-width="5" fill="none" stroke-linecap="round"/>

      <text x="200" y="265" font-family="'Outfit', sans-serif" font-weight="900" font-size="16" fill="#451a03" text-anchor="middle">MINYAK SAWIT</text>
      <text x="200" y="285" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="12" fill="#78350f" text-anchor="middle">POUCH 2 LITER</text>
    </svg>
  `),

  // 15. Sabun Mandi & Shampo Botol Pump
  shampooBodywash: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <circle cx="110" cy="100" r="20" fill="#e0e7ff" stroke="#6366f1" stroke-width="3" opacity="0.8"/>
      <circle cx="290" cy="90" r="16" fill="#e0e7ff" stroke="#6366f1" stroke-width="3" opacity="0.8"/>

      <!-- Pump Head -->
      <rect x="188" y="70" width="24" height="40" fill="#94a3b8" stroke="#0f172a" stroke-width="4"/>
      <path d="M150,70 L250,70 C250,55 230,55 200,55 C170,55 150,55 150,70 Z" fill="#64748b" stroke="#0f172a" stroke-width="4"/>

      <!-- Bottle Body -->
      <rect x="140" y="110" width="120" height="210" rx="30" fill="#4f46e5" stroke="#0f172a" stroke-width="6"/>
      <rect x="150" y="125" width="100" height="180" rx="20" fill="#6366f1" opacity="0.6"/>

      <!-- Botanicals Badge -->
      <circle cx="200" cy="200" r="32" fill="#ffffff"/>
      <path d="M200,180 C185,195 185,215 200,220 C215,215 215,195 200,180 Z" fill="#10b981"/>

      <text x="200" y="260" font-family="'Outfit', sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">SHAMPOO</text>
    </svg>
  `),

  // 16. Sabun Cuci Piring & Jeruk Nipis (Sunlight, Mama Lemon, Ekonomi)
  dishSoap: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Lime Citrus Slice -->
      <g transform="rotate(-15 130 140)">
        <circle cx="130" cy="140" r="40" fill="#84cc16" stroke="#365314" stroke-width="5"/>
        <circle cx="130" cy="140" r="32" fill="#d9f99d"/>
        <path d="M130,110 L130,170 M100,140 L160,140 M109,119 L151,161 M109,161 L151,119" stroke="#65a30d" stroke-width="3"/>
      </g>

      <!-- Dish Soap Pouch/Bottle -->
      <path d="M165,110 L235,110 L255,295 C255,310 145,310 145,295 Z" fill="#65a30d" stroke="#14532d" stroke-width="6"/>
      <rect x="180" y="75" width="40" height="35" rx="6" fill="#facc15" stroke="#14532d" stroke-width="4"/>

      <!-- White Dish Foam Bubbles -->
      <circle cx="200" cy="190" r="35" fill="#ffffff"/>
      <!-- Sparkling Plate Icon -->
      <ellipse cx="200" cy="190" rx="22" ry="14" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>
      <polygon points="215,170 218,178 226,181 218,184 215,192 212,184 204,181 212,178" fill="#38bdf8"/>

      <text x="200" y="260" font-family="'Outfit', sans-serif" font-weight="900" font-size="13" fill="#ffffff" text-anchor="middle">LIME DISHWASH</text>
    </svg>
  `),

  // 17. Sikat Gigi & Pasta Gigi Segar
  toothpaste: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <g transform="rotate(-30 180 220)">
        <polygon points="120,120 220,120 200,280 140,280" fill="#ef4444" stroke="#0f172a" stroke-width="6"/>
        <rect x="150" y="280" width="40" height="25" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="4"/>
        <rect x="140" y="160" width="60" height="60" rx="6" fill="#ffffff"/>
        <path d="M150,190 Q170,170 190,190" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round"/>
      </g>

      <g transform="rotate(35 250 200)">
        <rect x="230" y="60" width="22" height="260" rx="11" fill="#3b82f6" stroke="#0f172a" stroke-width="5"/>
        <rect x="225" y="45" width="32" height="40" rx="6" fill="#ffffff" stroke="#0f172a" stroke-width="4"/>
        <path d="M225,45 Q241,20 257,45" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/>
      </g>

      <polygon points="120,60 126,75 141,81 126,87 120,102 114,87 99,81 114,75" fill="#38bdf8"/>
    </svg>
  `),

  // 18. Skincare, Krim Wajah & Lotion (Glow & Lovely, Marina, Wardah)
  skincare: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect x="130" y="160" width="140" height="35" rx="8" fill="#f472b6" stroke="#831843" stroke-width="6"/>
      <rect x="120" y="195" width="160" height="110" rx="24" fill="#ffffff" stroke="#831843" stroke-width="6"/>
      <rect x="135" y="205" width="130" height="85" rx="16" fill="#fdf2f8"/>

      <polygon points="200,215 204,230 219,234 204,238 200,253 196,238 181,234 196,230" fill="#ec4899"/>
      <path d="M180,150 C175,130 225,130 220,150 Z" fill="#ffffff" stroke="#ec4899" stroke-width="4"/>

      <text x="200" y="280" font-family="'Outfit', sans-serif" font-weight="900" font-size="14" fill="#9d174d" text-anchor="middle">GLOW &amp; NOURISH</text>
    </svg>
  `),

  // 19. Bayi, Popok & Minyak Telon (My Baby, Zwitsal, MamyPoko)
  babyCare: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect x="150" y="110" width="100" height="210" rx="35" fill="#10b981" stroke="#064e3b" stroke-width="6"/>
      <rect x="175" y="75" width="50" height="35" rx="6" fill="#fbbf24" stroke="#064e3b" stroke-width="5"/>
      <rect x="162" y="140" width="76" height="145" rx="18" fill="#ffffff"/>
      
      <!-- Telon Leaf -->
      <path d="M200,165 C185,180 185,200 200,210 C215,200 215,180 200,165 Z" fill="#059669"/>
      <path d="M190,230 C185,225 180,230 185,236 L200,248 L215,236 C220,230 215,225 210,230 Z" fill="#ef4444"/>

      <text x="200" y="270" font-family="'Outfit', sans-serif" font-weight="900" font-size="11" fill="#065f46" text-anchor="middle">BABY CARE</text>
    </svg>
  `),

  // 20. Obat-obatan, Vitamin & Suplemen (Panadol, Tolak Angin, Bodrex, You C1000)
  pharmacyMeds: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Medicine Blister Foil Card -->
      <rect x="110" y="130" width="180" height="170" rx="16" fill="#f8fafc" stroke="#334155" stroke-width="6"/>
      
      <!-- 4 Capsule Blister Pills -->
      <!-- Pill 1: Red & White -->
      <g transform="rotate(-30 155 175)">
        <rect x="135" y="165" width="20" height="20" rx="6" fill="#ef4444"/>
        <rect x="155" y="165" width="20" height="20" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      </g>
      <!-- Pill 2: Blue & White -->
      <g transform="rotate(30 245 175)">
        <rect x="225" y="165" width="20" height="20" rx="6" fill="#3b82f6"/>
        <rect x="245" y="165" width="20" height="20" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      </g>
      <!-- Pill 3: Green & White -->
      <g transform="rotate(30 155 245)">
        <rect x="135" y="235" width="20" height="20" rx="6" fill="#10b981"/>
        <rect x="155" y="235" width="20" height="20" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      </g>
      <!-- Pill 4: Yellow & White -->
      <g transform="rotate(-30 245 245)">
        <rect x="225" y="235" width="20" height="20" rx="6" fill="#f59e0b"/>
        <rect x="245" y="235" width="20" height="20" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      </g>

      <!-- Medical Cross Badge in Center -->
      <circle cx="200" cy="85" r="30" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
      <rect x="194" y="70" width="12" height="30" rx="3" fill="#ffffff"/>
      <rect x="185" y="79" width="30" height="12" rx="3" fill="#ffffff"/>
    </svg>
  `),

  // 21. Tisu Basah & Tisu Wajah (Paseo, Tessa, Nice)
  tissueBox: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Fluffy Pulled Tissue Sheet (Top) -->
      <path d="M170,160 C160,80 230,80 220,160 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
      <path d="M190,160 C180,60 250,70 235,160 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>

      <!-- Pastel Tissue Box 3D Geometry -->
      <polygon points="120,180 180,140 280,140 220,180" fill="#a7f3d0" stroke="#065f46" stroke-width="5"/>
      <ellipse cx="200" cy="160" rx="35" ry="10" fill="#047857"/>

      <rect x="120" y="180" width="100" height="110" fill="#6ee7b7" stroke="#065f46" stroke-width="5"/>
      <polygon points="220,180 280,140 280,250 220,290" fill="#34d399" stroke="#065f46" stroke-width="5"/>

      <!-- Soft Cloud Flower Motif -->
      <circle cx="170" cy="235" r="14" fill="#ffffff" opacity="0.8"/>
      <text x="170" y="270" font-family="'Outfit', sans-serif" font-weight="900" font-size="11" fill="#064e3b" text-anchor="middle">SOFT TISSUE</text>
    </svg>
  `),

  // 22. Yogurt & Probiotik Segar (Yakult, Cimory, Heavenly Blush)
  yogurtDrink: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Probiotic Mini Bottle Shape -->
      <path d="M165,110 L165,90 L235,90 L235,110 C245,120 255,140 255,180 L250,290 C250,305 150,305 150,290 L145,180 C145,140 155,120 165,110 Z" fill="#fef2f2" stroke="#dc2626" stroke-width="6"/>
      <!-- Red Foil Lid -->
      <ellipse cx="200" cy="90" rx="38" ry="12" fill="#ef4444" stroke="#991b1b" stroke-width="3"/>

      <!-- Creamy Probiotic Swirl in Center -->
      <rect x="155" y="170" width="90" height="85" rx="12" fill="#fee2e2"/>
      <circle cx="200" cy="205" r="24" fill="#ffffff"/>
      <path d="M190,205 Q200,190 210,205" stroke="#ef4444" stroke-width="4" fill="none" stroke-linecap="round"/>

      <!-- Fresh Strawberries -->
      <circle cx="280" cy="160" r="15" fill="#e11d48"/>
      <polygon points="275,145 285,145 280,140" fill="#15803d"/>

      <text x="200" y="280" font-family="'Outfit', sans-serif" font-weight="900" font-size="13" fill="#991b1b" text-anchor="middle">PROBIOTIK</text>
    </svg>
  `),

  // 23. Baterai & Elektronik Kasir (Alkaline, ABC, Pulsa, PLN)
  batteryEnergy: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Positive Terminal Nib -->
      <rect x="180" y="70" width="40" height="25" rx="6" fill="#f59e0b" stroke="#78350f" stroke-width="4"/>

      <!-- Battery Cylindrical Body -->
      <rect x="140" y="95" width="120" height="215" rx="20" fill="#0f172a" stroke="#020617" stroke-width="6"/>
      <!-- Gold Top Collar -->
      <rect x="142" y="97" width="116" height="50" rx="14" fill="#f59e0b"/>

      <!-- Lightning Bolt Bolt Power Icon -->
      <polygon points="210,165 185,210 205,210 190,265 225,200 205,200" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>

      <text x="200" y="130" font-family="'Outfit', sans-serif" font-weight="900" font-size="14" fill="#78350f" text-anchor="middle">ALKALINE</text>
      <text x="200" y="295" font-family="'Outfit', sans-serif" font-weight="900" font-size="14" fill="#38bdf8" text-anchor="middle">POWER 100%</text>
    </svg>
  `),

  // 24. Santan & Kelapa Masak (Kara Santan, Bumbu Dapur)
  coconutMilk: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Coconut Shell Half -->
      <path d="M120,200 C120,280 280,280 280,200 Z" fill="#78350f" stroke="#451a03" stroke-width="6"/>
      <ellipse cx="200" cy="200" rx="80" ry="25" fill="#ffffff" stroke="#451a03" stroke-width="5"/>
      <ellipse cx="200" cy="200" rx="68" ry="18" fill="#f1f5f9"/>

      <!-- Coconut Palm Frond Leaf -->
      <path d="M110,140 Q150,110 200,120" stroke="#15803d" stroke-width="6" fill="none" stroke-linecap="round"/>
      <line x1="130" y1="125" x2="120" y2="105" stroke="#15803d" stroke-width="4" stroke-linecap="round"/>
      <line x1="160" y1="117" x2="155" y2="95" stroke="#15803d" stroke-width="4" stroke-linecap="round"/>
      <line x1="190" y1="118" x2="190" y2="95" stroke="#15803d" stroke-width="4" stroke-linecap="round"/>

      <!-- Splash Droplets of Rich Santan -->
      <circle cx="200" cy="160" r="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <circle cx="170" cy="145" r="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <circle cx="230" cy="140" r="7" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    </svg>
  `),

  // 25. Deterjen & Pembersih Rumah Karbol
  homeCleaner: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <path d="M130,160 L130,260 C100,260 100,160 130,160 Z" fill="#7c3aed" stroke="#2e1065" stroke-width="6"/>
      <path d="M140,110 L250,110 C275,110 285,140 285,285 C285,310 130,310 130,285 L130,150 Z" fill="#8b5cf6" stroke="#2e1065" stroke-width="6"/>
      <rect x="175" y="75" width="50" height="35" rx="8" fill="#10b981" stroke="#2e1065" stroke-width="5"/>

      <rect x="155" y="160" width="105" height="105" rx="16" fill="#ffffff"/>
      <polygon points="207,185 211,197 223,201 211,205 207,217 203,205 191,201 203,197" fill="#8b5cf6"/>

      <text x="207" y="250" font-family="'Outfit', sans-serif" font-weight="900" font-size="12" fill="#5b21b6" text-anchor="middle">PEMBERSIH</text>
    </svg>
  `),

  // 26. Beras / Sembako Karung
  stapleRice: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <path d="M140,140 C140,120 260,120 260,140 C285,200 290,300 270,320 C245,330 155,330 130,320 C110,300 115,200 140,140 Z" fill="#fde68a" stroke="#78350f" stroke-width="6"/>
      <ellipse cx="200" cy="140" rx="60" ry="12" fill="#d97706" stroke="#78350f" stroke-width="4"/>
      <path d="M150,140 C140,105 260,105 250,140 Z" fill="#fef3c7" stroke="#78350f" stroke-width="4"/>

      <circle cx="200" cy="230" r="40" fill="#ffffff" stroke="#b45309" stroke-width="4"/>
      <path d="M200,205 L200,255 M190,215 L200,225 L210,215 M188,230 L200,240 L212,230" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>

      <text x="200" y="295" font-family="'Outfit', sans-serif" font-weight="900" font-size="16" fill="#78350f" text-anchor="middle">BERAS SUPER</text>
    </svg>
  `),

  // 27. Default Keranjang Belanja Minimarket
  groceryCart: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <path d="M110,170 L290,170 L265,300 C260,315 140,315 135,300 Z" fill="#ef4444" stroke="#991b1b" stroke-width="6"/>
      <rect x="140" y="195" width="22" height="24" rx="4" fill="#b91c1c"/>
      <rect x="175" y="195" width="22" height="24" rx="4" fill="#b91c1c"/>
      <rect x="210" y="195" width="22" height="24" rx="4" fill="#b91c1c"/>
      <rect x="245" y="195" width="18" height="24" rx="4" fill="#b91c1c"/>

      <path d="M125,170 C125,70 275,70 275,170" fill="none" stroke="#e2e8f0" stroke-width="12" stroke-linecap="round"/>
      <path d="M175,70 L225,70" stroke="#1e293b" stroke-width="16" stroke-linecap="round"/>

      <circle cx="160" cy="150" r="22" fill="#22c55e" stroke="#15803d" stroke-width="4"/>
      <polygon points="210,165 245,90 265,100 230,175" fill="#f59e0b" stroke="#78350f" stroke-width="4"/>
    </svg>
  `),

  // 28. Buah-buahan Segar (Indomaret Fresh: Pisang Cavendish, Apel Fuji, Jeruk Segar)
  freshFruits: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <linearGradient id="bananaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="40%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#eab308"/>
        </linearGradient>
        <linearGradient id="appleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f87171"/>
          <stop offset="60%" stop-color="#dc2626"/>
          <stop offset="100%" stop-color="#991b1b"/>
        </linearGradient>
        <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fb923c"/>
          <stop offset="70%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#c2410c"/>
        </linearGradient>
      </defs>
      <!-- Fresh Green Leaves in Background -->
      <path d="M185,110 C165,70 215,60 215,60 C215,60 230,95 185,110 Z" fill="#16a34a" stroke="#14532d" stroke-width="3"/>
      <path d="M215,100 C235,65 265,80 265,80 C265,80 250,110 215,100 Z" fill="#22c55e" stroke="#14532d" stroke-width="3"/>

      <!-- Big Red Fuji Apple -->
      <circle cx="160" cy="220" r="65" fill="url(#appleGrad)" stroke="#7f1d1d" stroke-width="5"/>
      <ellipse cx="160" cy="160" rx="14" ry="7" fill="#7f1d1d"/>
      <path d="M160,160 Q155,130 170,120" fill="none" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
      <path d="M140,180 Q130,220 140,245" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.35"/>

      <!-- Sweet Orange -->
      <circle cx="250" cy="235" r="55" fill="url(#orangeGrad)" stroke="#7c2d12" stroke-width="5"/>
      <circle cx="250" cy="182" r="6" fill="#15803d"/>
      <circle cx="265" cy="210" r="2.5" fill="#c2410c"/>
      <circle cx="280" cy="230" r="2.5" fill="#c2410c"/>
      <circle cx="235" cy="250" r="2.5" fill="#c2410c"/>
      <path d="M230,200 Q220,230 230,255" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.4"/>

      <!-- Cavendish Banana Cluster Arc -->
      <path d="M110,240 Q170,330 270,300 C290,290 285,270 265,275 Q180,300 130,225 Z" fill="url(#bananaGrad)" stroke="#854d0e" stroke-width="5"/>
      <path d="M110,240 L100,230" stroke="#713f12" stroke-width="8" stroke-linecap="round"/>
      <path d="M265,275 L285,285" stroke="#713f12" stroke-width="7" stroke-linecap="round"/>

      <!-- Freshness Badge -->
      <rect x="125" y="325" width="150" height="28" rx="8" fill="#16a34a" stroke="#14532d" stroke-width="2"/>
      <text x="200" y="344" font-family="'Outfit', sans-serif" font-weight="900" font-size="12" fill="#ffffff" text-anchor="middle" letter-spacing="1">INDOMARET FRESH</text>
    </svg>
  `),

  // 29. Sayuran Segar (Indomaret Fresh: Wortel Berastagi, Brokoli Hijau, Tomat Merah, Cabai)
  freshVegetables: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <linearGradient id="carrotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fb923c"/>
          <stop offset="60%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#c2410c"/>
        </linearGradient>
        <linearGradient id="broccoliGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#4ade80"/>
          <stop offset="60%" stop-color="#16a34a"/>
          <stop offset="100%" stop-color="#14532d"/>
        </linearGradient>
      </defs>

      <!-- Crisp Carrot Greens Top -->
      <path d="M150,110 C130,70 160,50 160,50 C160,50 175,85 165,115 Z" fill="#22c55e" stroke="#14532d" stroke-width="3"/>
      <path d="M165,115 C175,75 205,65 205,65 C205,65 190,95 175,120 Z" fill="#15803d" stroke="#14532d" stroke-width="3"/>

      <!-- Crunchy Berastagi Carrot -->
      <path d="M140,120 Q190,130 180,120 L150,295 C148,305 142,305 140,295 Z" fill="url(#carrotGrad)" stroke="#7c2d12" stroke-width="5"/>
      <line x1="148" y1="160" x2="168" y2="162" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/>
      <line x1="145" y1="200" x2="162" y2="202" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/>
      <line x1="142" y1="245" x2="155" y2="246" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/>

      <!-- Fresh Green Broccoli Florets -->
      <rect x="235" y="210" width="30" height="70" rx="8" fill="#86efac" stroke="#14532d" stroke-width="4"/>
      <circle cx="230" cy="180" r="32" fill="url(#broccoliGrad)" stroke="#14532d" stroke-width="4"/>
      <circle cx="270" cy="180" r="30" fill="url(#broccoliGrad)" stroke="#14532d" stroke-width="4"/>
      <circle cx="250" cy="150" r="36" fill="url(#broccoliGrad)" stroke="#14532d" stroke-width="4"/>
      <circle cx="215" cy="160" r="22" fill="#15803d"/>
      <circle cx="280" cy="160" r="20" fill="#15803d"/>

      <!-- Juicy Red Tomato -->
      <circle cx="195" cy="250" r="42" fill="#ef4444" stroke="#991b1b" stroke-width="4"/>
      <!-- Tomato Star Calyx -->
      <polygon points="195,208 191,216 182,215 188,221 185,230 195,225 204,230 201,221 207,215 198,216" fill="#16a34a"/>
      <ellipse cx="180" cy="235" rx="5" ry="10" fill="#ffffff" opacity="0.45"/>

      <!-- Freshness Badge -->
      <rect x="125" y="325" width="150" height="28" rx="8" fill="#ea580c" stroke="#7c2d12" stroke-width="2"/>
      <text x="200" y="344" font-family="'Outfit', sans-serif" font-weight="900" font-size="12" fill="#ffffff" text-anchor="middle" letter-spacing="1">SAYUR SEGAR INDM</text>
    </svg>
  `),

  // 30. Rokok & Korek Kasir Minimarket
  tobaccoLighter: svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <!-- Lighter Flame -->
      <path d="M260,110 C240,80 260,50 260,35 C260,50 280,80 260,110 Z" fill="#f59e0b"/>
      <path d="M260,105 C250,85 260,65 260,55 C260,65 270,85 260,105 Z" fill="#ef4444"/>
      <circle cx="260" cy="100" r="4" fill="#38bdf8"/>

      <!-- Disposable Gas Lighter -->
      <rect x="240" y="110" width="40" height="30" rx="4" fill="#94a3b8" stroke="#334155" stroke-width="3"/>
      <rect x="242" y="140" width="36" height="150" rx="10" fill="#ef4444" stroke="#991b1b" stroke-width="4"/>
      <rect x="250" y="160" width="20" height="100" rx="6" fill="#f87171"/>

      <!-- Cigarette Pack Geometric Silhouette -->
      <rect x="120" y="130" width="105" height="170" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="5"/>
      <path d="M120,130 L225,130 L225,180 L120,180 Z" fill="#dc2626" stroke="#0f172a" stroke-width="3"/>
      <circle cx="172" cy="225" r="22" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
      <polygon points="172,210 176,220 186,224 176,228 172,238 168,228 158,224 168,220" fill="#dc2626"/>
      <text x="172" y="275" font-family="'Outfit', sans-serif" font-weight="900" font-size="11" fill="#0f172a" text-anchor="middle">RETAIL PACK</text>
    </svg>
  `)
};

// Detailed mapping with custom matching background themes (clean, high contrast, eyes-safe)
export function getProductFlatTheme(name: string, category?: string, packaging?: string): FlatVisualTheme {
  const lower = (name + ' ' + (category || '') + ' ' + (packaging || '')).toLowerCase();

  // 1. Mie Instan / Noodle / Ramen / Bihun / Spaghetti / Mie Ayam
  if (lower.includes('mie') || lower.includes('noodle') || lower.includes('ramen') || lower.includes('bihun') || lower.includes('spaghetti') || lower.includes('sedap') || lower.includes('indomie') || lower.includes('sarimi') || lower.includes('samyang')) {
    return {
      type: 'noodleBowl',
      category: 'Mie & Pasta',
      badge: 'Mie & Makanan Gurih',
      accentColor: '#ec4899',
      bgGradient: 'linear-gradient(145deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
      badgeBg: 'bg-pink-500/25 border-pink-400/40 text-pink-100',
      badgeText: 'Mie & Instant Food',
      svgDataUri: FLAT_ILLUSTRATIONS.noodleBowl
    };
  }

  // 2. Air Mineral / Air Putih / Galon (Aqua, Le Minerale, Cleo, Club, Pristine)
  if (lower.includes('aqua') || lower.includes('minerale') || lower.includes('cleo') || lower.includes('air mineral') || lower.includes('mineral water') || lower.includes('pristine') || lower.includes('club') || lower.includes('sanford') || lower.includes('le mineral')) {
    return {
      type: 'mineralWater',
      category: 'Air Mineral Segar',
      badge: 'Air Minum Murni',
      accentColor: '#0284c7',
      bgGradient: 'linear-gradient(145deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)',
      badgeBg: 'bg-sky-500/25 border-sky-400/40 text-sky-950',
      badgeText: 'Air Murni Alami',
      svgDataUri: FLAT_ILLUSTRATIONS.mineralWater
    };
  }

  // 3. Teh Kemasan / Botol Teh / Iced Tea (Teh Botol, Teh Pucuk, Nu Green Tea, Teh Kotak, Javana)
  if (lower.includes('teh') || lower.includes('tea') || lower.includes('pucuk') || lower.includes('javana') || lower.includes('sosro') || lower.includes('kotak teh') || lower.includes('green tea') || lower.includes('oolong')) {
    return {
      type: 'teaDrink',
      category: 'Minuman Teh Segar',
      badge: 'Teh Asli Alami',
      accentColor: '#16a34a',
      bgGradient: 'linear-gradient(145deg, #fef3c7 0%, #fde68a 50%, #d97706 100%)',
      badgeBg: 'bg-amber-500/25 border-amber-400/40 text-amber-950',
      badgeText: 'Seduhan Daun Teh',
      svgDataUri: FLAT_ILLUSTRATIONS.teaDrink
    };
  }

  // 4. Minuman Bersoda / Kaleng / Isotonik / Energy Drink (Pocari, Cola, Sprite, Kratingdaeng)
  if (lower.includes('cola') || lower.includes('soda') || lower.includes('fanta') || lower.includes('sprite') || lower.includes('pocari') || lower.includes('kaleng') || lower.includes('can') || lower.includes('mizone') || lower.includes('kratingdaeng') || lower.includes('red bull') || lower.includes('isotonik')) {
    return {
      type: 'beverageCan',
      category: 'Minuman Segar',
      badge: 'Minuman Dingin Kaleng',
      accentColor: '#6366f1',
      bgGradient: 'linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
      badgeBg: 'bg-indigo-500/25 border-indigo-400/40 text-indigo-950',
      badgeText: 'Minuman Dingin',
      svgDataUri: FLAT_ILLUSTRATIONS.beverageCan
    };
  }

  // 5. Kopi / Kopi Instan / Good Day / Kapal Api / Nescafe / Torabika
  if (lower.includes('kopi') || lower.includes('coffee') || lower.includes('good day') || lower.includes('torabika') || lower.includes('kapal api') || lower.includes('nescafe') || lower.includes('luwak') || lower.includes('latte') || lower.includes('cappuccino') || lower.includes('butterscotch') || lower.includes('espresso')) {
    const isSachetOrPouch = lower.includes('sachet') || lower.includes('pouch') || lower.includes('renceng') || lower.includes('sct') || lower.includes('bag') || lower.includes('sachet');
    return {
      type: isSachetOrPouch ? 'coffeeSachet' : 'coffee',
      category: 'Minuman Kopi',
      badge: isSachetOrPouch ? 'Kopi Sachet Instan' : 'Kopi & Caffeinated',
      accentColor: '#d97706',
      bgGradient: 'linear-gradient(145deg, #2b1d16 0%, #452414 50%, #1f140e 100%)',
      badgeBg: 'bg-amber-600/30 border-amber-400/40 text-amber-200',
      badgeText: isSachetOrPouch ? 'Kopi Sachet' : 'Kopi Nusantara',
      svgDataUri: isSachetOrPouch ? FLAT_ILLUSTRATIONS.coffeeSachet : FLAT_ILLUSTRATIONS.coffee
    };
  }

  // 6. Susu / Anlene / Indomilk / Dancow / Kental Manis / Ultra Milk / Bear Brand
  if (lower.includes('susu') || lower.includes('milk') || lower.includes('anlene') || lower.includes('indomilk') || lower.includes('dancow') || lower.includes('ultra') || lower.includes('frisian') || lower.includes('actifit') || lower.includes('skm') || lower.includes('bear brand')) {
    return {
      type: 'milk',
      category: 'Susu & Olahan Susu',
      badge: 'Susu Berkalsium',
      accentColor: '#3b82f6',
      bgGradient: 'linear-gradient(145deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)',
      badgeBg: 'bg-blue-500/25 border-blue-400/40 text-blue-950',
      badgeText: 'Nutrisi & Susu',
      svgDataUri: FLAT_ILLUSTRATIONS.milk
    };
  }

  // 7. Yogurt & Probiotik (Yakult, Cimory, Heavenly Blush, Biokul)
  if (lower.includes('yakult') || lower.includes('yogurt') || lower.includes('yoghurt') || lower.includes('cimory') || lower.includes('probiotik') || lower.includes('biokul')) {
    return {
      type: 'yogurtDrink',
      category: 'Yogurt & Probiotik',
      badge: 'Minuman Fermentasi Sehat',
      accentColor: '#e11d48',
      bgGradient: 'linear-gradient(145deg, #ffe4e6 0%, #fecdd3 50%, #fda4af 100%)',
      badgeBg: 'bg-rose-500/25 border-rose-400/40 text-rose-950',
      badgeText: 'Pencernaan Sehat',
      svgDataUri: FLAT_ILLUSTRATIONS.yogurtDrink
    };
  }

  // 8. Keripik Kentang & Snack Gurih (Chitato, Lay's, Taro, Qtela, Kusuka, Pringles, Chiki)
  if (lower.includes('chitato') || lower.includes('lay') || lower.includes('lays') || lower.includes('taro') || lower.includes('qtela') || lower.includes('kusuka') || lower.includes('pringles') || lower.includes('keripik') || lower.includes('chips') || lower.includes('snack') || lower.includes('chiki') || lower.includes('cheetos') || lower.includes('potabee')) {
    return {
      type: 'chipsSnack',
      category: 'Snack & Keripik Gurih',
      badge: 'Cemilan Renyah Gurih',
      accentColor: '#dc2626',
      bgGradient: 'linear-gradient(145deg, #fee2e2 0%, #fca5a5 50%, #ef4444 100%)',
      badgeBg: 'bg-red-500/25 border-red-400/40 text-red-950',
      badgeText: 'Cemilan Krispi',
      svgDataUri: FLAT_ILLUSTRATIONS.chipsSnack
    };
  }

  // 9. Cokelat Batangan & Permen (SilverQueen, Cadbury, KitKat, Choki, Mentos, Kopiko, Alpenliebe)
  if (lower.includes('cokelat') || lower.includes('chocolate') || lower.includes('silverqueen') || lower.includes('cadbury') || lower.includes('kitkat') || lower.includes('permen') || lower.includes('candy') || lower.includes('mentos') || lower.includes('kopiko') || lower.includes('alpenliebe') || lower.includes('beng-beng') || lower.includes('beng beng') || lower.includes('delfi')) {
    return {
      type: 'chocolateBar',
      category: 'Cokelat & Kembang Gula',
      badge: 'Cokelat & Permen Manis',
      accentColor: '#78350f',
      bgGradient: 'linear-gradient(145deg, #fef3c7 0%, #fde68a 50%, #d97706 100%)',
      badgeBg: 'bg-amber-600/25 border-amber-500/40 text-amber-950',
      badgeText: 'Manis & Lezat',
      svgDataUri: FLAT_ILLUSTRATIONS.chocolateBar
    };
  }

  // 10. Burger / Sandwich / Sosis / Nugget / Daging Olahan
  if (lower.includes('burger') || lower.includes('sandwich') || lower.includes('nugget') || lower.includes('fiesta') || lower.includes('sosis') || lower.includes('kornet') || lower.includes('daging') || lower.includes('kanzler')) {
    return {
      type: 'burger',
      category: 'Makanan Siap Saji',
      badge: 'Burger & Olahan Daging',
      accentColor: '#f59e0b',
      bgGradient: 'linear-gradient(145deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)',
      badgeBg: 'bg-amber-500/25 border-amber-400/40 text-amber-950',
      badgeText: 'Fast Food & Sosis',
      svgDataUri: FLAT_ILLUSTRATIONS.burger
    };
  }

  // 11. Bumbu Dapur, Kecap, Saus Sambal (Bango, ABC, Sedaap Kecap, Saus Tiram, Masako, Royco)
  if (lower.includes('kecap') || lower.includes('bango') || lower.includes('sambal') || lower.includes('saus') || lower.includes('sauce') || lower.includes('abc saus') || lower.includes('masako') || lower.includes('royco') || lower.includes('sasa') || lower.includes('tiram')) {
    return {
      type: 'soySauceChili',
      category: 'Bumbu Masak & Saus',
      badge: 'Penyedap & Sambal Lezat',
      accentColor: '#15803d',
      bgGradient: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 50%, #86efac 100%)',
      badgeBg: 'bg-emerald-500/25 border-emerald-400/40 text-emerald-950',
      badgeText: 'Bumbu Dapur Lengkap',
      svgDataUri: FLAT_ILLUSTRATIONS.soySauceChili
    };
  }

  // 12. Santan Kelapa & Olahan Kelapa (Kara, Rose Brand Santan, Sun Kara)
  if (lower.includes('santan') || lower.includes('kara') || lower.includes('kelapa') || lower.includes('coconut')) {
    return {
      type: 'coconutMilk',
      category: 'Santan & Olahan Kelapa',
      badge: 'Santan Kental Gurih',
      accentColor: '#16a34a',
      bgGradient: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
      badgeBg: 'bg-slate-500/25 border-slate-400/40 text-slate-950',
      badgeText: 'Masakan Tradisional',
      svgDataUri: FLAT_ILLUSTRATIONS.coconutMilk
    };
  }

  // 13. Minyak Goreng (Sania, Bimoli, Filma, Tropical, SunCo, Fortune)
  if (lower.includes('minyak') || lower.includes('mnyk') || lower.includes('grng') || lower.includes('sania') || lower.includes('bimoli') || lower.includes('filma') || lower.includes('tropical') || lower.includes('sunco') || lower.includes('fortune') || lower.includes('sawit')) {
    return {
      type: 'cookingOil',
      category: 'Minyak Goreng',
      badge: 'Minyak Sawit Murni',
      accentColor: '#eab308',
      bgGradient: 'linear-gradient(145deg, #fef9c3 0%, #fef08a 50%, #fde047 100%)',
      badgeBg: 'bg-yellow-500/30 border-yellow-400/50 text-yellow-950',
      badgeText: 'Sembako Utama',
      svgDataUri: FLAT_ILLUSTRATIONS.cookingOil
    };
  }

  // 14. Roti & Selai (Mr. Bread, Sari Roti, Selai Ceres, Toast)
  if (lower.includes('roti') || lower.includes('bread') || lower.includes('toast') || lower.includes('tawar') || lower.includes('sari roti') || lower.includes('selai') || lower.includes('ceres') || lower.includes('morin')) {
    return {
      type: 'breadToast',
      category: 'Roti & Sarapan',
      badge: 'Roti Tawar Lembut',
      accentColor: '#d97706',
      bgGradient: 'linear-gradient(145deg, #fef3c7 0%, #fed7aa 50%, #fcd34d 100%)',
      badgeBg: 'bg-amber-500/25 border-amber-400/40 text-amber-950',
      badgeText: 'Roti & Bakery',
      svgDataUri: FLAT_ILLUSTRATIONS.breadToast
    };
  }

  // 15. Es Krim (Walls, Glico Wings, Haku, Magnum, Cornetto, Aice)
  if (lower.includes('es krim') || lower.includes('ice cream') || lower.includes('icecream') || lower.includes('walls') || lower.includes('haku') || lower.includes('magnum') || lower.includes('cornetto') || lower.includes('aice') || lower.includes('monaka') || lower.includes('matcha')) {
    return {
      type: 'iceCream',
      category: 'Es Krim & Dessert',
      badge: 'Es Krim Lembut',
      accentColor: '#10b981',
      bgGradient: 'linear-gradient(145deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%)',
      badgeBg: 'bg-emerald-500/25 border-emerald-400/40 text-emerald-950',
      badgeText: 'Dessert Segar',
      svgDataUri: FLAT_ILLUSTRATIONS.iceCream
    };
  }

  // 16. Wafer & Biskuit (Chocolatos, Deka, Nissin, Oreo, Khong Guan, Tango, Roma)
  if (lower.includes('wafer') || lower.includes('wfr') || lower.includes('biskuit') || lower.includes('biscuit') || lower.includes('chocolatos') || lower.includes('deka') || lower.includes('nissin') || lower.includes('oreo') || lower.includes('tango') || lower.includes('roma') || lower.includes('malkist') || lower.includes('slai olay')) {
    return {
      type: 'waferSnack',
      category: 'Biskuit & Wafer',
      badge: 'Cemilan Renyah Cokelat',
      accentColor: '#b45309',
      bgGradient: 'linear-gradient(145deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)',
      badgeBg: 'bg-amber-500/25 border-amber-400/40 text-amber-950',
      badgeText: 'Snack & Wafer',
      svgDataUri: FLAT_ILLUSTRATIONS.waferSnack
    };
  }

  // 17. Sabun Cuci Piring & Spons (Sunlight, Mama Lemon, Ekonomi Cuci Piring)
  if (lower.includes('sunlight') || lower.includes('mama lemon') || lower.includes('cuci piring') || lower.includes('dishwash') || lower.includes('dish soap') || lower.includes('spons')) {
    return {
      type: 'dishSoap',
      category: 'Pembersih Dapur',
      badge: 'Pembersih Piring Higienis',
      accentColor: '#65a30d',
      bgGradient: 'linear-gradient(145deg, #ecfccb 0%, #d9f99d 50%, #bef264 100%)',
      badgeBg: 'bg-lime-500/25 border-lime-400/40 text-lime-950',
      badgeText: 'Dapur Bebas Lemak',
      svgDataUri: FLAT_ILLUSTRATIONS.dishSoap
    };
  }

  // 18. Shampoo & Body Wash (Lifebuoy, Lux, Pantene, Sunsilk, Clear, Biore, Dove)
  if (lower.includes('shampoo') || lower.includes('shp') || lower.includes('sabun mandi') || lower.includes('body wash') || lower.includes('bw') || lower.includes('lifebuoy') || lower.includes('lux') || lower.includes('biore') || lower.includes('pantene') || lower.includes('sunsilk') || lower.includes('clear') || lower.includes('dove') || lower.includes('head & shoulders')) {
    return {
      type: 'shampooBodywash',
      category: 'Perawatan Tubuh',
      badge: 'Kebersihan Diri',
      accentColor: '#6366f1',
      bgGradient: 'linear-gradient(145deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%)',
      badgeBg: 'bg-indigo-500/25 border-indigo-400/40 text-indigo-950',
      badgeText: 'Mandi & Keramas',
      svgDataUri: FLAT_ILLUSTRATIONS.shampooBodywash
    };
  }

  // 19. Pasta Gigi & Sikat Gigi (Pepsodent, Formula, Ciptadent, Closeup, Sensodyne)
  if (lower.includes('pasta gigi') || lower.includes('pg') || lower.includes('sikat gigi') || lower.includes('sg') || lower.includes('pepsodent') || lower.includes('formula') || lower.includes('ciptadent') || lower.includes('closeup') || lower.includes('sensodyne') || lower.includes('oral-b')) {
    return {
      type: 'toothpaste',
      category: 'Perawatan Gigi',
      badge: 'Kesehatan Mulut & Gigi',
      accentColor: '#ef4444',
      bgGradient: 'linear-gradient(145deg, #fee2e2 0%, #fecaca 50%, #fca5a5 100%)',
      badgeBg: 'bg-red-500/25 border-red-400/40 text-red-950',
      badgeText: 'Gigi Bersih Segar',
      svgDataUri: FLAT_ILLUSTRATIONS.toothpaste
    };
  }

  // 20. Skincare & Kosmetik (Glow & Lovely, Marina, Garnier, Wardah, Emina, Nivea)
  if (lower.includes('skincare') || lower.includes('glow') || lower.includes('lovely') || lower.includes('marina') || lower.includes('garnier') || lower.includes('lotion') || lower.includes('hbl') || lower.includes('wardah') || lower.includes('serum') || lower.includes('facial') || lower.includes('nivea') || lower.includes('emina') || lower.includes('micellar')) {
    return {
      type: 'skincare',
      category: 'Skincare & Kecantikan',
      badge: 'Nutrisi Kulit Halus',
      accentColor: '#ec4899',
      bgGradient: 'linear-gradient(145deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
      badgeBg: 'bg-pink-500/25 border-pink-400/40 text-pink-950',
      badgeText: 'Kecantikan Wajah',
      svgDataUri: FLAT_ILLUSTRATIONS.skincare
    };
  }

  // 21. Bayi & Anak (My Baby, Telon, Zwitsal, MamyPoko, Popok, Pampers, Sweety)
  if (lower.includes('baby') || lower.includes('bayi') || lower.includes('telon') || lower.includes('zwitsal') || lower.includes('cologne') || lower.includes('mamypoko') || lower.includes('popok') || lower.includes('pampers') || lower.includes('sweety') || lower.includes('merries')) {
    return {
      type: 'babyCare',
      category: 'Perawatan Bayi & Anak',
      badge: 'Lembut untuk Si Kecil',
      accentColor: '#10b981',
      bgGradient: 'linear-gradient(145deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
      badgeBg: 'bg-emerald-500/25 border-emerald-400/40 text-emerald-950',
      badgeText: 'Aman & Hangat Bayi',
      svgDataUri: FLAT_ILLUSTRATIONS.babyCare
    };
  }

  // 22. Obat-obatan & Suplemen (Panadol, Tolak Angin, Bodrex, Paracetamol, You C1000, Vitamin, Antangin)
  if (lower.includes('panadol') || lower.includes('tolak angin') || lower.includes('bodrex') || lower.includes('obat') || lower.includes('vitamin') || lower.includes('c1000') || lower.includes('paracetamol') || lower.includes('antangin') || lower.includes('promag') || lower.includes('salonpas') || lower.includes('hansaplast') || lower.includes('kayu putih') || lower.includes('freshcare') || lower.includes('redoxon')) {
    return {
      type: 'pharmacyMeds',
      category: 'Kesehatan & Suplemen',
      badge: 'Obat & Vitamin Resmi',
      accentColor: '#dc2626',
      bgGradient: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
      badgeBg: 'bg-red-500/25 border-red-400/40 text-red-950',
      badgeText: 'Kesehatan Keluarga',
      svgDataUri: FLAT_ILLUSTRATIONS.pharmacyMeds
    };
  }

  // 23. Tisu Wajah, Tisu Basah, Kapas (Paseo, Tessa, Nice, Mitu, Wet Wipes, Cotton)
  if (lower.includes('tisu') || lower.includes('tissue') || lower.includes('paseo') || lower.includes('tessa') || lower.includes('nice') || lower.includes('wipes') || lower.includes('kapas') || lower.includes('mitu')) {
    return {
      type: 'tissueBox',
      category: 'Perlengkapan Kebersihan',
      badge: 'Tisu Lembut Higienis',
      accentColor: '#059669',
      bgGradient: 'linear-gradient(145deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
      badgeBg: 'bg-emerald-500/25 border-emerald-400/40 text-emerald-950',
      badgeText: 'Lembut & Higienis',
      svgDataUri: FLAT_ILLUSTRATIONS.tissueBox
    };
  }

  // 24. Baterai, Pulsa & Elektronik Kasir (Alkaline, ABC Baterai, Energizer, Token PLN)
  if (lower.includes('baterai') || lower.includes('battery') || lower.includes('alkaline') || lower.includes('energizer') || lower.includes('pulsa') || lower.includes('pln') || lower.includes('token') || lower.includes('kabel') || lower.includes('charger')) {
    return {
      type: 'batteryEnergy',
      category: 'Baterai & Elektronik Kasir',
      badge: 'Daya Energi Terpercaya',
      accentColor: '#f59e0b',
      bgGradient: 'linear-gradient(145deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)',
      badgeBg: 'bg-amber-500/25 border-amber-400/40 text-amber-950',
      badgeText: 'Daya Tahan Tinggi',
      svgDataUri: FLAT_ILLUSTRATIONS.batteryEnergy
    };
  }

  // 25. Deterjen & Pembersih Rumah (Rinso, So Klin, Karbol, Lantai, Wipol, Molto, Downy, Harpic)
  if (lower.includes('rinso') || lower.includes('so klin') || lower.includes('deterjen') || lower.includes('pembersih') || lower.includes('lantai') || lower.includes('karbol') || lower.includes('wipol') || lower.includes('molto') || lower.includes('downy') || lower.includes('harpic') || lower.includes('bayclin') || lower.includes('vanish')) {
    return {
      type: 'homeCleaner',
      category: 'Kebutuhan Rumah',
      badge: 'Kebersihan Rumah Tangga',
      accentColor: '#8b5cf6',
      bgGradient: 'linear-gradient(145deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)',
      badgeBg: 'bg-purple-500/25 border-purple-400/40 text-purple-950',
      badgeText: 'Rumah Wangi Higienis',
      svgDataUri: FLAT_ILLUSTRATIONS.homeCleaner
    };
  }

  // 26. Beras / Sembako / Gula / Garam / Tepung / Telur (Segitiga Biru, Gulaku, Sania Beras)
  if (lower.includes('beras') || lower.includes('rice') || lower.includes('gula') || lower.includes('sugar') || lower.includes('garam') || lower.includes('salt') || lower.includes('tepung') || lower.includes('sembako') || lower.includes('telur') || lower.includes('terigu')) {
    return {
      type: 'stapleRice',
      category: 'Bahan Pokok & Sembako',
      badge: 'Bahan Dapur Pokok',
      accentColor: '#d97706',
      bgGradient: 'linear-gradient(145deg, #fefce8 0%, #fef9c3 50%, #fef08a 100%)',
      badgeBg: 'bg-yellow-500/25 border-yellow-400/40 text-yellow-950',
      badgeText: 'Pangan Keluarga',
      svgDataUri: FLAT_ILLUSTRATIONS.stapleRice
    };
  }

  // 27. Buah-buahan Segar (Indomaret Fresh: Pisang Cavendish, Apel Fuji, Jeruk Siam, Semangka, Melon, Buah Naga, Alpukat, Pir, Lemon, Anggur)
  if (
    lower.includes('pisang') ||
    lower.includes('cavendish') ||
    lower.includes('apel') ||
    lower.includes('fuji') ||
    lower.includes('jeruk') ||
    lower.includes('semangka') ||
    lower.includes('melon') ||
    lower.includes('alpukat') ||
    lower.includes('buah naga') ||
    lower.includes('dragon fruit') ||
    lower.includes('pir') ||
    lower.includes('pear') ||
    lower.includes('lemon') ||
    lower.includes('anggur') ||
    lower.includes('grape') ||
    lower.includes('mangga') ||
    lower.includes('sunpride') ||
    lower.includes('buah')
  ) {
    return {
      type: 'freshFruits',
      category: 'Buah Segar Indomaret Fresh',
      badge: 'Indomaret Fresh Buah',
      accentColor: '#16a34a',
      bgGradient: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
      badgeBg: 'bg-emerald-500/25 border-emerald-400/40 text-emerald-950',
      badgeText: 'Buah Segar Pilihan',
      svgDataUri: FLAT_ILLUSTRATIONS.freshFruits
    };
  }

  // 28. Sayuran Segar (Indomaret Fresh: Wortel Berastagi, Kentang Dieng, Bawang Merah/Putih, Cabai Rawit/Keriting, Brokoli, Tomat, Jagung, Sawi/Caisim, Bayam, Kangkung, Jamur)
  if (
    lower.includes('wortel') ||
    lower.includes('kentang') ||
    lower.includes('bawang') ||
    lower.includes('cabai') ||
    lower.includes('cabe') ||
    lower.includes('brokoli') ||
    lower.includes('tomat') ||
    lower.includes('jagung') ||
    lower.includes('sawi') ||
    lower.includes('caisim') ||
    lower.includes('bayam') ||
    lower.includes('kangkung') ||
    lower.includes('jamur') ||
    lower.includes('tiram') ||
    lower.includes('sayur') ||
    lower.includes('fresh pack')
  ) {
    return {
      type: 'freshVegetables',
      category: 'Sayuran Segar Indomaret Fresh',
      badge: 'Indomaret Fresh Sayur',
      accentColor: '#ea580c',
      bgGradient: 'linear-gradient(145deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
      badgeBg: 'bg-orange-500/25 border-orange-400/40 text-orange-950',
      badgeText: 'Sayur Segar Mutu A',
      svgDataUri: FLAT_ILLUSTRATIONS.freshVegetables
    };
  }

  // 29. Rokok & Korek Kasir Minimarket
  if (
    lower.includes('rokok') ||
    lower.includes('sampoerna') ||
    lower.includes('marlboro') ||
    lower.includes('magnum filter') ||
    lower.includes('surya') ||
    lower.includes('gudang garam') ||
    lower.includes('djarum') ||
    lower.includes('dunhill') ||
    lower.includes('mild') ||
    lower.includes('korek') ||
    lower.includes('cricket') ||
    lower.includes('tokai') ||
    lower.includes('lighter')
  ) {
    return {
      type: 'tobaccoLighter',
      category: 'Rokok & Korek Kasir',
      badge: 'Kasir & Tembakau',
      accentColor: '#dc2626',
      bgGradient: 'linear-gradient(145deg, #fef2f2 0%, #fee2e2 50%, #fecaca 100%)',
      badgeBg: 'bg-rose-500/25 border-rose-400/40 text-rose-950',
      badgeText: 'Item Kasir Ritel',
      svgDataUri: FLAT_ILLUSTRATIONS.tobaccoLighter
    };
  }

  // Default Grocery Cart Illustration with cheerful pleasant background
  return {
    type: 'groceryCart',
    category: 'Produk Retail',
    badge: 'Produk Minimarket Resmi',
    accentColor: '#059669',
    bgGradient: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
    badgeBg: 'bg-emerald-500/25 border-emerald-400/40 text-emerald-950',
    badgeText: 'Produk Resmi',
    svgDataUri: FLAT_ILLUSTRATIONS.groceryCart
  };
}

// Backward compatibility helper
export function getProductVisual(name: string, category?: string, packaging?: string): { imageUrl: string; badge: string; color: string; bgGradient: string } {
  const theme = getProductFlatTheme(name, category, packaging);
  return {
    imageUrl: theme.svgDataUri,
    badge: theme.badge,
    color: theme.accentColor,
    bgGradient: theme.bgGradient
  };
}

/**
 * Membersihkan nama produk untuk query pencarian KlikIndomaret & Google
 * Mempertahankan kata pembeda produk: merek, varian, ukuran/volume/berat, dan bentuk kemasan.
 * TIDAK memotong menjadi 4 kata dan TIDAK membuang isi dalam kurung.
 */
export function getCleanRetailQuery(name: string): string {
  if (!name) return '';
  // Ganti tanda kurung dengan spasi agar teks di dalam kurung (misal ukuran/varian) tetap terbawa
  let clean = name.replace(/[()[\]{}]/g, ' ');
  // Hapus simbol pemisah tanpa membuang titik desimal pada angka (misal 1.5L)
  clean = clean.replace(/[/\\|•–—_+*~]/g, ' ');
  // Hapus kata sifat marketing yang bising, tanpa membuang kata pembeda kemasan (refill, pouch, botol dsb.)
  clean = clean.replace(/\b(promo|diskon|termurah|terbaru|bermutu|paling|asli|original\s*product)\b/gi, ' ');
  // Normalisasi spasi
  clean = clean.replace(/\s+/g, ' ').trim();
  return clean || name;
}

export function buildECommerceLinks(productName: string) {
  const cleanKeyword = getCleanRetailQuery(productName);
  const query = encodeURIComponent(cleanKeyword);

  return [
    {
      platform: 'KlikIndomaret' as const,
      title: 'Katalog Resmi KlikIndomaret (Acuan Utama)',
      url: `https://www.klikindomaret.com/search/?key=${query}`
    },
    {
      platform: 'Google' as const,
      title: 'Google Search (KlikIndomaret)',
      url: `https://www.google.com/search?q=${query}+klikindomaret`
    },
    {
      platform: 'Alfagift' as const,
      title: 'Alfagift Ritel',
      url: `https://alfagift.id/s?q=${query}`
    },
    {
      platform: 'Tokopedia' as const,
      title: 'Tokopedia Grocery',
      url: `https://www.tokopedia.com/search?st=product&q=${query}`
    },
    {
      platform: 'GoogleImages' as const,
      title: 'Foto Kemasan Resmi',
      url: `https://www.google.com/search?tbm=isch&q=${query}+klikindomaret`
    }
  ];
}

export interface SearchFlatIconResult {
  type: string;
  title: string;
  category: string;
  svgDataUri: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

/**
 * Maps any user search query or filter string directly to a Flaticon-style flat vector illustration
 */
export function getSearchFlatIcon(keyword: string): SearchFlatIconResult | null {
  if (!keyword || !keyword.trim()) return null;
  const lower = keyword.toLowerCase().trim();
  const theme = getProductFlatTheme(lower);

  if (theme.type === 'groceryCart') {
    if (
      lower.includes('struk') ||
      lower.includes('belanja') ||
      lower.includes('toko') ||
      lower.includes('minimarket') ||
      lower.includes('kasir') ||
      lower.includes('retail')
    ) {
      return {
        type: theme.type,
        title: 'Produk Retail Minimarket',
        category: theme.category,
        svgDataUri: theme.svgDataUri,
        accentColor: theme.accentColor,
        badgeBg: theme.badgeBg,
        badgeText: theme.badgeText
      };
    }
    return null;
  }

  return {
    type: theme.type,
    title: theme.badge,
    category: theme.category,
    svgDataUri: theme.svgDataUri,
    accentColor: theme.accentColor,
    badgeBg: theme.badgeBg,
    badgeText: theme.badgeText
  };
}

export interface QuickSearchPreset {
  id: string;
  label: string;
  searchKeyword: string;
  iconUri: string;
  categoryName: string;
  accentColor: string;
}

/**
 * Curated Flaticon-style quick category and item filters
 */
export const QUICK_SEARCH_PRESETS: QuickSearchPreset[] = [
  {
    id: 'shampo',
    label: 'Shampo & Sabun',
    searchKeyword: 'shampoo',
    iconUri: FLAT_ILLUSTRATIONS.shampooBodywash,
    categoryName: 'Perawatan Tubuh',
    accentColor: '#6366f1'
  },
  {
    id: 'buah',
    label: 'Buah Segar',
    searchKeyword: 'buah',
    iconUri: FLAT_ILLUSTRATIONS.freshFruits,
    categoryName: 'Buah & Sayur',
    accentColor: '#16a34a'
  },
  {
    id: 'sayur',
    label: 'Sayuran Fresh',
    searchKeyword: 'sayur',
    iconUri: FLAT_ILLUSTRATIONS.freshVegetables,
    categoryName: 'Buah & Sayur',
    accentColor: '#ea580c'
  },
  {
    id: 'mie',
    label: 'Mie & Instan',
    searchKeyword: 'mie',
    iconUri: FLAT_ILLUSTRATIONS.noodleBowl,
    categoryName: 'Makanan & Snack',
    accentColor: '#ec4899'
  },
  {
    id: 'kopi',
    label: 'Kopi & Latte',
    searchKeyword: 'kopi',
    iconUri: FLAT_ILLUSTRATIONS.coffee,
    categoryName: 'Minuman',
    accentColor: '#d97706'
  },
  {
    id: 'susu',
    label: 'Susu Segar',
    searchKeyword: 'susu',
    iconUri: FLAT_ILLUSTRATIONS.milk,
    categoryName: 'Minuman',
    accentColor: '#3b82f6'
  },
  {
    id: 'snack',
    label: 'Snack & Keripik',
    searchKeyword: 'snack',
    iconUri: FLAT_ILLUSTRATIONS.chipsSnack,
    categoryName: 'Makanan & Snack',
    accentColor: '#dc2626'
  },
  {
    id: 'roti',
    label: 'Roti & Selai',
    searchKeyword: 'roti',
    iconUri: FLAT_ILLUSTRATIONS.breadToast,
    categoryName: 'Makanan & Snack',
    accentColor: '#d97706'
  },
  {
    id: 'air',
    label: 'Air Mineral',
    searchKeyword: 'aqua',
    iconUri: FLAT_ILLUSTRATIONS.mineralWater,
    categoryName: 'Minuman',
    accentColor: '#0284c7'
  },
  {
    id: 'minyak',
    label: 'Minyak Goreng',
    searchKeyword: 'minyak',
    iconUri: FLAT_ILLUSTRATIONS.cookingOil,
    categoryName: 'Sembako',
    accentColor: '#eab308'
  },
  {
    id: 'beras',
    label: 'Beras & Sembako',
    searchKeyword: 'beras',
    iconUri: FLAT_ILLUSTRATIONS.stapleRice,
    categoryName: 'Sembako',
    accentColor: '#b45309'
  },
  {
    id: 'kebersihan',
    label: 'Cuci Piring',
    searchKeyword: 'cuci piring',
    iconUri: FLAT_ILLUSTRATIONS.dishSoap,
    categoryName: 'Kebutuhan Rumah',
    accentColor: '#65a30d'
  },
  {
    id: 'bayi',
    label: 'Bayi & Anak',
    searchKeyword: 'baby',
    iconUri: FLAT_ILLUSTRATIONS.babyCare,
    categoryName: 'Bayi & Anak',
    accentColor: '#10b981'
  },
  {
    id: 'obat',
    label: 'Obat & Vitamin',
    searchKeyword: 'vitamin',
    iconUri: FLAT_ILLUSTRATIONS.pharmacyMeds,
    categoryName: 'Kesehatan',
    accentColor: '#ef4444'
  }
];

