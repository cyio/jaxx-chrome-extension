var jaxx;
(function (jaxx) {
    var DataValidator = (function () {
        function DataValidator() {
        }
        /*
            This is a function that should be used to check all data downloaded from outside of Jaxx before using it.
            It invokes different types of security checks depending on types of data.
            The is to prevent attacks such as code injection, cross-site scripting, sql injection etc.
         */
        DataValidator.securityCheckData = function (data) {
            //If the type is object then stringify it first
            if (typeof data === 'object')
                data = JSON.stringify(data);
            else if (typeof data === 'function')
                DataValidator.onSecurityFail('function', data);
            else if (typeof data === 'number')
                return;
            //If the type is not string at this point then fail it automatically.
            if (typeof data !== 'string')
                DataValidator.onSecurityFail('not string', data);
            //Main regular expression used to check the input data.
            var re = /<script|%3Cscript|href/i;
            //If failed regular expression check then call event handler.
            if (String(data).match(re))
                DataValidator.onSecurityFail(String(data).match(re).toString(), data);
        };
        /*
            Handler of the failed security check event.
         */
        DataValidator.onSecurityFail = function (reason, data) {
            DataValidator.security$.triggerHandler(DataValidator.ON_SECURITY_FAIL, { reason: reason, data: data });
            throw new Error(reason);
        };
        /*
            A function used to check specific type of input (HTML).
            Used in previous version of Jaxx.
         */
        DataValidator.securityCheckHTML = function (inputString) {
            //    console.log("inputString :: " + inputString);
            var mInput = thirdparty.sanitizeHtml(inputString, {
                allowedTags: ['h3', 'b', 'strong', 'em', 'ul', 'ol', 'li', 'p', 'br', 'hr'],
                allowedAttributes: [],
                selfClosing: ['br', 'hr'],
                nonTextTags: ['style', 'script', 'textarea', 'noscript'],
                allowedClasses: {
                    'li': ['cssJaxxMainFontColor', 'cssFunThingsColor', 'cssWarningFontColor', 'cssCurrencyFontColor'],
                    'ul': ['cssJaxxMainFontColor', 'cssFunThingsColor', 'cssWarningFontColor', 'cssCurrencyFontColor'],
                    'ol': ['cssJaxxMainFontColor', 'cssFunThingsColor', 'cssWarningFontColor', 'cssCurrencyFontColor'],
                    'p': ['cssJaxxMainFontColor', 'cssFunThingsColor', 'cssWarningFontColor', 'cssCurrencyFontColor'],
                    'h3': ['cssJaxxMainFontColor', 'cssFunThingsColor', 'cssWarningFontColor', 'cssCurrencyFontColor']
                }
            });
            //        inputString.replace(/<script.*?<\/script>/g, '').replace(/<a.*?<\/a>/g, '');
            if (mInput !== inputString) {
                //        console.log("recurse");
                // Commented this line because it leads to infinity loop
                DataValidator.security$.triggerHandler(DataValidator.ON_SECURITY_FAIL, inputString);
                throw new Error('input included restricted characters');
                //  mInput = JaxxUtils.scrubInput(mInput);
            }
            //    console.log("mInput :: " + mInput);
            return mInput;
        };
        return DataValidator;
    }());
    DataValidator.ON_SECURITY_FAIL = "ON_SECURITY_FAIL";
    DataValidator.security$ = $({});
    jaxx.DataValidator = DataValidator;
})(jaxx || (jaxx = {}));
//# sourceMappingURL=data-validator.js.map