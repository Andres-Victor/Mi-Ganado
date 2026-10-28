# Métodos de pago — cómo añadir uno nuevo

Todo método de pago vive en **un solo archivo** dentro de `js/methods/`.
No hay listas escritas a mano en ningún otro sitio.

## Pasos

### 1. Crear el archivo

`js/methods/<nombre>.method.js`

```js
import { PaymentMethod } from './methods_payment_method.js';

export class NakamotoMethod extends PaymentMethod
{
  constructor()
  {
    super
    (
      {
        key: 'nakamoto',
        category: 'crypto',
        name: 'Nakamoto Pay',
        theme: 'theme-nakamoto',
        badge:
        {
          icon: 'i-zap',
          text: 'Instantáneo',
        },
        desc: 'Descripción que verá el usuario en el paso 3.',
        logo:
        {
          img: './res/img/nakamoto.png',
          fallback: 'N|#1F2937',
        },
        instructions:
        [
          'Primer paso que debe seguir el usuario.',
          'Segundo paso.',
          'Tercer paso.',
        ],
        dataTitle: 'Datos de Nakamoto',
        dataRows:
        [
          { label: 'UID', value: '123456789' },
          { label: 'Correo', value: 'pagos@miganado.net' },
        ],
        action: null, // o { label, caption, buildLink } si abre un enlace
        formFields:
        [
          'miGanadoEmail',
          'emisorEmail',
        ],
        verification: null, // o { title, intro } para textos propios
        chargesInUsd: true,
      }
    );
  }
}
```

### 2. Registrarlo

En `js/methods/methods_index.js`: importar la clase y agregarla al arreglo.
**El orden del arreglo es el orden en pantalla.**

### 3. Tema de color

En `css/renew.css`, añadir el bloque del tema (mismo patrón que los demás):

```css
.theme-nakamoto { --mc: #1F2937; --mc-bg: #EEF1F5; --mc-border: #D2D9E2; --mc-dark: #111827; }
```

## Referencia del contrato

| Campo | Tipo | Uso |
|---|---|---|
| `key` | string | Identificador único. Es el `data-service` de la tarjeta. |
| `category` | string | `wallet` · `crypto` · `card` · `local` |
| `name` | string | Nombre visible. |
| `theme` | string | Clase CSS del método. |
| `badge` | `{ icon, text }` | Etiqueta superior de la tarjeta. |
| `desc` | string | Texto del paso 3. |
| `logo` | objeto | `img` + `fallback`, o `icon` (id del sprite), o `binance`, o `letter` + `color`. |
| `instructions` | string[] | Lista numerada del paso 4. |
| `dataTitle` | string | Título del bloque de datos. |
| `dataRows` | `{ label, value }[]` | Filas con botón "Copiar". |
| `action` | `{ label, caption, buildLink }` | Botón completo que abre un enlace con el monto. |
| `formFields` | string[] | Campos del paso 5: `miGanadoEmail`, `emisorEmail`, `referenceCode`, `receipt`. La fecha siempre se pide. |
| `verification` | `{ title, intro }` | Textos propios del paso 5. |
| `chargesInUsd` | boolean | `true` si el total se muestra en US$. |
| `noRefoundsReason` | string \| null | Motivo por el que el método no reembolsa. Si viene, el paso 4 muestra un recuadro ámbar "Este método no admite reembolsos". Si no, un recuadro verde "Respira tranquilo". |
| `customRefoundReason` | string \| null | Reembolso con condiciones propias. Tiene **prioridad** sobre `noRefoundsReason` y pinta un recuadro azul "Reembolso con condiciones". |
| `serviceComission` | string \| null | Comisión que cobra el servicio, ej. `'4% a 6%'`. Pinta un recuadro azul "Comisión del servicio" antes del de reembolsos. |
| `comingSoon` | boolean | `true` lo muestra deshabilitado con la etiqueta "Pronto". |

## Recordatorio

Al terminar, comprobar que el paso 5 no pida más de lo necesario:
`formFields` vacío deja solo la fecha.
