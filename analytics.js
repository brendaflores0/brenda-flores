/* ══════════════════════════════════════════════════════════════════
   ANALITICA DEL SITIO — brendaflores.co
   Este archivo lo cargan index.html, diagnostico.html y agenda/.
   Es el UNICO lugar donde se tocan los IDs. No los repitas en el HTML.

   COMO ACTIVARLO (dos pegadas y listo):

   1. GA4      analytics.google.com -> Administrar -> Flujos de datos
               -> Web -> brendaflores.co. Copia el "ID de medicion".
               Empieza con G- y son 10 caracteres.

   2. Clarity  clarity.microsoft.com -> nuevo proyecto -> brendaflores.co
               -> Configuracion -> Instalar. Copia el "Project ID".

   Mientras los IDs sigan con las XXXX de abajo no se carga nada:
   el sitio funciona igual y no se hace ni una sola peticion de red.
   ══════════════════════════════════════════════════════════════════ */

const GA4_ID = "G-JVWNHGYB4X";
const CLARITY_ID = "y2c10lyinw";

/* Barra de aviso de cookies. Ponla en false si prefieres quitarla:
   el resto de la analitica sigue funcionando igual. */
const COOKIE_NOTICE = true;

(function analytics() {
  "use strict";

  const ready = (id) => id && !/X{4}/.test(id);

  /* ── Google Analytics 4 ─────────────────────────────────────────
     anonymize_ip recorta el ultimo octeto de la IP antes de guardarla.
     No lo necesitas para las metricas y te ahorra la mitad de la
     conversacion legal si algun dia entra alguien desde Europa. */
  if (ready(GA4_ID)) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    gtag("js", new Date());
    gtag("config", GA4_ID, { anonymize_ip: true });
  }

  /* ── Microsoft Clarity ──────────────────────────────────────────
     Grabaciones de sesion y mapas de calor. Anonimo y sin limite. */
  if (ready(CLARITY_ID)) {
    (function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);

    /* Misma idea que arriba, del lado de las grabaciones: deja pedirle a
       Clarity "enseñame solo las sesiones de la tanda de ferreterias". */
    const campana = new URLSearchParams(location.search).get("utm_campaign");
    if (campana) window.clarity("set", "campana", campana);
  }

  /* ── De donde salio el clic ─────────────────────────────────────
     Sin esto GA4 te dice "20 clics en WhatsApp" y nada mas. Con esto
     te dice cuales vinieron del hero y cuales de despues del precio,
     que es la unica version del dato que sirve para decidir algo. */
  function seccion(el) {
    const con = el.closest("section[id], section, header, footer");
    if (con && con.id) return con.id;
    /* El boton del nav y el flotante de WhatsApp viven fuera de toda
       seccion con id, pero tienen id propio: dice mas que "sin-seccion". */
    if (el.id) return el.id;
    if (!con) return "sin-seccion";
    const h = con.querySelector("h1, h2, h3");
    if (!h) return con.tagName.toLowerCase();
    /* Cortado en palabra completa: estas etiquetas se leen en los
       informes de GA4 y una frase partida a la mitad no se entiende. */
    const t = h.textContent.trim().replace(/\s+/g, " ");
    return t.length <= 48 ? t : t.slice(0, 48).replace(/\s\S*$/, "") + "…";
  }

  function evento(nombre, el) {
    if (typeof window.gtag !== "function") return;
    gtag("event", nombre, {
      seccion: seccion(el),
      texto: (el.textContent || "").trim().slice(0, 60),
      /* Con la cadena de consulta, no solo la ruta: es lo que deja cruzar
         "hizo clic en WhatsApp" con "venia de la tanda de ferreterias".
         Sin esto el clic se cuenta pero se pierde de que campaña salio. */
      pagina: location.pathname + location.search,
    });
    /* La etiqueta de Clarity deja filtrar las grabaciones: "enseñame
       solo las sesiones que acabaron en un clic a WhatsApp". */
    if (typeof window.clarity === "function") window.clarity("set", "cta", nombre);
  }

  document.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";

      if (a.hasAttribute("data-whatsapp") || href.includes("wa.me")) {
        evento("click_whatsapp", a);
      } else if (
        a.hasAttribute("data-booking") ||
        href.includes("/agenda") ||
        href.includes("calendly.com")
      ) {
        evento("click_agenda", a);
      } else if (href.startsWith("mailto:")) {
        evento("click_email", a);
      } else if (href.includes("linkedin.com")) {
        evento("click_linkedin", a);
      }
    },
    true // fase de captura: el evento se registra aunque el enlace
    // se abra en otra pestaña y el navegador nos quite el foco.
  );

  /* ── Aviso de cookies ───────────────────────────────────────────
     Informativo, no bloqueante: es lo que hace un sitio de consultoria
     con trafico de Mexico y EE.UU. Si algun dia vendes a Europa hay que
     cambiarlo por uno que pida permiso ANTES de cargar los scripts. */
  if (!COOKIE_NOTICE || !(ready(GA4_ID) || ready(CLARITY_ID))) return;
  if (localStorage.getItem("cookies-ok") === "1") return;
  /* En /agenda la barra alcanzaria a parpadear antes del redirect. */
  if (document.querySelector('meta[http-equiv="refresh"]')) return;

  const es = (document.documentElement.lang || "es").startsWith("es");
  const barra = document.createElement("div");
  barra.setAttribute("role", "note");
  /* En el portafolio hay un boton flotante de WhatsApp abajo a la derecha.
     En movil la barra ocupa todo el ancho y se lo taparia, justo el boton
     que mas quieres que toquen. Cuando existe, la barra se sube encima. */
  const alto = document.querySelector("#wa-float") ? "88px" : "16px";
  barra.style.cssText =
    "position:fixed;left:16px;right:16px;bottom:" + alto + ";z-index:9999;max-width:34rem;" +
    "margin:0 auto;display:flex;gap:14px;align-items:center;justify-content:space-between;" +
    "background:#0F0F1A;color:#fff;padding:14px 18px;border-radius:14px;" +
    "font:400 0.85rem/1.45 'DM Sans',system-ui,sans-serif;" +
    "box-shadow:0 8px 30px rgba(0,0,0,.22)";
  barra.innerHTML =
    "<span>" +
    (es
      ? "Uso cookies para saber qué partes del sitio sirven. Nada de anuncios."
      : "I use cookies to see which parts of the site work. No ads.") +
    "</span>";

  const ok = document.createElement("button");
  ok.textContent = es ? "Entendido" : "Got it";
  ok.style.cssText =
    "flex:none;background:#fff;color:#0F0F1A;border:0;border-radius:999px;" +
    "padding:8px 18px;font:600 0.85rem 'DM Sans',system-ui,sans-serif;cursor:pointer";
  ok.addEventListener("click", () => {
    localStorage.setItem("cookies-ok", "1");
    barra.remove();
  });

  barra.appendChild(ok);
  const pintar = () => document.body.appendChild(barra);
  if (document.body) pintar();
  else document.addEventListener("DOMContentLoaded", pintar);
})();
