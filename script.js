/* ════════════════════════════════════════════
   CONSTANTS & MAPPINGS
════════════════════════════════════════════ */

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
  protein: '#6abf6a', iron: '#9b8ec4', vitamin_c: '#f5d05e',
};
const NUTRIENT_BAR_CLASS = {
  calories: 'bar-cal', fat: 'bar-fat', carbs: 'bar-carb',
  protein: 'bar-prot', iron: 'bar-iron', vitamin_c: 'bar-vitc',
};
const NUTRIENT_ICON = {
  calories: '🔥', fat: '💧', carbs: '🌾', protein: '💪', iron: '🩸', vitamin_c: '🍊',
};
const MAX_VAL  = { calories: 600, fat: 65, carbs: 85, protein: 40, iron: 22, vitamin_c: 110 };
const DAILY_VAL = { calories: 2000, fat: 78, carbs: 275, protein: 50, iron: 18, vitamin_c: 90 };

const CATEGORY_INSIGHTS = {
  calories: [
    '<span class="ins-orange">Snacks</span> have the highest average calories.',
    '<span class="ins-green">Fruits</span> and vegetables are the lowest.',
    '<span class="ins-blue">Dairy</span> and grains are moderate.',
  ],
  fat: [
    '<span class="ins-orange">Snacks</span> tend to be highest in fat.',
    '<span class="ins-green">Fruits</span> and vegetables are nearly fat-free.',
    '<span class="ins-blue">Dairy</span> varies widely by type.',
  ],
  carbs: [
    '<span class="ins-orange">Snacks</span> and <span class="ins-purple">Grains</span> lead in carbs.',
    '<span style="color:#c04040;font-weight:700">Protein</span> foods have almost zero carbs.',
    '<span class="ins-green">Fruits</span> contain natural sugars counted in carbs.',
  ],
  protein: [
    '<span style="color:#c04040;font-weight:700">Protein</span> foods rank the highest.',
    '<span class="ins-blue">Dairy</span> is also a solid protein source.',
    '<span class="ins-green">Fruits</span> and vegetables are low in protein.',
  ],
  iron: [
    'Vegetables and protein foods can be surprisingly high in iron.',
    '<span class="ins-green">Fruits</span> generally have lower iron levels.',
    'Dried fruits can be a surprisingly good iron source.',
  ],
  vitamin_c: [
    '<span class="ins-green">Fruits</span> are the clear winner in Vitamin C!',
    'Vegetables also provide a good amount of Vitamin C.',
    '<span class="ins-orange">Snacks</span> have very little Vitamin C.',
  ],
};

/* ════════════════════════════════════════════
   STATE
════════════════════════════════════════════ */
let foodData = [];
let selectedFood = null;
let barChartInst = null;
let scatterChartInst = null;

/* ════════════════════════════════════════════
   SCROLL ANIMATION OBSERVER
════════════════════════════════════════════ */
const animObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // animate nutrient bars when hook cards appear
        entry.target.querySelectorAll('.n-bar[data-width]').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        // animate breakdown bars in explore panel
        entry.target.querySelectorAll('.bd-fill[data-width]').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        // animate reality bars
        entry.target.querySelectorAll('.rl-fill[data-width]').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        // animate counter numbers
        entry.target.querySelectorAll('.counter[data-target]').forEach(el => {
          animateCounter(el, parseFloat(el.dataset.target), el.dataset.suffix || '');
        });
      }
    });
  },
  { threshold: 0.08 }
);

document.querySelectorAll(
  '.slide-left, .slide-right, .slide-up, .pop-in, .fade-up, .hook-card, section'
).forEach(el => animObserver.observe(el));

/* ════════════════════════════════════════════
   COUNTER ANIMATION
════════════════════════════════════════════ */
function animateCounter(el, target, suffix, duration = 1000) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

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

    // Default selection: Naked Juice or Apple
    const def = foodData.find(f => f.food_name.includes('NAKED JUICE'))
             || foodData.find(f => f.food_name === 'Apple, raw')
             || foodData[0];
    if (def) selectFood(def.food_name);
  },
});

