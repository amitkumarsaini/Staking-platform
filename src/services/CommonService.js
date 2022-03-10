import BigNumber from "big-number";

const convertWithDecimal = (value, decimal) => {
  if (value > 0) {
    if (isInt(value)) {
      value = parseInt(value);
      value = BigNumber(value).multiply(decimal);
    } else {
      value = value * decimal;
      value = toFixed(value);
      value = parseInt(value.toString().split(".")[0]);
      value = toFixed(value);
      value = BigNumber(value);
    }
    return value.toString();
  } else {
    return 0;
  }
};

const toFixed = (x) => {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
};

const isInt = (n) => {
  return n % 1 === 0;
};

const getError = (error) => {
  console.log("error -", error)
  let errorMsg =
    error && error.message ? error.message : "Something went wrong";
  if (errorMsg.indexOf("Internal JSON-RPC error") > -1) {
    let msg = errorMsg.replace("Internal JSON-RPC error.", "");
    msg = JSON.parse(msg);
    return msg.message.split(":")[1];
  } else if (errorMsg.indexOf("execution reverted:") > -1) {
    let errorMsg = error.message.split("{")[0].replace('InverseV0:', '')
    return errorMsg;
  } else {
    return errorMsg;
  }
};

const custmizeAddress = (address) => {
  let firstFive = address.substring(0, 5);
  let lastFour = address.substr(address.length - 4);
  return firstFive + "..." + lastFour;
};

const getCoinType = (type) => {
  type = type.toLowerCase();
  type = type === "defi" ? 1 : type === "chain" ? 2 : type === "nft" ? 3 : 0;
  return type;
};


const fixedToDecimal = (value, decimals = 2) => {
  value = value && parseFloat(value) > 0 ? value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] : 0
  return value;
};
export const CommonService = {
  convertWithDecimal,
  toFixed,
  getError,
  custmizeAddress,
  getCoinType,
  fixedToDecimal
};
