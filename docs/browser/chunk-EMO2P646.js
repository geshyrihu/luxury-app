import{b as m,c as _}from"./chunk-CK3JX6QL.js";import{B as c,D as E}from"./chunk-RBLK56XA.js";import{Ia as v,Ib as d,Jb as h,Kb as u,Zb as I,ab as y,da as f,jb as l,kb as p,la as s,ma as g,oc as D,pb as C,ub as w,vb as b,wb as M}from"./chunk-3JZBD3P2.js";m.register(..._);var B=m;var L=(()=>{class n{platformId;el;type;plugins=[];width;height;responsive=!0;ariaLabel;ariaLabelledBy;get data(){return this._data}set data(i){this._data=i,this.reinit()}get options(){return this._options}set options(i){this._options=i,this.reinit()}onDataSelect=new C;isBrowser=!1;initialized;_data;_options={};chart;constructor(i,e){this.platformId=i,this.el=e}ngAfterViewInit(){this.initChart(),this.initialized=!0}onCanvasClick(i){if(this.chart){let e=this.chart.getElementsAtEventForMode(i,"nearest",{intersect:!0},!1),t=this.chart.getElementsAtEventForMode(i,"dataset",{intersect:!0},!1);e&&e[0]&&t&&this.onDataSelect.emit({originalEvent:i,element:e[0],dataset:t})}}initChart(){if(E(this.platformId)){let i=this.options||{};i.responsive=this.responsive,i.responsive&&(this.height||this.width)&&(i.maintainAspectRatio=!1),this.chart=new B(this.el.nativeElement.children[0].children[0],{type:this.type,data:this.data,options:this.options,plugins:this.plugins})}}getCanvas(){return this.el.nativeElement.children[0].children[0]}getBase64Image(){return this.chart.toBase64Image()}generateLegend(){if(this.chart)return this.chart.generateLegend()}refresh(){this.chart&&this.chart.update()}reinit(){this.chart&&(this.chart.destroy(),this.initChart())}ngOnDestroy(){this.chart&&(this.chart.destroy(),this.initialized=!1,this.chart=null)}static \u0275fac=function(e){return new(e||n)(p(v),p(y))};static \u0275cmp=s({type:n,selectors:[["p-chart"]],hostAttrs:[1,"p-element"],inputs:{type:"type",plugins:"plugins",width:"width",height:"height",responsive:"responsive",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",data:"data",options:"options"},outputs:{onDataSelect:"onDataSelect"},decls:2,vars:8,consts:[[2,"position","relative"],["role","img",3,"click"]],template:function(e,t){e&1&&(d(0,"div",0)(1,"canvas",1),I("click",function(o){return t.onCanvasClick(o)}),h()()),e&2&&(M("width",t.responsive&&!t.width?null:t.width)("height",t.responsive&&!t.height?null:t.height),l(1),w("aria-label",t.ariaLabel)("aria-labelledby",t.ariaLabelledBy)("width",t.responsive&&!t.width?null:t.width)("height",t.responsive&&!t.height?null:t.height))},encapsulation:2,changeDetection:0})}return n})(),P=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=g({type:n});static \u0275inj=f({imports:[c]})}return n})();var Q=(()=>{let a=class a{ngOnInit(){let e=getComputedStyle(document.documentElement),t=e.getPropertyValue("--text-color"),r=e.getPropertyValue("--text-color-secondary"),o=e.getPropertyValue("--surface-border");this.options={maintainAspectRatio:!1,aspectRatio:.6,plugins:{legend:{labels:{color:t}}},scales:{x:{ticks:{color:r},grid:{color:o,drawBorder:!1}},y:{ticks:{color:r},grid:{color:o,drawBorder:!1}}}}}};a.\u0275fac=function(t){return new(t||a)},a.\u0275cmp=s({type:a,selectors:[["app-custom-bar-chart"]],inputs:{data:"data",options:"options"},standalone:!0,features:[D],decls:6,vars:2,consts:[[1,"card"],["type","line",1,"chart",3,"data","options"]],template:function(t,r){t&1&&(d(0,"table")(1,"tr")(2,"td")(3,"div",0),u(4,"p-chart",1),h()()()(),u(5,"hr")),t&2&&(l(4),b("data",r.data)("options",r.options))},dependencies:[P,L,c],styles:[`table[_ngcontent-%COMP%] {
    width: 100%;
    border-collapse: collapse;
  }

  td[_ngcontent-%COMP%] {
    padding: 10px;
    border: 0px solid black;
  }

  tr[_ngcontent-%COMP%]:first-child, tr[_ngcontent-%COMP%]:last-child {
    width: 10%;
  }

  tr[_ngcontent-%COMP%]:nth-child(2) {
    width: 80%;
  }`]});let n=a;return n})();export{L as a,P as b,Q as c};
