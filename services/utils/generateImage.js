import { createCanvas, loadImage  } from 'canvas';
import { sendImageEmail } from './sendEmail.js';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nivelesImagen = {
  A1: 'A1.jpg',
  A2: 'A2.jpg',
  B1: 'B1.jpg',
  B2: 'B2.jpg',
};

export async function generateImage(req, res) {
  const { nombre, nivel, correo } = req.body;
  if(!nombre || !nivel || !correo) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  const imagenBase = nivelesImagen[nivel];
  console.log('imagen base:', imagenBase);
  console.log('imagen path', join(__dirname, imagenBase));
  console.log('dirname:', __dirname);
  if (!imagenBase) {
    return res.status(400).json({ error: 'Nivel no válido.' });
  }
  try {
    const imagenOriginal = await loadImage(join(__dirname, imagenBase));
    const canvas = createCanvas(imagenOriginal.width, imagenOriginal.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imagenOriginal, 0, 0);

    ctx.font = 'bold 50px Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#000000';

    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'yellow';
    ctx.shadowBlur = 10;

    const x = canvas.width / 2;
    let y = 100;

    // Línea 1: Felicidades,
    y = drawTextWrapped(ctx, '¡Felicidades,', x, y, canvas.width - 100, 60);

    // Línea 2: Nombre dinámico
    drawTextWrapped(ctx, nombre + '!', x, y, canvas.width - 100, 60);

    ctx.shadowBlur = 0;

    const buffer = canvas.toBuffer('image/png');
    console.log('Buffer length:', buffer.length);
    await sendImageEmail(buffer, correo, nivel, nombre);
    res.status(200).json({ message: 'Imagen generada y enviada por correo.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function drawTextWrapped(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let offsetY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + (line ? ' ' : '') + words[n];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      // 1️⃣ Borde con sombra
      ctx.strokeText(line, x, offsetY);
      // 2️⃣ Relleno negro encima
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#000000';
      ctx.fillText(line, x, offsetY);
      ctx.shadowBlur = 10; // restaurar sombra para la siguiente línea
      offsetY += lineHeight;
      line = words[n];
    } else {
      line = testLine;
    }
  }

  if (line) {
    ctx.strokeText(line, x, offsetY);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000000';
    ctx.fillText(line, x, offsetY);
    offsetY += lineHeight;
  }

  return offsetY;
}
