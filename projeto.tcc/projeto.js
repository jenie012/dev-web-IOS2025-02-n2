/* script.js — funcionalidades: produtos, filtros, carrinho, formulário */
document.addEventListener('DOMContentLoaded', () => {
    // Dados de exemplo (você pode substituir por API)
    const produtos = [
      { id: 1, nome: 'Picanha', tipo: 'bovino', preco: 89.90, desc: 'Picanha suculenta, fatiada por kg', destaque: true, img: "https://lirp.cdn-website.com/33406c6e/dms3rep/multi/opt/picanha-aa0c51c6-1920w.jpg"},
      { id: 2, nome: 'Alcatra', tipo: 'bovino', preco: 39.50, desc: 'Ótima para churrasco', destaque: true, img: "https://www.comidaereceitas.com.br/wp-content/uploads/2011/01/Churrasco-brasileiro-carne-grelhada-servid1-780x556.jpg"},
      { id: 3, nome: 'Costela', tipo: 'bovino', preco: 29.90, desc: 'Costela macia, ideal para assar', destaque: true, img: "https://www.seara.com.br/wp-content/uploads/2025/09/costela-bovina.jpg"},
      { id: 4, nome: 'Filé Mignon', tipo: 'bovino', preco: 79.00, desc: 'Corte nobre e macio', destaque: true, img: "https://i0.wp.com/espetinhodesucesso.com/wp-content/uploads/2024/09/Receitas-com-contrafile-1.jpg?ssl=1"},
      { id: 5, nome: 'Bisteca Suína', tipo: 'suino', preco: 18.50, desc: 'Sabor delicado', destaque:true, img: "https://midias.agazeta.com.br/2025/06/21/edicasebisteca-de-porco-ao-limao-imagem-elena-veselova--shutterstock-1umnidn7ue.jpg"},
      { id: 6, nome: 'Linguiça Artesanal', tipo: 'suino', preco: 24.90, desc: 'Tempero caseiro', destaque: true, img: "https://images.tcdn.com.br/img/img_prod/1027475/linguica_com_rucula_e_parmesao_450gr_245_1_a5ac35aa7e69f4fd0e24366534cd39d8.jpg" },
      { id: 7, nome: 'Coxa e Sobrecoxa', tipo: 'aves', preco: 12.50, desc: 'Aves frescas e suculentas', destaque: true, img: "https://www.kitano.com.br/wp-content/uploads/2019/07/SSP_2348-Frango-assado-coxa-e-sobrecoxa-com-cu%E2%95%A0%C3%BCrcuma-e-gengibre.jpg"},
      { id: 8, nome: 'Peito de Frango', tipo: 'aves', preco: 16.80, desc: 'Peito desossado', destaque: true, img: "https://vovonaoca.com.br/wp-content/webp-express/webp-images/uploads/2024/07/Peito-de-Frango-Frito-de-Um-Jeitinho-Diferente-que-fica-com-um-Molho-Incrivel-672x352.jpg.webp"},
    ];
  
    // Elementos DOM
    const grid = document.getElementById('productGrid');
    const searchInput = document.getElementById('search');
    const filter = document.getElementById('filter');
    const sort = document.getElementById('sort');
    const cartCount = document.getElementById('cartCount');
    const cartPanel = document.getElementById('cartPanel');
    const openCart = document.getElementById('openCart');
    const closeCart = document.getElementById('closeCart');
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const clearCartBtn = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('checkout');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
  
    // NAV mobile toggle
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navMenu.style.display = open ? 'none' : 'flex';
    });
  
    // Carrinho (localStorage)
    let cart = JSON.parse(localStorage.getItem('cart_ribeiro')) || [];
  
    function saveCart(){ localStorage.setItem('cart_ribeiro', JSON.stringify(cart)); }
    function formatMoney(v){ return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
  
    // Render produtos
    function renderProducts(list){
      grid.innerHTML = '';
      if(!list.length){
        grid.innerHTML = `<p style="color:var(--muted);grid-column:1/-1">Nenhum produto encontrado.</p>`;
        return;
      }
  
      list.forEach(p => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
          <div class="thumb" aria-hidden="true" style="background-image: url(${p.img}); background-size: cover;">${p.tipo.toUpperCase()}</div>
          <h4>${p.nome}</h4>
          <p>${p.desc}</p>
          <div class="meta">
            <div class="badge">${formatMoney(p.preco)}/kg</div>
            <div>
              <button class="small-btn add-btn" data-id="${p.id}">Adicionar</button>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });
    }
  
    // Filtrar e ordenar
    function applyFilters(){
      let q = searchInput.value.trim().toLowerCase();
      let type = filter.value;
      let order = sort.value;
  
      let list = produtos.filter(p => {
        const hit = p.nome.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
        const tipoOk = (type === 'all') ? true : p.tipo === type;
        return hit && tipoOk;
      });
  
      if(order === 'price-asc') list.sort((a,b)=>a.preco-b.preco);
      if(order === 'price-desc') list.sort((a,b)=>b.preco-a.preco);
      if(order === 'name-asc') list.sort((a,b)=>a.nome.localeCompare(b.nome));
      if(order === 'featured') list.sort((a,b)=> (b.destaque?1:0) - (a.destaque?1:0));
  
      renderProducts(list);
      attachAddButtons();
    }
  
    // Adicionar eventos "add"
    function attachAddButtons(){
      document.querySelectorAll('.add-btn').forEach(btn=>{
        btn.addEventListener('click', () => {
          const id = Number(btn.dataset.id);
          addToCart(id, 1);
        });
      });
    }
  
    // Funções do carrinho
    function addToCart(id, qty=1){
      const produto = produtos.find(p=>p.id===id);
      if(!produto) return;
      const existing = cart.find(i=>i.id===id);
      if(existing) existing.qty += qty;
      else cart.push({id:produto.id,nome:produto.nome,preco:produto.preco,qty});
      saveCart();
      renderCart();
      flashCartCount();
    }
  
    function updateQty(id, qty){
      const item = cart.find(i=>i.id===id);
      if(!item) return;
      item.qty = qty;
      if(item.qty <= 0) cart = cart.filter(i=>i.id!==id);
      saveCart(); renderCart(); flashCartCount();
    }
  
    function removeItem(id){
      cart = cart.filter(i=>i.id!==id);
      saveCart(); renderCart(); flashCartCount();
    }
  
    function clearCart(){
      cart = []; saveCart(); renderCart(); flashCartCount();
    }
  
    function cartTotal(){
      return cart.reduce((s,i)=> s + i.preco * i.qty, 0);
    }
  
    // Render carrinho
    function renderCart(){
      cartItemsEl.innerHTML = '';
      if(cart.length === 0){
        cartItemsEl.innerHTML = `<p style="color:var(--muted)">Carrinho vazio. Adicione alguns cortes deliciosos!</p>`;
        cartTotalEl.textContent = formatMoney(0);
        cartCount.textContent = '0';
        return;
      }
      cart.forEach(item=>{
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
          <div style="flex:1">
            <div class="title">${item.nome}</div>
            <div class="meta" style="margin-top:6px;color:var(--muted);font-size:13px">${formatMoney(item.preco)} / Kg</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
            <div>
              <button class="small-btn" data-action="dec" data-id="${item.id}">−</button>
              <span style="padding:0 8px">${item.qty}</span>
              <button class="small-btn" data-action="inc" data-id="${item.id}">+</button>
            </div>
            <div style="font-weight:700">${formatMoney(item.preco * item.qty)}</div>
            <button class="small-btn" data-action="remove" data-id="${item.id}">Remover</button>
          </div>
        `;
        cartItemsEl.appendChild(row);
      });
  
      // attach cart item buttons
      cartItemsEl.querySelectorAll('[data-action]').forEach(btn=>{
        btn.addEventListener('click', (e)=>{
          const id = Number(btn.dataset.id);
          const act = btn.dataset.action;
          if(act === 'inc') updateQty(id, cart.find(i=>i.id===id).qty + 1);
          if(act === 'dec') updateQty(id, cart.find(i=>i.id===id).qty - 1);
          if(act === 'remove') removeItem(id);
        });
      });
  
      cartTotalEl.textContent = formatMoney(cartTotal());
      cartCount.textContent = String(cart.reduce((s,i)=>s + i.qty, 0));
    }
  
    // Small visual feedback
    function flashCartCount(){
      cartCount.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 400 });
      cartCount.textContent = String(cart.reduce((s,i)=>s + i.qty, 0));
    }
  
    // Abrir / fechar painel do carrinho
    function showCart(open = true){
      cartPanel.setAttribute('aria-hidden', String(!open));
    }
    openCart.addEventListener('click', (e)=>{ e.preventDefault(); showCart(true); });
    closeCart.addEventListener('click', ()=> showCart(false));
  
    // Limpar e finalizar
    clearCartBtn.addEventListener('click', clearCart);
    checkoutBtn.addEventListener('click', () => {
      if(cart.length === 0){ alert('Seu carrinho está vazio.'); return; }
      // Para TCC: aqui poderia enviar para API / WhatsApp
      alert('Pedido enviado! Em breve entraremos em contato.');
      clearCart();
      showCart(false);
    });
  
    // Search / filter events
    [searchInput, filter, sort].forEach(el => el.addEventListener('input', applyFilters));
  
    // Contact form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome').value.trim();
      const msg = document.getElementById('mensagem').value.trim();
      if(!nome || !msg){ alert('Por favor preencha nome e mensagem/pedido.'); return; }
      // Aqui você pode enviar via fetch para backend. Pra demo, apenas simula sucesso:
      alert('Mensagem enviada com sucesso. Obrigado, ' + nome + '!');
      contactForm.reset();
    });
  
    // Inicialização
    renderProducts(produtos);
    attachAddButtons();
    renderCart();
  
    // Footer year
    document.getElementById('year').textContent = new Date().getFullYear();
  
    // Accessibility: close cart with Escape
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape') showCart(false);
    });
  
  });
  