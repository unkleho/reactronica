---
to: components/<%= name %>/<%= name %>.css
---
@import '../../styles/global.css';

.<%= h.changeCase.camel(name) %> {
  display: block;
}
