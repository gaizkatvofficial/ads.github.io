// Ubah URL tujuan dengan URL afiliasi Tokopedia Anda
let origin = 'https://tokopedia.link/hvStQEJ0cMb';

window.pux = new window.dpu(target, {
    newTab: true,
    cookieExpires: 60 * 24 / 1,
    afterOpen: function () {
        window.location.href = origin; // Arahkan ke URL afiliasi setelah pop-under dibuka
    }
});
