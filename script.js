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
  'Fruits': '#6abf6a', 'Vegetables': '#e8c040', 'Dairy': '#6b9fd4',
  'Grains': '#9b8ec4', 'Protein': '#e85d5d', 'Snacks': '#f5a623',
  'Drinks': '#40c0c0', 'Other': '#a08060',
};

const CAT_IMAGE_SRC = {
  'Fruits': 'images/fruits.png', 'Vegetables': 'images/vegetables.png',
  'Dairy': 'images/dairy.png',   'Grains': 'images/grains.png',
  'Protein': 'images/protein.png', 'Snacks': 'images/snacks.png',
  'Drinks': 'images/drinks.png',
};

// Preload all category images so they're ready when the chart draws
const catImgs = {};
Object.entries(CAT_IMAGE_SRC).forEach(([cat, src]) => {
  const img = new Image();
  img.src = src;
  catImgs[cat] = img;
});

const barImagePlugin = {
  id: 'barImages',
  afterDatasetDraw(chart) {
    const { ctx, data } = chart;
    const meta = chart.getDatasetMeta(0);
    const size = 40;
    meta.data.forEach((bar, i) => {
      const label = data.labels[i];
      const img = catImgs[label];
      if (!img || !img.complete || !img.naturalWidth) return;
      ctx.save();
      ctx.drawImage(img, bar.x - size / 2, bar.y - size - 8, size, size);
      ctx.restore();
    });
  },
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
const MAX_VAL   = { calories: 600, fat: 65, carbs: 85, protein: 40, iron: 22, vitamin_c: 110 };
const DAILY_VAL = { calories: 2000, fat: 78, carbs: 275, protein: 50, iron: 18, vitamin_c: 90 };

const CATEGORY_INSIGHTS = {
  calories: [
    '<span class="ins-orange">Snacks</span> are the highest at ~418 kcal avg — more than double grains.',
    '<span class="ins-blue">Dairy</span> and <span class="ins-teal">Drinks</span> are the lowest calorie categories.',
    '<span class="ins-green">Fruits</span> avg ~166 kcal — higher than dairy despite the "healthy" label.',
  ],
  fat: [
    '<span class="ins-orange">Snacks</span> lead with ~21g fat avg — nearly double grains.',
    '<span class="ins-teal">Drinks</span> are nearly fat-free at just 0.1g avg.',
    '<span class="ins-blue">Dairy</span> is surprisingly low at ~2.5g avg — lower than protein foods.',
  ],
  carbs: [
    '<span class="ins-orange">Snacks</span> and <span class="ins-purple">Grains</span> are nearly tied at ~40–42g avg.',
    '<span style="color:#c04040;font-weight:700">Protein</span> foods have the fewest carbs at ~11g avg.',
    '<span class="ins-green">Fruits</span> (~23g) have more carbs than <span class="ins-blue">Dairy</span> (~15g).',
  ],
  protein: [
    '<span style="color:#c04040;font-weight:700">Protein</span> foods lead at ~8g avg, but <span class="ins-purple">Grains</span> are close at ~5.5g.',
    '<span class="ins-blue">Dairy</span> is a solid source at ~4.5g — similar to snacks.',
    '<span class="ins-green">Fruits</span> and <span class="ins-teal">Drinks</span> have almost no protein.',
  ],
  iron: [
    '<span class="ins-purple">Grains</span> top the iron chart at ~1.9mg avg — often due to fortification.',
    '<span class="ins-orange">Snacks</span>, <span class="ins-green">Vegetables</span>, and <span style="color:#c04040;font-weight:700">Protein</span> are all similar (~1–1.3mg).',
    '<span class="ins-blue">Dairy</span> and <span class="ins-teal">Drinks</span> are the lowest iron sources.',
  ],
  vitamin_c: [
    '<span class="ins-teal">Drinks</span> top Vitamin C at ~21mg avg — mostly from juices.',
    '<span class="ins-green">Vegetables</span> and <span class="ins-green">Fruits</span> are nearly tied at ~20mg avg.',
    '<span class="ins-blue">Dairy</span> has almost no Vitamin C at just ~1mg avg.',
  ],
};

/* ════════════════════════════════════════════
   DISPLAY FILTER — hide near-duplicates in UI
   (data is still used for charts/averages)
════════════════════════════════════════════ */
// Also filter clearly anomalous calorie values (>900 kcal per 100g for non-oil/fat foods)
function isAnomalous(food) {
  const n = food.food_name.toLowerCase();
  const isOilOrFat = n.includes('oil') || n.includes('butter') || n.includes('lard') || n.includes('margarine');
  return food.calories > 900 && !isOilOrFat;
}

/* ════════════════════════════════════════════
   STATE
════════════════════════════════════════════ */
let foodData       = [];   // full dataset (for charts)
let selectedFood   = null;
let barChartInst   = null;
let scatterChartInst = null;

/* ════════════════════════════════════════════
   SECTION-BASED ANIMATION OBSERVER
   Observing sections is more reliable than
   observing individual animated elements,
   because parent opacity-0 can hide children
   before they ever enter the viewport rect.
════════════════════════════════════════════ */
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const sec = entry.target;
    // Animate all children that have entry-animation classes
    const animEls = sec.querySelectorAll(
      '.slide-left, .slide-right, .slide-up, .pop-in, .fade-up, .hook-card'
    );
    animEls.forEach((el, i) => {
      // Respect existing CSS transition-delay by reading it
      const cssDelay = parseFloat(getComputedStyle(el).transitionDelay) || 0;
      setTimeout(() => el.classList.add('visible'), 80 + i * 30 + cssDelay * 1000);
    });

    // Animate n-bars (hook card nutrient bars)
    setTimeout(() => {
      sec.querySelectorAll('.n-bar[data-width]').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }, 350);

    // Stop observing once triggered — avoids re-firing on scroll up/down
    sectionObserver.unobserve(sec);
  });
}, { threshold: 0.06 });

