/**
 * Created by jonathan on 17/04/16.
 */
var GENDER = (function () {
  return {
    GENDER_DESCRIPTION: function (gender) {
      switch(gender.toUpperCase()) {
        case 'M':
          return 'Masculino';
        case 'F':
          return 'Feminino';
        default:
          return 'Não Especificado';
      }
    }
  }
})();
