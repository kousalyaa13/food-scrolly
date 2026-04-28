/* ════════════════════════════════════════════
   CONSTANTS & MAPPINGS
════════════════════════════════════════════ */

// Maps fine-grained CSV categories → display super-categories
const SUPER_CAT = {
  'Apples': 'Fruits', 'Bananas': 'Fruits', 'Blueberries and other berries': 'Fruits',
  'Citrus fruits': 'Fruits', 'Dried fruits': 'Fruits', 'Grapes': 'Fruits',
  'Mango and papaya': 'Fruits', 'Other fruits and fruit salads': 'Fruits',
  'Pears': 'Fruits', 'Strawberries': 'Fruits', 'Fruits and Fruit Juices': 'Fruits',
  'Apple juice': 'Drinks', 'Fruit drinks': 'Drinks', 'Other fruit juice': 'Drinks',
  'Beverages': 'Drinks', 'Vegetable juice': 'Drinks', 'Liquor and cocktails': 'Drinks',
  'Vegetables and Vegetable Products': 'Vegetables', 'Vegetable dishes': 'Vegetables',
  'Tomatoes': 'Vegetables', 'Onions': 'Vegetables',
  'Other red and orange vegetables': 'Vegetables',
  'Other vegetables and combinations': 'Vegetables', 'Fried vegetables': 'Vegetables',
  'Vegetables on a sandwich': 'Vegetables', 'Coleslaw, non-lettuce salads': 'Vegetables',
  'Dairy and Egg Products': 'Dairy', 'Flavored milk, reduced fat': 'Dairy',
  'Flavored milk, whole': 'Dairy', 'Ice cream and frozen dairy desserts': 'Dairy',
  'Baked Products': 'Grains', 'Cakes and pies': 'Grains', 'Rolls and buns': 'Grains',
  'Yeast breads': 'Grains', 'Rice mixed dishes': 'Grains',
  'Pasta mixed dishes, excludes macaroni and cheese': 'Grains',
  'Pork Products': 'Protein', 'Meat mixed dishes': 'Protein',
  'Seafood mixed dishes': 'Protein', 'Legumes and Legume Products': 'Protein',
  'Bean, pea, legume dishes': 'Protein',
  'American Indian/Alaska Native Foods': 'Protein',
  'Snacks': 'Snacks', 'Potato chips': 'Snacks',
  'Tortilla, corn, other chips': 'Snacks',
  'French fries and other fried white potatoes': 'Snacks',
  'Fast Foods': 'Snacks',
};

const CAT_COLOR = {
  'Fruits':     '#6abf6a',
  'Vegetables': '#e8c040',
  'Dairy':      '#6b9fd4',
  'Grains':     '#9b8ec4',
  'Protein':    '#e85d5d',
  'Snacks':     '#f5a623',
  'Drinks':     '#40c0c0',
  'Other':      '#a08060',
};

const CAT_EMOJI = {
  'All Foods': '🍽️', 'Fruits': '🍎', 'Vegetables': '🥦', 'Dairy': '🥛',
  'Grains': '🌾', 'Protein': '🍗', 'Snacks': '🍟', 'Drinks': '🧃', 'Other': '···',
};

const NUTRIENT_LABEL = {
  calories: 'Calories (kcal)', fat: 'Fat (g)', carbs: 'Carbs (g)',
  protein: 'Protein (g)', iron: 'Iron (mg)', vitamin_c: 'Vitamin C (mg)',
};

const NUTRIENT_COLOR = {
  calories: '#f5a623', fat: '#e87070', carbs: '#6b9fd4',
  protein: '#6abf6a',  iron: '#9b8ec4', vitamin_c: '#f5d05e',
};

const NUTRIENT_BAR_CLASS = {
  calories: 'bar-cal', fat: 'bar-fat', carbs: 'bar-carb',
  protein: 'bar-prot', iron: 'bar-iron', vitamin_c: 'bar-vitc',
};

