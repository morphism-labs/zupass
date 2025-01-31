"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  RSAPCD: () => RSAPCD,
  RSAPCDPackage: () => RSAPCDPackage,
  RSAPCDTypeName: () => RSAPCDTypeName,
  deserialize: () => deserialize,
  getDisplayOptions: () => getDisplayOptions,
  prove: () => prove,
  serialize: () => serialize,
  verify: () => verify
});
module.exports = __toCommonJS(src_exports);

// src/RSAPCD.ts
var import_json_bigint = __toESM(require("json-bigint"));
var import_node_rsa = __toESM(require("node-rsa"));
var import_uuid = require("uuid");

// src/CardBody.tsx
var import_passport_ui = require("@pcd/passport-ui");
var import_styled_components = __toESM(require("styled-components"));
var import_jsx_runtime = require("react/jsx-runtime");
function RSACardBody({ pcd }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This PCD represents an RSA signature of some text" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_passport_ui.Separator, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_passport_ui.FieldLabel, { children: "Signed Message" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_passport_ui.HiddenText, { text: pcd.claim.message }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_passport_ui.Spacer, { h: 8 }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_passport_ui.FieldLabel, { children: "RSA Public Key" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_passport_ui.HiddenText, { text: pcd.proof.publicKey })
  ] });
}
var Container = import_styled_components.default.div`
  padding: 16px;
  overflow: hidden;
  width: 100%;
`;

// src/RSAPCD.ts
var RSAPCDTypeName = "rsa-pcd";
var RSAPCD = class {
  constructor(id, claim, proof) {
    this.type = RSAPCDTypeName;
    this.id = id;
    this.claim = claim;
    this.proof = proof;
  }
};
function prove(args) {
  return __async(this, null, function* () {
    if (args.privateKey.value == null) {
      throw new Error("missing private key value");
    }
    if (args.signedMessage.value == null) {
      throw new Error("missing message to sign");
    }
    const id = typeof args.id.value === "string" ? args.id.value : (0, import_uuid.v4)();
    const key = new import_node_rsa.default(args.privateKey.value);
    const publicKey = key.exportKey("public");
    const signature = key.sign(args.signedMessage.value, "hex");
    return new RSAPCD(
      id,
      { message: args.signedMessage.value },
      { publicKey, signature }
    );
  });
}
function verify(pcd) {
  return __async(this, null, function* () {
    try {
      const publicKey = new import_node_rsa.default(pcd.proof.publicKey, "public");
      const valid = publicKey.verify(
        Buffer.from(pcd.claim.message),
        pcd.proof.signature,
        "utf8",
        "hex"
      );
      return valid;
    } catch (e) {
      return false;
    }
  });
}
function serialize(pcd) {
  return __async(this, null, function* () {
    return {
      type: RSAPCDTypeName,
      pcd: (0, import_json_bigint.default)().stringify(pcd)
    };
  });
}
function deserialize(serialized) {
  return __async(this, null, function* () {
    return (0, import_json_bigint.default)().parse(serialized);
  });
}
function getDisplayOptions(pcd) {
  return {
    header: "RSA Signature",
    displayName: "rsa-sig-" + pcd.id.substring(0, 4)
  };
}
var RSAPCDPackage = {
  name: RSAPCDTypeName,
  renderCardBody: RSACardBody,
  getDisplayOptions,
  prove,
  verify,
  serialize,
  deserialize
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RSAPCD,
  RSAPCDPackage,
  RSAPCDTypeName,
  deserialize,
  getDisplayOptions,
  prove,
  serialize,
  verify
});
