# Aura-Meter// Função para calcular a aura
function calculateAura() {
    let name = document.getElementById("name").value;
    let age = parseInt(document.getElementById("age").value);
    let gender = document.getElementById("gender").value;
    let state = document.getElementById("state").value;
    let city = document.getElementById("city").value;
    let team = document.getElementById("team").value;
    let platform = document.getElementById("platform").value;
    let games = document.getElementById("games").value;
    let spendMoney = document.getElementById("spendMoney").value;
    let yearsPlaying = parseInt(document.getElementById("yearsPlaying").value);

    // Lógica simples para calcular a aura
    let aura = 0;

    // Base value based on age and years of gaming
    aura += age * 1000;
    aura += yearsPlaying * 50000;

    // Adicionando valores conforme o gênero
    if (gender === "masculino") {
        aura += 200000;
    } else if (gender === "feminino") {
        aura += 150000;
    }

    // Se o usuário gasta dinheiro com jogos
    if (spendMoney === "sim") {
        aura += 500000;
    }

    // Modificando aura conforme a plataforma de jogos
    switch (platform) {
        case "pc":
            aura += 80000;
            break;
        case "playstation":
            aura += 120000;
            break;
        case "xbox":
            aura += 100000;
            break;
        case "mobile":
            aura += 50000;
            break;
    }

    // Ajustando aura com base no tempo jogado
    if (yearsPlaying > 5) {
        aura += 300000;
    }

    // Exibindo o valor final da aura
    document.getElementById("auraValue").innerText = `Sua aura é: ${aura.toLocaleString()}`;
}

// Evento de clique no botão para chamar a função de calcular a aura
document.querySelector("button").addEventListener("click", function() {
    calculateAura();
});