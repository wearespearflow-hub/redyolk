
/* ============================================================
   RED YOLK — Contact Form Logic
   Paste inside a <script> tag: Webflow → Page Settings → Before </body>
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Selectors ────────────────────────────────────────── */
  const step1        = document.querySelector('.form_step.is-1');
  const stepBrand    = document.querySelector('.form_step.is-brand');
  const stepCreator1 = document.querySelector('.form_step.is-creator1');
  const stepCreator2 = document.querySelector('.form_step.is-creator2');

  const radioInputs = document.querySelectorAll('input[name="Guest-Type"]');

  const creatorTypeSelect = document.getElementById('Creator-Type');
  const portfolioWrap     = document.getElementById('portfolio');
  const instagramWrap     = document.getElementById('instagram');
  const youtubeWrap       = document.getElementById('youtube');
  const tiktokWrap        = document.getElementById('tiktok');
  const instagramInput    = document.getElementById('Instagram-URL');
  const instagramLabel    = instagramWrap ? instagramWrap.querySelector('.contact_popup_label') : null;
  const portfolioInput    = document.getElementById('Portfolio-URL');

  const industryNicheSelect = document.getElementById('Industry-Niche');
  const nicheOthersWrap     = document.querySelector('.contact_popup_field.is-niche-others');
  const nicheOthersInput    = document.getElementById('Industry-Niche-Other');
  const nicheColumn         = document.querySelector('.contact_popup_niche');
  const nicheFieldWrap      = document.getElementById('niche');

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
    required ? input.setAttribute('required', '') : input.removeAttribute('required');
  }

  function isFieldHidden(field, stepEl) {
    var el = field.parentElement;
    while (el && el !== stepEl) {
      if (el.style.display === 'none') return true;
      el = el.parentElement;
    }
    return false;
  }

  /* ── Step validity check (used only for Next gating) ──── */
  function stepIsValid(stepEl) {
    if (!stepEl) return true;
    var fields = stepEl.querySelectorAll('[required]');
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (isFieldHidden(f, stepEl)) continue;
      if (!f.validity.valid) return false;
    }
    return true;
  }

  /* ── Before native submit, clear inactive path's required
        so the browser doesn't complain about hidden fields ── */
  if (form) {
    form.addEventListener('submit', function() {
      if (currentPath === 'brand') {
        if (stepCreator1) stepCreator1.querySelectorAll('[required]').forEach(function(f) { f.removeAttribute('required'); });
        if (stepCreator2) stepCreator2.querySelectorAll('[required]').forEach(function(f) { f.removeAttribute('required'); });
      } else if (currentPath === 'creator') {
        if (stepBrand) stepBrand.querySelectorAll('[required]').forEach(function(f) { f.removeAttribute('required'); });
      }
    });
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
    if (nicheFieldWrap) nicheFieldWrap.style.gridColumn = window.innerWidth >= 768 ? 'span 2' : 'span 1';
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
  radioInputs.forEach(function(radio) {
    radio.addEventListener('change', function() {
      if (radio.value === 'Brand / Business') {
        currentPath = 'brand';
        hideStep(step1);
        hideStep(stepCreator1);
        hideStep(stepCreator2);
        showStep(stepBrand);
      } else if (radio.value === 'Creator / Talent') {
        currentPath = 'creator';
        hideStep(step1);
        hideStep(stepBrand);
        hideStep(stepCreator2);
        showStep(stepCreator1);
        applyCreatorType(creatorTypeSelect ? creatorTypeSelect.value : '');
      }
    });
  });

  /* ── Creator type ─────────────────────────────────────── */
  function applyCreatorType(type) {
    hideField(portfolioWrap);
    hideField(instagramWrap);
    hideField(youtubeWrap);
    hideField(tiktokWrap);
    setRequired(portfolioInput, false);
    setRequired(instagramInput, false);
    setRequired(document.getElementById('YouTube-URL'), false);
    setRequired(document.getElementById('TikTok-URL'), false);

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
    creatorTypeSelect.addEventListener('change', function() {
      applyCreatorType(creatorTypeSelect.value);
    });
  }

  /* ── Next button — trigger browser validation on step 1 ── */
  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();

      // Use browser's native reportValidity to show default errors
      var allValid = true;
      if (stepCreator1) {
        stepCreator1.querySelectorAll('[required], [type="email"], [type="url"], [pattern]').forEach(function(f) {
          if (isFieldHidden(f, stepCreator1)) return;
          if (!f.validity.valid) {
            if (allValid) f.reportValidity(); // browser shows its tooltip on the first invalid field
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
    backBtn.addEventListener('click', function(e) {
      e.preventDefault();
      hideStep(stepCreator2);
      showStep(stepCreator1);
    });
  }

  /* ── Niche "Others" ───────────────────────────────────── */
  if (industryNicheSelect) {
    industryNicheSelect.addEventListener('change', function() {
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
        if (nicheFieldWrap) nicheFieldWrap.style.gridColumn = window.innerWidth >= 768 ? 'span 2' : 'span 1';
      }
    });
  }

});
