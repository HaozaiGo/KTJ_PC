import { JSEncrypt } from "jsencrypt";
import { getPublicKey } from "@/api/common/user.js";

import CryptoJS from "crypto-js";
const privateKey =
  "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMFPa+v52FkSUXvcUnrGI/XzW3EpZRI0s9BCWJ3oNQmEYA5luWW5p8h0uadTIoTyYweFPdH4hveyxlwmS7oefvbIdiP+o+QIYW/R4Wjsb4Yl8MhR4PJqUE3RCy6IT9fM8ckG4kN9ECs6Ja8fQFc6/mSl5dJczzJO3k1rWMBhKJD/AgMBAAECgYEAucMakH9dWeryhrYoRHcXo4giPVJsH9ypVt4KzmOQY/7jV7KFQK3x//27UoHfUCak51sxFw9ek7UmTPM4HjikA9LkYeE7S381b4QRvFuf3L6IbMP3ywJnJ8pPr2l5SqQ00W+oKv+w/VmEsyUHr+k4Z+4ik+FheTkVWp566WbqFsECQQDjYaMcaKw3j2Zecl8T6eUe7fdaRMIzp/gcpPMfT/9rDzIQk+7ORvm1NI9AUmFv/FAlfpuAMrdL2n7p9uznWb7RAkEA2aP934kbXg5bdV0R313MrL+7WTK/qdcYxATUbMsMuWWQBoS5irrt80WCZbG48hpocJavLNjbtrjmUX3CuJBmzwJAOJg8uP10n/+ZQzjEYXh+BszEHDuw+pp8LuT/fnOy5zrJA0dO0RjpXijO3vuiNPVgHXT9z1LQPJkNrb5ACPVVgQJBALPeb4uV0bNrJDUb5RB4ghZnIxv18CcaqNIft7vuGCcFBAIPIRTBprR+RuVq+xHDt3sNXdsvom4h49+Hky1b0ksCQBBwUtVaqH6ztCtwUF1j2c/Zcrt5P/uN7IHAd44K0gIJc1+Csr3qPG+G2yoqRM8KVqLI8Z2ZYn9c+AvEE+L9OQY=";

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description RSA加密
 * @param data
 * @returns {Promise<{param: PromiseLike<ArrayBuffer>}|*>}
 */
export async function encryptedData(data) {
  let publicKey = "";
  const res = await getPublicKey();
  publicKey = res.data;
  if (publicKey.mockServer) {
    publicKey = "";
  }
  if (publicKey == "") {
    return data;
  }

  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(
    `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`
  );
  data = encrypt.encrypt(JSON.stringify(data));
  return {
    param: data,
  };
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description RSA解密
 * @param data
 * @returns {PromiseLike<ArrayBuffer>}
 */
// export function decryptedData(data) {
//   const decrypt = new JSEncrypt();
//   decrypt.setPrivateKey(
//     `-----BEGIN RSA PRIVATE KEY-----${privateKey}-----END RSA PRIVATE KEY-----`
//   );
//   data = decrypt.decrypt(JSON.stringify(data));
//   return data;
// }

// KTJ专属加密
const AES_KEY = CryptoJS.enc.Utf8.parse("KTJ20240715_0001");
const iv = CryptoJS.enc.Utf8.parse("KTJ20240715_IV01");

export function encryptMessage(message) {
  const encrypted = CryptoJS.AES.encrypt(message, AES_KEY, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  console.log(encrypted);
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  // return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
}
