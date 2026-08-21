(function () {
  'use strict';

  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz40gN8Nk6rPdLSe1v_kvfHLeMscZ0jU794p_Lkth2bAoPmwG2AC5niE4_E_hqsYju-/exec';

  var SESSIONS = {
    'sab-balcao': { day: 'Sáb 05/09', time: 'Dia todo', title: 'Comparativo de motores no balcão' },
    'dom-1400':   { day: 'Dom 06/09', time: '14:00', title: 'Manicure russa com o LB Power' },
    'dom-1500':   { day: 'Dom 06/09', time: '15:00', title: 'Palestra sobre Cabines' },
    'dom-1600':   { day: 'Dom 06/09', time: '16:00', title: 'Molde F1 com francesa semipermanente' },
    'dom-1800':   { day: 'Dom 06/09', time: '18:00', title: 'Molde F1: Baby Boomer' },
    'seg-1400':   { day: 'Seg 07/09', time: '14:00', title: 'Molde F1 Baby Boomer com aerógrafo' },
    'seg-1600':   { day: 'Seg 07/09', time: '16:00', title: 'Soft Gel Estruturada' },
    'seg-1800':   { day: 'Seg 07/09', time: '18:00', title: 'Manicure perfeita com esmaltação em gel' },
    'ter-1400':   { day: 'Ter 08/09', time: '14:00', title: 'Molde superior com decoração / Airbrush' },
    'ter-1500':   { day: 'Ter 08/09', time: '15:00', title: 'Manutenção de alongamento (motor de mesa x portátil)' }
  };

  var selected = [];

  /* ---------------- Tabs de programação ---------------- */
  var tabs = document.querySelectorAll('.day-tab');
  var panels = document.querySelectorAll('.day-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(function (p) { p.classList.remove('active'); });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById(tab.dataset.day).classList.add('active');
    });
  });

  /* ---------------- Seleção de palestras ---------------- */
  var selectionCounter = document.getElementById('selectionCounter');
  var selectionCounterText = document.getElementById('selectionCounterText');
  var chipsList = document.getElementById('chipsList');
  var chipsEmpty = document.getElementById('chipsEmpty');
  var scheduleFab = document.getElementById('scheduleFab');
  var fabText = document.getElementById('fabText');
  var stickyCtaBtn = document.getElementById('stickyCtaBtn');

  function updateSelectionUI() {
    var count = selected.length;

    // Contador na seção de programação
    if (selectionCounter && selectionCounterText) {
      selectionCounter.classList.toggle('has-selection', count > 0);
      if (count === 0) {
        selectionCounterText.textContent = 'Nenhuma palestra selecionada ainda';
      } else if (count === 1) {
        selectionCounterText.textContent = '1 palestra selecionada';
      } else {
        selectionCounterText.textContent = count + ' palestras selecionadas';
      }
    }

    // Chips no formulário
    if (chipsList && chipsEmpty) {
      chipsList.innerHTML = '';
      chipsEmpty.style.display = count === 0 ? 'block' : 'none';

      selected.forEach(function (code) {
        var session = SESSIONS[code];
        if (!session) return;

        var chip = document.createElement('span');
        chip.className = 'chip';
        chip.dataset.code = code;

        var label = document.createElement('span');
        label.className = 'chip-label';
        label.textContent = session.day + ' ' + session.time + ' — ' + session.title;

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'chip-remove';
        removeBtn.setAttribute('aria-label', 'Remover ' + session.title);
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', function () {
          toggleSession(code);
        });

        chip.appendChild(label);
        chip.appendChild(removeBtn);
        chipsList.appendChild(chip);
      });
    }

    // FAB flutuante (desktop) e barra fixa (mobile)
    var ctaLabel = count > 0
      ? (count === 1 ? '1 palestra selecionada · Confirmar inscrição' : count + ' palestras selecionadas · Confirmar inscrição')
      : 'Confirmar inscrição';

    if (scheduleFab && fabText) {
      scheduleFab.classList.toggle('show', count > 0);
      fabText.textContent = ctaLabel;
    }
    if (stickyCtaBtn) {
      stickyCtaBtn.textContent = ctaLabel;
    }
  }

  function toggleSession(code) {
    var button = document.querySelector('.session-select[data-code="' + code + '"]');
    var item = document.querySelector('.session-item[data-code="' + code + '"]');
    var idx = selected.indexOf(code);
    var isNowSelected = idx === -1;

    if (isNowSelected) {
      selected.push(code);
    } else {
      selected.splice(idx, 1);
    }

    if (button) {
      button.setAttribute('aria-pressed', String(isNowSelected));
      button.querySelector('.select-label').textContent = isNowSelected ? 'Selecionado' : (button.dataset.code === 'sab-balcao' ? 'Quero ser avisado' : 'Tenho interesse');
    }
    if (item) {
      item.classList.toggle('is-selected', isNowSelected);
    }

    updateSelectionUI();
  }

  document.querySelectorAll('.session-select').forEach(function (btn) {
    btn.addEventListener('click', function () {
      toggleSession(btn.dataset.code);
    });
  });

  if (scheduleFab) {
    scheduleFab.addEventListener('click', function () {
      document.getElementById('form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  updateSelectionUI();

  /* ---------------- Modal (condições do sorteio) ---------------- */
  document.querySelectorAll('.modal-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      var modal = document.getElementById(trigger.dataset.modal);
      if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModals() {
    document.querySelectorAll('.modal-overlay.open').forEach(function (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.modal-close').forEach(function (btn) {
    btn.addEventListener('click', closeModals);
  });
  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModals();
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModals();
  });

  /* ---------------- Máscara de telefone BR ---------------- */
  var telInput = document.getElementById('telefone');
  if (telInput) {
    telInput.addEventListener('input', function () {
      var v = telInput.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) {
        v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      } else if (v.length > 5) {
        v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else if (v.length > 0) {
        v = v.replace(/(\d{0,2})/, '($1');
      }
      telInput.value = v.trim().replace(/-$/, '').replace(/\($/, '');
    });
  }

  /* ---------------- Validação + envio do formulário ---------------- */
  var form = document.getElementById('registrationForm');
  var submitBtn = document.getElementById('submitBtn');
  var formStatus = document.getElementById('formStatus');
  var formCard = document.querySelector('.form-card');
  var formSuccess = document.getElementById('formSuccess');

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return value.replace(/\D/g, '').length >= 10;
  }

  function setFieldValid(field, valid) {
    field.classList.toggle('invalid', !valid);
  }

  function validateForm() {
    var ok = true;

    var nome = document.getElementById('nome');
    var nomeOk = nome.value.trim().length >= 3;
    setFieldValid(nome.closest('.field'), nomeOk);
    ok = ok && nomeOk;

    var email = document.getElementById('email');
    var emailOk = isValidEmail(email.value.trim());
    setFieldValid(email.closest('.field'), emailOk);
    ok = ok && emailOk;

    var telefone = document.getElementById('telefone');
    var telOk = isValidPhone(telefone.value);
    setFieldValid(telefone.closest('.field'), telOk);
    ok = ok && telOk;

    var cargo = document.getElementById('cargo');
    var cargoOk = cargo.value !== '';
    setFieldValid(cargo.closest('.field'), cargoOk);
    ok = ok && cargoOk;

    var segmento = document.getElementById('segmento');
    var segOk = segmento.value !== '';
    setFieldValid(segmento.closest('.field'), segOk);
    ok = ok && segOk;

    var lgpd = document.getElementById('lgpd');
    ok = ok && lgpd.checked;
    if (!lgpd.checked) {
      formStatus.textContent = 'É necessário aceitar o uso dos dados para continuar.';
      formStatus.className = 'form-status show error';
    }

    return ok;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      if (!validateForm()) {
        return;
      }

      var payload = {
        nome: document.getElementById('nome').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefone: document.getElementById('telefone').value.trim(),
        cargo: document.getElementById('cargo').value,
        segmento: document.getElementById('segmento').value,
        lgpd: document.getElementById('lgpd').checked,
        palestras: selected.slice()
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      // O Apps Script Web App não responde com cabeçalhos CORS para fetch
      // cross-origin, por isso o envio usa mode:'no-cors' (resposta opaca).
      // O doPost() do Apps Script lê e.postData.contents diretamente, então
      // o JSON enviado no body chega corretamente mesmo sem Content-Type
      // customizado.
      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      })
        .then(function () {
          formCard.classList.add('is-submitted');
          formSuccess.classList.add('show');
        })
        .catch(function () {
          formStatus.textContent = 'Não foi possível enviar agora. Verifique sua conexão e tente novamente.';
          formStatus.className = 'form-status show error';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Confirmar inscrição';
        });
    });
  }
})();