// Reference max for bar widths (per 100g)
const MAX_VAL = { calories: 600, fat: 65, carbs: 85, protein: 40, iron: 22, vitamin_c: 110 };

// Daily values for % DV calculation
const DAILY_VAL = { calories: 2000, fat: 78, carbs: 275, protein: 50, iron: 18, vitamin_c: 90 };

const NUTRIENT_ICON = {
  calories: '🔥', fat: '💧', carbs: '🌾', protein: '💪', iron: '🩸', vitamin_c: '🍊',
};

const CATEGORY_INSIGHTS = {
  calories: [
    '<span class="ins-orange">Snacks</span> have the highest average calories.',
    '<span class="ins-green">Fruits</span> and <span style="color:#a07010;font-weight:700">Vegetables</span> are the lowest.',
    '<span class="ins-blue">Dairy</span> and <span class="ins-purple">Grains</span> are moderate.',
  ],
  fat: [
    '<span class="ins-orange">Snacks</span> tend to be highest in fat.',
    '<span class="ins-green">Fruits</span> and vegetables are nearly fat-free.',
    '<span class="ins-blue">Dairy</span> varies widely by type.',
  ],
  carbs: [
    '<span class="ins-orange">Snacks</span> and <span class="ins-purple">Grains</span> lead in carbs.',
    '<span style="color:#c04040;font-weight:700">Protein</span> foods have almost zero carbs.',
    '<span class="ins-green">Fruits</span> have natural sugars counted in carbs.',
  ],
  protein: [
    '<span style="color:#c04040;font-weight:700">Protein</span> foods rank highest in protein.',
    '<span class="ins-blue">Dairy</span> is also a solid protein source.',
    '<span class="ins-green">Fruits</span> and vegetables are low in protein.',
  ],
  iron: [
    'Vegetables and protein foods can be surprisingly high in iron.',
    '<span class="ins-green">Fruits</span> generally have lower iron.',
    'Dried fruits can be a good iron source.',
  ],
  vitamin_c: [
    '<span class="ins-green">Fruits</span> are the clear winner in Vitamin C!',
    'Vegetables also provide good Vitamin C.',
    '<span class="ins-orange">Snacks</span> have very little Vitamin C.',
  ],
};

/* ════════════════════════════════════════════
   STATE
════════════════════════════════════════════ */
let foodData = [];
let currentSuperCat = 'All Foods';
let selectedFood = null;
let barChartInst = null;
let scatterChartInst = null;

/* ════════════════════════════════════════════
   LOAD CSV
════════════════════════════════════════════ */
Papa.parse('Food_Nutrition_Dataset.csv', {
  download: true,
  header: true,
  dynamicTyping: true,
  complete(results) {
    foodData = results.data
      .filter(r => r.food_name && r.calories != null && !isNaN(r.calories))
      .map(r => ({ ...r, superCat: SUPER_CAT[r.category] || 'Other' }));

    buildScatter();
    buildBar('calories');
    buildCatFilter();
    renderFoodList('All Foods');
    buildRealitySelector();
    updateFruitSmoothie();

    // Default selection for explore panel
    const defaultFood =
      foodData.find(f => f.food_name.includes('NAKED JUICE')) ||
      foodData.find(f => f.food_name.toLowerCase().includes('apple, raw')) ||
      foodData[0];
    if (defaultFood) selectFood(defaultFood.food_name);
  },
});

/* ════════════════════════════════════════════
   SCROLL FADE-IN
════════════════════════════════════════════ */
const fadeObserver = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.07 }
);
document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* ════════════════════════════════════════════
   SCATTER CHART