document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));


/* ════════════════════════════════════════════
   COUNTER ANIMATION
════════════════════════════════════════════ */
function animateCounter(el, target, suffix = '', duration = 900) {
  const start = performance.now();
  function tick(now) {
    const t     = Math.min((now - start) / duration, 1);
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
    renderIngredients();
    updateBowl();
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
      superCats.map(cat =>
        `<span class="cl-item">
           <span class="cl-dot" style="background:${CAT_COLOR[cat] || '#aaa'}"></span>${cat}
         </span>`
      ).join('');
  }

  const datasets = superCats.map(cat => ({
    label: cat,
    data: foodData
      .filter(d => d.superCat === cat && d.fat != null && !isAnomalous(d))
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
          titleColor: '#222', bodyColor: '#555',
          borderColor: '#e0d8cc', borderWidth: 2,
          padding: 14, cornerRadius: 14,
          titleFont: { family: 'Fredoka', size: 14, weight: 'bold' },
          bodyFont:  { family: 'Nunito', size: 12 },
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
          grid: { color: '#f0ece8' }, ticks: { color: '#888' },
        },
        y: {
          title: { display: true, text: 'FAT (g) per 100g', font: { weight: 'bold', size: 11 }, color: '#666' },
          grid: { color: '#f0ece8' }, ticks: { color: '#888' },
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
  foodData.filter(d => !isAnomalous(d)).forEach(d => {
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
    plugins: [barImagePlugin],
    data: {
      labels: data.map(d => d.cat),
      datasets: [{
        label: NUTRIENT_LABEL[nutrient],
        data:  data.map(d => d.avg),
        backgroundColor: data.map(d => (CAT_COLOR[d.cat] || '#aaa') + 'cc'),
        borderColor:     data.map(d => CAT_COLOR[d.cat] || '#aaa'),
        borderWidth: 2, borderRadius: 12, borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      animation: { duration: 700, easing: 'easeOutBack' },
      layout: { padding: { top: 48 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.97)',
          titleColor: '#222', bodyColor: '#555',
          borderColor: '#e0d8cc', borderWidth: 2,
          padding: 12, cornerRadius: 12,
          titleFont: { family: 'Fredoka', size: 13 },
          bodyFont:  { family: 'Nunito', size: 12 },
          callbacks: { label: ctx => `${NUTRIENT_LABEL[nutrient]}: ${ctx.raw.toFixed(1)}` },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#555', font: { weight: 'bold' } } },
        y: {
          grid: { color: '#f0ece8' }, ticks: { color: '#888' },
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
/* ════════════════════════════════════════════
   BUILD YOUR OWN BOWL
════════════════════════════════════════════ */
const BOWL_INGREDIENTS = {
  fruit: [
    { id:'banana',      emoji:'🍌', label:'Banana',        cal:89,  fat:0.3, carb:23, prot:1.1, desc:'1 medium' },
    { id:'strawberry',  emoji:'🍓', label:'Strawberries',  cal:32,  fat:0.3, carb:7,  prot:0.7, desc:'½ cup' },
    { id:'mango',       emoji:'🥭', label:'Mango',         cal:60,  fat:0.4, carb:15, prot:0.8, desc:'½ cup' },
    { id:'blueberry',   emoji:'🫐', label:'Blueberries',   cal:42,  fat:0.2, carb:11, prot:0.6, desc:'½ cup' },
    { id:'granola',     emoji:'🌾', label:'Granola',       cal:120, fat:5.0, carb:18, prot:3.0, desc:'¼ cup',    addon:true },
    { id:'honey',       emoji:'🍯', label:'Honey',         cal:64,  fat:0.0, carb:17, prot:0.1, desc:'1 tbsp',   addon:true },
    { id:'yogurt',      emoji:'🥛', label:'Yogurt',        cal:59,  fat:0.6, carb:8,  prot:3.5, desc:'¼ cup',    addon:true },
    { id:'coconut',     emoji:'🥥', label:'Coconut',       cal:71,  fat:7.0, carb:3,  prot:0.7, desc:'2 tbsp',   addon:true },
    { id:'peanutbutter',emoji:'🥜', label:'Peanut Butter', cal:95,  fat:8.0, carb:3,  prot:4.0, desc:'1 tbsp',   addon:true },
  ],
  salad: [
    { id:'lettuce',  emoji:'🥬', label:'Lettuce',          cal:5,   fat:0.1, carb:1,  prot:0.5, desc:'1 cup' },
    { id:'chicken',  emoji:'🍗', label:'Chicken',          cal:165, fat:3.6, carb:0,  prot:31,  desc:'3 oz' },
    { id:'tomato',   emoji:'🍅', label:'Tomatoes',         cal:18,  fat:0.2, carb:4,  prot:0.9, desc:'½ cup' },
    { id:'cucumber', emoji:'🥒', label:'Cucumber',         cal:8,   fat:0.1, carb:2,  prot:0.3, desc:'½ cup' },
    { id:'cheese',   emoji:'🧀', label:'Feta Cheese',      cal:75,  fat:6.0, carb:1,  prot:4.0, desc:'1 oz',    addon:true },
    { id:'dressing', emoji:'🫙', label:'Caesar Dressing',  cal:78,  fat:8.0, carb:1,  prot:0.5, desc:'1 tbsp',  addon:true },
    { id:'croutons', emoji:'🍞', label:'Croutons',         cal:93,  fat:3.5, carb:14, prot:2.5, desc:'¼ cup',   addon:true },
    { id:'avocado',  emoji:'🥑', label:'Avocado',          cal:80,  fat:7.0, carb:4,  prot:1.0, desc:'¼ avoc.', addon:true },
    { id:'almonds',  emoji:'🌰', label:'Almonds',          cal:82,  fat:7.0, carb:3,  prot:3.0, desc:'1 tbsp',  addon:true },
  ],
  hotpot: [
    { id:'broth',    emoji:'🍲', label:'Broth Base',       cal:15,  fat:0.5, carb:2,  prot:1.5, desc:'1 cup' },
    { id:'beef',     emoji:'🥩', label:'Beef Slices',      cal:190, fat:12,  carb:0,  prot:22,  desc:'3 oz' },
    { id:'tofu',     emoji:'🟨', label:'Tofu',             cal:70,  fat:4.0, carb:2,  prot:8.0, desc:'½ cup' },
    { id:'mushroom', emoji:'🍄', label:'Mushrooms',        cal:22,  fat:0.3, carb:3,  prot:3.1, desc:'½ cup' },
    { id:'noodles',  emoji:'🍜', label:'Noodles',          cal:110, fat:0.5, carb:24, prot:3.5, desc:'½ cup',   addon:true },
    { id:'cabbage',  emoji:'🥬', label:'Cabbage',          cal:13,  fat:0.1, carb:3,  prot:0.9, desc:'1 cup',   addon:true },
    { id:'sesame',   emoji:'🫙', label:'Sesame Oil',       cal:120, fat:14,  carb:0,  prot:0.0, desc:'1 tbsp',  addon:true },
    { id:'dipper',   emoji:'🌶️', label:'Dipping Sauce',   cal:45,  fat:2.0, carb:5,  prot:1.0, desc:'2 tbsp',  addon:true },
    { id:'egg',      emoji:'🥚', label:'Egg',              cal:78,  fat:5.0, carb:0.6,prot:6.0, desc:'1 large', addon:true },
  ],
};

const BOWL_CAL_MAX  = 800;
const BOWL_FAT_MAX  = 50;
const BOWL_CARB_MAX = 100;
const BOWL_PROT_MAX = 50;

let currentBowlType = 'fruit';
let selectedIngredients = new Set();

const BOWL_DISH_EMOJI = { fruit: '🥣', salad: '🥗', hotpot: '🍲' };

function selectBowlType(type, btn) {
  currentBowlType = type;
  selectedIngredients = new Set();
  document.querySelectorAll('.bowl-type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const dish = document.querySelector('.bowl-dish');
  if (dish) dish.textContent = BOWL_DISH_EMOJI[type] || '🥣';
  renderIngredients();
  updateBowl();
}

function resetBowl() {
  selectedIngredients = new Set();
  renderIngredients();
  updateBowl();
}

function renderIngredients() {
  const grid = document.getElementById('ingredientGrid');
  if (!grid) return;
  grid.innerHTML = BOWL_INGREDIENTS[currentBowlType].map(item => `
    <div class="ing-card ${selectedIngredients.has(item.id) ? 'ing-selected' : ''} ${item.addon ? 'ing-addon' : ''}"
         onclick="toggleIngredient('${item.id}')">
      ${item.addon ? '<span class="ing-addon-tag">ADD-ON</span>' : ''}
      <span class="ing-emoji">${item.emoji}</span>
      <span class="ing-label">${item.label}</span>
      <span class="ing-desc">${item.desc}</span>
      <span class="ing-cal">${item.cal} kcal</span>
    </div>
  `).join('');
}

function toggleIngredient(id) {
  selectedIngredients.has(id) ? selectedIngredients.delete(id) : selectedIngredients.add(id);
  renderIngredients();
  updateBowl();
}

function updateBowl() {
  const items    = BOWL_INGREDIENTS[currentBowlType];
  const selected = items.filter(i => selectedIngredients.has(i.id));
  const totalCal  = selected.reduce((s, i) => s + i.cal,  0);
  const totalFat  = selected.reduce((s, i) => s + i.fat,  0);
  const totalCarb = selected.reduce((s, i) => s + i.carb, 0);
  const totalProt = selected.reduce((s, i) => s + i.prot, 0);

  document.getElementById('bowlCal').textContent  = Math.round(totalCal);
  document.getElementById('bowlFat').textContent  = totalFat.toFixed(1);
  document.getElementById('bowlCarb').textContent = Math.round(totalCarb);
  document.getElementById('bowlProt').textContent = totalProt.toFixed(1);

  document.getElementById('bowlCalBar').style.width  = Math.min(100, (totalCal  / BOWL_CAL_MAX)  * 100) + '%';
  document.getElementById('bowlFatBar').style.width  = Math.min(100, (totalFat  / BOWL_FAT_MAX)  * 100) + '%';
  document.getElementById('bowlCarbBar').style.width = Math.min(100, (totalCarb / BOWL_CARB_MAX) * 100) + '%';
  document.getElementById('bowlProtBar').style.width = Math.min(100, (totalProt / BOWL_PROT_MAX) * 100) + '%';

  document.getElementById('bowlEmojis').innerHTML =
    selected.map(i => `<span class="bowl-ing-emoji">${i.emoji}</span>`).join('');

  const insightEl = document.getElementById('bowlInsight');
  const msgEl     = document.getElementById('bowlMessage');
  const highFat   = selected.filter(i => i.fat >= 5).map(i => i.label);

  let msg, insight, cls = '';
  if (selected.length === 0) {
    msg = 'Add ingredients to start!';
    insight = '🌱 Your bowl is empty, pick some ingredients!';
    cls = '';
  } else if (totalCal <= 150) {
    msg = '🌱 Light and refreshing!';
    insight = '✅ Very light bowl! Low in calories and fat. Great base!';
    cls = 'good';
  } else if (totalCal <= 300) {
    msg = '😊 A balanced choice.';
    insight = '👍 Solid and balanced. Watch out if you start adding the add-ons!';
    cls = 'good';
  } else if (totalCal <= 500) {
    msg = '📈 Calories are climbing...';
    insight = highFat.length
      ? `⚠️ ${highFat.join(' & ')} ${highFat.length > 1 ? 'are' : 'is'} adding a lot of fat. Add-ons add up fast!`
      : '📈 Getting calorie-dense. Consider swapping an add-on for more fruit.';
    cls = '';
  } else if (totalCal <= 700) {
    msg = '⚠️ More than it looks!';
    insight = `😲 At ${Math.round(totalCal)} kcal, this is almost a full restaurant meal! And most of it is coming from the add-ons.`;
    cls = 'warning';
  } else {
    msg = '🔥 This is a full meal!';
    insight = `🚨 ${Math.round(totalCal)} kcal! More than many fast food meals. Small add-ons make a massive difference.`;
    cls = 'warning';
  }

  if (msgEl)     msgEl.textContent = msg;
  if (insightEl) { insightEl.textContent = insight; insightEl.className = 'bowl-insight ' + cls; }
}

/* ════════════════════════════════════════════
   DRINKING FRUIT ≠ EATING FRUIT
════════════════════════════════════════════ */
const dfPlateItems = new Set();

function selectDFMode(mode, btn) {
  document.querySelectorAll('.df-toggle-btn').forEach(b => b.classList.remove('df-active'));
  btn.classList.add('df-active');
  const drinkPanel = document.getElementById('dfDrinkPanel');
  const eatPanel   = document.getElementById('dfEatPanel');
  if (mode === 'drink') {
    drinkPanel.classList.remove('df-hidden');
    eatPanel.classList.add('df-hidden');
  } else {
    drinkPanel.classList.add('df-hidden');
    eatPanel.classList.remove('df-hidden');
  }
}

function toggleDFFruit(id, emoji, name) {
  if (dfPlateItems.has(id)) {
    dfPlateItems.delete(id);
  } else {
    dfPlateItems.add(id);
  }
  // Update card selected state
  document.querySelectorAll('.df-fruit-card').forEach(card => {
    const cardName = card.querySelector('.df-fruit-name').textContent;
    if (cardName === name) card.classList.toggle('df-fruit-selected', dfPlateItems.has(id));
  });
  updateDFPlate();
}

function updateDFPlate() {
  const plate = document.getElementById('dfPlate');
  const msg   = document.getElementById('dfPlateMsg');
  if (!plate) return;

  // Rebuild plate from all selected fruits using stored data
  const fruitData = [
    { id:'mango',      emoji:'🥭', name:'Mango' },
    { id:'orange',     emoji:'🍊', name:'Orange' },
    { id:'banana',     emoji:'🍌', name:'Banana' },
    { id:'apple',      emoji:'🍎', name:'Apple' },
    { id:'pineapple',  emoji:'🍍', name:'Pineapple' },
    { id:'strawberry', emoji:'🍓', name:'Strawberry' },
  ];
  const selected = fruitData.filter(f => dfPlateItems.has(f.id));

  if (selected.length === 0) {
    plate.innerHTML = '<span class="df-plate-empty">← pick some fruits</span>';
    msg.textContent = '';
    return;
  }

  plate.innerHTML = selected.map(f => `<span class="df-plate-fruit">${f.emoji}</span>`).join('');

  const messages = [
    '',
    '🍽️ One piece of fruit — a quick snack.',
    '🍽️ Two fruits — that\'s already a sizeable snack with texture and chewing.',
    '🍽️ Three fruits — starting to feel like a proper fruit bowl!',
    '🍽️ Four fruits — you can see how much fruit this would feel like compared to a single drink.',
    '🍽️ Five fruits — this would take a while to eat. The drink takes 10 seconds.',
    '🍽️ All six fruits — now imagine drinking all of this in one bottle. That\'s what fruit drinks can feel like to your body.'
  ];
  msg.textContent = messages[Math.min(selected.length, 6)];
}

/* ════════════════════════════════════════════
   UTILITIES
════════════════════════════════════════════ */
function setEl(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function esc(str)     { return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }
function escAttr(str) { return str.replace(/"/g, '&quot;'); }
