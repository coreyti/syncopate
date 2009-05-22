syn·co·pate (sĭng'kə-pāt', sĭn'-)
--------------------------------------------------------------------------------

*tr.v*., **-pat·ed**, **-pat·ing**, **-pates**.

   1. *Grammar*. To shorten (a word) by syncope.
   2. *Music*. To modify (rhythm) by syncopation.
   3. *Web Development*.
    * To synchronize a textarea with a basic "rich text editor", using very
      little code.
    * A response to my (i.e., Corey Innis) Pivotal Labs ["blab"][blab]

[Late Latin syncopāre, syncopāt-, from syncopē, syncope. See syncope.]


*(shake, shake, shake) shake your booty*
-------------------------------------------------------------------------------

Hey, you wanna *get down tonight*? Check out:

  * `example/index.html`; *that's the way (i like it)*
  * the screw unit spec suite in `spec/suite.html`; *stayin' alive*


*you should be dancing*
-------------------------------------------------------------------------------

For your own site,

  * copy and reference:
    * `lib/jquery.js`
    * `lib/disco.js`
    * `lib/sycopate.js`
  * get your groove on:

        $('textarea.syncopate').syncopate({
          // 'commands' is an array of arrays, grouping editor commands.
          // check out https://developer.mozilla.org/En/Rich-Text_Editing_in_Mozilla
          commands : [
            ['bold', 'italic', 'underline'],
            ['indent', 'outdent']
          ]
        });


*reach out (i'll be there)*
-------------------------------------------------------------------------------

Found an issue?  Let us know (in GitHub's issue tracker)!



[blab]: http://pivotallabs.com/users/corey/blog/articles/860-javascript-snacks-nibble-1-rte-wysiwyg-is-built-in-to-your-browser "Javascript Snacks, Nibble #1: RTE/WYSIWYG is Built in to your Browser"
