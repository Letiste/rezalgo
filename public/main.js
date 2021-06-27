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
  matchBrackets: true,
  autoCloseBrackets: true
};
const myCodeMirror = CodeMirror.fromTextArea(textArea, myCodeMirrorOptions);
const codeMirrorStyle = Array.from(document.styleSheets).find((ss) => !ss.href)
  .cssRules[0].style;
myCodeMirror.setValue(
  localStorage.getItem(`${location.pathname}:${selectedLanguage}`) || helpers[selectedLanguage]
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
  const challenge = location.pathname
  const language = select[select.selectedIndex];
  localStorage.setItem(`${challenge}:${selectedLanguage}`, myCodeMirror.getValue());
  selectedLanguage = language.value;
  myCodeMirror.setValue(
    localStorage.getItem(`${challenge}:${selectedLanguage}`) || helpers[selectedLanguage]
  );
  myCodeMirror.setOption('mode', language.text);
  myCodeMirror.refresh();
  localStorage.setItem('selectedLanguage', selectedLanguage);
  localStorage.setItem('mode', language.text);
}

function resetCode() {
  myCodeMirror.setValue(helpers[selectedLanguage]);
  myCodeMirror.refresh();
  localStorage.removeItem(`${location.pathname}:${selectedLanguage}`);
}

function setContent({stdout, stderr, success, time, memory}) {
  let [stdoutStdElem, stderrStdElem] = document.getElementsByClassName("std")
  stdoutStdElem.textContent = stdout ? "Stdout :" : ""
  stderrStdElem.textContent = stderr ? "Stderr :" : ""
  let [stdoutOutputElem, stderrOuputElem] = document.getElementsByClassName("output")
  stdoutOutputElem.innerHTML = stdout;
  stderrOuputElem.innerHTML = stderr;
  let successElem = document.getElementById('success');
  successElem.textContent = success ? 'Success !' : '';
  let timeElem = document.getElementById('time');
  if (typeof time === "number") {
    timeElem.textContent = `⏱ Time duration : ${time} ms`
  } else {
    timeElem.textContent = time
  }
  let memoryElem = document.getElementById('memory');
  if (typeof memory === "number") {
    let mem = memory > 1024 * 1024 ? (memory / (1024 * 1024)).toFixed(1) + " MB" : (memory / 1024).toFixed(1) + " KB"
    memoryElem.textContent = `💾 Memory used: ${mem}`
  } else {
    memoryElem.textContent = memory
  }
}

function togglePresOutput() {
  const presOutputElem = document.getElementById("pres-output")
  const outputElem = document.getElementById("challenge-output")
  const presElem = document.getElementById("challenge-presentation")
  if (presOutputElem.textContent === "Show Output") {
    presOutputElem.textContent = "Show Presentation"
    outputElem.style.display = "initial"
    presElem.style.display = "none"
  } else {
    presOutputElem.textContent = "Show Output"
    outputElem.style.display = "none"
    presElem.style.display = "initial"
  }
}

async function runCode() {
  const buttonElem = document.getElementById("submit")
  buttonElem.disabled = true
  try {
    if (document.getElementById("pres-output").textContent !== "Show Presentation") {
      togglePresOutput()
    }
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

