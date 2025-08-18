function calculateTotal() {
  let inputs = document.querySelectorAll('.product input');
  let total = 0;
  inputs.forEach(input => {
    total += input.value * input.getAttribute('data-price');
  });
  document.getElementById('total').innerText = "Total: R" + total;
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('orderForm');
  if(form){
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert("Order submitted successfully!");
    });
  }
});