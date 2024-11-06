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
var auth_exports = {};
__export(auth_exports, {
  LoginPage: () => LoginPage
});
module.exports = __toCommonJS(auth_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class LoginPage {
  render() {
    return (0, import_renderPage.default)({
      scripts: [
        `
        import { define, Auth } from "@calpoly/mustang";
        import { LoginForm } from "/scripts/login-form.js";

        define({
          "mu-auth": Auth.Provider,
          "login-form": LoginForm
        })
        `
      ],
      styles: [
        import_server.css`
          article {
            display: flex;
            height: 70vh;
            align-items: center;
            justify-content: center;
          }
          h2 {
            margin-bottom: var(--margin-m);
          }
          p {
            display: flex;
            justify-content: center;
            margin-top: var(--margin-m);
          }
        `
      ],
      body: import_server.html`
        <body>
          <mu-auth provides="blazing:auth">
            <header>
              <a href="index.html">
                <h1 class="logo">Backpack</h1>
              </a>
              <a href="profile.html">
                <svg class="page-icons">
                  <use href="/icons/sprite.svg#account" />
                </svg>
              </a>
            </header>
            <article>
              <main class="page">
                <login-form api="/auth/login">
                  <h2 slot="title">Sign in and get outside!</h2>
                </login-form>
                <p class="register">
                  <a href="./register"> Register as a new user!</a>
                </p>
              </main>
            </article>
          </mu-auth>
        </body>
      `
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LoginPage
});