/* ════════════════════════════════════════════
   SCATTER CHART
════════════════════════════════════════════ */
function buildScatter() {
  const superCats = [...new Set(foodData.map(d => d.superCat))].sort();

  const legendEl = document.getElementById('scatterLegend');
  if (legendEl) {
    legendEl.innerHTML =
      '<span class="cat-legend-label">CATEGORY &nbsp;</span>' +
      superCats.map(cat => `
        <span class="cl-item">
          <span class="cl-dot" style="background:${CAT_COLOR[cat] || '#aaa'}"></span>${cat}
        </span>`).join('');
  }

  const datasets = superCats.map(cat => ({
    label: cat,
    data: foodData
      .filter(d => d.superCat === cat && d.fat != null)
      .map(d => ({ x: d.calories, y: d.fat, name: d.food_name, cat: d.superCat, carbs: d.carbs, protein: d.protein })),
    backgroundColor: (CAT_COLOR[cat] || '#aaa') + 'bb',
    borderColor: CAT_COLOR[cat] || '#aaa',
    borderWidth: 1.5,
    pointRadius: 6,
    pointHoverRadius: 10,
  }));

  scatterChartInst = new Chart(document.getElementById('scatterChart'), {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      animation: { duration: 800, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.97)',
          titleColor: '#222',
          bodyColor: '#555',
          borderColor: '#e0d8cc',
          borderWidth: 2,
          padding: 14,
          cornerRadius: 14,
          titleFont: { family: 'Fredoka', size: 14, weight: 'bold' },
          bodyFont: { family: 'Nunito', size: 12 },
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
          grid: { color: '#f0ece8' },
          ticks: { color: '#888', font: { family: 'Nunito' } },
        },
        y: {
          title: { display: true, text: 'FAT (g) per 100g', font: { weight: 'bold', size: 11 }, color: '#666' },
          grid: { color: '#f0ece8' },
          ticks: { color: '#888', font: { family: 'Nunito' } },
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
        data: data.map(d => d.avg),
        backgroundColor: data.map(d => (CAT_COLOR[d.cat] || '#aaa') + 'cc'),
        borderColor: data.map(d => CAT_COLOR[d.cat] || '#aaa'),
        borderWidth: 2,
        borderRadius: 12,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      animation: { duration: 700, easing: 'easeOutBack' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.97)',
          titleColor: '#222',
          bodyColor: '#555',
          borderColor: '#e0d8cc',
          borderWidth: 2,
          padding: 12,
          cornerRadius: 12,
          titleFont: { family: 'Fredoka', size: 13 },
          bodyFont: { family: 'Nunito', size: 12 },
          callbacks: {
            label: ctx => `${NUTRIENT_LABEL[nutrient]}: ${ctx.raw.toFixed(1)}`,
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#555', font: { weight: 'bold', family: 'Nunito' } } },
        y: {
          grid: { color: '#f0ece8' },
          ticks: { color: '#888', font: { family: 'Nunito' } },
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
window.switchNutrient = switchNutrient;

/* ════════════════════════════════════════════
   EXPLORE — CATEGORY FILTER
════════════════════════════════════════════ */
function buildCatFilter() {
  const superCats = ['All Foods', ...new Set(foodData.map(d => d.superCat))].sort();
  const ordered   = ['All Foods', ...superCats.filter(c => c !== 'All Foods')];

  const el = document.getElementById('catFilterList');
  if (!el) return;
  el.innerHTML = ordered.map(cat => {
    const count = cat === 'All Foods' ? foodData.length : foodData.filter(d => d.superCat === cat).length;
    return `<button class="cf-btn ${cat === 'All Foods' ? 'active' : ''}"
               onclick="filterByCat('${esc(cat)}',this)">
              <span>${CAT_EMOJI[cat] || '🍴'} ${cat}</span>
              <span class="cf-count">${count}</span>
            </button>`;
  }).join('');
}

function filterByCat(cat, btn) {
  document.querySelectorAll('.cf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('foodSearch').value = '';
  renderFoodList(cat);
}
window.filterByCat = filterByCat;

/* ════════════════════════════════════════════
   EXPLORE — FOOD LIST
════════════════════════════════════════════ */
function renderFoodList(superCat) {
  const filtered = superCat === 'All Foods' ? foodData : foodData.filter(d => d.superCat === superCat);
  const sorted   = [...filtered].sort((a, b) => a.food_name.localeCompare(b.food_name));

  const el = document.getElementById('foodListEl');
  if (!el) return;
  el.innerHTML = sorted.map(f => {
    const isSel = selectedFood && selectedFood.food_name === f.food_name;
    return `<div class="fl-item ${isSel ? 'selected' : ''}" onclick="selectFood('${esc(f.food_name)}')">
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
   EXPLORE — SELECT FOOD & DETAIL PANEL
════════════════════════════════════════════ */
function selectFood(nameOrObj) {
  const food = typeof nameOrObj === 'string'
    ? foodData.find(f => f.food_name === nameOrObj)
    : nameOrObj;
  if (!food) return;
  selectedFood = food;

  document.querySelectorAll('.fl-item').forEach(el =>
    el.classList.toggle('selected', el.textContent.includes(food.food_name))
  );

  // Animate emoji box
  const emojiBox = document.getElementById('detailEmoji');
  emojiBox.style.transform = 'scale(0)';
  setTimeout(() => { emojiBox.style.transition = 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)'; emojiBox.style.transform = 'scale(1)'; }, 30);

  emojiBox.textContent = getFoodEmoji(food.food_name);
  document.getElementById('detailName').textContent  = food.food_name.toUpperCase();
  document.getElementById('detailKcal').textContent  = `${food.calories} kcal`;
  document.getElementById('detailDesc').textContent  = getFoodDesc(food);

  const nutrients = ['calories', 'protein', 'carbs', 'fat', 'iron', 'vitamin_c'];
  document.getElementById('breakdownRows').innerHTML = nutrients.map((n, i) => {
    const val = food[n] ?? 0;
    const pct = Math.min(100, (val / MAX_VAL[n]) * 100);
    const dv  = Math.round((val / DAILY_VAL[n]) * 100);
    const unit = n === 'calories' ? 'kcal' : n === 'iron' || n === 'vitamin_c' ? 'mg' : 'g';
    return `<div class="bd-row" style="transition-delay:${i * 0.06}s">
      <span class="bd-icon">${NUTRIENT_ICON[n]}</span>
      <span class="bd-name">${NUTRIENT_LABEL[n]}</span>
      <div class="bd-track">
        <div class="bd-fill ${NUTRIENT_BAR_CLASS[n]}" data-width="${pct}" style="width:0%"></div>
      </div>
      <span class="bd-val">${val} ${unit}</span>
      <span class="bd-dv">${dv}%</span>
    </div>`;
  }).join('');

  // Trigger bar animations with rAF
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('#breakdownRows .bd-fill[data-width]').forEach(bar => {
        bar.style.transition = 'width 0.9s cubic-bezier(0.25,1,0.5,1)';
        bar.style.width = bar.dataset.width + '%';
      });
    });
  });

  document.getElementById('dykText').textContent = getDYKFact(food);
}
window.selectFood = selectFood;

/* ════════════════════════════════════════════
   FOOD HELPERS
════════════════════════════════════════════ */
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
  if (n.includes('ice cream') || n.includes('frozen')) return '🍨';
  return '🍴';
}

function getFoodDesc(food) {
  const n = food.food_name.toLowerCase();
  if (n.includes('naked juice') || n.includes('mighty mango'))
    return 'A popular bottled fruit smoothie marketed as a healthy, vitamin-rich drink.';
  if (n.includes('chip'))       return 'Deep-fried sliced potatoes — crunchy and calorie-dense.';
  if (n.includes('yogurt'))     return 'A dairy snack that can vary widely in sugar depending on flavoring.';
  if (n.includes('apple, raw')) return 'A crisp, sweet whole fruit loaded with fiber and vitamins.';
  if (food.superCat === 'Snacks')
    return `A snack food with ${food.calories} kcal per 100g. Compare that to whole fruits at ~60 kcal!`;
  if (food.superCat === 'Fruits')
    return `A naturally sweet fruit with ${food.calories} kcal per 100g, rich in vitamins and fiber.`;
  if (food.superCat === 'Drinks')
    return `A beverage with ${food.calories} kcal per 100g. Many drinks lose fiber and nutrients during processing.`;
  return `${food.category} — ${food.calories} kcal, ${food.protein ?? '—'}g protein, ${food.carbs ?? '—'}g carbs per 100g.`;
}

function getDYKFact(food) {
  const n = food.food_name.toLowerCase();
  if (n.includes('naked') || n.includes('mighty mango'))
    return 'NAKED JUICE Mighty Mango has 4× the calories of a fresh apple per 100g, with almost no fiber!';
  if (n.includes('chip'))
    return 'Potato chips can pack more calories per 100g than many desserts — mostly from fat!';
  if (n.includes('yogurt') && n.includes('chobani'))
    return 'Greek yogurt is high in protein, but the flavored versions can pack surprising amounts of added sugar!';
  if (n.includes('apple, raw'))
    return 'An apple a day keeps the doctor away — only ~61 kcal per 100g and a solid dose of fiber!';
  if (n.includes('banana chips'))
    return 'Banana chips sound healthy, but frying concentrates calories to ~519 kcal — nearly same as potato chips!';
  if (n.includes('mango, raw'))
    return 'Fresh mango is only 60 kcal per 100g and packed with Vitamin C. Dried mango has 5× more calories!';
  if (food.superCat === 'Drinks')
    return 'Most bottled fruit drinks lose fiber during processing, leaving mostly sugar with little nutritional benefit.';
  if (food.superCat === 'Snacks')
    return `This snack has ${food.calories} kcal per 100g. Whole fruits average ~60 kcal — almost ${Math.round(food.calories / 60)}× less!`;
  return `${food.food_name} has ${food.calories} kcal, ${food.protein ?? '—'}g protein, and ${food.carbs ?? '—'}g carbs per 100g.`;
}

/* ════════════════════════════════════════════
   EXPECTATION vs REALITY
════════════════════════════════════════════ */
function buildRealitySelector() {
  const select = document.getElementById('realitySelect');
  if (!select) return;

  const priority = ['naked', 'juice', 'smoothie', 'yogurt', 'granola', 'dried', 'chips', 'banana chips'];
  const sorted = [...foodData].sort((a, b) => {
    const aP = priority.findIndex(k => a.food_name.toLowerCase().includes(k));
    const bP = priority.findIndex(k => b.food_name.toLowerCase().includes(k));
    return (aP === -1 ? 999 : aP) - (bP === -1 ? 999 : bP);
  });

  select.innerHTML = sorted.slice(0, 80).map(f =>
    `<option value="${escAttr(f.food_name)}">${f.food_name}</option>`
  ).join('');

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
  barsEl.innerHTML = nutrients.map((n, i) => {
    const val  = food[n] ?? 0;
    const pct  = Math.min(100, (val / MAX_VAL[n]) * 100);
    const tag  = getRealityTag(n, val);
    const unit = n === 'calories' ? 'kcal' : n === 'iron' || n === 'vitamin_c' ? 'mg' : 'g';
    return `<div class="rl-row" style="transition-delay:${i * 0.08}s">
      <span class="rl-label">${NUTRIENT_ICON[n]} ${NUTRIENT_LABEL[n].split(' ')[0]}</span>
      <div class="rl-track">
        <div class="rl-fill" data-width="${pct}" style="width:0%;background:${NUTRIENT_COLOR[n]}"></div>
      </div>
      <span class="rl-val">${val} ${unit}</span>
      <span class="rl-tag ${tag.cls}">${tag.label}</span>
    </div>`;
  }).join('');

  // Animate bars in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      barsEl.querySelectorAll('.rl-fill[data-width]').forEach(bar => {
        bar.style.transition = 'width 1.1s cubic-bezier(0.25,1,0.5,1)';
        bar.style.width = bar.dataset.width + '%';
      });
    });
  });

  document.getElementById('realityVerdict').textContent = getRealityVerdict(food);
}
window.renderReality = renderReality;

function getRealityTag(nutrient, val) {
  const tiers = {
    calories: [{max:100,cls:'tag-good',label:'Low'},{max:300,cls:'tag-med',label:'Moderate'},{max:Infinity,cls:'tag-hi',label:'High in calories'}],
    carbs:    [{max:15,cls:'tag-good',label:'Low carbs'},{max:40,cls:'tag-med',label:'Moderate'},{max:Infinity,cls:'tag-hi',label:'High in carbs'}],
    fat:      [{max:5,cls:'tag-good',label:'Low fat'},{max:20,cls:'tag-med',label:'Moderate fat'},{max:Infinity,cls:'tag-hi',label:'High in fat'}],
    protein:  [{max:5,cls:'tag-low',label:'Low protein'},{max:15,cls:'tag-ok',label:'Good amount'},{max:Infinity,cls:'tag-good',label:'High protein'}],
    iron:     [{max:2,cls:'tag-low',label:'Low iron'},{max:5,cls:'tag-ok',label:'Decent iron'},{max:Infinity,cls:'tag-good',label:'Good iron'}],
    vitamin_c:[{max:5,cls:'tag-low',label:'Low vit C'},{max:30,cls:'tag-ok',label:'Some vit C'},{max:Infinity,cls:'tag-good',label:'High vit C'}],
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
   FRUIT vs SMOOTHIE
════════════════════════════════════════════ */
function updateFruitSmoothie() {
  const apple = foodData.find(f => f.food_name === 'Apple, raw')
             || foodData.find(f => f.food_name.toLowerCase().includes('apple') && f.food_name.toLowerCase().includes('raw'));
  const smoothie = foodData.find(f => f.food_name.includes('NAKED JUICE') && f.food_name.includes('MANGO'))
                || foodData.find(f => f.food_name.toLowerCase().includes('smoothie') || f.food_name.toLowerCase().includes('naked juice'));

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
    const lbl = document.getElementById('smoothieMtLabel');
    if (lbl) lbl.textContent = `NUTRITION (per 100g) — ${smoothie.food_name}`;
  }
}

/* ════════════════════════════════════════════
   UTILITIES
════════════════════════════════════════════ */
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function esc(str)     { return str.replace(/'/g, "\\'"); }
function escAttr(str) { return str.replace(/"/g, '&quot;'); }
