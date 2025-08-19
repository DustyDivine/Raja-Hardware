const USER_KEY='raja_user'; const CART_KEY='raja_cart';
function requireLogin(){ if(!localStorage.getItem(USER_KEY)){ alert('Please login first.'); window.location.href='login.html'; return false;} return true;}
function guardRoute(){ requireLogin(); }
function logout(){ localStorage.removeItem(USER_KEY); alert('Logged out'); window.location.href='index.html'; }
document.addEventListener('DOMContentLoaded', ()=>{
  const reg=document.getElementById('registerForm');
  if(reg){ reg.addEventListener('submit', e=>{ e.preventDefault();
    const u=document.getElementById('regUser').value.trim();
    const p=document.getElementById('regPass').value;
    const p2=document.getElementById('regPass2').value;
    if(p!==p2){ alert('Passwords do not match'); return; }
    localStorage.setItem('raja_creds', JSON.stringify({u,p}));
    alert('Registration successful. Please login.'); window.location.href='login.html';
  });}
  const log=document.getElementById('loginForm');
  if(log){ log.addEventListener('submit', e=>{ e.preventDefault();
    const u=document.getElementById('loginUser').value.trim();
    const p=document.getElementById('loginPass').value;
    const creds=JSON.parse(localStorage.getItem('raja_creds')||'{}');
    if(!creds.u){ alert('No account found. Please register first.'); window.location.href='register.html'; return; }
    if(u===creds.u && p===creds.p){ localStorage.setItem(USER_KEY, JSON.stringify({u})); alert('Login successful!'); window.location.href='departments.html'; }
    else{ alert('Incorrect username or password.'); }
  });}
});
function getCart(){ try{return JSON.parse(localStorage.getItem(CART_KEY))||[]}catch(e){return[]} }
function setCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }
function addToOrder(){ const cards=[...document.querySelectorAll('.product')]; const picked=[];
  cards.forEach(c=>{ const chk=c.querySelector('.pick'); const qty=Number((c.querySelector('.qty').value)||0);
    const name=c.querySelector('.pname').textContent; const price=Number(c.querySelector('.price').dataset.price||0);
    if(chk && chk.checked && qty>0){ picked.push({name, price, qty, subtotal: price*qty}); } });
  if(!picked.length){ alert('Select at least one item with quantity.'); return; }
  setCart(picked); alert('Items added to order.');
}
function loadOrderSummary(){ const cart=getCart(); const tbody=document.querySelector('#summaryTable tbody'); if(!tbody) return;
  if(!cart.length){ tbody.innerHTML='<tr><td colspan="5">No items yet. Go back to Departments to add items.</td></tr>'; return; }
  tbody.innerHTML=cart.map((r,i)=>`<tr><td>${i+1}</td><td>${r.name}</td><td>${r.qty}</td><td>R ${r.price.toFixed(2)}</td><td>R ${(r.subtotal||r.price*r.qty).toFixed(2)}</td></tr>`).join('');
}
function calcTotal(){ const cart=getCart(); const total=cart.reduce((s,it)=>s+(it.subtotal||it.price*it.qty),0);
  const cell=document.getElementById('totalCell'); if(cell) cell.textContent='R '+total.toFixed(2); return total; }
function clearOrder(){ localStorage.removeItem(CART_KEY); loadOrderSummary(); alert('Order cleared.'); }
function submitOrder(){ const name=document.getElementById('custName').value.trim();
  const phone=document.getElementById('custPhone').value.trim(); const addr=document.getElementById('custAddr').value.trim();
  const email=document.getElementById('custEmail').value.trim(); const method=document.getElementById('payMethod').value;
  if(!name||!phone||!addr){ alert('Please fill in Name, Phone and Address.'); return; }
  const total=calcTotal(); if(total<=0){ alert('Please add items and calculate total first.'); return; }
  const cart=getCart(); const r=document.getElementById('receipt'); const body=document.getElementById('receiptBody');
  body.innerHTML=`<p><strong>Customer:</strong> ${name} (${phone})</p>
  <p><strong>Address:</strong> ${addr}</p>
  <p><strong>Payment Method:</strong> ${method}</p>
  <h3>Items</h3>
  <ul>${cart.map(i=>`<li>${i.qty} × ${i.name} — R ${(i.subtotal||i.qty*i.price).toFixed(2)}</li>`).join('')}</ul>
  <p><strong>Total Paid:</strong> R ${total.toFixed(2)}</p>`;
  r.style.display='block'; alert('Payment successful! Receipt shown below.');
}
