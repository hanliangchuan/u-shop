webpackJsonp([7],{EYio:function(t,i){},FG9T:function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var s=e("3pLw"),n={data:function(){return{list:[]}},mounted:function(){var t=this;Object(s.h)({fid:this.$route.query.fid}).then(function(i){t.list=i.data.list?i.data.list:[],console.log(t.list)})}},r={render:function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",[0==t.list.length?e("div",[t._v("暂无数据")]):t._l(t.list,function(i){return e("div",{key:i.id,staticClass:"catelist",on:{click:function(e){return t.$router.push("/detail?id="+i.id)}}},[e("div",{staticClass:"left"},[e("img",{attrs:{src:t.$pre+i.img,alt:""}})]),t._v(" "),e("div",{staticClass:"right"},[e("h3",[t._v(t._s(i.goodsname))]),t._v(" "),e("h5",[t._v("¥"+t._s(t._f("filterPrice")(i.price)))]),t._v(" "),e("br"),t._v(" "),e("el-button",{attrs:{type:"primary",disabled:""}},[t._v("立即抢购")])],1)])})],2)},staticRenderFns:[]};var a=e("C7Lr")(n,r,!1,function(t){e("EYio")},"data-v-5798a416",null);i.default=a.exports}});
//# sourceMappingURL=7.dbc62930ef3c77360ace.js.map