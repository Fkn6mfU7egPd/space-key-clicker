function accuAdd(a, b) {
  var as = a.split("."),
    bs = b.split(".");
  var ai = as[0],
    bi = bs[0];
  var af = as[1] || "",
    bf = bs[1] || "";
  while (af.length < bf.length) af += "0";
  while (bf.length < af.length) bf += "0";

  var carry = 0,
    resf = "";
  for (var i = af.length - 1; i >= 0; i--) {
    var sum = Number(af[i]) + Number(bf[i]) + carry;
    carry = sum >= 10 ? 1 : 0;
    resf = (sum % 10) + resf;
  }

  var aiRev = ai.split("").reverse();
  var biRev = bi.split("").reverse();
  var len = Math.max(aiRev.length, biRev.length);
  var resi = "";
  for (var i = 0; i < len; i++) {
    var d1 = aiRev[i] ? Number(aiRev[i]) : 0;
    var d2 = biRev[i] ? Number(biRev[i]) : 0;
    var sum = d1 + d2 + carry;
    carry = sum >= 10 ? 1 : 0;
    resi = (sum % 10) + resi;
  }
  if (carry) resi = "1" + resi;

  // 前ゼロ削除
  var k = 0;
  while (k < resi.length - 1 && resi[k] === "0") k++;
  resi = resi.slice(k);

  // 小数部の後ゼロ削除
  var j = resf.length - 1;
  while (j >= 0 && resf[j] === "0") j--;
  resf = resf.slice(0, j + 1);

  return resf.length > 0 ? resi + "." + resf : resi;
}

function accuSub(a, b) {
  var neg = false;
  function cmp(x, y) {
    var xs = x.split("."),
      ys = y.split(".");
    var xi = xs[0],
      yi = ys[0];
    if (xi.length != yi.length) return xi.length - yi.length;
    if (xi != yi) return xi > yi ? 1 : -1;
    var xf = xs[1] || "",
      yf = ys[1] || "";
    while (xf.length < yf.length) xf += "0";
    while (yf.length < xf.length) yf += "0";
    if (xf != yf) return xf > yf ? 1 : -1;
    return 0;
  }
  if (cmp(a, b) < 0) {
    var t = a;
    a = b;
    b = t;
    neg = true;
  }

  var as = a.split("."),
    bs = b.split(".");
  var ai = as[0],
    bi = bs[0];
  var af = as[1] || "",
    bf = bs[1] || "";
  while (af.length < bf.length) af += "0";
  while (bf.length < af.length) bf += "0";

  var borrow = 0,
    resf = "";
  for (var i = af.length - 1; i >= 0; i--) {
    var diff = Number(af[i]) - Number(bf[i]) - borrow;
    if (diff < 0) {
      diff += 10;
      borrow = 1;
    } else borrow = 0;
    resf = diff + resf;
  }

  var aiRev = ai.split("").reverse();
  var biRev = bi.split("").reverse();
  var len = Math.max(aiRev.length, biRev.length);
  var resi = "";
  for (var i = 0; i < len; i++) {
    var d1 = aiRev[i] ? Number(aiRev[i]) : 0;
    var d2 = biRev[i] ? Number(biRev[i]) : 0;
    var diff = d1 - d2 - borrow;
    if (diff < 0) {
      diff += 10;
      borrow = 1;
    } else borrow = 0;
    resi = diff + resi;
  }

  // 前ゼロ削除
  var k = 0;
  while (k < resi.length - 1 && resi[k] === "0") k++;
  resi = resi.slice(k);

  // 小数部の後ゼロ削除
  var j = resf.length - 1;
  while (j >= 0 && resf[j] === "0") j--;
  resf = resf.slice(0, j + 1);

  var result = resf.length > 0 ? resi + "." + resf : resi;
  return neg ? "-" + result : result;
}