════════════════════════════════════════════ */
function buildScatter() {
  const superCats = [...new Set(foodData.map(d => d.superCat))].sort();

  // Legend
  const legendEl = document.getElementById('scatterLegend');
  if (legendEl) {
    legendEl.innerHTML =
      '<span class="cat-legend-label">CATEGORY</span>' +
      superCats.map(cat => `
        <span class="cl-item">
          <span class="cl-dot" style="background:${CAT_COLOR[cat] || '#aaa'}"></span>
          ${cat}
        </span>`).join('');
  }

  // One dataset per super-category
  const datasets = superCats.map(cat => ({
    label: cat,
    data: foodData
      .filter(d => d.superCat === cat && d.fat != null)
      .map(d => ({ x: d.calories, y: d.fat, name: d.food_name, cat: d.superCat, carbs: d.carbs, protein: d.protein })),
    backgroundColor: (CAT_COLOR[cat] || '#aaa') + 'bb',
    borderColor:     CAT_COLOR[cat] || '#aaa',
    borderWidth: 1.5,
    pointRadius: 6,
    pointHoverRadius: 9,
  }));

  scatterChartInst = new Chart(document.getElementById('scatterChart'), {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'white',
          titleColor: '#222',
          bodyColor:  '#555',
          borderColor: '#e0d8cc',
          borderWidth: 2,
          padding: 14,
          cornerRadius: 14,
          callbacks: {
            title: ctx => ctx[0].raw.name,
            label: ctx => [
              `Category: ${ctx.raw.cat}`,
              `Calories: ${ctx.raw.x} kcal`,
              `Fat: ${ctx.raw.y} g`,
              `Carbs: ${ctx.raw.carbs ?? '—'} g`,
              `Protein: ${ctx.raw.protein ?? '—'} g`,
            ],
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: 'CALORIES (kcal) per 100g', font: { weight: 'bold', size: 11 }, color: '#666' },
          grid:  { color: '#f0ece8' },
          ticks: { color: '#888' },
        },
        y: {
          title: { display: true, text: 'FAT (g) per 100g', font: { weight: 'bold', size: 11 }, color: '#666' },
          grid:  { color: '#f0ece8' },
          ticks: { color: '#888' },
        },
      },
    },
  });
}

/* ════════════════════════════════════════════
   BAR CHART
════════════════════════════════════════════ */
function getCatAverages(nutrient) {
  const groups = {};
  foodData.forEach(d => {
    const c = d.superCat;
    if (!groups[c]) groups[c] = { sum: 0, n: 0 };
    if (typeof d[nutrient] === 'number' && !isNaN(d[nutrient])) {
      groups[c].sum += d[nutrient];
      groups[c].n++;
    }
  });
  return Object.entries(groups)
    .map(([cat, g]) => ({ cat, avg: g.n ? g.sum / g.n : 0 }))
    .filter(d => d.avg > 0)
    .sort((a, b) => a.avg - b.avg);
}

function buildBar(nutrient) {
  const data = getCatAverages(nutrient);
  barChartInst = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: data.map(d => d.cat),
      datasets: [{
        label: NUTRIENT_LABEL[nutrient],
        data:  data.map(d => d.avg),
        backgroundColor: data.map(d => (CAT_COLOR[d.cat] || '#aaa') + 'cc'),
        borderColor:     data.map(d => CAT_COLOR[d.cat] || '#aaa'),
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'white',
          titleColor: '#222',
          bodyColor:  '#555',
          borderColor: '#e0d8cc',
          borderWidth: 2,
          padding: 12,
          cornerRadius: 12,
          callbacks: {
            label: ctx => `${NUTRIENT_LABEL[nutrient]}: ${ctx.raw.toFixed(1)}`,
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#555', font: { weight: 'bold' } } },
        y: {
          grid:  { color: '#f0ece8' },
          ticks: { color: '#888' },
          title: { display: true, text: NUTRIENT_LABEL[nutrient], color: '#666', font: { weight: 'bold', size: 11 } },
        },
      },
    },
  });
}

