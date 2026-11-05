# Primera Comunión de Grecia — Galería compartida

Galería de fotos en vivo para que los invitados suban y vean las fotos del día,
escaneando un QR en las mesas. Sin registro, sin apps que instalar.

**Este archivo es la fuente de verdad del proyecto.** Léelo completo al retomar.

---

## El evento

| | |
|---|---|
| Niña | **Grecia** |
| Fecha | **28 de noviembre de 2026** |
| Misa | Capilla del convento "La Guadalupana" |
| Recepción | Jardín Angelis |
| Padres | Elías Neri Zamora Ch. · Beatriz Valdez de Zamora |
| Padrinos | Marco Antonio Ixcoatl M. · Sonia Valdez De Ixcoatl |
| Versículo | Juan 6:35 |
| Invitación original | https://invitio.events/es-MX/invitacion/80b010b1-e0e6-40f8-9088-71f31a46d9ab |

Todos estos datos viven en **`src/lib/event.ts`**. No los escribas a mano en los
componentes: cámbialos ahí y se propagan solos.

---

## Stack

- Vite 6 + React 19 + TypeScript
- Tailwind CSS v4 (por plugin de Vite, sin archivo de config)
- Supabase — base de datos + Storage + tiempo real
- Framer Motion + react-photo-album (masonry)
- Deploy: Cloudflare Pages

Viene del proyecto de la boda de Mariana & Jesús (`~/Boda_Mariana_Jesus`), con el
diseño rehecho para la comunión y los corazones añadidos.

---

## Diseño — NO cambiar sin indicación

La paleta y las tipografías salen de la invitación real de Grecia: marfil del
papel, rosa palo de las flores, plata del crucifijo. **Nada de dorado** (eso era
de la boda).

```
--background  #F7F2EA   marfil
--foreground  #3C332B   café tinta
--accent      #B5968A   rosa palo
--accent-dark #8C6F63   rosa palo oscuro (textos)
--silver      #A5A29C   plata
--muted-fg    #7A6E60   texto secundario
```

Tipografías:
- **Great Vibes** — el nombre "Grecia" (caligráfica, como la invitación)
- **Cormorant Garamond** — títulos y el versículo, en itálica ligera
- **Inter** — textos chicos en versalitas espaciadas
- **Caveat** — la firma manuscrita en las Polaroids

Elementos:
- **Polaroid**: marco blanco `6px 6px 54px 6px`, inclinación aleatoria por foto,
  se endereza al pasar el cursor. El corazón va en la esquina inferior derecha.
- **Cruz ornamento**: SVG delgado en `WelcomeScreen.tsx`, hace eco del crucifijo.
- **Grano**: overlay SVG animado al 2.2% sobre toda la app.
- Los textos chicos NO deben bajar de ~60% de opacidad: se leen en un salón con
  poca luz o en el jardín a pleno sol.

### La animación del corazón (`HeartButton.tsx`)

Referencias: el **doble tap de Instagram** y el **estallido de partículas de
Twitter/X**, pero traducidos a esta paleta — en vez de confeti de colores, van
**pétalos y corazones diminutos** en los dos rosas, que hacen eco de las flores
de la invitación.

Tres capas que ocurren juntas al DAR corazón (nunca al quitarlo — festejar que
alguien se arrepintió no tiene sentido):

1. El corazón se hunde y rebota — `scale: [1, 0.72, 1.34, 0.94, 1]`.
2. Una **onda** delgada se expande y se desvanece.
3. **Siete partículas** (3 corazoncitos + 4 pétalos) salen en abanico HACIA
   ARRIBA, no en círculo parejo: se siente ligero, como pétalos que se sueltan,
   y no como confeti de videojuego.

En el lightbox, además, **doble tap sobre la foto** da corazón y hace florecer un
corazón grande encima. Solo DA, nunca quita — si ya tenía, el doble tap no lo
arranca.

Dos decisiones de color que costaron ver y no hay que revertir:
- Las partículas **no usan plata ni rosa claro como color principal**: sobre el
  marco BLANCO del Polaroid desaparecen.
- El corazón grande del doble tap es **rosa palo con halo blanco**, no blanco:
  un corazón blanco se pierde sobre fotos claras (un vestido, un perro blanco).

Todo respeta `prefers-reduced-motion`: si el invitado pidió menos movimiento en
su teléfono, el corazón cambia sin estallido.

---

## Base de datos

Proyecto de Supabase: **`umakimzggdtgdpydbesn`** — "Mi primera comunión Grecia",
en la cuenta **Naturalaguas** (plan gratis), la misma donde vive el proyecto de
la boda de Mariana. Token de la cuenta en el llavero: `Supabase Grecia`.

**El esquema ya está aplicado y verificado en ese proyecto** (2026-09-20).
Queda en **`supabase/schema.sql`** como fuente de verdad; es idempotente, así que
se puede volver a correr sin romper nada.

Para correr SQL desde aquí (probado):

```bash
TOKEN=$(security find-generic-password -s "Supabase Grecia" -w)
curl -X POST "https://api.supabase.com/v1/projects/umakimzggdtgdpydbesn/database/query" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  --data @payload.json     # {"query": "..."}
```

Ojo: usar **curl, no python-urllib** — Cloudflare bloquea ese user-agent con 403.

```
photos        id · created_at · url · guest_name · event_id · width · height · message
photo_likes   id · photo_id → photos(id) · guest_key · created_at
              unique(photo_id, guest_key)  ← un corazón por invitado por foto
```

Bucket de Storage: **`communion-photos`** (público), ruta `photos/{timestamp}-{random}.jpg`.

### Dos detalles que no son obvios

