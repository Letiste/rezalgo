const textArea = document.getElementById('data');
let selectedLanguage = localStorage.getItem('selectedLanguage') || 'js';
const selectLanguage = document.getElementById('language');
selectLanguage.selectedIndex = Array.from(selectLanguage.options).find(
  (option) => option.value === selectedLanguage
).index;
const theme = localStorage.getItem('theme') || 'default';
const mode = localStorage.getItem('mode') || 'javascript';
const fontSize = localStorage.getItem('fontSize') || '14';

const myCodeMirrorOptions = {
  mode,
  lineNumbers: true,
  tabSize: 2,
};
const myCodeMirror = CodeMirror.fromTextArea(textArea, myCodeMirrorOptions);
const codeMirrorStyle = Array.from(document.styleSheets).find((ss) => !ss.href)
  .cssRules[0].style;
myCodeMirror.setValue(
  localStorage.getItem(selectedLanguage) || helpers[selectedLanguage]
);

function switchFontSize(fontSize) {
  codeMirrorStyle.fontSize = `${fontSize}px`;
  codeMirrorStyle.lineHeight = `${Number(fontSize) + 5}px`;
  myCodeMirror.refresh();
  localStorage.setItem('fontSize', fontSize);
}

switchFontSize(fontSize);
document.getElementById('fontSize').value = fontSize;

function switchTheme(theme) {
  myCodeMirror.setOption('theme', theme);
  myCodeMirror.refresh();
  localStorage.setItem('theme', theme);
}

switchTheme(theme);
document.getElementById('theme').value = theme;

function switchHelpers(select) {
  const language = select[select.selectedIndex];
  localStorage.setItem(selectedLanguage, myCodeMirror.getValue());
  myCodeMirror.setValue(
    localStorage.getItem(language.value) || helpers[language.value]
  );
  myCodeMirror.setOption('mode', language.text);
  selectedLanguage = language.value;
  myCodeMirror.refresh();
  localStorage.setItem('selectedLanguage', selectedLanguage);
  localStorage.setItem('mode', language.text);
}

function resetCode() {
  myCodeMirror.setValue(helpers[selectedLanguage]);
  myCodeMirror.refresh();
  localStorage.removeItem(selectedLanguage);
}

function setContent({stdout, stderr, success, time, memory}) {
  let stdoutElem = document.getElementById('stdout');
  stdoutElem.textContent = stdout;
  let stderrElem = document.getElementById('stderr');
  stderrElem.textContent = stderr;
  let successElem = document.getElementById('success');
  successElem.textContent = success ? 'Success !' : '';
  let timeElem = document.getElementById('time');
  if (typeof time === "number") {
    timeElem.textContent = `Time duration: ${time} ms`
  } else {
    timeElem.textContent = time
  }
  let memoryElem = document.getElementById('memory');
  if (typeof memory === "number") {
    let mem = memory > 1024 * 1024 ? (memory / (1024 * 1024)).toFixed(1) + " MB" : (memory / 1024).toFixed(1) + " KB"
    memoryElem.textContent = `Memory used: ${mem}`
  } else {
    memoryElem.textContent = memory
  }
}

async function runCode() {
  const buttonElem = document.getElementById("submit")
  buttonElem.disabled = true
  try {
    setContent({stdout: "", stderr: "", success: false, time: "Pending...", memory: "Pending..."})
    const data = myCodeMirror.getValue();
    const rawResponse = await fetch(
      window.location.href,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: selectedLanguage,
          data,
        }),
      }
    );
    const content = await rawResponse.json();
    setContent(content)
  } catch (err) {
    console.log(err);
  } finally {
    buttonElem.disabled = false
  }
}
const root = document.documentElement
const elem = document.getElementById("dark-light-mode")
function switchDarkLightMode() {
  let isDarkMode = localStorage.getItem("dark-mode") === "true" ? false : true
  localStorage.setItem("dark-mode", isDarkMode)
  setDarkLightMode()
}

function setDarkLightMode() {
  const isDarkMode = localStorage.getItem("dark-mode") === "true" ? true : false
  elem.textContent = isDarkMode ? "🌕" : "☀️"
  let bodyColor = "hsl(0, 0%, 100%)"
  let bgColor = "hsla(226, 100%, 98%, 0.6)"
  let borderColor = "hsl(228, 96%, 89%)"
  let fontColor = "hsl(241, 46%, 20%)"
  let codeColor = "hsla(224, 25%, 80%, 0.5)"
  if (isDarkMode) {
    bodyColor = "hsl(222, 47%, 9%)"
    bgColor = "hsla(226, 100%, 8%, 0.6)"
    borderColor = "hsl(228, 96%, 20%)"
    fontColor = "hsl(241.4, 100%, 91.6%)"
    codeColor = "hsla(224, 25%, 30%, 0.5)"
  }
  root.style.setProperty("--body-color", bodyColor)
  root.style.setProperty("--bg-color", bgColor)
  root.style.setProperty("--border-color", borderColor)
  root.style.setProperty("--font-color", fontColor)
  root.style.setProperty("--code-color", codeColor)
}
setDarkLightMode()

