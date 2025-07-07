function adicionarRenda() {
  const container = document.getElementById("rendas-container");
  const bloco = document.createElement("div");
  bloco.classList.add("renda-bloco");
  bloco.innerHTML = `
    <label>Rendimento Bruto Mensal (R$): <input type="number" step="0.01" class="rendimento"></label>
    <label>INSS Contribuído Mensal (R$): <input type="number" step="0.01" class="inss" value="0"></label>
    <label>IRRF Retido Mensal (R$): <input type="number" step="0.01" class="irrf" value="0"></label>
  `;
  container.appendChild(bloco);
}

// FAIXAS DO IRPF ANUAL 2024
function calcularIRPF(base) {
  if (base <= 27110.4) return 0;
  if (base <= 33919.8) return base * 0.075 - 2033.28;
  if (base <= 45012.6) return base * 0.15 - 4577.28;
  if (base <= 55976.16) return base * 0.225 - 7953.24;
  return base * 0.275 - 10752.0;
}

function executarCalculo() {
  const rendimentos = document.querySelectorAll(".rendimento");
  const inssCampos = document.querySelectorAll(".inss");
  const irrfCampos = document.querySelectorAll(".irrf");

  let rendimentoTotalAnual = 0;
  let inssTotalAnual = 0;
  let irrfRetidoAnual = 0;

  for (let i = 0; i < rendimentos.length; i++) {
    const rendimentoMensal = parseFloat(rendimentos[i].value) || 0;
    const inssMensal = parseFloat(inssCampos[i].value) || 0;
    const irrfMensal = parseFloat(irrfCampos[i].value) || 0;

    rendimentoTotalAnual += rendimentoMensal * 13;
    inssTotalAnual += inssMensal * 13;
    irrfRetidoAnual += irrfMensal * 13;
  }

  const dependentes =
    parseInt(document.getElementById("dependentes").value) * 12 || 0;
  const pensao = parseFloat(document.getElementById("pensao").value) * 12 || 0;
  const educacao =
    parseFloat(document.getElementById("educacao").value) * 12 || 0;
  const saude = parseFloat(document.getElementById("saude").value) * 12 || 0;
  const previdencia =
    parseFloat(document.getElementById("previdencia").value) * 12 || 0;

  const deducaoDependentes = dependentes * 189.59 * 12;
  const totalDeducoes =
    inssTotalAnual +
    deducaoDependentes +
    pensao +
    educacao +
    saude +
    previdencia;

  const baseCalculo = rendimentoTotalAnual - totalDeducoes;

  const impostoDevido = Math.max(calcularIRPF(baseCalculo), 0);
  const saldo = impostoDevido - irrfRetidoAnual;

  const resultadoHTML = `
    <strong>Resumo Anual:</strong><br>
    ➤ Total de rendimentos (13 salários): R$ ${rendimentoTotalAnual.toFixed(
      2
    )}<br>
    ➤ Total de deduções:<br>
    &nbsp;&nbsp;&nbsp;&nbsp;- INSS informado (13 meses): R$ ${inssTotalAnual.toFixed(
      2
    )}<br>
    &nbsp;&nbsp;&nbsp;&nbsp;- Dependentes: R$ ${deducaoDependentes.toFixed(
      2
    )}<br>
    &nbsp;&nbsp;&nbsp;&nbsp;- Pensão alimentícia: R$ ${pensao.toFixed(2)}<br>
    &nbsp;&nbsp;&nbsp;&nbsp;- Educação: R$ ${educacao.toFixed(2)}<br>
    &nbsp;&nbsp;&nbsp;&nbsp;- Saúde: R$ ${saude.toFixed(2)}<br>
    &nbsp;&nbsp;&nbsp;&nbsp;- Previdência privada: R$ ${previdencia.toFixed(
      2
    )}<br>
    <strong>➤ Total de deduções: R$ ${totalDeducoes.toFixed(2)}</strong><br><br>
    ➤ Base de cálculo do IRPF: R$ ${baseCalculo.toFixed(2)}<br>
    ➤ IRPF devido no ano: R$ ${impostoDevido.toFixed(2)}<br>
    ➤ IRRF retido (13 meses): R$ ${irrfRetidoAnual.toFixed(2)}<br>
    <br><strong>${
      saldo >= 0 ? "Imposto a pagar" : "Imposto a restituir"
    }: R$ ${Math.abs(saldo).toFixed(2)}</strong>
    <br><strong>${
      saldo >= 0
        ? `Imposto a pagar / 12 meses: R$ ${(Math.abs(saldo) / 12).toFixed(2)}`
        : "Imposto a restituir"
    }: </strong>
  `;

  document.getElementById("resultado").innerHTML = resultadoHTML;
}
