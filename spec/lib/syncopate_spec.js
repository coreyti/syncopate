Screw.Unit(function(c) { with(c) {
  describe('$.Syncopate', function() {
    var view;
    var commands = [
      ['bold', 'italic', 'underline'],
      ['indent', 'outdent']
    ];
    var commands_with_arguments = [
      [['heading', 'H1']]
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

      describe("given a 'commands' template with no arguments", function() {
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
              });
            });
          });
        });
      });

      describe("given a 'commands' template with arguments", function() {
        var syncopated, toolbar;

        before(function() {
          syncopated = Disco.build($.Syncopate, {
            textarea : view.children('textarea'),
            commands : commands_with_arguments
          });

          toolbar = view.find('ul.toolbar');
        });

        describe("the 'syncopated' editor's toolbar", function() {
          $.each(commands_with_arguments, function() {
            $.each(this, function() {
              var button_type = this;
              var css_class = this.join("_");

              describe("the generated " + button_type + " command button", function() {
                it("joins the array elements with an underscore", function() {
                  expect(toolbar.find('li.button.' + css_class).length).to(equal, 1);
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

    describe("#refresh", function() {
      var syncopated, textarea, iframe, editor;

      before(function() {
        textarea   = view.children('textarea');
        syncopated = Disco.build($.Syncopate, { textarea: textarea });
        syncopated.load();

        iframe = view.find('iframe');
        editor = $(iframe[0].contentWindow.document); // (frame.contentDocument || frame.document)
      });

      describe("invocation", function() {
        var called, original;

        before(function() {
          called   = false;
          original = syncopated.refresh;

          syncopated.refresh = function() {
            called = true;
          };
        });

        it("happens on 'blur' of the editor's iframe document", function() {
          editor.trigger('blur');
          expect(called).to(be_true);
        });
      });

      describe("behavior", function() {
        before(function() {
          textarea.val('');
        });

        it("updates the textarea with the HTML content from the iframe document", function() {
          syncopated.refresh();
          expect(textarea.val()).to(equal, 'plain text content');
        });

        it("triggers a 'change' event on the textarea", function() {
          var event_target;
          textarea.bind('change', function(e) { event_target = $(e.target); });

          syncopated.refresh();
          expect(event_target.val()).to(equal, 'plain text content');
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

        it("(PENDING) does not lose content, because we also set innerHTML (bugfix)", function() {
          // PENDING: the innerHTML solution causes funny behavior on Safari
          // var clone_textarea = clone.find('textarea');
          // expect(clone_textarea.val()).to(equal, content);
        });
      });
    });
  });
}});
