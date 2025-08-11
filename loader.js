// Load CSS without showing link
fetch("style.css")
  .then(response => response.text())
  .then(css => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  });

// Load JS without showing script src
fetch("script.js")
  .then(response => response.text())
  .then(js => {
    const script = document.createElement("script");
    script.textContent = js;
    document.body.appendChild(script);
  });