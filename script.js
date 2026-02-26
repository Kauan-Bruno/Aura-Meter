// JS atualizado - Aura escalada para 0 a ~1 trilhão

document.getElementById('auraForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obter valores
    const nome = document.getElementById('nome').value.trim();
    const idade = parseInt(document.getElementById('idade').value);
    const genero = document.getElementById('genero').value;
    const estado = document.getElementById('estado').value;
    const time = document.getElementById('time').value;
    const plataforma = document.getElementById('plataforma').value;
    const jogosSelect = document.getElementById('jogos');
    const jogos = Array.from(jogosSelect.selectedOptions).map(option => option.value);

    // Aura base bem maior (milhões a dezenas de bilhões)
    let aura = calcularAuraNome(nome) + calcularAuraIdade(idade);

    // Multiplicador total
    let multiplicador = 1;

    multiplicador *= (1 + calcularPorcentagemGenero(genero));
    multiplicador *= (1 + calcularPorcentagemEstado(estado));
    multiplicador *= (1 + calcularPorcentagemTime(time));
    multiplicador *= (1 + calcularPorcentagemPlataforma(plataforma));

    // Efeitos dos jogos
    jogos.forEach(jogo => {
        const efeito = calcularEfeitoJogo(jogo);
        if (efeito.isPercent) {
            multiplicador *= (1 + efeito.valor);
        } else {
            aura += efeito.valor;
        }
    });

    // Bônus final pequeno aleatório (ajuda a variar)
    aura += randomInt(-500_000_000, 1_500_000_000); // -0.5B a +1.5B

    // Aplicar multiplicador
    aura = Math.round(aura * multiplicador);

    // Limitar entre 0 e 1 trilhão
    aura = Math.max(0, Math.min(aura, 1_000_000_000_000));

    // Formatar com sufixos para ficar legível
    const auraFormatada = formatarNumero(aura);

    // Mostrar
    document.getElementById('auraValor').textContent = `${auraFormatada} Aura`;
    document.getElementById('resultado').classList.remove('hidden');
});

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcularAuraNome(nome) {
    const partes = nome.split(/\s+/);
    const primeiroNome = partes[0];
    const sobrenomes = partes.slice(1);
    const numSobrenomes = sobrenomes.length;

    let auraNome = 0;

    // Primeiro nome (escalado ×100)
    const lenPrimeiro = primeiroNome.length;
    if (lenPrimeiro < 5) {
        auraNome += randomInt(500_000, 1_000_000);     // 0.5M – 1M
    } else if (lenPrimeiro <= 7) {
        auraNome += randomInt(300_000, 700_000);
    } else {
        auraNome += randomInt(100_000, 300_000);
    }

    // Sobrenomes (escalado)
    if (numSobrenomes === 1) {
        auraNome += randomInt(500_000, 1_000_000);
    } else if (numSobrenomes === 2 || numSobrenomes === 3) {
        auraNome += randomInt(200_000, 300_000);
    } else if (numSobrenomes > 3) {
        auraNome -= 400_000;
    }

    return auraNome * 100;  // ×100 final → casa dos milhões/bilhões
}

function calcularAuraIdade(idade) {
    if (idade < 13) {
        return randomInt(200_000, 500_000) * 100;
    } else if (idade >= 14 && idade <= 18) {
        return randomInt(300_000, 700_000) * 100;
    } else if (idade >= 19 && idade <= 30) {
        return randomInt(500_000, 1_000_000) * 100;
    } else if (idade > 40) {
        return randomInt(1_000_000, 2_000_000) * 100;
    }
    return 0;
}

function calcularPorcentagemGenero(genero) {
    return genero === 'outro' ? -0.05 : 0;
}

function calcularPorcentagemEstado(estado) {
    const sul      = ['RS', 'SC', 'PR'];           // +20%
    const sudeste  = ['SP', 'RJ', 'MG', 'ES'];     // +10%
    const centro   = ['MS', 'MT', 'GO', 'DF'];     // 0%
    const nordeste = ['BA','SE','AL','PE','PB','RN','CE','PI','MA']; // -10%
    const norte    = ['TO','PA','AM','RR','AP','AC','RO'];           // -15%

    if (sul.includes(estado))      return 0.20;
    if (sudeste.includes(estado))  return 0.10;
    if (centro.includes(estado))   return 0;
    if (nordeste.includes(estado)) return -0.10;
    if (norte.includes(estado))    return -0.15;
    return -0.15;
}

function calcularPorcentagemTime(time) {
    const top10 = ['Flamengo','Corinthians','Palmeiras','São Paulo','Grêmio','Internacional','Santos','Cruzeiro','Atlético-MG','Vasco'];
    if (!top10.includes(time)) return -0.30;
    return randomInt(-10, 20) / 100;
}

function calcularPorcentagemPlataforma(plataforma) {
    const bonus = { 'PC': 0.20, 'Console': 0.10, 'Mobile': -0.15, 'VR': -0.15 };
    return bonus[plataforma] || 0;
}

function calcularEfeitoJogo(jogo) {
    if (jogo === 'Minecraft') {
        return { isPercent: true, valor: 1.00 };   // ×2
    }
    if (jogo === 'Roblox') {
        return { isPercent: true, valor: -0.75 };  // ×0.25
    }
    // Outros jogos → valor fixo grande
    return { isPercent: false, valor: randomInt(-50_000_000, 150_000_000) }; // -50M a +150M
}

// Formatação bonita: B, M, K, etc.
function formatarNumero(num) {
    if (num >= 1_000_000_000_000) return (num / 1_000_000_000_000).toFixed(2) + 'T';
    if (num >= 1_000_000_000)    return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000)        return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000)            return (num / 1_000).toFixed(0) + 'K';
    return num.toString();
}