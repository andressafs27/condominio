// Espera o carregamento do DOM para garantir que todos os elementos estejam prontos
document.addEventListener('DOMContentLoaded', function() {
    // Variáveis para armazenar os dados de votação, se já passados pelo EJS
    const votosSim = parseInt(document.getElementById('votosSim').value, 10) || 0;
    const votosNao = parseInt(document.getElementById('votosNao').value, 10) || 0;
    const totalVotos = votosSim + votosNao;

    // Validação dos dados de votos para garantir que sejam números válidos
    if (isNaN(votosSim) || isNaN(votosNao)) {
        alert('Erro nos dados de votação.');
        return; // Evita continuar caso haja erro nos dados
    }

    // Caso o total de votos seja maior que zero, renderiza os gráficos
    if (totalVotos > 0) {
        const percentualSim = ((votosSim / totalVotos) * 100).toFixed(1);
        const percentualNao = ((votosNao / totalVotos) * 100).toFixed(1);

        // Atualiza a barra de progresso para votos "Sim" e "Não"
        const progressSim = document.querySelector('.progress-bar.bg-success');
        const progressNao = document.querySelector('.progress-bar.bg-danger');

        if (progressSim && progressNao) {
            progressSim.style.width = `${percentualSim}%`;
            progressSim.textContent = `${percentualSim}%`;
        
            progressNao.style.width = `${percentualNao}%`;
            progressNao.textContent = `${percentualNao}%`;
        }

        // Inicializa o gráfico de pizza com Chart.js
        const ctx = document.getElementById('graficoVotacao').getContext('2d');
        
        // Configura o gráfico de pizza com os dados de votos
        const graficoVotacao = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Sim', 'Não'],
                datasets: [{
                    label: 'Distribuição dos Votos',
                    data: [percentualSim, percentualNao],
                    backgroundColor: ['#28a745', '#dc3545'],
                    borderColor: ['#ffffff', '#ffffff'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 1000, // Duração da animação
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(1) + '%';
                            }
                        }
                    }
                }
            }
        });
    } else {
        // Se não houver votos, mostrar uma mensagem
        document.querySelector("#graficoVotacao").style.display = "none"; // Esconde o gráfico
        document.querySelector(".alert-voto").style.display = "block";  // Exibe a mensagem
    }
});
