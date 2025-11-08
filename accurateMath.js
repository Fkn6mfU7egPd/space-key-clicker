function accuAdd(a, b) {
  if(a.includes("-")) {
    if(b.includes("-")) {
      if(a == "0" && b == "0") return "0";
      return "-" + accuAdd(a.slice(1), b.slice(1));
    }
    else return accuSub(b, a.slice(1));
  }
  if(b.includes("-")) return accuSub(a, b.slice(1));

  let temp1 = 0, temp2 = 0;
  if(a.includes(".") || b.includes(".")) {
    for(let temp27 = 0; Math.max(a.length, b.length) > temp27; temp27++) {
      if(a[a.length - 1 - temp27] === ".") temp1 = temp27;
      if(b[b.length - 1 - temp27] === ".") temp2 = temp27;
    }
  }
  let temp17 = a.replace(".", "") + "0".repeat(temp2 > temp1 ? temp2 - temp1 : 0);
  let temp21 = b.replace(".", "") + "0".repeat(temp1 > temp2 ? temp1 - temp2 : 0);

  let temp3 = "";
  let temp30 = 0;
  for(let temp27 = 0; Math.max(temp17.length, temp21.length) > temp27; temp27++) {
    temp3 = ((Number(temp17[temp17.length - 1 - temp27] || "0") + Number(temp21[temp21.length - 1 - temp27] || "0") + temp30) % 10).toString() + temp3;
    temp30 = Math.floor((Number(temp17[temp17.length - 1 - temp27] || "0") + Number(temp21[temp21.length - 1 - temp27] || "0") + temp30) / 10);
  }
  if(temp30 == 1) temp3 = "1" + temp3;

  let accuCalcResult = "";
  let temp27 = 0;
  for(; Math.max(temp1, temp2) > temp27; temp27++) {
    if(!(accuCalcResult === "" && temp3[temp3.length - 1 - temp27] === "0")) accuCalcResult = temp3[temp3.length - 1 - temp27] + accuCalcResult;
  }

  if(accuCalcResult !== "") accuCalcResult = "." + accuCalcResult;

  temp2 = "";
  let temp4 = temp3.length - temp27 - 1;
  for(let temp27 = 0; temp4 >= temp27; temp27++) {
    if(!(temp2 === "" && temp3[temp27] === "0")) {
      temp2 += temp3[temp27];
    }
  }
  if(temp2 === "") temp2 = "0";
  return temp2 + accuCalcResult;
  // var as = a.split("."),
  //   bs = b.split(".");
  // var ai = as[0],
  //   bi = bs[0];
  // var af = as[1] || "",
  //   bf = bs[1] || "";
  // while (af.length < bf.length) af += "0";
  // while (bf.length < af.length) bf += "0";

  // var carry = 0,
  //   resf = "";
  // for (var i = af.length - 1; i >= 0; i--) {
  //   var sum = Number(af[i]) + Number(bf[i]) + carry;
  //   carry = sum >= 10 ? 1 : 0;
  //   resf = (sum % 10) + resf;
  // }

  // var aiRev = ai.split("").reverse();
  // var biRev = bi.split("").reverse();
  // var len = Math.max(aiRev.length, biRev.length);
  // var resi = "";
  // for (var i = 0; i < len; i++) {
  //   var d1 = aiRev[i] ? Number(aiRev[i]) : 0;
  //   var d2 = biRev[i] ? Number(biRev[i]) : 0;
  //   var sum = d1 + d2 + carry;
  //   carry = sum >= 10 ? 1 : 0;
  //   resi = (sum % 10) + resi;
  // }
  // if (carry) resi = "1" + resi;

  // // 前ゼロ削除
  // var k = 0;
  // while (k < resi.length - 1 && resi[k] === "0") k++;
  // resi = resi.slice(k);

  // // 小数部の後ゼロ削除
  // var j = resf.length - 1;
  // while (j >= 0 && resf[j] === "0") j--;
  // resf = resf.slice(0, j + 1);

  // return resf.length > 0 ? resi + "." + resf : resi;
}

function accuSub(a, b) {
  if(a.includes("-")) {
    if(b.includes("-")) return accuAdd(a.slice(1), b.slice(1));
    else return accuSub(b, a.slice(1));
  }
  if(b.includes("-")) return accuAdd(a, b.slice(1));

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
  if(a.includes("-")) {
    if(b.includes("-")) return accuMul(a.slice(1), b.slice(1));
    else return "-" + accuMul(a.slice(1), b);
  }
  if(b.includes("-")) return "-" + accuMul(a, b.slice(1));

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
  if(b == "" || b == "0") {
    if(a == "" || a == "0") return "NaN";
    else if (a.includes("-")) return "-Infinity";
    else return "Infinity";
  }
  if(a.includes("-")) {
    if(b.includes("-")) return accuDiv(a.slice(1), b.slice(1), c);
    else return "-" + accuDiv(a.slice(1), b, c);
  }
  if(b.includes("-")) return "-" + accuDiv(a, b.slice(1), c);

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
