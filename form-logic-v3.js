/* ============================================================
   RED YOLK — Contact Form Logic  v3.1
   Naming convention:
     • Webflow element IDs  → kebab-case   e.g. creator-type
     • Radio Group Name     → form_type
     • Radio Choice Values  → brand | creator
   Paste inside a <script> tag: Webflow → Page Settings → Before </body>
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Selectors ────────────────────────────────────────── */
  const step1        = document.querySelector('.form_step.is-1');
  const stepBrand    = document.querySelector('.form_step.is-brand');
  const stepCreator1 = document.querySelector('.form_step.is-creator1');
  const stepCreator2 = document.querySelector('.form_step.is-creator2');

  // Radio — Group Name: form_type | Choice Values: brand / creator
  const radioInputs = document.querySelectorAll('input[name="form_type"]');

  // Creator type select — Webflow ID: creator-type
  const creatorTypeSelect = document.getElementById('creator-type');

  // URL field wrappers (contact_popup_field divs) — single-word IDs
  const portfolioWrap = document.getElementById('portfolio');
  const instagramWrap = document.getElementById('instagram');
  const youtubeWrap   = document.getElementById('youtube');
  const tiktokWrap    = document.getElementById('tiktok');

  // URL inputs — Webflow IDs: kebab-case
  const instagramInput = document.getElementById('instagram-url');
  const portfolioInput = document.getElementById('portfolio-url');

  // Instagram label (for required asterisk swap)
  const instagramLabel = instagramWrap
    ? instagramWrap.querySelector('.contact_popup_label')
    : null;

  // Niche fields — Webflow IDs: kebab-case
  const industryNicheSelect = document.getElementById('industry-niche');
  const nicheOthersWrap     = document.querySelector('.contact_popup_field.is-niche-others');
  const nicheOthersInput    = document.getElementById('industry-niche-other');
  const nicheColumn         = document.querySelector('.contact_popup_niche');
  const nicheFieldWrap      = document.getElementById('niche');

  // Navigation & form
  const nextBtn  = document.getElementById('next');
  const backBtn  = document.getElementById('back');
  const closeBtn = document.querySelector('.contact_popup_close');
  const form     = document.getElementById('wf-form-Contact-Form');

  /* ── Track current path ───────────────────────────────── */
  var currentPath = 'none';

  /* ── Helpers ──────────────────────────────────────────── */
  function showStep(el)  { if (el) el.style.display = 'flex'; }
  function hideStep(el)  { if (el) el.style.display = 'none'; }
  function showField(el) { if (el) el.style.display = 'block'; }
  function hideField(el) { if (el) el.style.display = 'none'; }

  function setRequired(input, required) {
    if (!input) return;
    required
      ? input.setAttribute('required', '')
      : input.removeAttribute('required');
  }

  /* Strip required from ALL fields inside a step element */
  function clearRequiredInStep(stepEl) {
    if (!stepEl) return;
    stepEl.querySelectorAll('[required]').forEach(function (f) {
      f.removeAttribute('required');
    });
  }

  function isFieldHidden(field, stepEl) {
    var el = field.parentElement;
    while (el && el !== stepEl) {
      if (el.style.display === 'none') return true;
      el = el.parentElement;
    }
    return false;
  }

  /* ── Full form reset ──────────────────────────────────── */
  function resetForm() {
    if (form) form.reset();
    currentPath = 'none';

    hideStep(stepBrand);
    hideStep(stepCreator1);
    hideStep(stepCreator2);
    showStep(step1);

    hideField(portfolioWrap);
    hideField(instagramWrap);
    hideField(youtubeWrap);
    hideField(tiktokWrap);

    if (nicheOthersWrap) {
      nicheOthersWrap.style.setProperty('display', 'none', 'important');
      setRequired(nicheOthersInput, false);
      if (nicheOthersInput) nicheOthersInput.value = '';
    }
    if (nicheColumn)    nicheColumn.style.display = '';
    if (nicheFieldWrap) nicheFieldWrap.style.gridColumn =
      window.innerWidth >= 768 ? 'span 2' : 'span 1';
    if (instagramLabel) instagramLabel.textContent = 'Instagram URL*';
  }

  /* ── Close button ─────────────────────────────────────── */
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      setTimeout(resetForm, 1000);
    });
  }

  /* ── Initial state ────────────────────────────────────── */
  showStep(step1);
  hideStep(stepBrand);
  hideStep(stepCreator1);
  hideStep(stepCreator2);
  hideField(portfolioWrap);
  hideField(instagramWrap);
  hideField(youtubeWrap);
  hideField(tiktokWrap);
  hideField(nicheOthersWrap);

  /* ── Guest-type radio ─────────────────────────────────── */
  // Radio Group Name: form_type
  // Choice Values:    brand | creator
  radioInputs.forEach(function (radio) {
    radio.addEventListener('change', function () {

      if (radio.value === 'brand') {
        currentPath = 'brand';

        // Clear required from ALL creator fields so browser validation
        // doesn't block the brand path submit
        clearRequiredInStep(stepCreator1);
        clearRequiredInStep(stepCreator2);

        hideStep(step1);
        hideStep(stepCreator1);
        hideStep(stepCreator2);
        showStep(stepBrand);

      } else if (radio.value === 'creator') {
        currentPath = 'creator';

        // Clear required from ALL brand fields
        clearRequiredInStep(stepBrand);

        hideStep(step1);
        hideStep(stepBrand);
        hideStep(stepCreator2);
        showStep(stepCreator1);
        applyCreatorType(
          creatorTypeSelect ? creatorTypeSelect.value : ''
        );
      }
    });
  });

  /* ── Creator type ─────────────────────────────────────── */
  function applyCreatorType(type) {
    // Reset all URL fields
    hideField(portfolioWrap);
    hideField(instagramWrap);
    hideField(youtubeWrap);
    hideField(tiktokWrap);
    setRequired(portfolioInput, false);
    setRequired(instagramInput, false);
    setRequired(document.getElementById('youtube-url'), false);
    setRequired(document.getElementById('tiktok-url'), false);

    if (type === 'Influencer') {
      showField(instagramWrap);
      showField(tiktokWrap);
      showField(youtubeWrap);
      setRequired(instagramInput, true);
      if (instagramLabel) instagramLabel.textContent = 'Instagram URL*';

    } else if (type === 'UGC Creator') {
      showField(portfolioWrap);
      showField(instagramWrap);
      showField(tiktokWrap);
      showField(youtubeWrap);
      setRequired(portfolioInput, true);
      if (instagramLabel) instagramLabel.textContent = 'Instagram URL';

    } else if (type === 'Both') {
      showField(portfolioWrap);
      showField(instagramWrap);
      showField(tiktokWrap);
      showField(youtubeWrap);
      setRequired(portfolioInput, true);
      setRequired(instagramInput, true);
      if (instagramLabel) instagramLabel.textContent = 'Instagram URL*';
    }
  }

  if (creatorTypeSelect) {
    creatorTypeSelect.addEventListener('change', function () {
      applyCreatorType(creatorTypeSelect.value);
    });
  }

  /* ── Next button — validate step 1 before advancing ───── */
  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.preventDefault();

      var allValid = true;

      if (stepCreator1) {
        stepCreator1
          .querySelectorAll('[required], [type="email"], [type="url"], [pattern]')
          .forEach(function (f) {
            if (isFieldHidden(f, stepCreator1)) return;
            if (!f.validity.valid) {
              if (allValid) f.reportValidity();
              allValid = false;
            }
          });
      }

      if (!allValid) return;

      hideStep(stepCreator1);
      showStep(stepCreator2);
    });
  }

  /* ── Back button ──────────────────────────────────────── */
  if (backBtn) {
    backBtn.addEventListener('click', function (e) {
      e.preventDefault();
      hideStep(stepCreator2);
      showStep(stepCreator1);
    });
  }

  /* ── Niche "Others" reveal ────────────────────────────── */
  if (industryNicheSelect) {
    industryNicheSelect.addEventListener('change', function () {
      var val = industryNicheSelect.value;

      if (val === 'Others') {
        if (nicheOthersWrap) {
          nicheOthersWrap.style.setProperty('display', 'block', 'important');
          setRequired(nicheOthersInput, true);
        }
        if (nicheColumn)    nicheColumn.style.display = 'grid';
        if (nicheFieldWrap) nicheFieldWrap.style.gridColumn = 'span 1';

      } else {
        if (nicheOthersWrap) {
          nicheOthersWrap.style.setProperty('display', 'none', 'important');
          setRequired(nicheOthersInput, false);
          if (nicheOthersInput) nicheOthersInput.value = '';
        }
        if (nicheColumn)    nicheColumn.style.display = '';
        if (nicheFieldWrap) nicheFieldWrap.style.gridColumn =
          window.innerWidth >= 768 ? 'span 2' : 'span 1';
      }
    });
  }

});
