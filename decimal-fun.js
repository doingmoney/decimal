function getRealVal(w, len, mlen) { // 获取尾数的值
  let val = 0
  if (w != 0) {
    w = w * Math.pow(10, mlen)
    val = w / Math.pow(10, len)
  }
  return val
}

function getRealWei(w, mlen, base) { // 处理最终的尾数
  let val = w
  if (w != 0) {
    let wlen = (w + '').length
    if (mlen - wlen) {
      for (let m = 0, len = mlen - wlen; m < len; m++) {
        val = '0' + val
      }
    }
  }
  return val
}

function handleWei(newa, new_wei, wei_base) { // 处理正负数
  let negative = newa < 0
  if (newa < 0) {
    if (new_wei > 0) {
      newa += 1
      new_wei = wei_base - new_wei
    } else {
      new_wei = -new_wei
    }
  } else if (newa == 0) {
    if (new_wei < 0) {
      new_wei = -new_wei
      negative = true
    }
  } else if (newa > 0) {
    if (new_wei < 0) {
      newa -= 1
      new_wei = wei_base + new_wei
      negative = newa < 0
    }
  }
  return {
    newa,
    new_wei,
    negative
  }
}

function eliminateDot(d) {
  // 以小数点拆分
  let asp = d + ''
  let obj = Object.create(null)
  if (asp.indexOf('.') != -1) {
    let asplits = asp.split('.')
    obj.len = asplits[1].length
    obj.val = Number(asplits.join(''))
  } else {
    obj.len = 0
    obj.val = d
  }
  return obj
}

const minus = function (prev, beminus, opt) {
  /*
  prev: 第一个数 Number
  beminus: 第二个数 Number
  opt: 备留拓展
  */
  let asp = prev + '';
  let adp = beminus + '';
  let asp_prev = '';
  let asp_wei = '';
  let adp_prev = '';
  let adp_wei = '';
  let slen = 0;
  let dlen = 0;
  let maxlen = 0;

  // 以小数点拆分
  if (asp.indexOf('.') != -1) {
    let asplits = asp.split('.')
    asp_prev = parseInt(asplits[0])
    slen = asplits[1].length
    asp_wei = parseInt(asplits[1])
  } else {
    asp_prev = parseInt(asp)
    asp_wei = 0
  }
  if (asp < 0) asp_wei = -asp_wei

  if (adp.indexOf('.') != -1) {
    let dsplits = adp.split('.')
    adp_prev = parseInt(dsplits[0])
    dlen = dsplits[1].length
    adp_wei = parseInt(dsplits[1])
  } else {
    adp_prev = parseInt(adp)
    adp_wei = 0
  }
  if (adp < 0) adp_wei = -adp_wei

  if (slen > dlen) {
    maxlen = slen
  } else {
    maxlen = dlen
  }

  let newa = asp_prev - adp_prev;
  let new_wei = 0
  let wei_base = Math.pow(10, maxlen)

  // 获取真整尾数
  asp_wei = getRealVal(asp_wei, slen, maxlen)
  adp_wei = getRealVal(adp_wei, dlen, maxlen)

  new_wei = asp_wei - adp_wei

  let newval = '' // 计算后的数

  if (new_wei == 0) {
    newval = newa + ''
  } else {
    let result = handleWei(newa, new_wei, wei_base)
    let negative = result.negative
    newa = result.newa
    new_wei = result.new_wei

    new_wei = getRealWei(new_wei, maxlen)
    newval = newa + '.' + new_wei
    if (negative && Number(newval) > 0) newval = '-' + newval
    if (newval[newval.length - 1] == '0') {
      newval = newval.substring(0, newval.length - 1)
    }
  }
  return newval
}

