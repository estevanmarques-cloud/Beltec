(function () {
  'use strict';

  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz40gN8Nk6rPdLSe1v_kvfHLeMscZ0jU794p_Lkth2bAoPmwG2AC5niE4_E_hqsYju-/exec';

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
        lgpd: document.getElementById('lgpd').checked
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
          submitBtn.textContent = 'Quero meu cupom';
        });
    });
  }
})();
