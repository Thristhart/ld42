import CONSTANTS from "./constants.mjs";

class UI {
  static setHP(hp) {
    UI.hearts.innerHTML = CONSTANTS.HEART_EMOJI.repeat(hp);
  }
  static showDialog() {
    UI.dialog.classList.remove("hide");
  }
  static hideDialog() {
    UI.dialog.classList.add("hide");
  }
}
class Spell {
  constructor(id) {
    this.element = document.getElementById(id);
  }
  set percentage(percentage) {
    let percent = percentage * 100;
    if(percent < 0) {
      percent = 0;
    }
    this.element.style.setProperty("--percentage", percent);
  }
}

UI.hearts = document.getElementById("hearts");
UI.mutebutton = document.getElementById("mutebutton");
UI.mutebutton.addEventListener("click", function() {
  let vol = Howler.volume();
  if(vol === 0) {
    Howler.volume(0.8);
    UI.mutebutton.innerHTML = CONSTANTS.UNMUTED_EMOJI;
  }
  else {
    Howler.volume(0);
    UI.mutebutton.innerHTML = CONSTANTS.MUTED_EMOJI;
  }
});
UI.dialog = document.getElementById("dialog");
UI.dialog.text = document.getElementById("text");

UI.Spells = {};
UI.Spells.lightning = new Spell("lightning");
UI.Spells.slowmo = new Spell("slowmo");
UI.Spells.wall = new Spell("wall");

export default UI;