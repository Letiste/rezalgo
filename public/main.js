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
    timeElem.textContent = time + "ms"
  } else {
    timeElem.textContent = time
  }
  let memoryElem = document.getElementById('memory');
  if (typeof memory === "number") {
    let mem = memory / 1024
    memoryElem.textContent = mem > 1024 ? (mem / 1024).toFixed(1) + "MB" : mem.toFixed(1) + "KB"
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
