import{b as $}from"./chunk-XMPTDKSD.js";import"./chunk-BUGMLDPD.js";import"./chunk-X2KYT7AR.js";import{p as k}from"./chunk-Z6MUR4HA.js";import"./chunk-5JP3LAOO.js";import{b as V}from"./chunk-ZM7TG2CK.js";import{j as D,l as I,m as A}from"./chunk-55OH2YGL.js";import{b as F,c as P}from"./chunk-IUTP2CPD.js";import"./chunk-OT7QMP3V.js";import{d as M}from"./chunk-Y5AKHCVE.js";import"./chunk-QBLC4QDI.js";import"./chunk-62HKU34N.js";import"./chunk-F6ZVC27B.js";import"./chunk-K57XGHKA.js";import{c as O}from"./chunk-QNZTJFJV.js";import"./chunk-3H4FX66L.js";import"./chunk-QKB2Y33R.js";import"./chunk-SZPHH6CO.js";import"./chunk-33D5ATNK.js";import"./chunk-V3WBGSLQ.js";import{d as v}from"./chunk-MK3UTQGM.js";import"./chunk-LRAUUQVI.js";import"./chunk-7ANUR2EW.js";import"./chunk-HYWS42VJ.js";import"./chunk-NGTLZQLD.js";import"./chunk-ER76SXMX.js";import"./chunk-MZBZ45EI.js";import"./chunk-AZO7VNC4.js";import{E as N,z as R}from"./chunk-MIEORJZ2.js";import"./chunk-FQKZZ3J4.js";import"./chunk-DAXOQCTC.js";import"./chunk-BTAPYLMK.js";import"./chunk-RBLK56XA.js";import{Db as L,Ib as e,Jb as t,Kb as d,Ob as T,Zb as S,_b as p,dc as w,ec as o,f as b,gc as c,ja as E,jb as m,jc as y,la as u,oc as x,pc as C,qa as f,ra as g,vb as _}from"./chunk-3JZBD3P2.js";import"./chunk-G2X5OL7Z.js";var j=(()=>{let n=class n{constructor(){}ngOnInit(){}};n.\u0275fac=function(r){return new(r||n)},n.\u0275cmp=u({type:n,selectors:[["app-legal-ticket-request"]],standalone:!0,features:[x],decls:25,vars:0,consts:[[1,"card","p-3"],[1,"row"],[1,"col"],[1,"list-group"],[1,"list-group-item","pointer"]],template:function(r,s){r&1&&(e(0,"div",0)(1,"div",1)(2,"div",2)(3,"ul",3)(4,"li",4)(5,"p"),o(6,"1. ALTA DE PROVEEDOR"),t()(),e(7,"li",4)(8,"p"),o(9,"2. RENOVACION DE CONTRATO PROVEEDORES"),t()(),e(10,"li",4)(11,"p"),o(12,"3. ASAMBLEAS"),t()(),e(13,"li",4)(14,"p"),o(15,"4. JUNTAS DE COMIT\xC9, TEMAS LEGALES"),t()(),e(16,"li",4)(17,"p"),o(18,"5. CONVENIOS MOROSOS"),t()(),e(19,"li",4)(20,"p"),o(21,"6. BAJAS COLABORADORES"),t()(),e(22,"li",4)(23,"p"),o(24,"7. OTROS"),t()()()()()())},encapsulation:2});let i=n;return i})();function B(i,n){if(i&1){let a=T();e(0,"app-table-header",8),S("add",function(){f(a);let r=p();return g(r.onModalRequest({id:0,title:"Nuevo Registro"}))}),t()}if(i&2){p();let a=w(3);_("title","Legal Tickets")("dt",a)}}function Z(i,n){i&1&&(e(0,"tr")(1,"th",9),o(2," Folio "),d(3,"p-sortIcon",10),t(),e(4,"th",11),o(5," Nombre "),d(6,"p-sortIcon",12),t(),e(7,"th",13),o(8," Raz\xF3n social"),d(9,"p-sortIcon",14),t(),e(10,"th",15),o(11,"Opciones"),t()())}function H(i,n){if(i&1){let a=T();e(0,"tr")(1,"td",16),o(2),t(),e(3,"td",16),o(4),t(),e(5,"td",16),o(6),t(),e(7,"td",17)(8,"div",18)(9,"custom-button-edit",19),S("edit",function(){let s=f(a).$implicit,h=p();return g(h.onModalAddOrEdit({id:s.id,title:"Editar Registro"}))}),t(),e(10,"custom-button-delete",20),S("OnConfirm",function(){let s=f(a).$implicit,h=p();return g(h.onDelete(s))}),t()()()()}if(i&2){let a=n.$implicit;m(2),c(" ",a.code," "),m(2),c(" ",a.shortName," "),m(2),c(" ",a.largeName," ")}}function J(i,n){if(i&1&&(e(0,"div",21),o(1),t()),i&2){let a=p();m(1),c(" En total hay ",a.data?a.data.length:0," registros. ")}}var z=()=>["shortName","largeName"],G=()=>[50,75,100,200],U=()=>({"min-width":"50rem"}),de=(()=>{let n=class n{constructor(){this.customToastService=E(v),this.dialogService=E(O),this.data=[],this.destroy$=new b}ngOnInit(){this.onLoadData()}onLoadData(){}onModalRequest(l){this.ref=this.dialogService.open(j,{data:{id:l.id},header:l.title,styleClass:"modal-lg",closeOnEscape:!0,baseZIndex:1e4}),this.ref.onClose.subscribe(r=>{r&&(this.customToastService.onShowSuccess(),this.onLoadData())})}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete()}};n.\u0275fac=function(r){return new(r||n)},n.\u0275cmp=u({type:n,selectors:[["app-legal-list-ticket"]],standalone:!0,features:[y([O,R,v]),x],decls:8,vars:13,consts:[["position","top-left",3,"baseZIndex"],[1,"card"],["currentPageReportTemplate","Mostrando {first} a {last} de {totalRecords} registros","styleClass","custom-table",3,"value","autoLayout","globalFilterFields","paginator","rowHover","rows","rowsPerPageOptions","showCurrentPageReport","tableStyle"],["dt",""],["pTemplate","caption"],["pTemplate","header"],["pTemplate","body"],["pTemplate","paginatorleft"],[3,"title","dt","add"],["scope","col","pSortableColumn","folio"],["field","folio"],["scope","col","pSortableColumn","shortName"],["field","shortName"],["scope","col","pSortableColumn","largeName"],["field","largeName"],["scope","col",1,"hide-print-mode",2,"width","5%"],[1,"p-column-title"],[1,"hide-print-mode"],[1,"d-flex","justify-content-center"],[3,"edit"],[3,"OnConfirm"],[1,"p-d-flex","p-ai-center","p-jc-between","hide-print-mode"]],template:function(r,s){r&1&&(d(0,"p-toast",0),e(1,"div",1)(2,"p-table",2,3),L(4,B,1,2,"ng-template",4)(5,Z,12,0,"ng-template",5)(6,H,11,3,"ng-template",6)(7,J,2,1,"ng-template",7),t()()),r&2&&(_("baseZIndex",99999),m(2),_("value",s.data)("autoLayout",!0)("globalFilterFields",C(10,z))("paginator",!0)("rowHover",!0)("rows",50)("rowsPerPageOptions",C(11,G))("showCurrentPageReport",!0)("tableStyle",C(12,U)))},dependencies:[k,F,P,V,$,D,N,I,A,M],encapsulation:2});let i=n;return i})();export{de as default};
