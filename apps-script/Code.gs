/**
 * Beltec x Beauty Fair 2026 — Apps Script (Plano B)
 *
 * Como atualizar:
 * 1. Abra a planilha "Beltec x Beauty Fair 2026 - Cadastros LP" no Google Sheets.
 * 2. Menu Extensões -> Apps Script.
 * 3. Apague todo o código existente e cole este arquivo inteiro no lugar.
 * 4. Salve (ícone de disquete).
 * 5. Implantar -> Gerenciar implantações -> editar (ícone de lápis) na
 *    implantação ativa -> Versão: "Nova versão" -> Implantar.
 *    Isso mantém a mesma URL que já está em uso no formulário da LP.
 * 6. Na primeira execução após esta atualização, o Google pode pedir uma
 *    nova autorização (porque o script passa a criar uma aba nova) —
 *    autorize normalmente.
 *
 * A aba "Inscricoes_Palestras" é criada automaticamente na primeira
 * execução — não precisa criar manualmente.
 */

var SESSOES = {
  'sab-balcao': { dia: '05/09 (Sáb)', horario: 'Dia todo', titulo: 'Comparativo de motores no balcão', palestrante: 'Equipe Beltec' },
  'dom-1400':   { dia: '06/09 (Dom)', horario: '14:00', titulo: 'Manicure russa com o LB Power', palestrante: 'Fernanda Liciotti' },
  'dom-1500':   { dia: '06/09 (Dom)', horario: '15:00', titulo: 'Palestra sobre Cabines', palestrante: 'Dani Bailey' },
  'dom-1600':   { dia: '06/09 (Dom)', horario: '16:00', titulo: 'Molde F1 com francesa semipermanente', palestrante: 'Pablo Bressan' },
  'dom-1800':   { dia: '06/09 (Dom)', horario: '18:00', titulo: 'Molde F1: Baby Boomer', palestrante: 'Chey Susaki' },
  'seg-1400':   { dia: '07/09 (Seg)', horario: '14:00', titulo: 'Molde F1 Baby Boomer com aerógrafo', palestrante: 'Pablo Bressan' },
  'seg-1600':   { dia: '07/09 (Seg)', horario: '16:00', titulo: 'Soft Gel Estruturada', palestrante: 'Chey Susaki' },
  'seg-1800':   { dia: '07/09 (Seg)', horario: '18:00', titulo: 'Manicure perfeita com esmaltação em gel', palestrante: 'Fátima Sousa (Fadinha das Unhas)' },
  'ter-1400':   { dia: '08/09 (Ter)', horario: '14:00', titulo: 'Molde superior com decoração / Airbrush', palestrante: 'Fátima Sousa (Fadinha das Unhas)' },
  'ter-1500':   { dia: '08/09 (Ter)', horario: '15:00', titulo: 'Manutenção de alongamento (motor de mesa x portátil)', palestrante: 'Lidiane Santos' }
};

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var cadastros = ss.getSheetByName('Cadastros') || ss.getSheets()[0];
  if (cadastros.getName() !== 'Cadastros') cadastros.setName('Cadastros');

  var inscricoes = ss.getSheetByName('Inscricoes_Palestras');
  if (!inscricoes) {
    inscricoes = ss.insertSheet('Inscricoes_Palestras');
    inscricoes.appendRow(['Timestamp', 'Nome', 'Email', 'Telefone', 'Dia', 'Horario', 'Palestra', 'Palestrante', 'Codigo Sessao']);
  }

  var data = JSON.parse(e.postData.contents);
  var cupom = 'BEAUTEC5';
  var timestamp = new Date();

  cadastros.appendRow([
    timestamp,
    data.nome || '',
    data.email || '',
    data.telefone || '',
    data.cargo || '',
    data.segmento || '',
    data.lgpd ? 'Sim' : 'Nao',
    cupom
  ]);

  var palestrasSelecionadas = data.palestras || [];
  var resumoPalestras = [];

  palestrasSelecionadas.forEach(function (codigo) {
    var sessao = SESSOES[codigo];
    if (sessao) {
      inscricoes.appendRow([
        timestamp, data.nome || '', data.email || '', data.telefone || '',
        sessao.dia, sessao.horario, sessao.titulo, sessao.palestrante, codigo
      ]);
      resumoPalestras.push(sessao.dia + ' às ' + sessao.horario + ' - ' + sessao.titulo + ' (' + sessao.palestrante + ')');
    }
  });

  if (data.email) {
    var assunto = 'Sua inscrição confirmada - Beltec x Beauty Fair 2026';
    var corpo =
      'Oi, ' + (data.nome || '') + '!\n\n' +
      'Sua inscrição no estande da Beltec (L115) na Beauty Fair 2026 está confirmada.\n\n' +
      (resumoPalestras.length
        ? 'Suas palestras/workshops:\n- ' + resumoPalestras.join('\n- ') + '\n\n'
        : '') +
      'Seu cupom de 5% OFF é: ' + cupom + '\n' +
      'Válido até 14/09/2026, para compras em https://beltecoficial.com.br/loja\n\n' +
      'Você também está concorrendo a um Micromotor LB100 Beltec completo!\n\n' +
      'Nos vemos na feira!\n' +
      'Equipe Beltec';

    MailApp.sendEmail(data.email, assunto, corpo);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'API online' }))
    .setMimeType(ContentService.MimeType.JSON);
}
