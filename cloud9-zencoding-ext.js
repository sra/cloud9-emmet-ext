/*!
 * Zen Coding for the Cloud9 IDE
 *
 * @copyright 2013, Rubens Mariuzzo, Mariuzzo.com
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */

// RequireJS configuration for non AMD dependencies.
requirejs.config({
    shim: {
        './vendors/underscore.js': {
            exports : '_'
        },
        './vendors/emmet-core.js' : {
            
            exports : 'emmet'
        }
    }
});

// Zen Coding Cloud9 extension.
define(function(require, exports, module) {

    // Cloud9 dependencies.
    var ext = require('core/ext');
    var menus = require('ext/menus/menus');
    var editors = require("ext/editors/editors");
    var commands = require('ext/commands/commands');
    
    // Emmet dependencies.
    require('./vendors/underscore.js');
    require('./vendors/emmet-core.js');
    
    // Cloud9 extension definition.
    module.exports = ext.register('ext/cloud9-zencoding-ext/cloud9-zencoding-ext', {

        // C9 Extension Properties

        name:    'Zen Coding Extension',
        dev:     'Rubens Mariuzzo',
        alone:   true,
        offline: false,
        type:    ext.GENERAL,
        nodes:   [],

        // C9 Extension Methods

        init: function(amlNode) { },

        hook: function() {
            
            var _self = this;
            
            // Prepare the menu.
            this.nodes.push(menus.addItemByPath('Tools/Zen Coding/', new apf.menu(), 900));
            
            // Zen Coding > Expand Abbreviation
            var mnuItemExpand = new apf.item({
                command:'expand',
                onclick: function(editor) {
                    _self.expand(editor);
                }
            });

            this.nodes.push(menus.addItemByPath('Tools/Zen Coding/Expand Abbreviation', mnuItemExpand, 910));
            
            commands.addCommand({
                name: 'expand',
                hint: 'expands CSS-like abbreviations into HTML/XML/CSS code, depending on current document’s syntax.',
                msg: 'Expanding abbreviation.',
                bindKey: {mac: 'Command-Shift-E', win: 'Shift-Ctrl-E'},
                isAvailable : function(editor){
                    return true;
                },
                exec: function (editor) {
                    _self.expand(editor);
                }
            });
            
            ext.initExtension(this);
        },

        enable: function() {
            this.nodes.each(function(item) {
                item.enable();
            });
            this.disabled = false;
        },

        disable: function() {
            this.nodes.each(function(item) {
                item.disable();
            });
            this.disabled = true;
        },

        destroy: function() {
            
            // Restore the menu.
            menus.remove('Tools/Zen Coding');
            
            this.nodes.each(function(item) {
                item.destroy(true, true);
            });
            this.nodes = [];
        },

        // Zen Coding Functions

        expand: function(editor) {
            
            if (!editor)
                editors.currentEditor;

            if (editor.amlEditor)
                editor = editor.amlEditor.$editor;

            var sel = editor.selection;
            var session = editor.session;
            var range = sel.getRange();

            var line = session.getLine(range.start.row);
            
            editor.insert(line);
            
        }

    });

});