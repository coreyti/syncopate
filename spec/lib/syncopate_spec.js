Screw.Unit(function(c) { with(c) {
  describe('$.Syncopate', function() {
    var view;
    var commands = [
      ['bold', 'italic', 'underline'],
      ['indent', 'outdent']
    ];

    before(function() {
      view = Disco.build(function(builder) {
        with(builder) {
          form({ 'onsubmit': 'return false;' }, function() {
            textarea('plain text content');
            input({ 'type': 'submit' });
          });
        }
      });

      $('#test_content').html(view).css({ display: 'none' });
    });

    describe("Disco.build(...)", function() {
      describe("when not provided a textarea", function() {
        var syncopated, textarea;

        before(function() {
          textarea   = view.children('textarea');
          syncopated = Disco.build($.Syncopate);
        });

        it("does not render", function() {
          expect(view.find('iframe')).to(be_empty);
        });
      });

      describe("given a textarea", function() {
        var syncopated, textarea;

        before(function() {
          textarea   = view.children('textarea');
          syncopated = Disco.build($.Syncopate, { textarea: textarea });
        });

        describe("the textarea", function() {
          it("becomes hidden", function() {
            expect(textarea.css('display')).to(equal, 'none');
          });
        });

        describe("the 'syncopated' editor's container", function() {
          it("is inserted directly after the textarea", function() {
            expect(textarea.next()[0]).to(equal, syncopated[0]);
          });
        });

        describe("the 'syncopated' editor's iframe", function() {
          var iframe, editor;

          before(function() {
            iframe = view.find('iframe');
          });

          it("exists", function() {
            expect(iframe.length).to(equal, 1);
          });
        });
      });

      describe("given a 'commands' template", function() {
        var syncopated, toolbar;

        before(function() {
          syncopated = Disco.build($.Syncopate, {
            textarea : view.children('textarea'),
            commands : commands
          });

          toolbar = view.find('ul.toolbar');
        });

        describe("the 'syncopated' editor's toolbar", function() {
          it("exists", function() {
            expect(toolbar.length).to(equal, 1);
          });

          $.each(commands, function() {
            $.each(this, function() {
              var button_type = this;

              describe("the generated " + button_type + " command button", function() {
                it("exists", function() {
                  expect(toolbar.find('li.button.' + button_type).length).to(equal, 1);
                });

                it("when clicked, sends a '" + button_type + "' command to the iframe document", function() {

                });
              });
            });
          });
        });
      });
    });

    describe("#load", function() {
      var syncopated, textarea;

      before(function() {
        textarea   = view.children('textarea');
        syncopated = Disco.build($.Syncopate, {
          textarea: textarea,
          commands: commands
        });
        syncopated.load();
      });

      describe("the 'syncopated' editor's iframe document", function() {
        var iframe, editor;

        before(function() {
          iframe = view.find('iframe');
          editor = $(iframe[0].contentWindow.document); // (frame.contentDocument || frame.document)
        });

        it("is editable", function() {
          expect(editor[0].contentEditable).to(equal, true);
          expect(editor[0].designMode     ).to(equal, 'on');
        });

        it("contains content copied from the textarea", function() {
          expect(editor.find('body').html()).to(equal, textarea.val());
        });
      });

      describe("the 'syncopated' editor's toolbar", function() {
        $.each(commands, function() {
          $.each(this, function() {
            var button_type = this;

            describe("clicking the generated " + button_type + " command button", function() {
              var iframe, original, parameters;

              before(function() {
                iframe = view.find('iframe');
                original = iframe[0].contentWindow.document.execCommand;

                iframe[0].contentWindow.document.execCommand = function() {
                  parameters = arguments;
                };
              });

              after(function() {
                iframe[0].contentWindow.document.execCommand = original;
              });

              it("sends a '" + button_type + "' command to the iframe document", function() {
                view.find('li.button.' + button_type).mousedown();
                expect(parameters[0]).to(equal, button_type);
              });
            });
          });
        });
      });
    });

    describe("jQuery.fn.clone(...)", function() {
      var content;

      before(function() {
        content = '<b>original content</b>'

        var textarea   = view.children('textarea');
        var syncopated = Disco.build($.Syncopate, { textarea: textarea });
            syncopated.load();
        var iframe = view.find('iframe');
        var editor = $(iframe[0].contentWindow.document); // (frame.contentDocument || frame.document)
            editor.find('body').html(content);

        syncopated.refresh()
        expect(textarea.val()).to(equal, content);
      });

      describe("the cloned textarea", function() {
        var clone;

        before(function() {
          clone = view.clone(true);
        });

        it("does not lose content, because we also set innerHTML (bugfix)", function() {
          var clone_textarea = clone.find('textarea');
          expect(clone_textarea.val()).to(equal, content);
        });
      });
    });
  });
}});
