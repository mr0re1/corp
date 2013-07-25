// Generated by CoffeeScript 1.6.3
(function() {
  var DocumentAudioEditor,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  DocumentAudioEditor = (function() {
    function DocumentAudioEditor($place) {
      var _this = this;
      this.$place = $place;
      this.__on_marker_hover = __bind(this.__on_marker_hover, this);
      this.__on_new_fragment = __bind(this.__on_new_fragment, this);
      this.__on_file_input_change = __bind(this.__on_file_input_change, this);
      this.redraw = __bind(this.redraw, this);
      this.view = new DocumentView();
      this.$view_place = $('.view', this.$place);
      this.$tablink = $("a[data-target=#" + this.$place[0].id + "]");
      this.$markers = $('.markerslist', this.$place);
      this.$load_btn = $('button[name=load]', this.$place);
      this.$load_input = $('input:file[name=audio]', this.$place);
      this.audio = $('audio', this.$place)[0];
      this.complexAudio = new ComplexAudio(this.audio);
      this.complexAudio.appendTo($('.complex-audio-wrap', this.$place));
      this.$tablink.on('shown', this.redraw);
      this.$load_btn.on('click', function() {
        return _this.$load_input.click();
      });
      this.$load_input.on('change', this.__on_file_input_change);
      this.complexAudio.on('newfragment', this.__on_new_fragment);
      this.$markers.on('hover', '.marker', this.__on_marker_hover);
    }

    DocumentAudioEditor.prototype.setDocument = function(document) {
      var _base;
      this.document = document;
      if ((_base = this.document).audio == null) {
        _base.audio = {
          markers: [],
          src: null
        };
      }
      return this.document.on('contentchange', this.redraw);
    };

    DocumentAudioEditor.prototype.redraw = function() {
      if (this.$place.is(':visible')) {
        return this.view.show(this.document, this.$view_place);
      }
    };

    DocumentAudioEditor.prototype.__on_file_input_change = function() {
      var file;
      file = this.$load_input[0].files[0];
      if (file == null) {
        return;
      }
      return this.__set_audio_src(URL.createObjectURL(file));
    };

    DocumentAudioEditor.prototype.__set_audio_src = function(url) {
      return this.document.audio.src = this.audio.src = url;
    };

    DocumentAudioEditor.prototype.__on_new_fragment = function(fragment) {
      return this.$markers.append("<li>------</li>");
    };

    DocumentAudioEditor.prototype.__on_marker_hover = function(e) {};

    return DocumentAudioEditor;

  })();

  window.DocumentAudioEditor = DocumentAudioEditor;

}).call(this);
