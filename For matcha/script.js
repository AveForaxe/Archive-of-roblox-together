const colorThief = new ColorThief();
const images = document.querySelectorAll(".gallery img");
const cards = document.querySelectorAll(".card");

// Fungsi cek luminance untuk tentuin kontras teks
function getLuminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

// Fungsi buat mencerahkan warna
function lightenColor(r, g, b, amount = 40) {
  return [
    Math.min(r + amount, 255),
    Math.min(g + amount, 255),
    Math.min(b + amount, 255)
  ];
}

images.forEach((img, idx) => {
  img.addEventListener("click", () => {
    if (img.complete) {
      const color = colorThief.getColor(img);
      const [r, g, b] = color;

      // Ubah background body
      document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

      // Warna card -> lebih terang
      const [cr, cg, cb] = lightenColor(r, g, b, 40);
      cards.forEach(card => {
        card.style.backgroundColor = `rgb(${cr}, ${cg}, ${cb})`;
      });

      // Tentukan warna font (kontras dengan card)
      const luminance = getLuminance(cr, cg, cb);
      document.body.style.color = luminance > 0.5 ? "#000" : "#fff";
    }
  });
});

const audio = document.getElementById("bg-music");
let musicStarted = false;

images.forEach((img, idx) => {
  img.addEventListener("click", () => {
    if (!musicStarted) {
      audio.volume = 0;
      audio.play().catch(err => console.log("Autoplay blocked:", err));
      musicStarted = true;

      // naikkan volume pelan-pelan
      let vol = 0;
      const fade = setInterval(() => {
        if (vol < 0.5) {
          vol += 0.05;
          audio.volume = vol;
        } else {
          clearInterval(fade);
        }
      }, 200); // tiap 200ms naik
    }
    
    if (img.complete) {
      const color = colorThief.getColor(img);
      const [r, g, b] = color;

      document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

      const [cr, cg, cb] = lightenColor(r, g, b, 40);
      cards.forEach(card => {
        card.style.backgroundColor = `rgb(${cr}, ${cg}, ${cb})`;
      });

      const luminance = getLuminance(cr, cg, cb);
      document.body.style.color = luminance > 0.5 ? "#000" : "#fff";
    }
  });
});

