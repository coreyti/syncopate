(function($) {
  $.extend($.fn, {
    syncopate : function(options) {
      this.each(function() {
        Disco.build($.Syncopate, $.extend({ textarea : $(this) }, options)).load();
      });
    }
  });

  $.extend($, {
    Syncopate : {
      content : function(builder) {
        with(builder) {
          div({ 'class': 'syncopated' }, function() {
            ul({ 'class': 'toolbar' });
            div({ 'class': 'container'}, function() {
              iframe();
            })
          });
        }
      },

      methods : {
        after_initialize : function() {
          if(this.textarea) {
            var self    = this;
            var toolbar = this.find('ul.toolbar');

            $.each(this.commands || [], function() {
              $.each(this, function() {
                var command = this;
                var css_class = this.join ? this.join("_") : this;
                $('<li class="button ' + css_class + '"><a>' + command + '</a></li>')
                  .appendTo(toolbar)
                  .mousedown(function() {
                    if(command.join) {
                      self.exec(command[0], command[1]);
                    } else {
                      self.exec(command);
                    }
                    self.refresh();
                });
              });

              toolbar.append('<li class="separator"></li>');
            });

            this.textarea.hide();
            this.textarea.after(this);
          }
        },

        load : function() {
          var self    = this;
          var content = this.textarea.val();

          this.iframe_document = (frame.contentDocument || frame.contentWindow.document);
          this.iframe_document = this.find('iframe').contents()[0];
          this.iframe_document.open();
          this.iframe_document.write(content);
          this.iframe_document.close();
          this.iframe_document.contentEditable = true;
          this.iframe_document.designMode = 'on';

          $(this.iframe_document).bind('blur', function() { self.refresh(); });
        },

        refresh: function() {
          var source = $(this.iframe_document).find('body').html();
          this.textarea.val(source);

          this.textarea.trigger('change');
        },

        exec: function() {
          var name = arguments[0];
          var args = [];
          if(arguments.length == 2) {
            args = arguments[1];
          }

          this.iframe_document.execCommand(name, false, args);
          this.refresh();
        }
      }
    }
  });
})(jQuery);
