<template>
  <view class="hello">
<!--    <u-calendar-->
<!--        :show="show"-->
<!--        @confirm="handleConfirm"></u-calendar>-->
    <u-navbar
        title="入库报表"
    >
      <view
          @click="$goBack"
          class="u-nav-slot"
          slot="left"
      >
        <u-icon
          name="arrow-left"
          size="20"
      ></u-icon>
      </view>
    </u-navbar>

    <view class="fenlei_top zuoyouduiqi">
     <view class="fenlei_top_left">
           <view  @click="showFrom= true">
             <!-- <el-date-picker style="width: 44vw" readonly="readonly"
                             v-model="queryParam.createTimeFrom" value-format="yyyy-MM"  type="month"
                             placeholder="开始时间"></el-date-picker> -->
			<u-input
				style="width: 44vw;background-color: #f4f3f8;" readonly="readonly"
				prefixIcon="calendar"
				placeholder="开始时间"
        placeholderStyle="font-size: 15px;color:#c0c4cc"
				v-model = "queryParam.createTimeFrom"
				prefixIconStyle="font-size: 20px;color:#c0c4cc"
				clearable
			>
			</u-input>
           </view>
      </view>
      <view style="margin-right: 6px;margin-left: 6px;">
        <text>至</text>
      </view>
      <view class="fenlei_top_left">
        <view   @click="showTo= true">
			<u-input
          placeholderStyle="font-size: 15px;color:#c0c4cc"
				style="width: 44vw;background-color: #f4f3f8;" readonly="readonly"
				prefixIcon="calendar"
				placeholder="结束时间"
				v-model = "queryParam.createTimeTo"
				prefixIconStyle="font-size: 20px;color:#c0c4cc"
				clearable
			>
			</u-input>
   <!--       <el-date-picker style="width: 44vw" readonly="readonly"
                          v-model="queryParam.createTimeTo" value-format="yyyy-MM"  type="month"
                          placeholder="结束时间"></el-date-picker> -->
        </view>
      </view>
    </view>
    <u-datetime-picker
        :show="showFrom"
        mode="year-month"
        :minDate="1646064000000"
        @confirm="confirmFrom"
        @cancel="cancelFrom"
    ></u-datetime-picker>
    <u-datetime-picker
        :show="showTo"
        mode="year-month"
        :minDate="1646064000000"
        @confirm="confirmTo"
        @cancel="cancelTo"
    ></u-datetime-picker>
<!--    列表开始-->
    <view style="    padding-top: 44px;">
      <view class="dingdans_item_rt" v-for="(item,index) in tableData" :key="index">
        <view class="dingdans_top_rt">
            <strong style="margin-left: 12px;">月份：</strong>
              <strong style="color: #409eff"
                @click="jumpDetail(item.months )"> {{item.months}} </strong>
        </view>
        <view class="dingdans_con_rt">
          <view  style="">
            <strong>
              {{item.successNum}}
            </strong>
            <p>入库数</p>
          </view>
          <view  style="">
            <strong>
              {{item.orderAmount}}
            </strong>
            <p>入库总额</p>
          </view>
          <view  >
            <strong>
              {{item.profits}}
            </strong>
            <p>已产生利润</p>
          </view>
          <view style="   border-right-width: 0vw;">
            <strong>
              {{item.profitsAmount}}
            </strong>
            <p>市价总额</p>
          </view>
        </view>
        <view class="dingdans_con_rt">
          <view  >
            <strong v-if="item.successNum">
              {{item.orderAmount / item.successNum  | numFilter}}
            </strong>
            <strong v-else>
              0
            </strong>
            <p>入库均价</p>
          </view>
          <view  >
            <strong v-if="item.successNum">
              {{item.profitsAmount / item.successNum  | numFilter}}
            </strong>
            <strong v-else>
              0
            </strong>
            <p>市价均价</p>
          </view>
          <view  >
            <strong>
              {{item.inventory}}
            </strong>
            <p>剩余库存</p>
          </view>
          <view style="border-right-width: 0vw;">
            <strong>
              {{item.inventoryPrice}}
            </strong>
            <p>剩余总额</p>
          </view>
        </view>
        <view class="dingdans_con_rt">
          <view  >
            <strong>
              {{item.saleNum}}
            </strong>
            <p>已售数量</p>
          </view>
          <view  >
            <strong>
              {{item.theirPrice}}
            </strong>
            <p>出售金额</p>
          </view>
          <view  >
            <strong v-if="item.saleNum">
              {{item.profits / item.saleNum  | numFilter}}
            </strong>
            <strong v-else>0</strong>
            <p>利润均价</p>
          </view>
          <view style=" border-right-width: 0vw;">
            <strong>
              {{item.thisTimeProfits}}
            </strong>
            <p>预估利润</p>
          </view>
        </view>

      </view>
    </view>
    <!--    列表结束-->
    <view v-if="!tableData.length" class="to-the-bottom-1" >
      <p>
        <image style="width: 60vw; height: 60vw;"  src="../../static/img/new/empity_7.png"></image>

