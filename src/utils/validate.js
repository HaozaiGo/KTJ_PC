/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判读是否为外链
 * @param path
 * @returns {boolean}
 */
import request from "@/config/request.js";
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}
// 获取验证码
export function getCodeImg(username) {
  return request({
    url: "/api/code",
    method: "get",
    params: { username: username },
  });
}
/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 校验密码是否小于6位
 * @param str
 * @returns {boolean}
 */
export function isPassword(str) {
  return str.length >= 6;
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否为数字
 * @param value
 * @returns {boolean}
 */
export function isNumber(value) {
  const reg = /^[0-9]*$/;
  return reg.test(value);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否是名称
 * @param value
 * @returns {boolean}
 */
export function isName(value) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
  return reg.test(value);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否为IP
 * @param ip
 * @returns {boolean}
 */
export function isIP(ip) {
  const reg =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  return reg.test(ip);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否是传统网站
 * @param url
 * @returns {boolean}
 */
export function isUrl(url) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否是小写字母
 * @param str
 * @returns {boolean}
 */
export function isLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否是大写字母
 * @param str
 * @returns {boolean}
 */
export function isUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否是大写字母开头
 * @param str
 * @returns {boolean}
 */
export function isAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否是字符串
 * @param str
 * @returns {boolean}
 */
export function isString(str) {
  return typeof str === "string" || str instanceof String;
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否是数组
 * @param arg
 * @returns {arg is any[]|boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === "undefined") {
    return Object.prototype.toString.call(arg) === "[object Array]";
  }
  return Array.isArray(arg);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否是端口号
 * @param str
 * @returns {boolean}
 */
export function isPort(str) {
  const reg =
    /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
  return reg.test(str);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否是手机号
 * @param str
 * @returns {boolean}
 */
export function isPhone(str) {
  const reg = /^1\d{10}$/;
  return reg.test(str);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否是身份证号(第二代)
 * @param str
 * @returns {boolean}
 */
export function isIdCard(str) {
  const reg =
    /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  return reg.test(str);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否是邮箱
 * @param str
 * @returns {boolean}
 */
export function isEmail(str) {
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return reg.test(str);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否中文
 * @param str
 * @returns {boolean}
 */
export function isChina(str) {
  const reg = /^[\u4E00-\u9FA5]{2,4}$/;
  return reg.test(str);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否为空
 * @param str
 * @returns {boolean}
 */
export function isBlank(str) {
  return (
    str == null ||
    false ||
    str === "" ||
    str.trim() === "" ||
    str.toLocaleLowerCase().trim() === "null"
  );
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否为固话
 * @param str
 * @returns {boolean}
 */
export function isTel(str) {
  const reg =
    /^(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/;
  return reg.test(str);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断是否为数字且最多两位小数
 * @param str
 * @returns {boolean}
 */
export function isNum(str) {
  const reg = /^\d+(\.\d{1,2})?$/;
  return reg.test(str);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断经度 -180.0～+180.0（整数部分为0～180，必须输入1到5位小数）
 * @param str
 * @returns {boolean}
 */
export function isLongitude(str) {
  const reg = /^[-|+]?(0?\d{1,2}\.\d{1,5}|1[0-7]?\d{1}\.\d{1,5}|180\.0{1,5})$/;
  return reg.test(str);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断纬度 -90.0～+90.0（整数部分为0～90，必须输入1到5位小数）
 * @param str
 * @returns {boolean}
 */
export function isLatitude(str) {
  const reg = /^[-|+]?([0-8]?\d{1}\.\d{1,5}|90\.0{1,5})$/;
  return reg.test(str);
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description rtsp校验，只要有rtsp://
 * @param str
 * @returns {boolean}
 */
export function isRTSP(str) {
  const reg =
    /^rtsp:\/\/([a-z]{0,10}:.{0,10}@)?(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  const reg1 =
    /^rtsp:\/\/([a-z]{0,10}:.{0,10}@)?(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):[0-9]{1,5}/;
  const reg2 =
    /^rtsp:\/\/([a-z]{0,10}:.{0,10}@)?(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\//;
  return reg.test(str) || reg1.test(str) || reg2.test(str);
}

// 账号的验证
var checkuserName = (rule, value, callback) => {
  var reg = /^[a-zA-Z0-9_]+$/;
  var reg1 = /^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/;
  if (value) {
    if (value.toString().length > 20) {
      callback(new Error("不能大于20个字符"));
    } else if (!reg.test(value)) {
      callback(new Error("数字、字母及下划线组合"));
    } else if (!reg1.test(value)) {
      callback(new Error("不能以下划线开头或结尾"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 名字/角色的验证
var checknickName = (rule, value, callback) => {
  if (value) {
    var reg = /^[a-zA-Z0-9&-_\u4e00-\u9fa5]+$/;
    var reg1 = /^(?!_)(?!.*?_$)[a-zA-Z0-9&-_\u4e00-\u9fa5]+$/;
    if (value.toString().length > 20) {
      callback(new Error("不能大于20个字符"));
    } else if (!reg.test(value)) {
      callback(new Error("请输入：数字、汉字、字母、- 、& 、 _ "));
    } else if (!reg1.test(value)) {
      callback(new Error("不能以下划线开头或结尾"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
// 邮箱的验证
var emailCheck = (rule, value, callback) => {
  if (value) {
    var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的邮箱"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 经度判断
var checkLongitude = (rule, value, callback) => {
  if (value) {
    if (value.toString().length > 10) {
      callback(new Error("不能大于10个数字"));
    } else if (value <= 180 && value >= -180) {
      callback();
    } else {
      callback(new Error("经度范围：-180°～180°"));
    }
  } else {
    callback();
  }
};
// 纬度判断
var checkLatitude = (rule, value, callback) => {
  if (value) {
    if (value.toString().length > 10) {
      callback(new Error("不能大于10个数字"));
    } else if (value <= 90 && value >= -90) {
      callback();
    } else {
      callback(new Error("纬度范围：-90°～90°"));
    }
  } else {
    callback();
  }
};

// 验证码
var vilidate = (rule, value, callback) => {
  var reg = /^\S+$/;
  if (value) {
    if (!reg.test(value)) {
      callback(new Error("由英文、字母组成"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
// 仪表地址码
var InstrumentAddressCode = (rule, value, callback) => {
  var reg = /^\d+$/;
  if (value) {
    if (!reg.test(value)) {
      callback(new Error("只能输入数字"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
// 能耗数据采集器地址码
var EnergyConsumptionAddressCode = (rule, value, callback) => {
  var reg = /^\d+$/;
  if (value) {
    if (!reg.test(value)) {
      callback(new Error("只能输入数字"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

//检验是否超出99999999.99
let checkOutNum = (rule, value, callback) => {
  if (value === 0 || value) {
    var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
    if (value < 0) {
      callback(new Error("只能输入正数"));
    } else if (value > 999999999.99) {
      value = 99999999.99;
      callback();
    } else if (!reg.test(value)) {
      callback(new Error("只能输入数字"));
    } else {
      callback();
    }
  }
};
// 需要输入个数的输入框
var numberInputs2 = (rule, value, callback) => {
  if (value === 0 || value) {
    var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;

    if (!reg.test(value)) {
      callback(new Error("只能输入9位数字"));
    } else if (value.toString().length > 9) {
      callback(new Error("只能输入9位数字"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
// 身份证校验
var IDCard = (rule, value, callback) => {
  if (value === 0 || value) {
    var reg =
      /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;

    if (!reg.test(value)) {
      callback(new Error("请输入正确的身份证"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

export let rules = {
  // 必填
  required: function (message) {
    return [{ required: true, message, trigger: "change" }];
  },
  // 账号
  account: function (message, isRequired = true) {
    if (isRequired) {
      return [
        {
          required: true,
          message: message ? message : "请输入账号",
          trigger: "change",
        },
        { validator: checkuserName, trigger: "change" },
        // { min: 1, max: 10, message: "不能大于20个字符", trigger: "change" },
      ];
    } else {
      return [
        { validator: checkuserName, trigger: "change" },
        // { min: 1, max: 10, message: "不能大于20个字符", trigger: "change" },
      ];
    }
  },
  // 姓名/名称
  name: function (isRequired = true, message = "请输入姓名/名称") {
    if (isRequired)
      return [
        { required: true, message, trigger: "change" },
        { validator: checknickName, trigger: "change" },
      ];
    else
      return [
        { validator: checknickName, trigger: "change" },
        { min: 1, max: 20, message: "不能大于20个字符", trigger: "change" },
      ];
  },
  // 密码
  password: function (isRequired = true) {
    if (isRequired)
      return [
        { required: true, message: "请输入密码", trigger: "change" },
        {
          min: 6,
          max: 16,
          message: "密码6到16位",
          trigger: "change",
        },
      ];
    else
      return [
        {
          min: 6,
          max: 16,
          message: "密码6到16位",
          trigger: "change",
        },
      ];
  },
  // 验证码
  vilidate: function () {
    return [
      { required: true, message: "请输入验证码", trigger: "change" },
      {
        max: 4,
        message: "请输入四位验证码",
        trigger: "change",
      },
      { validator: vilidate, trigger: "change" },
    ];
  },

  // 备注/详情/描述/简介等
  remarks: function () {
    return [{ max: 100, message: "不能大于100个字符", trigger: "change" }];
  },
  // 常规地址
  address: function () {
    return [{ max: 50, message: "不能大于50个字符", trigger: "change" }];
  },
  // 仪表地址码
  InstrumentAddressCode: function () {
    return [
      { max: 40, message: "不能大于40个数字", trigger: "change" },
      { validator: InstrumentAddressCode, trigger: "change" },
    ];
  },
  // 能耗数据采集器地址码
  EnergyConsumptionAddressCode: function () {
    return [
      { max: 6, message: "不能大于6个数字", trigger: "change" },
      { validator: EnergyConsumptionAddressCode, trigger: "change" },
    ];
  },
  // 需要输入数字的输入框（比如个数、面积等）
  numberInput(isRequired = false, isRequired_message = "不能为空") {
    if (isRequired) {
      return [
        { required: true, message: isRequired_message, trigger: "change" },
        { validator: numberInputs, trigger: "change" },
      ];
    } else {
      return [{ validator: numberInputs, trigger: "change" }];
    }
  },
  // 需要输入个数的输入框
  numberInput2(isRequired = false, isRequired_message = "不能为空") {
    if (isRequired) {
      return [
        { required: true, message: isRequired_message, trigger: "change" },
        { validator: numberInputs2, trigger: "change" },
      ];
    } else {
      return [{ validator: numberInputs2, trigger: "change" }];
    }
  },
  //范围99999999.99
  numberMax(isRequired = false, isRequired_message = "不能为空") {
    if (isRequired) {
      return [
        { requird: true, message: isRequired_message, trigger: "blur" },
        { validator: checkOutNum, trigger: "blur" },
      ];
    }
  },
  //
  IDCard(isRequired = false, isRequired_message = "不能为空") {
    if (isRequired) {
      return [
        { required: true, message: isRequired_message, trigger: "change" },
        { validator: IDCard, trigger: "change" },
      ];
    } else {
      return [{ validator: IDCard, trigger: "change" }];
    }
  },
  // 需要输入文字的框（例如部门名称、指令名称等）
  textInput() {
    return [
      { max: 20, message: "不能大于20个数字", trigger: "change" },
      { validator: checknickName, trigger: "change" },
    ];
  },
  // 经纬度范围
  // 经度
  longitudeInput() {
    return [{ validator: checkLongitude, trigger: "change" }];
  },
  // 纬度
  latitudeInput() {
    return [
      {
        pattern: /^[+-]?((\d*(\.\d{1,})$)|(\d+$))/,
        message: "只能输入数字",
        trigger: "change",
      },
      { validator: checkLatitude, trigger: "change" },
    ];
  },
  //纯电话号码
  phoneNumberReg(rule, value, callback) {
    let reg = /^[0-9]+$/;
    if (value.length != 11) {
      callback(new Error("手机号位数不正确"));
    } else if (!reg.test(value)) {
      callback(new Error("输入必须为数字"));
    } else {
      callback();
    }
  },
  // 手机号
  phoneNumber(isRequired = false) {
    if (isRequired) {
      return [
        { required: true, message: "请输入手机号", trigger: "change" },
        { max: 11, message: "不能大于11个数字", trigger: "change" },
        { validator: EnergyConsumptionAddressCode, trigger: "change" },
      ];
    } else {
      return [
        { max: 11, message: "不能大于11个数字", trigger: "change" },
        { validator: EnergyConsumptionAddressCode, trigger: "change" },
      ];
    }
  },
  // 座机
  seatNumber() {
    return [
      { required: true, message: "请输入座机号", trigger: "change" },
      { max: 12, message: "不能大于12个数字", trigger: "change" },
      { validator: EnergyConsumptionAddressCode, trigger: "change" },
    ];
  },
  // 关键字
  keyWord() {
    return [{ max: 10, message: "不能大于20个字符", trigger: "change" }];
  },
  // 邮箱验证
  email() {
    return [{ validator: emailCheck, trigger: "change" }];
  },
};
