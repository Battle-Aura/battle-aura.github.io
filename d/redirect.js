// Page d'aiguillage des liens de défi : si l'app est installée, Android/iOS l'ouvrent directement sans passer ici.
// Sinon : bouton pour réessayer d'ouvrir l'app, et lien vers le bon store. Partagé par /d/ (fr), /d/en/ et /d/es/ :
// le texte suit la langue du navigateur du pote, à défaut celle de la page (langue de l'envoyeur).
(function () {
  var TEXTS = {
    fr: {
      msg: 'On te défie ! Ouvre BattleAura pour relever le défi.',
      open: '🔥 OUVRIR LE DÉFI',
      store: "📲 Télécharger l'app (gratuit)",
      soon: "📲 Bientôt sur l'App Store",
      hint: 'Pas encore l’app ? Installe-la, puis rouvre ce lien pour jouer le défi.',
      notOpened: "L'app ne s'est pas ouverte ? Installe BattleAura, puis rouvre ce lien.",
    },
    en: {
      msg: "You've been challenged! Open BattleAura to take it on.",
      open: '🔥 OPEN THE CHALLENGE',
      store: '📲 Get the app (free)',
      soon: '📲 Coming soon to the App Store',
      hint: "Don't have the app yet? Install it, then open this link again to play the challenge.",
      notOpened: "App didn't open? Install BattleAura, then open this link again.",
    },
    es: {
      msg: '¡Te han retado! Abre BattleAura para aceptar el reto.',
      open: '🔥 ABRIR EL RETO',
      store: '📲 Descargar la app (gratis)',
      soon: '📲 Muy pronto en el App Store',
      hint: '¿Aún no tienes la app? Instálala y vuelve a abrir este enlace para jugar el reto.',
      notOpened: '¿No se abrió la app? Instala BattleAura y vuelve a abrir este enlace.',
    },
  };
  var lang = document.documentElement.lang;
  var list = navigator.languages || [navigator.language || ''];
  for (var i = 0; i < list.length; i++) {
    var base = String(list[i]).slice(0, 2).toLowerCase();
    if (TEXTS[base]) { lang = base; break; }
  }
  var T = TEXTS[lang] || TEXTS.en;
  document.documentElement.lang = lang;

  var PKG = 'com.battleaura.app';
  var PLAY = 'https://play.google.com/store/apps/details?id=' + PKG;
  var APPSTORE = ''; // à renseigner une fois l'app publiée sur l'App Store
  var ua = navigator.userAgent;
  var android = /Android/i.test(ua), ios = /iPhone|iPad|iPod/i.test(ua);
  var msg = document.getElementById('msg');
  var store = document.getElementById('store');
  var open = document.getElementById('open');
  var hash = location.hash;
  msg.textContent = T.msg;
  open.textContent = T.open;
  store.textContent = T.store;
  document.getElementById('hint').textContent = T.hint;
  store.href = ios && APPSTORE ? APPSTORE : PLAY;
  if (ios && !APPSTORE) { store.textContent = T.soon; store.removeAttribute('href'); }
  if (android) {
    // Intent Android : ouvre l'app si elle est là, sinon le Play Store.
    open.href = 'intent://' + location.host + location.pathname + hash + '#Intent;scheme=https;package=' + PKG
      + ';S.browser_fallback_url=' + encodeURIComponent(PLAY) + ';end';
  } else if (ios) {
    // iOS n'ouvre pas les Universal Links touchés sur leur propre domaine (ni dans les navigateurs intégrés
    // d'Instagram, TikTok…) : le bouton passe par le schéma de l'app (CFBundleURLTypes dans Info.plist).
    open.href = PKG + '://d/' + hash;
    open.addEventListener('click', function () {
      setTimeout(function () { if (!document.hidden) msg.textContent = T.notOpened; }, 1500);
    });
  } else {
    open.href = location.href;
  }
})();
