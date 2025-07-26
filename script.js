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

  // Cancelar assento
  $('#selected-seats').on('click', '.cancel-cart-item', function () {
      sc.get($(this).parents('li:first').data('seatId')).click();
  });

  // Confirmar reserva
  $('#checkout-button').click(function () {
      const nome = $('#nome').val().trim();
      const rg = $('#rg').val().trim();

      if (!nome || !rg) {
          alert("Preencha o nome completo e o RG para confirmar.");
          return;
      }

      const assentosSelecionados = sc.find('selected').seatIds;
      if (assentosSelecionados.length === 0) {
          alert("Selecione ao menos um assento.");
          return;
      }

      assentosSelecionados.forEach((assentoId) => {
          db.collection("reservas").add({
              nome: nome,
              rg: rg,
              assento: assentoId,
              timestamp: new Date()
          }).then(() => {
              sc.get(assentoId).status('unavailable');
              $('#cart-item-' + assentoId).remove();
          });
      });

      alert("Reserva confirmada com sucesso!");
      $('#nome').val('');
      $('#rg').val('');
      $contador.text(0);
      $total.text(0);
  });

  // Reset
  $('#reset-btn').click(function () {
      window.location.reload();
  });

  // Carregar reservas do banco
  db.collection("reservas").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          const assento = doc.data().assento;
          if (assento) {
              sc.get(assento).status('unavailable');
          }
      });
  });
});

// Recalcular total
function recalcularTotal(sc) {
  let total = 0;
  sc.find('selected').each(function () {
      total += this.data().price;
  });
  return total;
}

// Firebase
const firebaseConfig = {
   apiKey: "AIzaSyAz_IJaBaxVOGzzff_mE1FHn8nH5PGWTGE",
  authDomain: "reservaonibuscaldas-novas.firebaseapp.com",
  projectId: "reservaonibuscaldas-novas",
  storageBucket: "reservaonibuscaldas-novas.firebasestorage.app",
  messagingSenderId: "598309582688",
  appId: "1:598309582688:web:f212fe3cee9f8aff935005"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
