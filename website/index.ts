import { convertCSS } from "css-to-cssinjs";

declare let ace: any;

document.addEventListener("DOMContentLoaded", () => {
  const input = ace.edit("input");
  input.session.setMode("ace/mode/css");

  const output = ace.edit("output");
  output.session.setMode("ace/mode/javascript");
  output.getSession().setTabSize(2);
  output.getSession().setUseSoftTabs(true);
  output.getSession().setUseWrapMode(true);

  const convert = () => {
    const inputCSS = input.getValue();
    output.session.setValue(`const styles = ${convertCSS(inputCSS)};`);
  };

  window.addEventListener("keyup", event => {
    if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
      convert();
    }
  });

  document.getElementById("compile-button").addEventListener("click", event => {
    convert();
  });
});
