// JS
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

    // Calcular aura fixa de nome e idade
    let aura = calcularAuraNome(nome) + calcularAuraIdade(idade);

    // Calcular multiplicadores
    let multiplicador = 1;
    multiplicador *= (1 + calcularPorcentagemGenero(genero));
    multiplicador *= (1 + calcularPorcentagemEstado(estado));
    multiplicador *= (1 + calcularPorcentagemTime(time));

    // Plataforma é %
    multiplicador *= (1 + calcularPorcentagemPlataforma(plataforma));

    // Jogos: somar efeitos, pois múltiplos
    jogos.forEach(jogo => {
        const efeitoJogo = calcularEfeitoJogo(jogo);
        if (efeitoJogo.isPercent) {
            multiplicador *= (1 + efeitoJogo.valor);
        } else {
            aura += efeitoJogo.valor;
        }
    });

    // Aplicar multiplicador à aura
    aura = Math.round(aura * multiplicador);

    // Mostrar resultado
    document.getElementById('auraValor').textContent = `${aura} Aura`;
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

    // Primeiro nome
    const lenPrimeiro = primeiroNome.length;
    if (lenPrimeiro < 5) {
        auraNome += randomInt(5000, 10000);
    } else if (lenPrimeiro <= 7) {
        auraNome += randomInt(3000, 7000);
    } else {
        auraNome += randomInt(1000, 3000);
    }

    // Sobrenomes
    if (numSobrenomes === 1) {
        auraNome += randomInt(5000, 10000);
    } else if (numSobrenomes === 2 || numSobrenomes === 3) {
        auraNome += randomInt(2000, 3000);
    } else if (numSobrenomes > 3) {
        auraNome -= 4000;
    }

    return auraNome;
}

function calcularAuraIdade(idade) {
    if (idade < 13) {
        return randomInt(2000, 5000);
    } else if (idade >= 14 && idade <= 18) {
        return randomInt(3000, 7000);
    } else if (idade >= 19 && idade <= 30) {
        return randomInt(5000, 10000);
    } else if (idade > 40) {
        return randomInt(10000, 20000);
    } else {
        // Gap 31-40: 0
        return 0;
    }
}

function calcularPorcentagemGenero(genero) {
    if (genero === 'outro') {
        return -0.05;
    }
    return 0;
}

function calcularPorcentagemEstado(estado) {
    // Mapa de estados por "proximidade ao Sul": Sul alto, Norte baixo
    const estadosSul = ['RS', 'SC', 'PR']; // +20%
    const estadosSudeste = ['SP', 'RJ', 'MG', 'ES']; // +10%
    const estadosCentroOeste = ['MS', 'MT', 'GO', 'DF']; // 0%
    const estadosNordeste = ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA']; // -10%
    const estadosNorte = ['TO', 'PA', 'AM', 'RR', 'AP', 'AC', 'RO']; // -15%

    if (estadosSul.includes(estado)) {
        return 0.20;
    } else if (estadosSudeste.includes(estado)) {
        return 0.10;
    } else if (estadosCentroOeste.includes(estado)) {
        return 0;
    } else if (estadosNordeste.includes(estado)) {
        return -0.10;
    } else if (estadosNorte.includes(estado)) {
        return -0.15;
    }
    return -0.15; // Default se inválido
}

function calcularPorcentagemTime(time) {
    const timesTop = ['Flamengo', 'Corinthians', 'Palmeiras', 'São Paulo', 'Grêmio', 'Internacional', 'Santos', 'Cruzeiro', 'Atlético-MG', 'Vasco'];
    if (time === 'outro' || !timesTop.includes(time)) {
        return -0.30;
    }
    // Varia entre -10% e +20% aleatoriamente para os top
    return randomInt(-10, 20) / 100;
}

function calcularPorcentagemPlataforma(plataforma) {
    switch (plataforma) {
        case 'PC': return 0.20;
        case 'Console': return 0.10;
        case 'Mobile': return -0.15;
        case 'VR': return -0.15;
        default: return 0;
    }
}

function calcularEfeitoJogo(jogo) {
    if (jogo === 'Minecraft') {
        return { isPercent: true, valor: 1.00 }; // +100%
    } else if (jogo === 'Roblox') {
        return { isPercent: true, valor: -0.75 }; // -75%
    } else {
        return { isPercent: false, valor: randomInt(-10000, 15000) }; // Fixo -10k a +15k
    }
}