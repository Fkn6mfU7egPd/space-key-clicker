const scoreElem = document.getElementById("score");
const items = Array.from(document.getElementsByClassName("item"));
const settingsButton = document.getElementById("settings-button");
const formatter = (factor, num = score) => num.div(new Decimal(factor)).toPrecision(3);

let score = new Decimal(0);
let clickPower = new Decimal(1);
let clickMultiplier = new Decimal(1);
let autoPower = new Decimal(0);
let autoMultiplier = new Decimal(1);
let prevTime = Date.now();
let pressing = false;
let fps = 0;
let fpsPrevTime = Date.now();
let formatCfg = {
  type: "Standard", // Classic (Q,Qui,S,Sp...) | Standard (Qa,Qi,Sx,Sp...)
  whitespaceBeforeSuffix: false, // false (e.g. 123.4k, 133e36) | true (e.g. 123.4 k, 133 e36) | (sample is written on standard type and lowercase k)
  uppercaseK: false, // false (e.g. 123.4k) | true (e.g. 123.4K) | (sample is written on no whitespace before suffix)
};
let isSettingsPanelOpen = false;
let clickPowerDirty = true;
let autoPowerDirty = true;

document.getElementById("scale-type").addEventListener("change", event => {
  formatCfg.type = event.target.value;
  clickPowerDirty = true;
  autoPowerDirty = true;
});

document.getElementById("whitespaceBeforeSuffix").addEventListener("change", event => {
  switch (event.target.value){
    case "no": formatCfg.whitespaceBeforeSuffix = false; break;
    case "yes": formatCfg.whitespaceBeforeSuffix = true; break;
  }
  clickPowerDirty = true;
  autoPowerDirty = true;
});

document.getElementById("uppercase-k").addEventListener("change", event => {
  switch (event.target.value){
    case "no": formatCfg.uppercaseK = false; break;
    case "yes": formatCfg.uppercaseK = true; break;
  }
  clickPowerDirty = true;
  autoPowerDirty = true;
});

document.getElementById("themecolor-light").addEventListener("change", event => {
  document.body.style.setProperty("--themecolor-light", event.target.value);
});

document.getElementById("themecolor-dark").addEventListener("change", event => {
  document.body.style.setProperty("--themecolor-dark", event.target.value);
});

// 有効数字digits桁まで切り落とす
const toExponential = (num, digits = 3) => {
  num = num.abs();
  if (num.equals(0)) return "0";
  const mantissa = (num.mantissa * (10 ** Math.floor(num.log10() % 3)));
  return mantissa.toPrecision(digits) + (formatCfg.whitespaceBeforeSuffix ? " " : "") + (formatCfg.type === "Classic" ? "E" : "e") + Math.floor(num.log10() / 3) * 3;
}

addEventListener("click", event => {
  if (event.target.closest(".item-block") || event.target.closest("#settings-button") || (event.target.closest("#settings-panel") && isSettingsPanelOpen) || event.target.closest("#powerDisplay")) return;
  score = score.plus(clickPower.mul(clickMultiplier));
});

settingsButton.addEventListener("click", () => {
  if (isSettingsPanelOpen){
    document.getElementById("settings-panel").style.clipPath = "inset(0 0 100% 0)";
    isSettingsPanelOpen = !isSettingsPanelOpen;
  }else{
    document.getElementById("settings-panel").style.clipPath = "inset(0 0 0 0)";
    isSettingsPanelOpen = !isSettingsPanelOpen;
  }
});

addEventListener("keydown", event => {
  if (event.key === " "){
    event.preventDefault();
    if (pressing) return;
    pressing = true;
    score = score.plus(clickPower.mul(clickMultiplier));
  }
});

addEventListener("keyup", event => {
  if (event.key === " ") pressing = false;
});

function formatNumber(num){
  num = new Decimal(num);
  const suffixes = (formatCfg.type === "Standard") ? [
    {exp: 3, suffix: (formatCfg.uppercaseK ? "K" : "k")},
    {exp: 6, suffix: "M"},
    {exp: 9, suffix: "B"},
    {exp: 12, suffix: "T"},
    {exp: 15, suffix: "Qa"},
    {exp: 18, suffix: "Qi"},
    {exp: 21, suffix: "Sx"},
    {exp: 24, suffix: "Sp"},
    {exp: 27}
  ] : (formatCfg.type === "Classic") ? [
    {exp: 3, suffix: (formatCfg.uppercaseK ? "K" : "k")},
    {exp: 6, suffix: "M"},
    {exp: 9, suffix: "B"},
    {exp: 12, suffix: "T"},
    {exp: 15, suffix: "Q"},
    {exp: 18, suffix: "Qui"},
    {exp: 21, suffix: "S"},
    {exp: 24, suffix: "Sp"},
    {exp: 27}
  ] : [
    {exp: 0}
  ];
  suffixes.sort((a, b) => b.exp - a.exp);

  if (num.exponent >= suffixes[0].exp){
    return toExponential(num);
  }else if (num.exponent < suffixes.at(-1).exp){
    return formatter('1', num);
  }else{
    for (const suffix of suffixes){
      if (num.exponent >= suffix.exp){
        return formatter('1e' + suffix.exp, num) + (formatCfg.whitespaceBeforeSuffix ? " " : "") + suffix.suffix;
      }
    }
  }
}

