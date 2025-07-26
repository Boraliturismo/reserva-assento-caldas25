var firstSeatLabel = 1;
$(document).ready(function () {
  var $carrinho = $('#selected-seats'),
      $contador = $('#counter'),
      $total = $('#total'),
      sc = $('#bus-seat-map').seatCharts({
          map: [
              'ff_ff',
              'ff_ff',
              'ee_ee',
              'ee_ee',
              'ee___',
              'ee_ee',
              'ee_ee',
              'ee_ee',
              'eeeee',
          ],
          seats: {
              f: {
                  price: 75,
                  classes: 'mais-conforto',
                  category: 'Mais conforto'
              },
              e: {
                  price: 50,
                  classes: 'assento-padrao',
                  category: 'Assento Padrão'
              }
          },
          naming: {
              top: false,
              getLabel: function () {
                  return firstSeatLabel++;
              }
          },
          legend: {
              node: $('#legend'),
              items: [
                  ['f', 'available', 'Mais conforto'],
                  ['e', 'available', 'Assento Padrão'],
                  ['f', 'unavailable', 'Não disponível']
              ]
          },
          click: function () {
              if (this.status() == 'available') {
                  if (!$('#nome').val() || !$('#rg').val()) {
                      alert("Por favor, preencha o nome completo e o RG antes de continuar.");
                      return 'available';
                  }
                  $('<li>' + this.data().category + ' - Assento nº ' + this.settings.label +
                      ': <b>R$' + this.data().price + '</b> <a href="#" class="cancel-cart-item">[cancelar]</a></li>')
                      .attr('id', 'cart-item-' + this.settings.id)
                      .data('seatId', this.settings.id)
                      .appendTo($carrinho);
                  $contador.text(sc.find('selected').length + 1);
                  $total.text(recalcularTotal(sc) + this.data().price);
                  return 'selected';
              } else if (this.status() == 'selected') {
                  $contador.text(sc.find('selected').length - 1);
                  $total.text(recalcularTotal(sc) - this.data().price);
                  $('#cart-item-' + this.settings.id).remove();
                  return 'available';
              } else if (this.status() == 'unavailable') {
                  return 'unavailable';
              } else {
                  return this.style();
              }
          }
      });

  $('#selected-seats').on('click', '.cancel-cart-item', function () {
      sc.get($(this).parents('li:first').data('seatId')).click();
  });
});

function recalcularTotal(sc) {
  var total = 0;
  sc.find('selected').each(function () {
      total += this.data().price;
  });
  return total;
}

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO",
  projectId: "SEU_PROJECT_ID",
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();