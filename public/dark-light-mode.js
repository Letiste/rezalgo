const root = document.documentElement
const elem = document.getElementById("dark-light-mode")
function switchDarkLightMode() {
  let isDarkMode = localStorage.getItem("dark-mode") === "darkMode" ? "lightMode" : "darkMode"
  localStorage.setItem("dark-mode", isDarkMode)
  setDarkLightMode()
}

const colors = {
  lightMode: {
    "--body-color": "hsl(0, 0%, 100%)",
    "--bg-color": "hsla(226, 100%, 98%, 0.6)",
    "--border-color": "hsl(228, 96%, 89%)",
    "--font-color": "hsl(241, 46%, 20%)",
    "--code-color": "hsla(224, 25%, 80%, 0.5)",
    "--memory-bg-color": "hsl(287deg 75% 84% / 60%)",
    "--memory-border-color": "hsl(287deg 56% 71% / 60%)",
    "--memory-font-color": "hsl(291deg 47% 30%)",
    "--time-bg-color": "hsl(46, 100%, 94%)",
    "--time-border-color": "hsl(46, 100%, 65%)",
    "--time-font-color": "hsl(14, 88%, 40%)",
    "--success-bg-color": "hsl(125, 39%, 94%)",
    "--success-border-color": "hsl(123, 38%, 64%)",
    "--success-font-color": "hsl(124, 55%, 24%)",
    "--stdout-bg-color": "hsl(0, 0%, 98%)",
    "--stdout-border-color": "hsl(0, 0%, 74%)",
    "--stdout-font-color": "hsl(0, 0%, 26%)",
    "--stderr-bg-color": "hsl(351, 100%, 96%)",
    "--stderr-border-color": "hsl(0, 73%, 77%)",
    "--stderr-font-color": "hsl(0, 73%, 41%)",
    "--button-disabled-bg-color": "hsl(0, 0%, 88%)",
    "--button-disabled-border-color": "hsl(0, 0%, 70%)",
    "--button-disabled-font-color": "hsl(0, 0%, 28%)",
  },
  darkMode: {
    "--body-color": "hsl(219, 44%, 6%)",
    "--bg-color": "hsla(226, 85%, 8%, 0.6)",
    "--border-color": "hsl(225, 73%, 16%)",
    "--font-color": "hsla(240, 47%, 90%, 0.96)",
    "--code-color": "hsla(224, 25%, 30%, 0.5)",
    "--memory-bg-color": "hsl(287deg 75% 14% / 60%)",
    "--memory-border-color": "hsl(287deg 56% 29% / 60%)",
    "--memory-font-color": "hsl(291deg 47% 71%)",
    "--time-bg-color": "hsl(45, 67%, 7%)",
    "--time-border-color": "hsl(45, 53%, 23%)",
    "--time-font-color": "hsl(14, 53%, 54%)",
    "--success-bg-color": "hsl(142, 85%, 8%)",
    "--success-border-color": "hsl(122, 34%, 28%)",
    "--success-font-color": "hsl(125, 23%, 50%)",
    "--stdout-bg-color": "hsla(240, 33%, 0%, 0.64)",
    "--stdout-border-color": "hsl(240, 29%, 18%)",
    "--stdout-font-color": "hsl(240, 4%, 55%)",
    "--stderr-bg-color": "hsl(348, 79%, 4%)",
    "--stderr-border-color": "hsl(0, 94%, 14%)",
    "--stderr-font-color": "hsl(0, 62%, 49%)",
    "--button-disabled-bg-color": "hsla(228, 11%, 18%, 0.6)",
    "--button-disabled-border-color": "hsl(225, 23%, 23%)",
    "--button-disabled-font-color": "hsla(0, 0%, 66%, 0.96)",
  }
}

function setDarkLightMode() {
  const isDarkMode = localStorage.getItem("dark-mode") || "lightMode"
  elem.textContent = isDarkMode === "darkMode" ? "🌕" : "☀️"
  Object.entries(colors[isDarkMode]).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  
}
setDarkLightMode()