<!--        <u&#45;&#45;image src="../../static/img/new/empity_7.png" style="width: 60vw;"></u&#45;&#45;image>-->
      </p>
      <p>
        <text>暂无相关数据</text>
      </p>
    </view>
    <!--    <p style="padding: 0.5rem 0;" class="to-the-bottom">{{emtityMsg}}</p>-->
  </view>
</template>
<script>
  // import Baseline from '@/common/_baseline.vue'
  // import Footer from '@/common/_footer.vue'
  // import {reportApi} from '@/api/report'


  export default {
    components: {
      // 'v-baseline': Baseline,
      // 'v-footer': Footer
    },
    name: "HelloWorld",
    data() {
      return {
        pickerValue:new Date(),
        pickerValueType: '',
        showFrom: false,
        showTo: false,
        allLoaded: false,
        emtityMsg: '没有更多了',
        queryParam: {
          createTimeFrom: '',
          createTimeTo: ''
        },
        tableData: [],
      }
    },
    mounted() {
      this.getPage()

    },
    methods: {

      cancelFrom() {
         this.showFrom=false
         this.queryParam.createTimeFrom = ''
         this.getPage()
       },
      cancelTo() {
         this.showTo=false
         this.queryParam.createTimeTo = ''
         this.getPage()
       },
       confirmFrom(e) {
        this.showFrom = false;
        let timeValue =  uni.$u.timeFormat(e.value, 'yyyy-mm');
        this.queryParam.createTimeFrom = timeValue
        this.getPage()
      },
       confirmTo(e) {
        this.showTo = false;
        let timeValue =  uni.$u.timeFormat(e.value, 'yyyy-mm');
        this.queryParam.createTimeTo = timeValue
        this.getPage()
      },
      jumpDetail(months) {
        if (months == '合计'){
          return
        }
        this.$router.push({ path: '/putinDetail', query: { months }})
      },
      getPage() {
        this.allLoaded = false
        this.$request({
          url: '/gw/op/v1/report/putInStorage',
          method: 'get',
          data: this.queryParam
        }).then(res => {
          if (res.subCode === 1000) {
            this.tableData = res.data ? res.data : []
            if (this.tableData.length == 0) {
              this.emtityMsg = '暂无相关数据'
              this.allLoaded = true
            } else {
              this.emtityMsg = '没有更多了'
            }
          } else {
            this.$toast(res.subMsg)
          }
        })
      }
    }
  };
</script>

<style lang="less" scoped>
  @import '@/assets/index/rt_style.less';
  @import '@/assets/index/style.css';

  * {
    /*margin: 0;*/
    /*padding: 0;*/
    box-sizing: border-box;
  }

  /* 这里直接设置 1rem = 50px begin */
  html {
    font-size: 10px;
  }

  /* 这里直接设置 1rem = 50px end */
  html,
  body {
    /*font-family: "微软雅黑";*/
    /*color: #333;*/
    /*background: #fff;*/
  }

  /*.login {*/
  /*  >section {*/
  /*    .tip {*/
  /*      padding: 6vw 3vw;*/
  /*      color:rgb(224, 145, 71);*/
  /*      letter-spacing: 2px;*/
  /*      font-size: 16px;*/
  /*    }*/
  /*  }*/
  /*}*/
  /*.clearfix {*/
  /*  &:after {*/
  /*    visibility: hidden;*/
  /*    display: block;*/
  /*    font-size: 0;*/
  /*    content: " ";*/
  /*    clear: both;*/
  /*    height: 0;*/
  /*  }*/
  /*}*/
</style>
