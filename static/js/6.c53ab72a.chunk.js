(this["webpackJsonpliliana-player-admin"]=this["webpackJsonpliliana-player-admin"]||[]).push([[6],{115:function(e,t,a){"use strict";a.d(t,"a",(function(){return l}));var n=a(24);var r=a(31);function l(e){return function(e){if(Array.isArray(e))return Object(n.a)(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||Object(r.a)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},155:function(e,t,a){},186:function(e,t,a){"use strict";a.r(t);var n=a(115),r=a(16),l=a(17),c=a(30),o=a(29),i=a(0),s=a.n(i),u=a(18),m=a(2),p=a(4),f=a(9),b=(a(155),function(e){Object(c.a)(a,e);var t=Object(o.a)(a);function a(){var e;Object(r.a)(this,a);for(var n=arguments.length,l=new Array(n),c=0;c<n;c++)l[c]=arguments[c];return(e=t.call.apply(t,[this].concat(l))).handleLogout=function(){f.a.logout()},e.getActiveMenuItems=function(t,a){a.forEach((function(a,n){a.subItems?e.getActiveMenuItems(t,a.subItems):f.a.rolesHasPermission(t,a.path)?a.enabled=!0:a.enabled=!1}))},e.generateMenu=function(t){var a=e.props.location.pathname;return t.map((function(t){var n="menu-item"+(t.path===a?" active-menu":"");return null===t.path&&(t.path="#"),t.subItems?s.a.createElement("li",{key:t.key,className:"".concat(n," menu-parent level").concat(t.level)},s.a.createElement(u.b,{to:t.path},t.name,"\xa0",s.a.createElement("i",{className:"caret fa "+(t.level>1?"fa-caret-right":"fa-caret-down"),onClick:function(e){return e.preventDefault()}})),s.a.createElement("ul",{key:t.key,className:n+" sub-menu level"+(t.level+1)},e.generateMenu(t.subItems))):t.enabled&&s.a.createElement("li",{key:t.key,className:"".concat(n," level").concat(t.level," ").concat(t.className?t.className:""),title:t.title?t.title:""},s.a.createElement(u.b,{to:t.path},t.name))}))},e}return Object(l.a)(a,[{key:"render",value:function(){var e=this.props.userInfo,t=e?e.roleArray:[],a=Object(n.a)(p.d);return this.getActiveMenuItems(t,a),s.a.createElement("nav",{className:"custom-navbar"},s.a.createElement("ul",{className:"nav-wrapper"},this.generateMenu(a)),s.a.createElement("div",{className:"userinfo-wrapper"},!e&&s.a.createElement(u.b,{to:"/login"},"Login"),e&&s.a.createElement("div",null,e.name," (",s.a.createElement("span",{className:"logout-link",onClick:this.handleLogout},"Logout"),")")))}}]),a}(i.Component));t.default=Object(m.g)(b)}}]);