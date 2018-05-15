var jaxx;
(function (jaxx) {
    var AddressVerifier = (function () {
        function AddressVerifier() {
        }
        /*
            This is a function that should be used to check all data downloaded from outside of Jaxx before using it.
            It invokes different types of security checks depending on types of data.
            The is to prevent attacks such as code injection, cross-site scripting, sql injection etc.
         */
        //Verify the displayed receive address on UI using address derived directly from mnemonic and current index
        //Ensure receive address displayed on UI belongs to current wallet
        //This is to prevent UI freezing that could potentially displaying old wallet address and insertion of
        //malicious address
        AddressVerifier.verifyDisplayedReceiveAddressAndQRCode = function (coinControllerBase) {
            //Check if current controller is the same as expected
            //This happens sometimes when navigate between coins
            if (jaxx.Registry.getCurrentCryptoController().config.symbol != coinControllerBase.config.symbol) {
                coinControllerBase.stopBalancesCheck();
                console.log("Event CTL001 occurred");
                // Navigation.flashBanner("Error (CTL001) occurred, please restart your application and try again.");
                return;
            }
            var generator = coinControllerBase.getGenerator();
            if (!generator) {
                console.log("Event CTL002 occurred");
                //   Navigation.flashBanner("Error (CTL002) occurred, please restart your application and try again.");
                return;
            }
            //If display address is not ready, return
            var displayedCurrentAddress = $('#AddressView-address').text();
            if (displayedCurrentAddress == '-----') {
                return;
            }
            //Verify displayed receiving address and refresh if needed
            var expectedCurrentAddress = generator.generateAddressReceive(coinControllerBase.getCurrentBalance().index || 0);
            var expectedCurrentAddress0 = generator.generateAddressReceive(0);
            if (expectedCurrentAddress != displayedCurrentAddress) {
                //Only throw user warning if displayed address is not expected or the first address (set when initializing)
                if (expectedCurrentAddress0 != displayedCurrentAddress) {
                    Navigation.flashBanner("Change of wallet detected, if you're not performing this (pairing) operation, please ensure you have your 12-word backup phrase, restart your application and double-check your addresses.");
                }
                $('#AddressView-address').text(expectedCurrentAddress);
            }
            //Verify displayed receiving QR code and refresh if needed
            var expectedQRCode = jaxx.Utils.generateQRCode(expectedCurrentAddress, true);
            var expectedQRCode0 = jaxx.Utils.generateQRCode(expectedCurrentAddress0, true);
            var displayedQRCode = $('.populateQRCode').attr('src');
            if (expectedQRCode != displayedQRCode) {
                //Only throw user warning if QR code is not expected or the first address (set when initializing)
                if (expectedQRCode0 != displayedQRCode) {
                    //   Navigation.flashBanner("Change of wallet detected, if you're not performing this (pairing) operation, please ensure you have your 12-word backup phrase, restart your application and double-check your addresses.");
                }
                $('.populateQRCode').attr('src', expectedQRCode);
            }
        };
        return AddressVerifier;
    }());
    jaxx.AddressVerifier = AddressVerifier;
})(jaxx || (jaxx = {}));
//# sourceMappingURL=address-verifier.js.map