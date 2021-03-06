//全局过滤器
Vue.filter("money", function (value, type) {
    return "￥ " + value.toFixed(2) + type;
});

var goods = new Vue({
    el: "#app",
    data: {
        totalMoney: 0,
        productList: [],
        checkAllFlag: false,
        delFlag: false,
        carProduct: ''
    },
    filters: { // 局部过滤器
        formatMoney: function (value) {
            return "￥ "+value.toFixed(2);
        }
    },
    mounted: function () { // 生命周期 -- 默认查询某个方法
        this.$nextTick(function () {
            goods.cartView();
        });
        // this.cartView();)
    },
    methods: {
        cartView: function () {
            this.$http.get("data/cartData.json").then(res=>{
                this.productList = res.data.result.list;
                // this.totalMoney = res.data.result.totalMoney;
            });
            // let _this = this;
            // _this.$http.get("data/cartData.json", {"id":123}).then(function (res) {
            //     _this.productList = res.data.result.list;
            //     _this.totalMoney = res.data.result.totalMoney;
            // });
        },
        changeMoney: function (product, way) {
            if(way>0){
                product.productQuantity++;
            }else{
                product.productQuantity--;
                if(product.productQuantity<1){
                    product.productQuantity = 1;
                }
            }
            this.calcTotalPrice();
        },
        selectedProduct: function (item) {
            // 判断一个对象里的变量是否存在 typeof
            if(typeof item.checked == 'undefined'){
                // Vue.set(item,"checked",true);// 全局注册  -通过vue全局注册往item里变量里注册一个checked属性，checked的值为true

                this.$set(item,"checked",true);// 局部注册
            }else{
                item.checked = !item.checked; // 取反
            }
            this.calcTotalPrice();
        },
        checkAll: function (flag) {
            this.checkAllFlag = flag;
            var _this =  this;
            this.productList.forEach(function (item, index) {
                if(typeof item.checked == 'undefined'){
                    _this.$set(item,"checked",_this.checkAllFlag);
                }else{
                    item.checked = _this.checkAllFlag;
                }
            });
            this.calcTotalPrice();
        },
        calcTotalPrice: function () {
            var _this = this;
            this.totalMoney = 0;
            this.productList.forEach(function (item, index) {
                if(item.checked){
                    _this.totalMoney += item.productPrice*item.productQuantity;
                }
            });
        },
        delConfirm: function (item) {
            this.delFlag = true;
            this.carProduct = item;
        },
        delProduct: function () {
            // vue 1.0 删除$delete
            // this.delProduct.$delete(this.carProduct);

            var index = this.productList.indexOf(this.carProduct);
            this.productList.splice(index,1);
            this.delFlag = false;
        }
    }
});