1. **`photo_likes` tiene `REPLICA IDENTITY FULL`.** Sin eso, el aviso de DELETE en
   tiempo real llega sin `photo_id` y los contadores nunca bajarían al quitar un
   corazón.
2. **Las políticas de RLS están abiertas a propósito** (select/insert/delete para
   cualquiera). Los invitados no se registran: entran escaneando el QR. Esto
   significa que cualquiera con la llave anónima —que va en el bundle del
   navegador— podría borrar fotos. Es el mismo trato que tenía la boda y es
   aceptable para un evento privado cuyo enlace solo está en las mesas, pero
   **está dicho aquí para que sea una decisión, no una sorpresa.** Si algún día
   importa más, el camino es mover los borrados a una Edge Function con secreto.

---

## Cómo se corre

```bash
npm install
npm run dev              # http://localhost:5173
npm run build            # tsc -b && vite build
npm run qr -- <url>      # genera el QR de las mesas (ver abajo)
```

Variables de entorno (`.env.local` local, y las MISMAS en Cloudflare Pages):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## Rutas

- `/` — galería para los invitados
- `/#admin` — panel: estadísticas, borrar fotos, descargar todo en ZIP.
  Código de acceso en `src/lib/event.ts` (`adminCode`). Es una puerta de
  cortesía del lado del navegador, no seguridad real.

---

## El QR de las mesas

```bash
npm run qr -- https://<la-url-real>
```

Deja dos cosas:
- `public/qr.png` — QR suelto a 1400 px
- `qr-card.html` — 4 tarjetas por hoja A4 con la marca del evento.
  Se abre en Chrome y se imprime con Cmd+P → "Guardar como PDF".
  Sale vectorial, que es lo que pide la imprenta.

---

## ⚠️ Supabase gratuito se pausa solo

Un proyecto gratuito de Supabase **se pausa a los 7 días sin actividad**, y un
proyecto pausado responde NXDOMAIN: la galería simplemente no carga.

Esto ya le pasó al proyecto de la boda de Mariana.

Como la comunión es el **28 de noviembre de 2026** y la app se arma con meses de
anticipación, **hay que despertar el proyecto unos días antes del evento** y
volver a entrar a la galería para confirmar que responde. Sin eso, la app llega
muerta el día de la fiesta.

---

## Lo que ya se probó (2026-09-20)

Prueba real contra el proyecto, con la llave anónima, tal como lo hará la app —
y limpiada después (la base quedó en ceros):

- Subida al bucket ✅ · insert de foto ✅
- Dar corazón ✅ · el MISMO invitado no puede repetir (choca con el índice
  único, error 23505) ✅ · otro invitado sí ✅ · quitar corazón baja el contador ✅
- En pantalla: Polaroid con firma manuscrita, corazón que se llena en rosa palo
  y lightbox ✅
- La animación del corazón, atrapada a media animación: onda, pétalos en abanico
  y el corazón grande del doble tap ✅

Falta probarlo en **teléfono real** — eso lo hace Zahir.

## Estado al 2026-11-04

- **Publicada en `https://pc-grecia.pages.dev`** (Cloudflare Pages, desde GitHub).
- **QR generado** con esa URL: `public/qr.png` + `qr-card.html` (4 por hoja A4).
- **Anti-pausa:** `.github/workflows/mantener-activo.yml` consulta Supabase cada
  2 días (GitHub Actions). Se puede correr a mano en GitHub → Actions → "Mantener
  activa la galería" → Run workflow. GitHub la apaga si el repo pasa 60 días sin commits.
- **Token del llavero `Supabase Grecia` renovado** (el anterior había caducado).
- Bienvenida pulida: composición centrada (antes había un hueco grande entre el
  versículo y el nombre), textos chicos con más contraste, cruz en rosa palo y
  botón "Entrar" relleno en rosa palo con letra marfil.
- **Va SIN foto de Grecia** (decisión 4-nov): la bienvenida lleva un **marco doble
  fino** (plata + rosa palo) como el filo de la invitación impresa.
- Botones de subir (Galería/Cámara): vidrio **marfil casi opaco** con ícono rosa palo
  y etiqueta en píldora. Antes eran transparentes con saturación alta y tomaban el
  color de la foto de atrás (sobre madera salían naranjas).
- Admin: `https://pc-grecia.pages.dev/#admin` · código `2026`.
- **Arreglos traídos de la boda de Diana & Antonio** (4-nov): "← Galería" del panel
  ya regresa (`main.tsx` escucha `hashchange`); fotos y corazones **paginados de
  1,000 en 1,000** (`traerFotos`/`traerCorazones` en `lib/supabase.ts`; antes la
  galería cortaba en 300 y el panel en 1,000) y la galería ya no se vacía si falla
  la red; borrar desde el panel **quita también el archivo** del bucket; en el
  teléfono el panel muestra siempre nombre y bote de basura (no hay hover);
  descargar en el teléfono abre el **menú de compartir → Guardar en Fotos**; el ZIP
  limpia nombres raros y **avisa si faltó alguna foto**.

## Lo que falta

1. **Capturar las variables en Cloudflare Pages** al desplegar
   (las mismas dos de `.env.local`).
2. **Foto de Grecia** para el fondo de la pantalla de bienvenida.
   Se guarda en `public/grecia.jpg` y se activa poniendo
   `const HERO_PHOTO = '/grecia.jpg'` en `src/components/WelcomeScreen.tsx`
   (hoy está en `null` y la pantalla se sostiene sola).
3. ~~Desplegar y generar el QR~~ → hecho (ver arriba).
4. **Confirmar la hora** de la misa: la invitación no la trae.
5. ~~Despertar Supabase~~ → lo hace la tarea de GitHub; igual entrar a la galería 1-2 días antes para confirmar.
