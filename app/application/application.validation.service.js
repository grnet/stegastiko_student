var Application;
(function (Application) {
    'use strict';
    var ValidationService = (function () {
        function ValidationService() {
        }
        ValidationService.prototype.checkIsAFM = function (afm) {
            if (!afm || afm.length == 0) {
                return true;
            }
            if (!afm.match(/^\d{9}$/) || afm == '000000000') {
                return false;
            }
            afm = afm.split('').reverse().join('');
            var Num1 = 0;
            for (var iDigit = 1; iDigit <= 8; iDigit++) {
                Num1 += afm.charAt(iDigit) << iDigit;
            }
            return (Num1 % 11) % 10 == afm.charAt(0);
        };
        ValidationService.prototype.checkIsAMKA = function (amka) {
            if (typeof amka === 'undefined') {
                return false;
            }
            var _numAMKA = 0;
            var sum = 0;
            if (amka.length != 11 || (parseFloat(amka) == Number.NaN))
                return false;
            else {
                var iter = amka.length - 1;
                var amkaArray = amka.split('');
                for (var c in amkaArray) {
                    if (iter % 2 != 0) {
                        var DigitTimes2 = parseInt(amkaArray[c]) * 2;
                        if (DigitTimes2 > 9)
                            sum += 1 + DigitTimes2 % 10;
                        else
                            sum += DigitTimes2;
                    }
                    else
                        sum += parseInt(amkaArray[c]);
                    iter--;
                }
                if (sum % 10 == 0)
                    return true;
                else
                    return false;
            }
        };
        ValidationService.prototype.checkIsAcademicId = function (academicId) {
            if (typeof academicId === 'undefined') {
                return false;
            }
            //Αν ο κωδικός δεν έχει μήκος 12 ψηφία επέστρεψε false
            if (academicId.length != 12)
                return false;
            var academicIdDigits = new Array(12);
            //Παίρνουμε τους χαρακτήρες του 12-ψήφιου Κωδικού σε ένα char array
            var academicIdArray = academicId.split('');
            //Μετατροπή του char array σε int array
            for (var i = 0; i < 12; i++) {
                var currentDigit = parseInt(academicIdArray[i]);
                //Αν έστω κι ένας χαρακτήρας δεν είναι ψηφίο επέστρεψε false
                if (currentDigit == Number.NaN) {
                    return false;
                }
                else {
                    academicIdDigits[i] = currentDigit;
                }
            }
            //Υπολογισμός του checkSum με βάση τα 10 πρώτα ψηφία
            var calculatedCheckSum = '';
            var counter = 1;
            var x = 0;
            var y = 1;
            var sum = 0;
            while (counter <= 5) {
                sum += (academicIdDigits[x] * 10 + academicIdDigits[y]) * counter;
                x += 2;
                y += 2;
                counter++;
            }
            var checkSum = 100 - (sum % 100);
            if (checkSum == 100) {
                checkSum = 0;
            }
            if (checkSum < 10) {
                calculatedCheckSum += "0";
            }
            calculatedCheckSum += checkSum.toString();
            //Το checkSum που έχει ο κωδικός που εισήγαγε ο χρήστης
            var givenCheckSum = academicIdDigits[10].toString() + academicIdDigits[11].toString();
            //Έλεγχος ότι τα δύο checkSums ταιριάζουν
            return calculatedCheckSum == givenCheckSum;
        };
        return ValidationService;
    }());
    Application.ValidationService = ValidationService;
    Application.ApplicationModule.service('ApplicationValidationService', ValidationService);
})(Application || (Application = {}));
//# sourceMappingURL=application.validation.service.js.map