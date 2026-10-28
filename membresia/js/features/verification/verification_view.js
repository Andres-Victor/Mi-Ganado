/* ============================================================
   Mi Ganado PRO — Feature: verificación (vista)
   js/features/verification/verification_view.js
   ------------------------------------------------------------
   Los campos del formulario del paso 5 se derivan de la
   propiedad formFields del método elegido:
     miGanadoEmail | emisorEmail | referenceCode | receipt
   ============================================================ */

import { getElement } from '../../core/core_dom.js';

const FIELD_CONTAINERS =
{
  emisorEmail: 'email-emisor-form',
  miGanadoEmail: 'email-form',
  referenceCode: 'reference-code-form',
  receipt: 'reference-upload-form',
};

export function renderVerificationHeader(method)
{
  const formTitle = getElement('formTitle');
  const formIntro = getElement('formIntro');

  if (!formTitle || !formIntro) return;

  if (method.verification)
  {
    formTitle.textContent = method.verification.title;
    formIntro.textContent = method.verification.intro;
    formIntro.style.display = 'block';

    return;
  }

  formTitle.textContent = 'Registra tu Comprobante de Pago';
  formIntro.style.display = 'none';
}

export function displayPaymentForm(method)
{
  Object.keys(FIELD_CONTAINERS).forEach
  (
    (fieldKey) =>
    {
      const container = getElement(FIELD_CONTAINERS[fieldKey]);

      if (!container) return;

      container.classList.toggle('hidden-group', !method.hasFormField(fieldKey));
    }
  );
}

export function handleFileSelect(fileInput)
{
  const file = fileInput.files && fileInput.files[0];
  const fileNameElement = getElement('file-name');
  const previewElement = getElement('image-preview');

  if (!fileNameElement || !previewElement) return;

  if (!file)
  {
    fileNameElement.textContent = '';
    previewElement.innerHTML = '';
    previewElement.style.display = 'none';

    return;
  }

  fileNameElement.textContent = `✓ ${file.name}`;

  if (!file.type.startsWith('image/'))
  {
    previewElement.innerHTML = '';
    previewElement.style.display = 'none';

    return;
  }

  previewElement.innerHTML = '';

  const image = document.createElement('img');

  image.src = URL.createObjectURL(file);
  image.alt = 'Vista previa del comprobante de pago';
  image.onload = () =>
  {
    URL.revokeObjectURL(image.src);
  };

  previewElement.appendChild(image);
  previewElement.style.display = 'block';
}

export function setupDragDrop()
{
  const dropZone = getElement('file-upload-zone');
  const fileInput = getElement('file-upload');

  if (!dropZone || !fileInput) return;

  ['dragenter', 'dragover'].forEach
  (
    (eventName) =>
    {
      dropZone.addEventListener
      (
        eventName,
        (event) =>
        {
          event.preventDefault();
          event.stopPropagation();
          dropZone.classList.add('dragover');
        }
      );
    }
  );

  ['dragleave', 'drop'].forEach
  (
    (eventName) =>
    {
      dropZone.addEventListener
      (
        eventName,
        (event) =>
        {
          event.preventDefault();
          event.stopPropagation();
          dropZone.classList.remove('dragover');
        }
      );
    }
  );

  dropZone.addEventListener
  (
    'drop',
    (event) =>
    {
      if (!event.dataTransfer || !event.dataTransfer.files.length) return;

      fileInput.files = event.dataTransfer.files;
      handleFileSelect(fileInput);
    }
  );
}
