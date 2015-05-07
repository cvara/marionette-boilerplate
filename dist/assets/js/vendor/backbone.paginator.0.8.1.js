Backbone.Paginator=function(a,b,c){"use strict";var d=b.map(a.VERSION.split("."),function(a){return parseInt(a,10)}),e={};e.version="0.8.1",e.clientPager=a.Collection.extend({useDiacriticsPlugin:!0,useLevenshteinPlugin:!0,sortColumn:"",sortDirection:"desc",lastSortColumn:"",fieldFilterRules:[],lastFieldFilterRules:[],filterFields:"",filterExpression:"",lastFilterExpression:"",defaults_ui:{firstPage:0,currentPage:1,perPage:5,totalPages:10,pagesInRange:4},initialize:function(){this.on("add",this.addModel,this),this.on("remove",this.removeModel,this),this.setDefaults()},setDefaults:function(){var a=b.defaults(this.paginator_ui,this.defaults_ui);b.defaults(this,a)},addModel:function(a){this.origModels.push(a)},removeModel:function(a){var c=b.indexOf(this.origModels,a);this.origModels.splice(c,1)},sync:function(e,f,g){var h=this;this.setDefaults();var i={};b.each(b.result(h,"server_api"),function(a,c){b.isFunction(a)&&(a=b.bind(a,h),a=a()),i[c]=a});var j=b.clone(h.paginator_core);b.each(j,function(a,c){b.isFunction(a)&&(a=b.bind(a,h),a=a()),j[c]=a}),j=b.defaults(j,{timeout:25e3,cache:!1,type:"GET",dataType:"jsonp"}),j=b.extend(j,{data:decodeURIComponent(c.param(i)),processData:!1,url:b.result(j,"url")},g);var k=!(0===d[0]&&9===d[1]&&10===d[2]),l=j.success;j.success=function(a,b,c){l&&(k?l(a,b,c):l(f,a,j)),f&&f.trigger&&f.trigger("sync",f,a,j)};var m=j.error;j.error=function(a){m&&m(f,a,j),f&&f.trigger&&f.trigger("error",f,a,j)};var n=j.xhr=a.ajax(j);return f&&f.trigger&&f.trigger("request",f,n,j),n},nextPage:function(a){this.currentPage<this.information.totalPages&&(this.currentPage=++this.currentPage,this.pager(a))},previousPage:function(a){this.currentPage>1&&(this.currentPage=--this.currentPage,this.pager(a))},goTo:function(a,b){void 0!==a&&(this.currentPage=parseInt(a,10),this.pager(b))},howManyPer:function(a){if(void 0!==a){var b=this.perPage;this.perPage=parseInt(a,10),this.currentPage=Math.ceil((b*(this.currentPage-1)+1)/a),this.pager()}},setSort:function(a,b){void 0!==a&&void 0!==b&&(this.lastSortColumn=this.sortColumn,this.sortColumn=a,this.sortDirection=b,this.pager(),this.info())},setFieldFilter:function(a){b.isEmpty(a)?(this.lastFieldFilterRules=this.fieldFilterRules,this.fieldFilterRules="",this.pager(),this.info()):(this.lastFieldFilterRules=this.fieldFilterRules,this.fieldFilterRules=a,this.pager(),this.info())},doFakeFieldFilter:function(a){if(!b.isEmpty(a)){var c=this.origModels;return void 0===c&&(c=this.models),c=this._fieldFilter(c,a),""!==this.filterExpression&&(c=this._filter(c,this.filterFields,this.filterExpression)),c.length}},setFilter:function(a,b){void 0!==a&&void 0!==b&&(this.filterFields=a,this.lastFilterExpression=this.filterExpression,this.filterExpression=b,this.pager(),this.info())},doFakeFilter:function(a,c){if(void 0!==a&&void 0!==c){var d=this.origModels;return void 0===d&&(d=this.models),b.isEmpty(this.fieldFilterRules)||(d=this._fieldFilter(d,this.fieldFilterRules)),d=this._filter(d,a,c),d.length}},pager:function(a){var c=this,d=this.perPage,e=(c.currentPage-1)*d,f=e+d;void 0===c.origModels&&(c.origModels=c.models),c.models=c.origModels.slice(),""!==this.sortColumn&&(c.models=c._sort(c.models,this.sortColumn,this.sortDirection)),b.isEmpty(this.fieldFilterRules)||(c.models=c._fieldFilter(c.models,this.fieldFilterRules)),""!==this.filterExpression&&(c.models=c._filter(c.models,this.filterFields,this.filterExpression)),this.lastSortColumn===this.sortColumn&&this.lastFilterExpression===this.filterExpression&&b.isEqual(this.fieldFilterRules,this.lastFieldFilterRules)||(e=0,f=e+d,c.currentPage=1,this.lastSortColumn=this.sortColumn,this.lastFieldFilterRules=this.fieldFilterRules,this.lastFilterExpression=this.filterExpression),c.sortedAndFilteredModels=c.models.slice(),c.info(),c.reset(c.models.slice(e,f)),b.result(a,"success")},_sort:function(a,c,d){return a=a.sort(function(a,e){var f=a.get(c),g=e.get(c);if(b.isUndefined(f)||b.isUndefined(g)||null===f||null===g)return 0;if(f=f.toString().toLowerCase(),g=g.toString().toLowerCase(),"desc"===d)if(!f.match(/[^\-\d\.]/)&&f.match(/-?[\d\.]+/)&&!g.match(/[^\-\d\.]/)&&g.match(/-?[\d\.]+/)){if(g-0>f-0)return 1;if(f-0>g-0)return-1}else{if(g>f)return 1;if(f>g)return-1}else if(!f.match(/[^\-\d\.]/)&&f.match(/-?[\d\.]+/)&&!g.match(/[^\-\d\.]/)&&g.match(/-?[\d\.]+/)){if(g-0>f-0)return-1;if(f-0>g-0)return 1}else{if(g>f)return-1;if(f>g)return 1}if(a.cid&&e.cid){var h=a.cid,i=e.cid;if(i>h)return-1;if(h>i)return 1}return 0})},_fieldFilter:function(a,c){if(b.isEmpty(c))return a;var d=[];return b.each(a,function(a){var e=!0;b.each(c,function(c){if(!e)return!1;if(e=!1,"function"===c.type){var d=b.wrap(c.value,function(b){return b(a.get(c.field))});d()&&(e=!0)}else"required"===c.type?b.isEmpty(a.get(c.field).toString())||(e=!0):"min"===c.type?!b.isNaN(Number(a.get(c.field)))&&!b.isNaN(Number(c.value))&&Number(a.get(c.field))>=Number(c.value)&&(e=!0):"max"===c.type?!b.isNaN(Number(a.get(c.field)))&&!b.isNaN(Number(c.value))&&Number(a.get(c.field))<=Number(c.value)&&(e=!0):"range"===c.type?!b.isNaN(Number(a.get(c.field)))&&b.isObject(c.value)&&!b.isNaN(Number(c.value.min))&&!b.isNaN(Number(c.value.max))&&Number(a.get(c.field))>=Number(c.value.min)&&Number(a.get(c.field))<=Number(c.value.max)&&(e=!0):"minLength"===c.type?a.get(c.field).toString().length>=c.value&&(e=!0):"maxLength"===c.type?a.get(c.field).toString().length<=c.value&&(e=!0):"rangeLength"===c.type?b.isObject(c.value)&&!b.isNaN(Number(c.value.min))&&!b.isNaN(Number(c.value.max))&&a.get(c.field).toString().length>=c.value.min&&a.get(c.field).toString().length<=c.value.max&&(e=!0):"oneOf"===c.type?b.isArray(c.value)&&b.include(c.value,a.get(c.field))&&(e=!0):"equalTo"===c.type?c.value===a.get(c.field)&&(e=!0):"containsAllOf"===c.type?b.isArray(c.value)&&b.isArray(a.get(c.field))&&b.intersection(c.value,a.get(c.field)).length===c.value.length&&(e=!0):"pattern"===c.type?a.get(c.field).toString().match(c.value)&&(e=!0):e=!1}),e&&d.push(a)}),d},_filter:function(c,d,e){var f=this,g={};if(b.isString(d)?g[d]={cmp_method:"regexp"}:b.isArray(d)?b.each(d,function(a){g[a]={cmp_method:"regexp"}}):b.each(d,function(a,c){g[c]=b.defaults(a,{cmp_method:"regexp"})}),d=g,b.has(a.Paginator,"removeDiacritics")&&f.useDiacriticsPlugin&&(e=a.Paginator.removeDiacritics(e)),""===e||!b.isString(e))return c;var h=b.map(e.match(/\w+/gi),function(a){return a.toLowerCase()}),i="("+b.uniq(h).join("|")+")",j=new RegExp(i,"igm"),k=[];return b.each(c,function(c){var g=[];b.each(d,function(d,i){var k=c.get(i);if(k){var l=[];if(k=b.has(a.Paginator,"removeDiacritics")&&f.useDiacriticsPlugin?a.Paginator.removeDiacritics(k.toString()):k.toString(),"levenshtein"===d.cmp_method&&b.has(a.Paginator,"levenshtein")&&f.useLevenshteinPlugin){var m=a.Paginator.levenshtein(k,e);b.defaults(d,{max_distance:0}),m<=d.max_distance&&(l=b.uniq(h))}else l=k.match(j);l=b.map(l,function(a){return a.toString().toLowerCase()}),b.each(l,function(a){g.push(a)})}}),g=b.uniq(b.without(g,"")),b.isEmpty(b.difference(h,g))&&k.push(c)}),k},info:function(){var a=this,b={},c=a.sortedAndFilteredModels?a.sortedAndFilteredModels.length:a.length,d=Math.ceil(c/a.perPage);return b={totalUnfilteredRecords:a.origModels.length,totalRecords:c,currentPage:a.currentPage,perPage:this.perPage,totalPages:d,lastPage:d,previous:!1,next:!1,startRecord:0===c?0:(a.currentPage-1)*this.perPage+1,endRecord:Math.min(c,a.currentPage*this.perPage)},a.currentPage>1&&(b.previous=a.currentPage-1),a.currentPage<b.totalPages&&(b.next=a.currentPage+1),b.pageSet=a.setPagination(b),a.information=b,b},setPagination:function(a){var b=[],c=0,d=0,e=2*this.pagesInRange,f=Math.ceil(a.totalRecords/a.perPage);if(f>1)if(1+e>=f)for(c=1,d=f;d>=c;c++)b.push(c);else if(a.currentPage<=this.pagesInRange+1)for(c=1,d=2+e;d>c;c++)b.push(c);else if(f-this.pagesInRange>a.currentPage&&a.currentPage>this.pagesInRange)for(c=a.currentPage-this.pagesInRange;c<=a.currentPage+this.pagesInRange;c++)b.push(c);else for(c=f-e;f>=c;c++)b.push(c);return b},bootstrap:function(a){return b.extend(this,a),this.goTo(1),this.info(),this}}),e.clientPager.prototype.prevPage=e.clientPager.prototype.previousPage;var f=function(){var a=new c.Deferred;return a.reject(),a.promise()};return e.requestPager=a.Collection.extend({sync:function(e,f,g){var h=this;h.setDefaults();var i={};b.each(b.result(h,"server_api"),function(a,c){b.isFunction(a)&&(a=b.bind(a,h),a=a()),i[c]=a});var j=b.clone(h.paginator_core);b.each(j,function(a,c){b.isFunction(a)&&(a=b.bind(a,h),a=a()),j[c]=a}),j=b.defaults(j,{timeout:25e3,cache:!1,type:"GET",dataType:"jsonp"}),g.data?g.data=decodeURIComponent(c.param(b.extend(i,g.data))):g.data=decodeURIComponent(c.param(i)),j=b.extend(j,{data:decodeURIComponent(c.param(i)),processData:!1,url:b.result(j,"url")},g);var k=!(0===d[0]&&9===d[1]&&10===d[2]),l=j.success;j.success=function(a,b,c){l&&(k?l(a,b,c):l(f,a,j)),d[0]<1&&f&&f.trigger&&f.trigger("sync",f,a,j)};var m=j.error;j.error=function(a){m&&m(a),f&&f.trigger&&f.trigger("error",f,a,j)};var n=j.xhr=a.ajax(j);return f&&f.trigger&&f.trigger("request",f,n,j),n},setDefaults:function(){var a=this;b.defaults(a.paginator_ui,{firstPage:0,currentPage:1,perPage:5,totalPages:10,pagesInRange:4}),b.each(a.paginator_ui,function(c,d){b.isUndefined(a[d])&&(a[d]=a.paginator_ui[d])})},requestNextPage:function(a){return void 0!==this.currentPage?(this.currentPage+=1,this.pager(a)):f()},requestPreviousPage:function(a){return void 0!==this.currentPage?(this.currentPage-=1,this.pager(a)):f()},updateOrder:function(a,b){return void 0!==a?(this.sortField=a,this.pager(b)):f()},goTo:function(a,b){return void 0!==a?(this.currentPage=parseInt(a,10),this.pager(b)):f()},howManyPer:function(a,b){return void 0!==a?(this.currentPage=this.firstPage,this.perPage=a,this.pager(b)):f()},info:function(){var a={totalRecords:this.totalRecords||0,currentPage:this.currentPage,firstPage:this.firstPage,totalPages:Math.ceil(this.totalRecords/this.perPage),lastPage:this.totalPages,perPage:this.perPage,previous:!1,next:!1};return this.currentPage>1&&(a.previous=this.currentPage-1),this.currentPage<a.totalPages&&(a.next=this.currentPage+1),a.hasNext=a.next,a.hasPrevious=a.next,a.pageSet=this.setPagination(a),this.information=a,a},setPagination:function(a){var b=[],c=0,d=0,e=2*this.pagesInRange,f=Math.ceil(a.totalRecords/a.perPage);if(f>1)if(1+e>=f)for(c=1,d=f;d>=c;c++)b.push(c);else if(a.currentPage<=this.pagesInRange+1)for(c=1,d=2+e;d>c;c++)b.push(c);else if(f-this.pagesInRange>a.currentPage&&a.currentPage>this.pagesInRange)for(c=a.currentPage-this.pagesInRange;c<=a.currentPage+this.pagesInRange;c++)b.push(c);else for(c=f-e;f>=c;c++)b.push(c);return b},pager:function(a){return b.isObject(a)||(a={}),this.fetch(a)},url:function(){return void 0!==this.paginator_core&&void 0!==this.paginator_core.url?this.paginator_core.url:null},bootstrap:function(a){return b.extend(this,a),this.setDefaults(),this.info(),this}}),e.requestPager.prototype.nextPage=e.requestPager.prototype.requestNextPage,e.requestPager.prototype.prevPage=e.requestPager.prototype.requestPreviousPage,e}(Backbone,_,jQuery);