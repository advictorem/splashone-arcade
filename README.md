# SplashOne Arcade — Air Superiority

A 3D CSS arcade cabinet branded for SplashOne, showing the Air Superiority screen.

Static site: open `index.html` or serve the folder with any static host (GitHub Pages works as-is).

## Structure

```
index.html
css/style.css        cabinet styles (SplashOne changes are grouped at the end)
js/main.js           sounds + cabinet interactions
js/camera.js         drag / zoom camera (bundled copy)
assets/
  splashone-title.png   marquee artwork
  screen.png            monitor artwork
  favicon.png
```

To swap artwork, replace the files in `assets/` keeping the same names.

## Controls

- Click the coin slot (or press `C` / `5`): insert coin
- Click the red button (or `Space` / `Up`): start / fire
- Click the joystick (or arrow keys): move
- Drag: rotate the cabinet. Scroll / pinch: zoom. `Esc`: re-centre
- Buttons on the right: sound, music, game view, glass, joystick lock, centre

## Credits

Adapted from ["Tetris Arcade Game - Atari 1988" by Josetxu](https://codepen.io/josetxu/pen/bGKqxyR).
Camera by S. Shahriar, cuboid technique by Jhey, joystick ball by Amit Sheen (as credited in the original Pen).
Audio files are loaded from the original author's CDN (`cdn.josetxu.com`).
