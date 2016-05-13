/**
 * Created by jonathan on 09/04/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.utils.name)
    .filter(frontApp.modules.utils.filters.searchFilter, [
      '$filter',
      function ($filter) {
        var boyermoore = {

          alphabetSize: 256,
          indexOf: function( needle, haystack ) {

            var i, k;
            var n = needle.length;
            var m = haystack.length;

            if( n === 0 ) return n;

            var charTable = this.makeCharTable( needle );
            var offsetTable = this.makeOffsetTable( needle );

            for( i = n - 1; i < m; ) {
              for( k = n - 1; needle[k] === haystack[i]; --i, --k ) {
                if( k === 0 ) return i;
              }
              // i += n - k; // for naive method
              i += Math.max( offsetTable[ n - 1 - k ], charTable[ haystack[i] ] );
            }

            return -1;

          },
          makeCharTable: function( needle ) {

            var table = new Uint32Array( this.alphabetSize );
            var n = needle.length;
            var t = table.length;
            var i = 0;

            for( ; i < t; ++i ) {
              table[i] = n;
            }

            n--;

            for( i = 0; i < n; ++i ) {
              table[ needle[i] ] = n - i;
            }

            return table;

          },
          makeOffsetTable: function( needle ) {

            var i, suffix;
            var n = needle.length;
            var m = n - 1;
            var lastPrefix = n;
            var table = new Uint32Array( n );

            for( i = m; i >= 0; --i ) {
              if( this.isPrefix( needle, i + 1 ) ) {
                lastPrefix = i + 1;
              }
              table[ m - i ] = lastPrefix - i + m;
            }

            for( i = 0; i < n; ++i ) {
              suffix = this.suffixLength( needle, i );
              table[ suffix ] = m - i + suffix;
            }

            return table;

          },
          isPrefix: function( needle, i ) {

            var k = 0;
            var n = needle.length;

            for( ; i < n; ++i, ++k ) {
              if( needle[i] !== needle[k] ) {
                return false;
              }
            }

            return true;

          },
          suffixLength: function( needle, i ) {

            var k = 0;
            var n = needle.length;
            var m = n - 1;

            for( ; i >= 0 && needle[i] === needle[m]; --i, --m ) {
              k += 1;
            }

            return k;

          }

        };

        return function (text, search) {
          text = angular.lowercase($filter('removeAccentsFilter')(text));
          search = angular.lowercase($filter('removeAccentsFilter')(search));
          return boyermoore.indexOf(text, search);
        }
      }
    ]);
}(angular, frontApp));