const themeColors = {
  light: [
    {color: "lightblue", colorName: "ライトブルー (デフォルト)", selected: true},
    {color: "lightpink", colorName: "ライトピンク"},
    {color: "lightgray", colorName: "ライトグレー"},
    {color: "mediumaquamarine", colorName: "ミントグリーン"},
    {color: "lightgreen", colorName: "グリーン"},
    {color: "plum", colorName: "マゼンタ"},
    {color: "peachpuff", colorName: "ベージュ"},
    {color: "paleturquoise", colorName: "シアン"},
    {color: "thistle", colorName: "パープル"},
    {color: "wheat", colorName: "イエロー"},
    {color: "burlywood", colorName: "ブラウン"},
    {color: "skyblue", colorName: "スカイブルー"}
  ],
  dark: [
    {color: "#2c2c80", colorName: "#2c2c80 (デフォルト)", selected: true},
    {color: "darkred", colorName: "ダークレッド"}
  ]
}

themeColors.light.forEach(e => {
  const button = document.createElement("label");
  const br = document.createElement("br");
  button.innerHTML = `<input type="radio" name="themecolor-light" value="${e.color}"${e.selected ? " checked" : ""}><span style="color: ${e.color};">●</span>${e.colorName}`
  document.querySelector("#themecolor-light").append(button, br);
});

themeColors.dark.forEach(e => {
  const button = document.createElement("label");
  const br = document.createElement("br");
  button.innerHTML = `<input type="radio" name="themecolor-dark" value="${e.color}"${e.selected ? " checked" : ""}><span style="color: ${e.color};">●</span>${e.colorName}`
  document.querySelector("#themecolor-dark").append(button, br);
});

items.forEach(item => {
  const priceDisplay = document.createElement("div");
  priceDisplay.className = "price-display";
  item.parentElement.append(priceDisplay);

  const remainDisplay = document.createElement("div");
  remainDisplay.className = "remain-display";
  item.parentElement.append(remainDisplay);

  item.addEventListener('click', () => {
    const {price, multiplier, amount} = item;
    const action = item.dataset.action;

    if (score.lt(price)) return;

    score = score.sub(price);

    item.price = price.mul(multiplier);

    switch(action) {
      case "cp": clickPower = clickPower.plus(amount); clickPowerDirty = true; break;
      case "cm": clickMultiplier = clickMultiplier.plus(amount); clickPowerDirty = true; break;
      case "ap": autoPower = autoPower.plus(amount); autoPowerDirty = true; break;
      case "am": autoMultiplier = autoMultiplier.plus(amount); autoPowerDirty = true; break;
      case "mcp": clickPower = clickPower.mul(amount); clickPowerDirty = true; break;
      case "map": autoPower = autoPower.mul(amount); autoPowerDirty = true; break;
      default: console.warn("Unknown action:", action);
    }
  });

  item.price = new Decimal(item.dataset.price);
  item.multiplier = new Decimal(item.dataset.multiplier);
  item.amount = new Decimal(item.dataset.amount);
  item.priceDisplay = priceDisplay;
  item.remainDisplay = remainDisplay;
});

function maxPurchasesFormula(a, x, y){ // 初期価格、倍率、所持金
  if (x.equals(1)) return y.div(a).floor();
  const one = new Decimal(1);
  const threshold = one.minus(y.div(a).mul(one.minus(x)));
  if (threshold.lte(0)) return 0;

  const n = Decimal.log(threshold, x);
  return Math.floor(n);
}

function tick(){
  items.forEach(item => {
    const {price, multiplier, priceDisplay, remainDisplay} = item;
    priceDisplay.textContent = "値段: " + formatNumber(price);
    const remain = price.minus(score);
    if (score.lt(price)){
      remainDisplay.textContent = "あと" + formatNumber(remain) + "スコア\n";
      remainDisplay.textContent += "(" + formatNumber(remain.div(clickPower.mul(clickMultiplier))) + "クリック";
      if (autoPower.eq(0)){
        remainDisplay.textContent += ")";
      }else{
        remainDisplay.textContent += " / " + formatNumber(remain.div(autoPower.mul(autoMultiplier))) + "秒)";
      };
    }else{
      remainDisplay.textContent = maxPurchasesFormula(price, multiplier, score).toString() + "個購入可能";
    }
  });

  if (clickPowerDirty){
    document.getElementById("clickPowerDisplay").textContent = "クリックパワー: " +
    formatNumber(clickPower.mul(clickMultiplier)) + " (" +
    formatNumber(clickPower) + " +" + formatNumber(clickMultiplier.minus(1).mul(100)) + "%)";
    clickPowerDirty = false;
  }

  if (autoPowerDirty){
    document.getElementById("autoPowerDisplay").textContent = "自動: " +
    formatNumber(autoPower.mul(autoMultiplier)) + " (" +
    formatNumber(autoPower) + " +" + formatNumber(autoMultiplier.minus(1).mul(100)) + "%)";
    autoPowerDirty = true;
  }

  scoreElem.textContent = formatNumber(score);
  score = score.plus(autoPower.mul(autoMultiplier).mul((Date.now() - prevTime) / 1000));

  fps++;
  if (Date.now() - fpsPrevTime >= 1000){
    document.getElementById("fpsDisplay").textContent = fps.toString();
    fpsPrevTime = Date.now();
    fps = 0;
  }
  prevTime = Date.now();
  requestAnimationFrame(tick);
}

tick();