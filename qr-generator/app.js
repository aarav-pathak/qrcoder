const urlInput = document.getElementById('urlInput');
const generateBtn = document.getElementById('generateBtn');
const qrContainer = document.getElementById('qrContainer');
const downloadBtn = document.getElementById('downloadBtn');
const message = document.getElementById('message');

function generateQRCode() {
  const rawInput = urlInput.value.trim();

  if (!rawInput) {
    qrContainer.innerHTML = '';
    qrContainer.style.display = 'none';
    downloadBtn.style.display = 'none';
    message.textContent = 'Please enter a link.';
    return;
  }

  const protocolRegex = /^[a-z][a-z0-9+.-]*:\/\//i;
  const finalUrl = protocolRegex.test(rawInput) ? rawInput : `https://${rawInput}`;

  qrContainer.innerHTML = '';

  try {
    if (typeof QRCode === 'undefined') {
      throw new Error('QRCode library not loaded');
    }

    new QRCode(qrContainer, {
      text: finalUrl,
      width: 256,
      height: 256,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });

    qrContainer.style.display = 'block';
    downloadBtn.style.display = 'block';
    message.textContent = finalUrl;
  } catch (err) {
    qrContainer.innerHTML = '';
    qrContainer.style.display = 'none';
    downloadBtn.style.display = 'none';
    message.textContent = 'Link is too long or QR library failed to load.';
  }
}

function downloadQRCode() {
  const canvas = qrContainer.querySelector('canvas');
  const img = qrContainer.querySelector('img');

  let dataUrl = '';
  if (canvas && typeof canvas.toDataURL === 'function') {
    dataUrl = canvas.toDataURL('image/png');
  } else if (img && img.src) {
    dataUrl = img.src;
  }

  if (dataUrl) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

generateBtn.addEventListener('click', generateQRCode);

urlInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    generateQRCode();
  }
});

downloadBtn.addEventListener('click', downloadQRCode);
