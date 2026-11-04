// Reproduz a peça do WhatsApp com fontes, foto e marca já existentes no projeto.
// Dependência de autoria: sharp. Não participa do build ou do runtime da aplicação.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require(process.env.VAGGU_SHARP_PATH || 'sharp');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'vaggu-frontend/public/assets');
const fonts = path.join(root, 'vaggu-frontend/node_modules/@fontsource/poppins/files');

async function text(value, size, color, weight = 400) {
  const font = 'Poppins Semi-Bold';
  const markup = `<span foreground="${color}">${value}</span>`;
  return sharp({ text: {
    text: markup, font: `${font} ${size}`, rgba: true,
    fontfile: path.join(fonts, 'poppins-latin-600-normal.woff'),
  } }).png().toBuffer();
}

const photo = await sharp(path.join(assets, 'estacionamento-hero-vaggu.webp'))
  .resize(1200, 675, { fit: 'cover', position: 'right' }).toBuffer();
const logo = await sharp(path.join(assets, 'vaggu-logo-yellow.svg')).resize({ width: 225 }).png().toBuffer();
const overlay = Buffer.from(`<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="s"><stop stop-color="#101010"/><stop offset=".45" stop-color="#101010" stop-opacity=".97"/><stop offset="1" stop-color="#101010" stop-opacity=".24"/></linearGradient></defs>
  <rect width="1200" height="675" fill="url(#s)"/>
  <rect x="64" y="568" width="50" height="4" fill="#ffe100"/>
</svg>`);

const output = path.join(assets, 'apresentacao-whatsapp-vaggu.jpg');
await sharp(photo).composite([
  { input: overlay },
  { input: logo, left: 64, top: 58 },
  { input: await text('Seu estacionamento.', 48, '#ffffff', 600), left: 64, top: 216 },
  { input: await text('Uma visão mais clara.', 48, '#ffe100', 600), left: 64, top: 282 },
  { input: await text('Mapa de vagas, monitoramento e análises', 23, '#e5e5e5'), left: 66, top: 392 },
  { input: await text('para a gestão do seu shopping.', 23, '#e5e5e5'), left: 66, top: 430 },
  { input: await text('vaggu-tcc.onrender.com', 22, '#ffffff'), left: 66, top: 593 },
]).jpeg({ quality: 90, chromaSubsampling: '4:4:4' }).toFile(output);
const metadata = await sharp(output).metadata();
console.log(`Arte exportada: ${path.relative(root, output)} (${metadata.width}x${metadata.height}, JPEG).`);
