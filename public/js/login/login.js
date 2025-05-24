document.getElementById('loginForm').addEventListener('submit', function (event) {
    // Impede o envio do formulário se houver erro
    event.preventDefault();

    // Obtém os valores dos campos
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Verifica se os campos estão preenchidos
    if (!email || !senha) {
        showError('Por favor, preencha todos os campos!');
        return;
    }

    // Envia os dados para o servidor via Fetch ou AJAX
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "/";
        } else {
            showError('Usuário ou senha incorretos!');
        }
    })
    .catch(error => {
        console.error('Erro ao tentar fazer login:', error);
        showError('Erro ao tentar fazer login. Tente novamente.');
    });
});

// Função para mostrar a mensagem de erro
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}