const plus = function (prev, beminus, opt) {
  /*
  prev: 第一个数 Number
  beminus: 第二个数 Number
  opt: 备留拓展
  */
  let asp = prev + '';
  let adp = beminus + '';
  let asp_prev = '';
  let asp_wei = '';
  let adp_prev = '';
  let adp_wei = '';
  let slen = 0;
  let dlen = 0;
  let maxlen = 0;

  // 以小数点拆分
  if (asp.indexOf('.') != -1) {
    let asplits = asp.split('.')
    asp_prev = parseInt(asplits[0])
    slen = asplits[1].length
    asp_wei = parseInt(asplits[1])
  } else {
    asp_prev = parseInt(asp)
    asp_wei = 0
  }
  if (asp < 0) asp_wei = -asp_wei

  if (adp.indexOf('.') != -1) {
    let dsplits = adp.split('.')
    adp_prev = parseInt(dsplits[0])
    dlen = dsplits[1].length
    adp_wei = parseInt(dsplits[1])
  } else {
    adp_prev = parseInt(adp)
    adp_wei = 0
  }
  if (adp < 0) adp_wei = -adp_wei

  if (slen > dlen) {
    maxlen = slen
  } else {
    maxlen = dlen
  }

  let newa = asp_prev + adp_prev;
  let new_wei = 0
  let wei_base = Math.pow(10, maxlen)

  // 获取真整尾数
  asp_wei = getRealVal(asp_wei, slen, maxlen)
  adp_wei = getRealVal(adp_wei, dlen, maxlen)

  new_wei = asp_wei + adp_wei

  let newval = '' // 计算后的数

  if (new_wei == 0) {
    newval = newa + ''
  } else {
    let result = handleWei(newa, new_wei, wei_base)
    let negative = result.negative
    newa = result.newa
    new_wei = result.new_wei

    let new_len = (new_wei + '').length
    if (new_len && new_len - maxlen) {
      let prev = (new_wei + '').slice(0, new_len - maxlen)
      let next = (new_wei + '').slice(new_len - maxlen)
      newa += Number(prev)
      new_wei = Number(next)
    }

    if (!new_wei) {
      newval = newa + ''
    } else {
      new_wei = getRealWei(new_wei, maxlen, wei_base)

      newval = newa + '.' + new_wei
      if (negative && Number(newval) > 0) newval = '-' + newval
      if (newval[newval.length - 1] == '0') {
        newval = newval.substring(0, newval.length - 1)
      }
    }

  }

  return newval
}

const makePercent = function (d, str) {
  /*
  d: 小数
  str: 为真时和%一起返回
  */
  d = d + ''
  if (d.indexOf('.') != -1) {
    let ds = d.split('.')
    let dl = Math.pow(10, ds[1].length)
    d = Number(ds.join('')) * 100
    d /= dl
  } else {
    d = Number(d) * 100
  }
  if (str) d = d + '%'
  return d
}

const times = function (prev, beminus, opt) {
  /*
  prev: 第一个数 Number
  beminus: 第二个数 Number
  opt: 备留拓展
  */
  let aobj = eliminateDot(prev)
  let bobj = eliminateDot(beminus)
  let newval = aobj.val * bobj.val;
  let maxlen = aobj.len + bobj.len;
  let basenum = Math.pow(10, maxlen)
  if (basenum) newval = newval / basenum
  return newval
}

const divide = function (prev, beminus, opt) {
  /*
  prev: 第一个数 Number
  beminus: 第二个数 Number
  opt: 备留拓展
  */
  let aobj = eliminateDot(prev)
  let bobj = eliminateDot(beminus)
  let newval = aobj.val / bobj.val;
  let maxlen = aobj.len - bobj.len;
  let basenum = 0
  if (maxlen > 0) {
    basenum = Math.pow(10, maxlen)
    if (basenum) {
      newval = newval / basenum
    }
  } else {
    newval = times(newval, Math.pow(10, -maxlen))
  }
  return newval
}

const keepPrecise = function (num, p, opt) {
  /*
  num: 处理的数 Number
  p: 保留的小数
  opt: 备留拓展
  */
  p = p || 0
  let val = num + ''
  let dl = 0
  if (val.indexOf('.') != -1) {
    let ds = val.split('.')
    dl = ds[1].length
    if(p==0){
      val = ds[0]
    }else if(p<=dl){
      ds[1] = ds[1].substring(0,p)
      val = ds.join('.')
    }
  }

  return val
}

export default {
  minus, // 两数相减
  plus, // 两数相加
  makePercent, // 乘100 转百分比
  times, // 两数相乘
  divide, // 两数相除
  keepPrecise, // 保留小数位
}
