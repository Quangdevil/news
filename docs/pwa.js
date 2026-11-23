'use strict';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(error => {
    console.warn('Không đăng ký được chế độ ngoại tuyến.', error);
  });
}