function accuMul(a, b) {
  var as = a.split("."),
    bs = b.split(".");
  var ai = as[0] + (as[1] || "");
  var bi = bs[0] + (bs[1] || "");
  var aflen = as[1] ? as[1].length : 0;
  var bflen = bs[1] ? bs[1].length : 0;
  var totalDec = aflen + bflen;

  var res = new Array(ai.length + bi.length);
  for (var i = 0; i < res.length; i++) res[i] = 0;

  for (var i = ai.length - 1; i >= 0; i--) {
    for (var j = bi.length - 1; j >= 0; j--) {
      var mul = Number(ai[i]) * Number(bi[j]);
      var p1 = i + j,
        p2 = i + j + 1;
      var sum = mul + res[p2];
      res[p2] = sum % 10;
      res[p1] += Math.floor(sum / 10);
    }
  }
  var result = res.join("");

  // 前ゼロ削除
  var k = 0;
  while (k < result.length - 1 && result[k] === "0") k++;
  result = result.slice(k);

  if (totalDec > 0) {
    while (result.length <= totalDec) result = "0" + result;
    result = result.slice(0, result.length - totalDec) + "." + result.slice(result.length - totalDec);
    // 小数部の後ゼロ削除
    var parts = result.split(".");
    if (parts[1]) {
      var j = parts[1].length - 1;
      while (j >= 0 && parts[1][j] === "0") j--;
      parts[1] = parts[1].slice(0, j + 1);
      if (parts[1].length === 0) result = parts[0];
      else result = parts[0] + "." + parts[1];
    }
  }
  return result;
}

function accuDiv(a, b, c = 10) {
  var as = a.split("."),
    bs = b.split(".");
  var ai = as[0] + (as[1] || "");
  var bi = bs[0] + (bs[1] || "");
  var aflen = as[1] ? as[1].length : 0;
  var bflen = bs[1] ? bs[1].length : 0;
  var scale = aflen - bflen;

  // 前ゼロ削除
  var k = 0;
  while (k < ai.length - 1 && ai[k] === "0") k++;
  var dividend = ai.slice(k);
  k = 0;
  while (k < bi.length - 1 && bi[k] === "0") k++;
  var divisor = bi.slice(k);

  if (divisor === "0") return "NaN";

  var quotient = "";
  var temp = "";
  var idx = 0;
  var decCount = 0;
  var hasDot = false;

  while (idx < dividend.length || decCount < c) {
    if (idx < dividend.length) {
      temp += dividend[idx++];
    } else {
      if (!hasDot) {
        quotient += ".";
        hasDot = true;
      }
      temp += "0";
      decCount++;
    }
    // 前ゼロ削除
    var t = 0;
    while (t < temp.length - 1 && temp[t] === "0") t++;
    temp = temp.slice(t);

    var q = 0;
    while (accuSub(temp, divisor)[0] !== "-") {
      temp = accuSub(temp, divisor);
      q++;
    }
    quotient += q;
  }

  if (scale > 0) {
    while (quotient.length <= scale) quotient = "0" + quotient;
    quotient = quotient.slice(0, quotient.length - scale) + "." + quotient.slice(quotient.length - scale);
  } else if (scale < 0) {
    for (var i = 0; i < -scale; i++) quotient += "0";
  }

  // 小数点以下の余分なゼロを削除
  if (quotient.indexOf(".") >= 0) {
    var parts = quotient.split(".");
    // 前ゼロ削除
    var p0 = parts[0];
    var m = 0;
    while (m < p0.length - 1 && p0[m] === "0") m++;
    p0 = p0.slice(m);
    // 後ゼロ削除
    var p1 = parts[1];
    var n = p1.length - 1;
    while (n >= 0 && p1[n] === "0") n--;
    p1 = p1.slice(0, n + 1);
    quotient = p0 + (p1.length > 0 ? "." + p1 : "");
  } else {
    var m = 0;
    while (m < quotient.length - 1 && quotient[m] === "0") m++;
    quotient = quotient.slice(m);
  }
  return quotient;
}
