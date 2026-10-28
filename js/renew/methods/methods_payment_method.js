/* ============================================================
   Mi Ganado PRO — Métodos de pago: contrato
   js/methods/methods_payment_method.js
   ------------------------------------------------------------
   Patrón Strategy. Todo método de pago es una subclase de
   PaymentMethod con su configuración declarativa. Para añadir
   un método nuevo: se crea su archivo, se extiende esta clase
   y se registra en methods_index.js.
   ============================================================ */

export class PaymentMethod
{
  constructor
  (
    {
      key,
      category,
      name,
      theme,
      badge,
      desc,
      logo = null,
      instructions = [],
      dataTitle = null,
      dataRows = [],
      action = null,
      formFields = [],
      verification = null,
      chargesInUsd = false,
      noRefoundsReason = null,
      customRefoundReason = null,
      serviceComission = null,
      comingSoon = false,
    }
  )
  {
    this.key = key;
    this.category = category;
    this.name = name;
    this.theme = theme;
    this.badge = badge;
    this.desc = desc;
    this.logo = logo;
    this.instructions = instructions;
    this.dataTitle = dataTitle;
    this.dataRows = dataRows;
    this.action = action;
    this.formFields = formFields;
    this.verification = verification;
    this.chargesInUsd = chargesInUsd;
    this.noRefoundsReason = noRefoundsReason;
    this.customRefoundReason = customRefoundReason;
    this.serviceComission = serviceComission;
    this.comingSoon = comingSoon;
  }

  isAvailable()
  {
    return !this.comingSoon;
  }

  // Métodos con acción externa (PayPal, Zinli) sobrescriben esto
  buildActionLink(amount)
  {
    if (!this.action) return null;

    return this.action.buildLink(amount);
  }

  getActionLabel()
  {
    if (!this.action) return null;

    return this.action.label;
  }

  getActionCaption()
  {
    if (!this.action) return null;

    return this.action.caption;
  }

  hasFormField(fieldKey)
  {
    return this.formFields.includes(fieldKey);
  }

  // Si el método no reembolsa, el motivo viene en su configuración
  hasNoRefoundsReason()
  {
    return typeof this.noRefoundsReason === 'string' && this.noRefoundsReason.length > 0;
  }

  // Reembolso con condiciones propias (tiene prioridad sobre noRefoundsReason)
  hasCustomRefoundReason()
  {
    return typeof this.customRefoundReason === 'string' && this.customRefoundReason.length > 0;
  }

  // Comisión que cobra el servicio, descrita en texto (ej: '4% a 6%')
  hasServiceComission()
  {
    return typeof this.serviceComission === 'string' && this.serviceComission.length > 0;
  }

  getDataTitle()
  {
    return this.dataTitle || `Datos de ${this.name}`;
  }
}
