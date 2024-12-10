// Objektif: Memperbaiki deteksi browser, manajemen pop-up, dan pengelolaan cookies secara lebih aman

// Deteksi Browser
const browserDetect = {
  isChrome: /chrome/i.test(navigator.userAgent),
  isFirefox: /firefox/i.test(navigator.userAgent),
  isIE: /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent),
  isSafari: /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent),
  isEdge: /edge/i.test(navigator.userAgent),
  isWebkit: /webkit/i.test(navigator.userAgent)
};

// Fungsi untuk mengatur dan mendapatkan cookies
function setCookie(name, value, days) {
  const expires = days ? `; expires=${new Date(Date.now() + days * 864e5).toUTCString()}` : '';
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=/`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

// Fungsi untuk membuka pop-up dengan pengaturan khusus
function openPopup(url, options) {
  const defaultOptions = {
    width: 600,
    height: 400,
    location: 'no',
    toolbar: 'no',
    menubar: 'no',
    resizable: 'yes',
    scrollbars: 'yes'
  };

  const settings = { ...defaultOptions, ...options };

  const windowFeatures = Object.entries(settings)
    .map(([key, value]) => `${key}=${value}`)
    .join(',');

  return window.open(url, '_blank', windowFeatures);
}

// Mengatur pengelolaan cookies berdasarkan apakah browser mendukungnya
function manageCookies() {
  const cookieConsent = getCookie('cookieConsent');
  if (!cookieConsent) {
    // Jika belum ada consent, tampilkan popup
    openPopup('https://tokopedia.link/2Zsp78OUcPb', {
      width: 500,
      height: 300
    });
    setCookie('cookieConsent', 'true', 365); // Set cookie consent
  }
}

// Event Listener untuk mengatasi pergerakan mouse untuk pop-up 'smart'
let smartPopupDelay = null;
document.addEventListener('mousemove', function() {
  if (smartPopupDelay) clearTimeout(smartPopupDelay);
  
  smartPopupDelay = setTimeout(() => {
    openPopup('https://tokopedia.link/2Zsp78OUcPb', {
      width: 600,
      height: 400
    });
  }, 3000); // Pop-up setelah 3 detik setelah gerakan mouse
});

// Menangani pop-up yang diblokir atau ditutup
function handlePopupBlocker() {
  const popup = openPopup('https://tokopedia.link/2Zsp78OUcPb', { width: 600, height: 400 });
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    alert('Pop-up diblokir, pastikan Anda mengizinkan pop-up untuk melanjutkan.');
  }
}

// Inisialisasi
function initialize() {
  if (browserDetect.isIE) {
    alert("Browser Internet Explorer tidak didukung. Silakan gunakan browser lain.");
  }

  manageCookies(); // Memeriksa dan mengelola cookies
  handlePopupBlocker(); // Mengatasi pemblokiran pop-up
}

// Memanggil inisialisasi saat halaman dimuat
window.onload = initialize;
