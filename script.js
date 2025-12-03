const produtos = [
  // Bovinos
  {id:1, nome:'Picanha', preco:89.90, categoria:'Bovino', corte:'Picanha', img:'https://i.pinimg.com/1200x/c7/51/2d/c7512d9a3d6ddb81289040069029f4c1.jpg'},
  {id:2, nome:'Alcatra', preco:59.90, categoria:'Bovino', corte:'Alcatra', img:'https://i.pinimg.com/1200x/c1/39/44/c139444bf874178c3dfee0eface7de4c.jpg'},
  {id:3, nome:'Filé Mignon', preco:99.90, categoria:'Bovino', corte:'Filé Mignon', img:'https://www.tudogostoso.com.br/images/recipes/000/018/183/filé-mignon.jpg'},
  {id:4, nome:'Coxão Mole', preco:45.50, categoria:'Bovino', corte:'Coxão Mole', img:'https://www.carnes.com.br/wp-content/uploads/coxao-mole.jpg'},
  {id:5, nome:'Maminha', preco:52.00, categoria:'Bovino', corte:'Maminha', img:'https://www.receiteria.com.br/wp-content/uploads/receita-de-maminha-assada-1200x675.jpg'},

  // Suínos
  {id:6, nome:'Costela Suína', preco:49.90, categoria:'Suíno', corte:'Costela', img:'https://i.pinimg.com/736x/7c/1b/7c1b3f8c9471a2a6751ce06dc7aebc2a.jpg'},
  {id:7, nome:'Lombo', preco:55.00, categoria:'Suíno', corte:'Lombo', img:'https://www.receiteria.com.br/wp-content/uploads/receita-lombo-1200x675.jpg'},

  // Linguiças
  {id:8, nome:'Linguiça Toscana', preco:25.90, categoria:'Linguiça', corte:'Linguiça', img:'https://img.freepik.com/fotos-premium/linguica-toscana-na-churrasqueira_23-2148812280.jpg'},
  {id:9, nome:'Linguiça de Frango', preco:22.90, categoria:'Linguiça', corte:'Linguiça', img:'https://img.freepik.com/fotos-gratis/linguica-de-frango-assada.jpg'},

  // Peixes
  {id:10, nome:'Salmão', preco:75.00, categoria:'Peixe', corte:'Filé', img:'https://www.receiteria.com.br/wp-content/uploads/filé-de-salmao.jpg'},
  {id:11, nome:'Tilápia', preco:42.00, categoria:'Peixe', corte:'Filé', img:'https://www.receiteria.com.br/wp-content/uploads/filé-de-tilapia.jpg'},
  {id:12, nome:'Bacalhau', preco:120.00, categoria:'Peixe', corte:'Posta', img:'https://www.receiteria.com.br/wp-content/uploads/bacalhau-assado.jpg'}
];

div.innerHTML = `
  <img src="${p.img}" alt="${p.nome}">
  <h3>${p.nome}</h3>
  <p>${p.categoria} - Corte: ${p.corte}</p>
  <p>R$ ${p.preco.toFixed(2)}</p>
  <button>Adicionar</button>
`;

function filtrar(categoria){
  const area = document.getElementById('lista-produtos');
  area.innerHTML = '';
  let lista = categoria === 'Todos' ? produtos : produtos.filter(p => p.categoria === categoria);
  lista.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'produto';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.nome}">
      <h3>${p.nome}</h3>
      <p>${p.categoria} - Corte: ${p.corte}</p>
      <p>R$ ${p.preco.toFixed(2)}</p>
      <button>Adicionar</button>
    `;
    div.querySelector('button').onclick = ()=>{ adicionarCarrinho(p.id); };
    area.appendChild(div);
  });
}


let carrinho = JSON.parse(localStorage.getItem('carrinhoFinal')) || [];
let metodoPagamento = "Dinheiro";
const pixCode = "00020126330014br.gov.bcb.pix0111541548308055204000053039865802BR5918ALLE202401121827486009Sao Paulo610901227-20062240520daqr16346642472205006304C8C9";

const qrContainer = document.getElementById('qr-container');
const cartaoContainer = document.getElementById('cartao-container');

function atualizarCarrinhoFinal() {
    const carrinhoFinal = document.getElementById('carrinho-final');
    carrinhoFinal.innerHTML = '';
    let total = 0;
    carrinho.forEach(item => {
        total += item.preco;
        const div = document.createElement('div');
        div.innerHTML = '<img src="' + item.img + '" alt="' + item.nome + '"><span>' + item.nome + ' - R$ ' + item.preco.toFixed(2) + '</span>';
        carrinhoFinal.appendChild(div);
    });
    document.getElementById('total-final').innerText = "Total: R$ " + total.toFixed(2);
}

atualizarCarrinhoFinal();

document.querySelectorAll('.payment-methods button').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.payment-methods button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        metodoPagamento = btn.getAttribute('data-method');

        qrContainer.innerHTML = '';
        cartaoContainer.style.display = 'none';

        if (metodoPagamento === 'PIX') {
            new QRCode(qrContainer, {
                text: pixCode,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
            });
        } else if (metodoPagamento === 'Cartão') {
            cartaoContainer.style.display = 'block';
        }
    }
});

// Funções de validação do cartão
function validarCartao(numero, validade, cvv) {
    const regexNumero = /^\d{16}$/;
    const regexCVV = /^\d{3}$/;
    const regexValidade = /^(0[1-9]|1[0-2])\/\d{2}$/;

    if (!regexNumero.test(numero)) return "Número do cartão inválido! Deve ter 16 dígitos.";
    if (!regexValidade.test(validade)) return "Validade inválida! Use MM/AA.";
    if (!regexCVV.test(cvv)) return "CVV inválido! Deve ter 3 dígitos.";
    return null;
}

document.getElementById('btn-enviar').onclick = () => {
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    if (!nome || !telefone || !endereco) {
        alert("Preencha todos os campos!");
        return;
    }

    let totalValor = carrinho.reduce((a, b) => a + b.preco, 0).toFixed(2);

    if (metodoPagamento === 'PIX') {
        alert(
            "Pedido enviado!\nCliente: " + nome +
            "\nTelefone: " + telefone +
            "\nEndereço: " + endereco +
            "\nTotal: R$ " + totalValor +
            "\nPagamento: PIX\nUse o QR code exibido para pagar."
        );
    } else if (metodoPagamento === 'Cartão') {
        const numero = document.getElementById('numero-cartao').value.trim();
        const titular = document.getElementById('nome-cartao').value.trim();
        const validade = document.getElementById('validade-cartao').value.trim();
        const cvv = document.getElementById('cvv-cartao').value.trim();

        const erro = validarCartao(numero, validade, cvv);
        if (erro) {
            alert(erro);
            return;
        }

        if (!titular) {
            alert("Informe o nome do titular do cartão!");
            return;
        }

        alert(
            "Pedido enviado!\nCliente: " + nome +
            "\nTelefone: " + telefone +
            "\nEndereço: " + endereco +
            "\nTotal: R$ " + totalValor +
            "\nPagamento: Cartão\nNúmero: " + numero +
            "\nNome: " + titular +
            "\nValidade: " + validade
        );
    } else {
        alert(
            "Pedido enviado!\nCliente: " + nome +
            "\nTelefone: " + telefone +
            "\nEndereço: " + endereco +
            "\nTotal: R$ " + totalValor +
            "\nPagamento: " + metodoPagamento
        );
    }

    localStorage.removeItem('carrinhoFinal');
    window.close();
};
