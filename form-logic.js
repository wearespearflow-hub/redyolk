
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

  /* ── Format rules ─────────────────────────────────────── 
     Map field IDs to their format type.
     Add or rename IDs here to match your Webflow field IDs.
  ────────────────────────────────────────────────────────── */
  var FORMAT_RULES = {
    // Email fields
    'Work-Email':   'email',
    'Email':        'email',
    // Phone / contact number fields
    'Contact-Number': 'phone',
    'Phone':          'phone',
    'Phone-Number':   'phone',
    // URL fields — all social + portfolio links
    'Portfolio-URL':  'url',
    'Instagram-URL':  'url',
    'YouTube-URL':    'url',
    'TikTok-URL':     'url',
    'Website-URL':    'url'
  };

  var PATTERNS = {
    email: {
      regex:   /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address.'
    },
    phone: {
      // Allows digits, spaces, dashes, parentheses, plus sign — min 7 digits
      regex:   /^\+?[\d\s\-().]{7,}$/,
      message: 'Please enter a valid contact number.'
    },
    url: {
      // Must start with http:// or https://
      regex:   /^https?:\/\/.+\..+/i,
      message: 'Please enter a valid URL (e.g. https://example.com).'
    }
  };

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

  function getFieldWrapper(field) {
    var el = field.parentElement;
    while (el) {
      if (el.classList && el.classList.contains('contact_popup_field')) return el;
      el = el.parentElement;
    }
    return field.parentElement;
  }

  /* ── Validation ───────────────────────────────────────── */
  function stepIsValid(stepEl) {
    if (!stepEl) return true;
    var fields = stepEl.querySelectorAll('[required]');
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (isFieldHidden(f, stepEl)) continue;
      if (!f.value || f.value.trim() === '') return false;
    }
    // Also block if any format error is currently visible in this step
    if (stepEl.querySelector('.ry-error')) return false;
    return true;
  }

  /* ── Format validation for a single field ─────────────── 
     Returns null if OK, or an error message string if invalid.
  ────────────────────────────────────────────────────────── */
  function getFormatError(field) {
    var rule = FORMAT_RULES[field.id];
    if (!rule) return null;                       // no rule → always OK
    var val = field.value ? field.value.trim() : '';
    if (!val) return null;                        // empty handled by required check
    var pattern = PATTERNS[rule];
    if (!pattern) return null;
    if (!pattern.regex.test(val)) return pattern.message;
    return null;
  }

  /* ── Error messages ───────────────────────────────────── */
  function getFieldLabel(field) {
    var wrap = getFieldWrapper(field);
    if (wrap) {
      var labelEl = wrap.querySelector('.contact_popup_label');
      if (labelEl) return labelEl.textContent.replace(/\*$/, '').trim();
    }
    return field.placeholder || field.name || 'This field';
  }

  function showError(field, message) {
    var wrap = getFieldWrapper(field);
    if (!wrap) return;
    // Remove existing error for this field first
    wrap.querySelectorAll('.ry-error[data-for="' + field.id + '"]').forEach(function(el) { el.remove(); });

    var msg = document.createElement('span');
    msg.className = 'ry-error';
    msg.setAttribute('data-for', field.id);
    msg.textContent = message;
    Object.assign(msg.style, {
      display:    'block',
      marginTop:  '4px',
      fontSize:   '12px',
      color:      '#cc0000',
      fontFamily: 'inherit',
      lineHeight: '1.4'
    });
    wrap.appendChild(msg);
    field.style.borderColor = '#cc0000';
    field.style.outline     = 'none';
  }

  function showFieldError(field) {
    showError(field, (getFieldLabel(field) || 'This field') + ' is required.');
  }

  function clearFieldError(field) {
    if (!field) return;
    var wrap = getFieldWrapper(field);
    if (wrap) {
      wrap.querySelectorAll('.ry-error[data-for="' + field.id + '"]').forEach(function(el) { el.remove(); });
    }
    field.style.borderColor = '';
    field.style.outline     = '';
  }

  function clearStepErrors(stepEl) {
    if (!stepEl) return;
    stepEl.querySelectorAll('.ry-error').forEach(function(el) { el.remove(); });
    stepEl.querySelectorAll('input, select, textarea').forEach(function(f) {
      f.style.borderColor = '';
      f.style.outline     = '';
    });
  }

  function clearAllErrors() {
    [stepBrand, stepCreator1, stepCreator2].forEach(clearStepErrors);
  }

  /* ── Validate a single field on blur ──────────────────── */
  function validateField(field, stepEl) {
    if (!['INPUT', 'SELECT', 'TEXTAREA'].includes(field.tagName)) return;
    if (isFieldHidden(field, stepEl)) return;

    var val = field.value ? field.value.trim() : '';

    // 1. Required check
    if (field.hasAttribute('required') && !val) {
      showFieldError(field);
      return;
    }

    // 2. Format check (only if field has a value)
    if (val) {
      var formatErr = getFormatError(field);
      if (formatErr) {
        showError(field, formatErr);
        return;
      }
    }

    // All good — clear any existing error
    clearFieldError(field);
  }

  /* ── Bind blur + live-clear to a step ─────────────────── */
  function bindBlurValidation(stepEl) {
    if (!stepEl) return;

    // Validate on blur (focusout bubbles from all children)
    stepEl.addEventListener('focusout', function(e) {
      validateField(e.target, stepEl);
    });

    // Re-validate on input so format errors clear as soon as value becomes valid
    stepEl.addEventListener('input', function(e) {
      var f = e.target;
      var val = f.value ? f.value.trim() : '';
      if (!val) return; // don't clear "required" error while still empty

      var formatErr = getFormatError(f);
      if (!formatErr) {
        clearFieldError(f);
      } else {
        // Replace stale error with updated format error while typing
        showError(f, formatErr);
      }
    });

    // Selects fire 'change', not 'input'
    stepEl.addEventListener('change', function(e) {
      var f = e.target;
      if (f.value && f.value.trim() !== '') clearFieldError(f);
    });
  }

  /* ── Before native submit, clear inactive path's required ── */
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

  /* ── Button state refresh ─────────────────────────────── */
  function refreshNextBtn() {
    if (!nextBtn) return;
    nextBtn.style.opacity = stepIsValid(stepCreator1) ? '1' : '0.4';
  }

  function refreshBrandSubmit() {
    var btn = stepBrand ? stepBrand.querySelector('[type="submit"]') : null;
    if (!btn) return;
    btn.style.opacity = stepIsValid(stepBrand) ? '1' : '0.4';
  }

  function refreshCreator2Submit() {
    var btn = stepCreator2 ? stepCreator2.querySelector('[type="submit"]') : null;
    if (!btn) return;
    btn.style.opacity = stepIsValid(stepCreator2) ? '1' : '0.4';
  }

  /* ── Full form reset ──────────────────────────────────── */
  function resetForm() {
    if (form) form.reset();
    currentPath = 'none';

    clearAllErrors();

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

    refreshNextBtn();
    refreshBrandSubmit();
    refreshCreator2Submit();
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

  /* ── Bind blur validation to all steps ───────────────── */
  bindBlurValidation(stepCreator1);
  bindBlurValidation(stepCreator2);
  bindBlurValidation(stepBrand);

  /* ── Guest-type radio ─────────────────────────────────── */
  radioInputs.forEach(function(radio) {
    radio.addEventListener('change', function() {
      if (radio.value === 'Brand / Business') {
        currentPath = 'brand';
        clearStepErrors(stepCreator1);
        clearStepErrors(stepCreator2);
        hideStep(step1);
        hideStep(stepCreator1);
        hideStep(stepCreator2);
        showStep(stepBrand);
        refreshBrandSubmit();
      } else if (radio.value === 'Creator / Talent') {
        currentPath = 'creator';
        clearStepErrors(stepBrand);
        hideStep(step1);
        hideStep(stepBrand);
        hideStep(stepCreator2);
        showStep(stepCreator1);
        applyCreatorType(creatorTypeSelect ? creatorTypeSelect.value : '');
        refreshNextBtn();
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

    [portfolioInput, instagramInput,
     document.getElementById('YouTube-URL'),
     document.getElementById('TikTok-URL')
    ].forEach(function(f) { if (f) clearFieldError(f); });

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
    refreshNextBtn();
  }

  if (creatorTypeSelect) {
    creatorTypeSelect.addEventListener('change', function() {
      applyCreatorType(creatorTypeSelect.value);
    });
  }

  /* ── Live button opacity refresh ──────────────────────── */
  if (stepCreator1) {
    stepCreator1.addEventListener('input',  refreshNextBtn);
    stepCreator1.addEventListener('change', refreshNextBtn);
  }
  if (stepBrand) {
    stepBrand.addEventListener('input',  refreshBrandSubmit);
    stepBrand.addEventListener('change', refreshBrandSubmit);
  }
  if (stepCreator2) {
    stepCreator2.addEventListener('input',  refreshCreator2Submit);
    stepCreator2.addEventListener('change', refreshCreator2Submit);
  }

  /* ── Next button ──────────────────────────────────────── */
  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (!stepIsValid(stepCreator1)) return;
      clearStepErrors(stepCreator1);
      hideStep(stepCreator1);
      showStep(stepCreator2);
      refreshCreator2Submit();
    });
  }

  /* ── Back button ──────────────────────────────────────── */
  if (backBtn) {
    backBtn.addEventListener('click', function(e) {
      e.preventDefault();
      clearStepErrors(stepCreator2);
      hideStep(stepCreator2);
      showStep(stepCreator1);
      refreshNextBtn();
    });
  }

  /* ── Submit buttons — safety guard ───────────────────── */
  [stepBrand, stepCreator2].forEach(function(stepEl) {
    if (!stepEl) return;
    var btn = stepEl.querySelector('[type="submit"]');
    if (!btn) return;
    btn.addEventListener('click', function(e) {
      if (!stepIsValid(stepEl)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });
  });

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
          if (nicheOthersInput) {
            clearFieldError(nicheOthersInput);
            nicheOthersInput.value = '';
          }
        }
        if (nicheColumn)    nicheColumn.style.display = '';
        if (nicheFieldWrap) nicheFieldWrap.style.gridColumn = window.innerWidth >= 768 ? 'span 2' : 'span 1';
      }
      refreshCreator2Submit();
    });
  }

  /* ── Init button states ───────────────────────────────── */
  refreshNextBtn();
  refreshBrandSubmit();
  refreshCreator2Submit();

});