function switchNutrient(nutrient, btn) {
  document.querySelectorAll('.n-btn').forEach(b => b.classList.remove('active-n'));
  btn.classList.add('active-n');

  const titleEl = document.getElementById('barTitle');
  if (titleEl) titleEl.textContent = `AVERAGE ${NUTRIENT_LABEL[nutrient].toUpperCase()} PER 100g`;

  const listEl = document.getElementById('insightList');
  if (listEl) listEl.innerHTML = (CATEGORY_INSIGHTS[nutrient] || []).map(i => `<li>${i}</li>`).join('');

  const data = getCatAverages(nutrient);
  barChartInst.data.labels = data.map(d => d.cat);
  barChartInst.data.datasets[0].label = NUTRIENT_LABEL[nutrient];
  barChartInst.data.datasets[0].data  = data.map(d => d.avg);
  barChartInst.data.datasets[0].backgroundColor = data.map(d => (CAT_COLOR[d.cat] || '#aaa') + 'cc');
  barChartInst.data.datasets[0].borderColor      = data.map(d => CAT_COLOR[d.cat] || '#aaa');
  barChartInst.options.scales.y.title.text = NUTRIENT_LABEL[nutrient];
  barChartInst.update();
}

// expose globally for inline onclick
window.switchNutrient = switchNutrient;

/* ════════════════════════════════════════════
   EXPLORE FOODS — CATEGORY FILTER
════════════════════════════════════════════ */
function buildCatFilter() {
  const superCats = ['All Foods', ...new Set(foodData.map(d => d.superCat)).keys()].sort();
  // put All Foods first
  const ordered = ['All Foods', ...superCats.filter(c => c !== 'All Foods')];

  const el = document.getElementById('catFilterList');
  if (!el) return;
  el.innerHTML = ordered.map(cat => {
    const count = cat === 'All Foods' ? foodData.length : foodData.filter(d => d.superCat === cat).length;
    const emoji = CAT_EMOJI[cat] || '🍴';
    return `<button class="cf-btn ${cat === 'All Foods' ? 'active' : ''}"
               onclick="filterByCat('${escapeSingle(cat)}', this)">
              <span>${emoji} ${cat}</span>
              <span class="cf-count">${count}</span>
            </button>`;
  }).join('');
}

