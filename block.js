(function ignielAdBlock() {
  const adPub = 'xxxx';
  const adTitle = 'Matikan AdBlock';
  const adText =
    'Kami mendeteksi bahwa Anda menggunakan AdBlock. Untuk mendukung kami, matikan AdBlock atau tambahkan situs ini ke daftar putih. Terima kasih!';
  const adFooter = 'Hal ini membantu kami tetap menyediakan konten berkualitas untuk Anda.';

  const ad = document.createElement('script');
  ad.src =
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-' +
    adPub;
  ad.async = true;
  ad.setAttribute('crossorigin', 'anonymous');

  // Fungsi untuk memainkan suara peringatan
  const playWarningSound = () => {
    const audio = new Audio(
      'https://www.soundjay.com/buttons/beep-11.wav' // URL suara peringatan
    );
    audio.play();
  };

  ad.onerror = function () {
    const overlay = document.createElement('div');
    overlay.className = 'ignielAdBlock';

    overlay.innerHTML = `
      <div class="adblock-container">
        <div class="adblock-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0zm4.243 16.243l-1.414 1.414L12 13.414l-2.829 2.829-1.414-1.414L10.586 12 7.757 9.171l1.414-1.414L12 10.586l2.829-2.829 1.414 1.414L13.414 12l2.829 2.829z"/>
          </svg>
        </div>
        <div class="adblock-title">${adTitle}</div>
        <div class="adblock-text">${adText}</div>
        <div class="adblock-footer">${adFooter}</div>
      </div>
    `;

    document.body.appendChild(overlay);
    playWarningSound(); // Memainkan suara peringatan saat dialog muncul
  };

  document.head.appendChild(ad);
})();
