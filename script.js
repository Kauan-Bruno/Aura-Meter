document.getElementById('auraForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nome        = document.getElementById('nome').value.trim();
    const idade       = parseInt(document.getElementById('idade').value);
    const genero      = document.getElementById('genero').value;
    const estado      = document.getElementById('estado').value;
    const time        = document.getElementById('time').value;
    const plataforma  = document.getElementById('plataforma').value;

    const jogosSelect = document.getElementById('jogos');
    const jogos       = Array.from(jogosSelect.selectedOptions).map(opt => opt.value);

    if (jogos.length > 3) {
        alert("Máximo de 3 jogos permitidos!");
        return;
    }
    if (jogos.length === 0) {
        alert("Selecione pelo menos 1 jogo!");
        return;
    }

    let aura = calcularAuraNome(nome) + calcularAuraIdade(idade);

    let mult = 1;
    mult *= (1 + calcularPorcentagemGenero(genero));
    mult *= (1 + calcularPorcentagemEstado(estado));
    mult *= (1 + calcularPorcentagemTime(time));
    mult *= (1 + calcularPorcentagemPlataforma(plataforma));

    jogos.forEach(jogo => {
        const efeito = calcularEfeitoJogo(jogo);
        if (efeito.isPercent) {
            mult *= (1 + efeito.valor);
        } else {
            aura += efeito.valor;
        }
    });

    aura += randomInt(-1_000_000_000, 5_000_000_000);

    aura = Math.round(aura * mult);
    aura = Math.max(0, Math.min(aura, 1_000_000_000_000));

    document.getElementById('auraValor').textContent = formatarNumero(aura) + " Aura";
    document.getElementById('resultado').classList.remove('hidden');
});

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcularAuraNome(nome) {
    const partes = nome.split(/\s+/);
    const primeiro = partes[0] || "";
    const sobrenomes = partes.slice(1).length;

    let base = 0;

    const len = primeiro.length;
    if (len < 5)        base += randomInt(5_000_000, 10_000_000);
    else if (len <= 7)  base += randomInt(300_000, 700_000);
    else                base += randomInt(10_000, 30_000);

    if (sobrenomes === 1)       base += randomInt(5_000_000, 10_000_000);
    else if (sobrenomes <= 3)   base += randomInt(200_000, 300_000);
    else if (sobrenomes > 3)    base -= 400_000;

    return base;
}

function calcularAuraIdade(idade) {
    if (idade < 13)               return randomInt(200_000, 500_000);
    if (idade >= 14 && idade <= 18) return randomInt(3_000_000, 7_000_000) * 3;
    if (idade >= 19 && idade <= 30) return randomInt(5_000_000, 10_000_000);
    if (idade > 40)               return randomInt(10_000_000, 20_000_000);
    return randomInt(1_000, 10_000); // 31–40 bem baixo
}

function calcularPorcentagemGenero(g) { return g === 'outro' ? -0.10 : 0; }

function calcularPorcentagemEstado(uf) {
    if (['RS','SC','PR'].includes(uf)) return 0.30;
    if (['SP','RJ','MG','ES'].includes(uf)) return 0.15;
    if (['MS','MT','GO','DF'].includes(uf)) return 0;
    if (['BA','SE','AL','PE','PB','RN','CE','PI','MA'].includes(uf)) return -0.20;
    return -0.30;
}

function calcularPorcentagemTime(time) {
    if (time === 'Flamengo')    return 0.40;
    if (time === 'Palmeiras')   return 0.30;
    if (time === 'Corinthians') return 0.20;
    if (time === 'Vasco')       return 0.10;
    if (['São Paulo','Grêmio','Internacional','Santos','Cruzeiro','Atlético-MG','Botafogo','Fluminense','Athletico-PR','Bahia','Fortaleza','Vitória','Sport','Ceará'].includes(time)) {
        return randomInt(-10, 10) / 100;
    }
    return -0.50;
}

function calcularPorcentagemPlataforma(p) {
    if (p === 'PC')      return 0.50;
    if (p === 'Console') return 0.20;
    if (p === 'Mobile')  return -0.40;
    if (p === 'VR')      return -0.40;
    return 0;
}

function calcularEfeitoJogo(jogo) {
    if (jogo === 'Minecraft') return { isPercent: true,  valor: 2.00 };
    if (jogo === 'Roblox')    return { isPercent: true,  valor: -0.90 };
    return { isPercent: false, valor: randomInt(-100_000_000, 500_000_000) };
}

function formatarNumero(n) {
    if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
    if (n >= 1e9)  return (n / 1e9).toFixed(1)  + "B";
    if (n >= 1e6)  return (n / 1e6).toFixed(1)  + "M";
    if (n >= 1e3)  return (n / 1e3).toFixed(0)  + "K";
    return n.toString();
}