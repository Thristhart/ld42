const Sounds = {
  ZAP: new Howl({
    src: "./assets/zap.mp3"
  }).volume(0.1),
  LIGHTNING_HIT: new Howl({
    src: "./assets/hit_enemy_final.wav"
  }).volume(0.3),
  WALL: new Howl({
    src: "./assets/rock_wall.mp3"
  }).volume(0.5),
  OUCH: new Howl({
    src: "./assets/ouch.mp3"
  }),
  CHARGER_WHINNY: new Howl({
    src: "./assets/charger_whinny.wav"
  }),
  CHARGER_CHARGE: new Howl({
    src: "./assets/charger_dash.wav"
  }),
}

export default Sounds;