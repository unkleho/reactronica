---
to: components/<%= name %>/<%= name %>.scss
---
@import '../../styles/global.scss';

.<%= h.changeCase.camel(name) %> {
  display: block;
}