function filterByCat(cat, btn) {
  currentSuperCat = cat;
  document.querySelectorAll('.cf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('foodSearch').value = '';
  renderFoodList(cat);
}

window.filterByCat = filterByCat;

/* ════════════════════════════════════════════
   EXPLORE FOODS — FOOD LIST
════════════════════════════════════════════ */
function renderFoodList(superCat) {
  const filtered = superCat === 'All Foods'
    ? foodData
    : foodData.filter(d => d.superCat === superCat);

  const sorted = [...filtered].sort((a, b) => a.food_name.localeCompare(b.food_name));

  const el = document.getElementById('foodListEl');
  if (!el) return;
  el.innerHTML = sorted.map(f => {
    const isSel = selectedFood && selectedFood.food_name === f.food_name;
    return `<div class="fl-item ${isSel ? 'selected' : ''}"
               onclick="selectFood('${escapeSingle(f.food_name)}')">
              <span>${getFoodEmoji(f.food_name)} ${f.food_name}</span>
              <span class="fl-kcal">${f.calories} kcal</span>
            </div>`;
  }).join('');
}

function filterFoods() {
  const q = document.getElementById('foodSearch').value.toLowerCase();
  document.querySelectorAll('.fl-item').forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}
window.filterFoods = filterFoods;

/* ════════════════════════════════════════════
   EXPLORE FOODS — SELECT & DETAIL PANEL
════════════════════════════════════════════ */
function selectFood(nameOrObj) {
  const food = typeof nameOrObj === 'string'
    ? foodData.find(f => f.food_name === nameOrObj)
    : nameOrObj;
  if (!food) return;
  selectedFood = food;

  // Highlight in list
  document.querySelectorAll('.fl-item').forEach(el => {
    el.classList.toggle('selected', el.textContent.includes(food.food_name));
  });

  // Header
  document.getElementById('detailEmoji').textContent  = getFoodEmoji(food.food_name);
  document.getElementById('detailName').textContent   = food.food_name.toUpperCase();
  document.getElementById('detailKcal').textContent   = `${food.calories} kcal`;
  document.getElementById('detailDesc').textContent   = getFoodDesc(food);

  // Breakdown bars
  const nutrientOrder = ['calories', 'protein', 'carbs', 'fat', 'iron', 'vitamin_c'];
  document.getElementById('breakdownRows').innerHTML = nutrientOrder.map(n => {
    const val = food[n] ?? 0;
    const pct = Math.min(100, (val / MAX_VAL[n]) * 100);
    const dv  = Math.round((val / DAILY_VAL[n]) * 100);
    return `<div class="bd-row">
      <span class="bd-icon">${NUTRIENT_ICON[n]}</span>
      <span class="bd-name">${NUTRIENT_LABEL[n]}</span>
      <div class="bd-track"><div class="bd-fill ${NUTRIENT_BAR_CLASS[n]}" style="width:${pct}%"></div></div>
      <span class="bd-val">${val} ${n === 'calories' ? 'kcal' : n === 'iron' || n === 'vitamin_c' ? 'mg' : 'g'}</span>
      <span class="bd-dv">${dv}%</span>
    </div>`;
  }).join('');

  document.getElementById('dykText').textContent = getDYKFact(food);
}

window.selectFood = selectFood;

function getFoodEmoji(name) {
  const n = name.toLowerCase();
  if (n.includes('apple'))      return '🍎';
  if (n.includes('banana'))     return '🍌';
  if (n.includes('mango'))      return '🥭';
  if (n.includes('orange') || n.includes('citrus')) return '🍊';
  if (n.includes('strawberr'))  return '🍓';
  if (n.includes('grape'))      return '🍇';
  if (n.includes('blueberr'))   return '🫐';
  if (n.includes('pear'))       return '🍐';
  if (n.includes('milk'))       return '🥛';
  if (n.includes('cheese'))     return '🧀';
  if (n.includes('yogurt'))     return '🍦';
  if (n.includes('butter'))     return '🧈';
  if (n.includes('rice'))       return '🍚';
  if (n.includes('bread') || n.includes('roll')) return '🍞';
  if (n.includes('pasta'))      return '🍝';
  if (n.includes('cake') || n.includes('pie'))   return '🎂';
  if (n.includes('chip'))       return '🍟';
  if (n.includes('cookie'))     return '🍪';
  if (n.includes('chocolate'))  return '🍫';
  if (n.includes('chicken') || n.includes('poultry')) return '🍗';
  if (n.includes('pork'))       return '🥩';
  if (n.includes('fish') || n.includes('seafood')) return '🐟';
  if (n.includes('smoothie') || n.includes('naked') || n.includes('juice')) return '🥤';
  if (n.includes('coffee') || n.includes('tea')) return '☕';
  if (n.includes('salad'))      return '🥗';
  if (n.includes('broccoli'))   return '🥦';
  if (n.includes('carrot'))     return '🥕';
  if (n.includes('tomato'))     return '🍅';
  if (n.includes('potato'))     return '🥔';
  if (n.includes('onion'))      return '🧅';
  return '🍴';
}

function getFoodDesc(food) {
  const n = food.food_name.toLowerCase();
  if (n.includes('naked juice') || n.includes('mighty mango'))
    return 'A popular bottled fruit smoothie marketed as a healthy, vitamin-rich drink.';
  if (n.includes('granola'))  return 'A crunchy mix of oats, nuts, seeds and sweeteners — often seen as a healthy breakfast.';
  if (n.includes('chip'))     return 'Deep-fried sliced potatoes — crunchy and calorie-dense.';
  if (n.includes('yogurt'))   return 'A dairy snack that can vary widely in sugar depending on flavoring.';
  if (n.includes('apple, raw')) return 'A crisp, sweet whole fruit loaded with fiber and vitamins.';
  if (n.includes('chicken breast')) return 'A lean protein source — low in fat and carbs.';
  if (food.superCat === 'Snacks')
    return `A snack food with ${food.calories} kcal per 100g. Compare that to whole fruits at 50–80 kcal!`;
  if (food.superCat === 'Fruits')
    return `A naturally sweet fruit with ${food.calories} kcal per 100g, rich in vitamins and fiber.`;
  return `${food.category} — ${food.calories} kcal, ${food.protein ?? '—'}g protein, ${food.carbs ?? '—'}g carbs per 100g.`;
}

function getDYKFact(food) {
  const n = food.food_name.toLowerCase();
  if (n.includes('naked') || n.includes('mighty mango'))
    return 'NAKED JUICE Mighty Mango has 4× the calories of a fresh apple per 100g, with almost no fiber!';
  if (n.includes('chip'))
    return 'Potato chips can pack more calories per 100g than many desserts — mostly from fat!';
  if (n.includes('yogurt') && n.includes('flavor'))
    return 'Flavored yogurt can contain as much sugar as a candy bar. Try plain yogurt with fresh fruit instead!';
  if (n.includes('apple, raw'))
    return 'An apple a day keeps the doctor away — only ~61 kcal per 100g and a solid dose of fiber!';
  if (n.includes('banana chips'))
    return 'Banana chips sound healthy, but frying concentrates the calories to ~519 kcal per 100g — nearly the same as potato chips!';
  if (food.superCat === 'Drinks')
    return 'Most bottled fruit drinks lose fiber during processing, leaving mostly sugar with little nutritional benefit.';
  if (food.superCat === 'Snacks')
    return `This snack has ${food.calories} kcal per 100g. Whole fruits average around 60 kcal — almost ${Math.round(food.calories / 60)}× less!`;
  return `${food.food_name} has ${food.calories} kcal, ${food.protein ?? '—'}g protein, and ${food.carbs ?? '—'}g carbs per 100g.`;
}

/* ════════════════════════════════════════════
   EXPECTATION vs REALITY
════════════════════════════════════════════ */
function buildRealitySelector() {
  const select = document.getElementById('realitySelect');
  if (!select) return;

  // Prioritize "deceptively healthy" looking foods
  const priority = ['naked', 'juice', 'smoothie', 'yogurt', 'granola', 'dried', 'chips', 'banana chips'];
  const sorted = [...foodData].sort((a, b) => {
    const aN = a.food_name.toLowerCase();
    const bN = b.food_name.toLowerCase();
    const aP = priority.findIndex(k => aN.includes(k));
    const bP = priority.findIndex(k => bN.includes(k));
    return (aP === -1 ? 999 : aP) - (bP === -1 ? 999 : bP);
  });

  select.innerHTML = sorted
    .slice(0, 80)
    .map(f => `<option value="${escapeAttr(f.food_name)}">${f.food_name}</option>`)
    .join('');

  renderReality();
}

function renderReality() {
  const select = document.getElementById('realitySelect');
  if (!select) return;
  const food = foodData.find(f => f.food_name === select.value);
  if (!food) return;

  const barsEl = document.getElementById('realityBars');
  if (!barsEl) return;

  const nutrients = ['calories', 'carbs', 'fat', 'protein', 'iron', 'vitamin_c'];
  barsEl.innerHTML = nutrients.map(n => {
    const val = food[n] ?? 0;
    const pct = Math.min(100, (val / MAX_VAL[n]) * 100);
    const tag = getRealityTag(n, val);
    const unit = n === 'calories' ? 'kcal' : n === 'iron' || n === 'vitamin_c' ? 'mg' : 'g';
    return `<div class="rl-row">
      <span class="rl-label">${NUTRIENT_ICON[n]} ${NUTRIENT_LABEL[n].split(' ')[0]}</span>
      <div class="rl-track">
        <div class="rl-fill" style="width:${pct}%;background:${NUTRIENT_COLOR[n]}"></div>
      </div>
      <span class="rl-val">${val} ${unit}</span>
      <span class="rl-tag ${tag.cls}">${tag.label}</span>
    </div>`;
  }).join('');

  document.getElementById('realityVerdict').textContent = getRealityVerdict(food);
}

window.renderReality = renderReality;

function getRealityTag(nutrient, val) {
  const tiers = {
    calories: [{max:100,cls:'tag-good',label:'Low'}, {max:300,cls:'tag-med',label:'Moderate'}, {max:Infinity,cls:'tag-hi',label:'High in calories'}],
    carbs:    [{max:15, cls:'tag-good',label:'Low carbs'}, {max:40,cls:'tag-med',label:'Moderate'}, {max:Infinity,cls:'tag-hi',label:'High in carbs'}],
    fat:      [{max:5,  cls:'tag-good',label:'Low fat'},   {max:20,cls:'tag-med',label:'Moderate fat'}, {max:Infinity,cls:'tag-hi',label:'High in fat'}],
    protein:  [{max:5,  cls:'tag-low', label:'Low protein'},{max:15,cls:'tag-ok', label:'Good amount'}, {max:Infinity,cls:'tag-good',label:'High protein'}],
    iron:     [{max:2,  cls:'tag-low', label:'Low iron'},  {max:5, cls:'tag-ok', label:'Decent iron'},  {max:Infinity,cls:'tag-good',label:'Good iron'}],
    vitamin_c:[{max:5,  cls:'tag-low', label:'Low vit C'}, {max:30,cls:'tag-ok', label:'Some vit C'},   {max:Infinity,cls:'tag-good',label:'High vit C'}],
  };
  for (const t of tiers[nutrient] || []) if (val <= t.max) return t;
  return { cls: 'tag-med', label: 'Moderate' };
}

function getRealityVerdict(food) {
  if (food.superCat === 'Drinks' && food.calories > 150)
    return '! More calories than it looks — and most of that is sugar, not nutrients.';
  if (food.calories > 450)
    return '! Very high in calories — not as healthy as it looks!';
  if (food.calories > 250 && food.fat > 15)
    return '! Higher in calories and fat than you might expect.';
  if (food.carbs > 60)
    return '! High in carbs — worth watching your portion size.';
  if (food.protein > 20 && food.calories < 200)
    return '✓ Great choice — high protein, lower calories!';
  return 'Check the full numbers before judging by appearance!';
}

/* ════════════════════════════════════════════
   FRUIT vs SMOOTHIE  (pull from CSV if found)
════════════════════════════════════════════ */
function updateFruitSmoothie() {
  const apple = foodData.find(f => f.food_name === 'Apple, raw') ||
                foodData.find(f => f.food_name.toLowerCase().includes('apple') && f.food_name.toLowerCase().includes('raw'));
  const smoothie = foodData.find(f => f.food_name.includes('NAKED JUICE') && f.food_name.includes('MANGO')) ||
                   foodData.find(f => f.food_name.toLowerCase().includes('smoothie') || f.food_name.toLowerCase().includes('naked juice'));

  if (apple) {
    setEl('fCal',  `${apple.calories} kcal`);
    setEl('fCarb', `${apple.carbs ?? '—'} g`);
    setEl('fFat',  `${apple.fat ?? '—'} g`);
    setEl('fProt', `${apple.protein ?? '—'} g`);
    setEl('fVitC', `${apple.vitamin_c ?? '—'} mg`);
    setEl('fIron', `${apple.iron ?? '—'} mg`);
  }

  if (smoothie) {
    setEl('sCal',  `${smoothie.calories} kcal`);
    setEl('sCarb', `${smoothie.carbs ?? '—'} g`);
    setEl('sFat',  `${smoothie.fat ?? 0} g`);
    setEl('sProt', `${smoothie.protein ?? '—'} g`);
    setEl('sVitC', `${smoothie.vitamin_c ?? '—'} mg`);
    setEl('sIron', `${smoothie.iron ?? '—'} mg`);

    // Update the mini-table label with actual food name
    const lblEl = document.querySelector('#fruitsplit .split-pink .mt-label');
    if (lblEl) lblEl.textContent = `NUTRITION (per 100g) — ${smoothie.food_name}`;
  }
}

/* ════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════ */
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function escapeSingle(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;');
}
