/**
 * Created by jonathan on 27/03/16.
 */
var DAYS = (function () {
  return {
    DAY_DESCRIPTION: function (day) {
      switch(day) {
        case 1:
          return 'Domingo';
        case 2:
          return 'Segunda-Feira';
        case 3:
          return 'Terça-Feira';
        case 4:
          return 'Quarta-Feira';
        case 5:
          return 'Quinta-Feira';
        case 6:
          return 'Sexta-Feira';
        case 7:
          return 'Sábado';
      }
    }
  }
})();
