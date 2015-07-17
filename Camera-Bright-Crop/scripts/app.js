(function (global) {
    var app = global.app = global.app || {};

    app.makeUrlAbsolute = function (url) {
        var anchorEl = document.createElement("a");
        anchorEl.href = url;
        return anchorEl.href;
    };

    document.addEventListener("deviceready", function () {
        cameraApp = new cameraApp();
        cameraApp.run();
        navigator.splashscreen.hide();
        app.changeSkin = function (e) {
            var mobileSkin = "";
            if (e.sender.element.text() === "Flat") {
                e.sender.element.text("Native");
                mobileSkin = "flat";
            } else {
                e.sender.element.text("Flat");
                mobileSkin = "";
            }
            app.application.skin(mobileSkin);
        };
        app.application = new kendo.mobile.Application(document.body, {
            layout: "tabstrip-layout"
        });
    }, false);

    function id(element) {
        return document.getElementById(element);
    }

    function cameraApp() {}

    cameraApp.prototype = {
        _pictureSource: null,

        _destinationType: null,

        run: function () {
            var that = this;
            that._pictureSource = navigator.camera.PictureSourceType;
            that._destinationType = navigator.camera.DestinationType;
            id("capturePhotoButton").addEventListener("click", function () {
                that._capturePhoto.apply(that, arguments);
            });
            id("capturePhotoEditButton").addEventListener("click", function () {
                that._capturePhotoEdit.apply(that, arguments)
            });
            id("getPhotoFromLibraryButton").addEventListener("click", function () {
                that._getPhotoFromLibrary.apply(that, arguments)
            });
            id("getPhotoFromAlbumButton").addEventListener("click", function () {
                that._getPhotoFromAlbum.apply(that, arguments);
            });
            id("brightness").addEventListener("change", function () {
                that._brightness.apply(that, arguments);
            });
        },

        _capturePhoto: function () {
            var that = this;
            navigator.camera.getPicture(function () {
                that._onPhotoDataSuccess.apply(that, arguments);
            }, function () {
                that._onFail.apply(that, arguments);
            }, {
                quality: 50,
                destinationType: that._destinationType.DATA_URL
            });
        },

        _capturePhotoEdit: function () {
            var that = this;
            navigator.camera.getPicture(function () {
                that._onPhotoDataSuccess.apply(that, arguments);
            }, function () {
                that._onFail.apply(that, arguments);
            }, {
                quality: 20,
                allowEdit: true,
                destinationType: cameraApp._destinationType.DATA_URL
            });
        },

        _getPhotoFromLibrary: function () {
            var that = this;
            that._getPhoto(that._pictureSource.PHOTOLIBRARY);
        },

        _getPhotoFromAlbum: function () {
            var that = this;
            that._getPhoto(that._pictureSource.SAVEDPHOTOALBUM)
        },

        _getPhoto: function (source) {
            var that = this;
            navigator.camera.getPicture(function () {
                that._onPhotoURISuccess.apply(that, arguments);
            }, function () {
                cameraApp._onFail.apply(that, arguments);
            }, {
                quality: 50,
                destinationType: cameraApp._destinationType.FILE_URI,
                sourceType: source
            });
        },

        _onPhotoDataSuccess: function (imageData) {
            var smallImage = document.getElementById('smallImage');
            smallImage.style.display = 'block';
            smallImage.src = "data:image/jpeg;base64," + imageData;
        },

        _onPhotoURISuccess: function (imageURI) {
            var smallImage = document.getElementById('smallImage');
            smallImage.style.display = 'block';
            smallImage.src = imageURI;
        },

        _brightness: function () {
            Caman("#target", function () {
                var b = document.getElementById("brightness").value;
                this.revert();
                this.brightness(b);
                this.render();
            });
        },

        _onFail: function (message) {
            alert(message);
        }
    };

})(window);