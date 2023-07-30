<template>
  <view class="hello" ref="hello">
<!--    <mt-header title="其他收支">-->
<!--      <view slot="left">-->
<!--        <mt-button  icon="back" @click="$router.go(-1)"></mt-button>-->
<!--      </view>-->
<!--      <view slot="right">-->
<!--        <el-dropdown trigger="click" style="margin-left: 1px;">-->
<!--           <mt-button size="normal">-->
<!--            <img  style="width: 25px" src="../../static/img/slh.png">-->
<!--          </mt-button>-->
<!--          <el-dropdown-menu slot="dropdown" >-->
<!--            <el-dropdown-item type="text" @click.native="goDetail(null,3)">添加</el-dropdown-item>-->
<!--            <el-dropdown-item type="text" @click.native="resetHandle">重置</el-dropdown-item>-->
<!--          </el-dropdown-menu>-->
<!--        </el-dropdown>-->
<!--      </view>-->
<!--    </mt-header>-->
    <u-navbar title="其他收支">
      <view @click="$goBack" class="u-nav-slot" slot="left">
        <u-icon name="arrow-left" size="20"></u-icon>
      </view>
      <view @click="submit" class="u-nav-slot" style="font-size: 15px;" slot="right">
        保存
      </view>
    </u-navbar>
      <view class="fenlei_top">
        <view>
<!--          <el-input-->
<!--            clearable-->
<!--            placeholder="搜索商品名称"-->
<!--            prefix-icon="el-icon-search"-->
<!--            v-model.trim="queryParam.name">-->
<!--          </el-input>-->
<!--          <view class="u-demo-block">-->
<!--            <view class="u-demo-block__content">-->
<!--              <view class="u-page__tag-item">-->
<!--                <u-search shape="square" placeholder="搜索商品名称" v-model="queryParam.name"></u-search>-->
<!--              </view>-->
<!--            </view>-->
<!--          </view>-->
          <view class="u-demo-block">
            <view class="u-demo-block__content m-t-10">
              <view class="u-page__tag-item">
                <u-search
                    placeholderStyle="font-size: 20px;color:#c0c4cc"
                    placeholder="搜索商品名称"
                    v-model="queryParam.name"
                    :show-action="false"
                    shape="square"
                ></u-search>
              </view>
            </view>
          </view>
        </view>
<!--        <view class="fenlei_top_right" @click="isShowDialog2 = true">-->
<!--          <image src="../../static/img/search.png" style="height:30px; width:30px;" ></image>-->
<!--        </view>-->
      </view>
<!--    <mt-loadmore-->
<!--      style="padding-top: 0.86rem"-->
<!--      :top-method="loadTop"-->
<!--      :bottom-method="loadBottom"-->
<!--      :bottom-all-loaded="allLoaded"-->
<!--      @top-status-change="handleTopChange"-->
<!--      @bottom-status-change="handleBottomChange"-->
<!--      :autoFill="false"-->
<!--      ref="loadmore"-->
<!--    >-->

      <view class="julibiaoti2">
        <view class="dingdans_item_other" v-for="(item,index) in tableData" :key="index">
          <view class="dingdans_top_other zuoyouduiqi">
            <view @click="goDetail(item.id , 1)" >
              <strong class="dingdans_con_other_strong"> {{item.name}} </strong>
            </view>
            <view>
              <el-dropdown trigger="click" style="margin-left: 1px;">
                <button
                  class="dw-button-common">操作
                </button>
                <el-dropdown-menu slot="dropdown" >
                  <el-dropdown-item type="text" @click.native="goDetail(item.id , 1)">查看</el-dropdown-item>
                  <el-dropdown-item type="text" @click.native="goDetail(item.id ,2)">修改</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </view>
          </view>
          <view class="dingdans_con_other bt1">
            <view  class="dingdans_top_common_other_left">
              <text>类型：</text>
            </view>
            <view   class="dingdans_top_common_other">
              <text >{{ item.type | dictToDescTypeValue(39) }}</text>
            </view>
          </view>
          <view style="margin-top: 10px;" class="dingdans_con_other bt1">
            <view class="dingdans_top_common_other_left">
              <text>金额：</text>
            </view>
            <view class="dingdans_top_common_other">
              <text >{{ item.price }}</text>
            </view>
          </view>
          <view style="margin-top: 10px;" class="dingdans_con_other bt1">
            <view class="dingdans_top_common_other_left">
              <text>时间：</text>
            </view>
            <view class="dingdans_top_common_other">
              <text >{{item.createTime |formateTime }}</text>
            </view>
          </view>
        </view>
      </view>
      <view slot="top" class="mint-loadmore-top">
        <text v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">松手释放↓</text>
        <text v-show="topStatus === 'loading'">加载中</text>
      </view>
      <view slot="bottom" class="mint-loadmore-bottom">
        <text
          v-if="bottomStatus !== 'loading'"
          :class="{ 'rotate': bottomStatus === 'drop' }"
        >松手释放↑</text>
        <text v-if="bottomStatus === 'loading'">加载中</text>
      </view>
<!--    </mt-loadmore>-->
<!--    <mt-popup-->
<!--      position="bottom"-->
<!--      v-model="isShowDialog2">-->
<!--      <mt-header title="筛选" >-->
<!--        <view slot="right">-->
<!--          <mt-button size="normal"  @click="resetHandle" style="font-size: 15px">关闭</mt-button>-->
<!--        </view>-->
<!--        <view slot="left">-->
<!--          <mt-button size="normal" @click="search1" style="font-size: 15px">确定</mt-button>-->
<!--        </view>-->
<!--      </mt-header>-->
<!--      <section style="height: 80vw;width: 100vw">-->
<!--        <mt-field label="类型" style="margin-top: 11vw;">-->
<!--&lt;!&ndash;            <select class="select100" v-model="queryParam.type" @change="changeSystem" >&ndash;&gt;-->
<!--&lt;!&ndash;               <option :disabled="true" value="" selected>请选择类型</option>&ndash;&gt;-->
<!--&lt;!&ndash;              <option v-for="x in typeList" :value="x.fieldValue">{{x.fieldName}}</option>&ndash;&gt;-->
<!--&lt;!&ndash;            </select>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-select size="small" class="select100" v-model="queryParam.type" >&ndash;&gt;-->
<!--&lt;!&ndash;          <el-option :disabled="true" value="" selected>请选择类型</el-option>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-option&ndash;&gt;-->
<!--&lt;!&ndash;            v-for="item in typeList"&ndash;&gt;-->
<!--&lt;!&ndash;            :key="item.fieldValue"&ndash;&gt;-->
<!--&lt;!&ndash;            :label="item.fieldName"&ndash;&gt;-->
<!--&lt;!&ndash;            :value="item.fieldValue">&ndash;&gt;-->
<!--&lt;!&ndash;          </el-option>&ndash;&gt;-->
<!--&lt;!&ndash;            </el-select>&ndash;&gt;-->
<!--          <select class=" select100_select select" v-model="queryParam.type" >-->
<!--            <option label="请选择类型"  value=""></option>-->
<!--            <option-->
<!--              v-for="item in typeList"-->
<!--              :key="item.fieldValue"-->
<!--              :label="item.fieldName"-->
<!--              :value="+item.fieldValue">-->
<!--            </option>-->
<!--          </select>-->

<!--        </mt-field>-->
<!--        <mt-field label="品牌" placeholder="请输入品牌"  v-model="queryParam.brand"></mt-field>-->
<!--        <mt-field label="开始时间" type="date" placeholder="开始时间"  v-model="queryParam.createTimeFrom" ></mt-field>-->
<!--        <mt-field label="结束时间" type="date" placeholder="结束时间"  v-model="queryParam.createTimeTo" ></mt-field>-->
<!--      </section>-->
<!--    </mt-popup>-->
    <view class="popContainer" v-if="pictureZoomShow" @click="pictureZoomShow = false">
      <view class="imageShow">
        <img :src="$fileUrl + imageZoom" alt="" width="100%" height="100%">
      </view>
    </view>
<!--    <view style="-->
<!--    right: 15px;-->
<!--    bottom: 10vw;-->
<!--    position: absolute;-->
<!--    text-align: center;-->
<!--    ">-->
<!--      <mt-button  @click="goDetail(null,3)"  style="margin-left: 5px;-->
<!--    border-radius: 100%;-->
<!--    margin-top: 0px;-->
<!--    height: 55px;-->
<!--    width: 55px;" type="primary">-->
<!--        <img src="../../static/img/add.png" height="30" width="30" slot="icon">-->
<!--      </mt-button>-->
<!--    </view>-->
    <view v-if="!tableData.length" class="to-the-bottom-1" >
      <p v-if="emtityMsg">
        <img src="../../static/img/new/empity_7.png" style="width: 60vw;">
      </p>
      <p>
        <text>{{emtityMsg}}</text>
      </p>
    </view>
<!--    <v-footer></v-footer>-->
  </view>
</template>
<script>
  // import Baseline from '@/common/_baseline.vue'
  // import Footer from '@/common/_footer.vue'
  // import { goodsOtherApi } from '@/api/goodsOther'

  export default {
    components: {
      // 'v-baseline': Baseline,
      // 'v-footer': Footer
    },
    name: "HelloWorld",
    data() {
      return {
        orderData2: '',
        isShowDialog2: false,
        emtityMsg: '',
        pictureZoomShow: false,
        imageZoom: '',
        // fileUrl: fileUrl,
        queryParam: {
          type: '',
          actNo: '',
          name: '',
          brand: '',
          remark: '',
          priceFrom: '',
          priceTo: '',
          createTimeFrom: '',
          createTimeTo: '',
          updateTimeFrom: '',
          updateTimeTo: '',
          pageSize: 10,
          pageNum: 1
        },
        typeList: [],
        topStatus: "",
        bottomStatus: "",
        allLoaded: false,
        tableData: [],
        totalCount: 1
      }
    },
    mounted() {
      this.getPage()
      this.listSysDict()
      this.keyupSubmit()

    },
    methods: {
      keyupSubmit() {
        document.onkeydown = (e) => {
          let _key = window.event.keyCode
          if (_key === 13) {
            this.search1()
          }
        }
      },
      goDetail(id, type) {
        this.$router.push({ path: '/otherAdd', query: { id, type } })
      },
      getPage() {
        this.emtityMsg = ''
        // goodsOtherApi.page(this.queryParam)
        this.$request({
          url: '/gw/op/v1/goodsOther',
          method: 'get',
          data: this.queryParam
        }).then(res => {
          if (res.subCode === 1000) {
            this.tableData = res.data ? res.data.list : []
            this.totalCount = res.data ? res.data.pageInfo.totalCount : 0
            if (this.totalCount == 0) {
              this.allLoaded = true;
              this.emtityMsg = '暂无相关数据'
            } else if (this.totalCount <= this.queryParam.pageSize) {
              this.allLoaded = true;
            }
          } else {
            this.$toast(res.subMsg)
          }
        })
      },
      listSysDict() {
        let sysDictList = uni.getStorageSync('sysDictList') ? JSON.parse(
          uni.getStorageSync('sysDictList')) : []
        this.typeList = sysDictList.filter(item => item.typeValue == 39)
      },
      loadData(p_status) {
        // 第一次加载或者下拉刷新最新数据
        if (p_status === "refresh") {
          this.tableData = [];
        }
        goodsOtherApi.page(this.queryParam).then(res => {
          if (res.subCode === 1000) {
            let list =  res.data ? res.data.list : []
            if (list && list.length) {
              for (let i = 0; i < list.length; i++) {
                this.tableData.push(list[i])
              }
              setTimeout(()=>{
                let ht2 = (this.$refs.hello.scrollTop)*1 +475
                this.$refs.hello.scrollTop = ht2
              },100)
            } else {
              this.allLoaded = true;
              this.$toast('没有更多了')
            }
          } else {
            this.$toast(res.subMsg)
            return false
          }
        })
      },
      search() {
        if (!this.queryParam.name ) {
          this.$toast('请输入名称')
          return
        }
        this.queryParam.pageNum = 1
        this.allLoaded = false;
        this.getPage()
      },
      // 日期
      open(picker) {
        this.$refs[picker].open();
      },
      search1() {
        this.queryParam.pageNum = 1
        this.allLoaded = false;
        this.isShowDialog2 = false
        this.$refs.hello.scrollTop = 0
        this.getPage()
      },
      resetHandle() {
        this.queryParam = {
          type: '',
          actNo: '',
          name: '',
          brand: '',
          remark: '',
          priceFrom: '',
          priceTo: '',
          createTimeFrom: '',
          createTimeTo: '',
          updateTimeFrom: '',
          updateTimeTo: '',
          pageSize: 10,
          pageNum: 1
        }
        this.search1()
      },
      handleTopChange(p_status) {
        this.topStatus = p_status;
      },
      handleBottomChange(p_status) {
        this.bottomStatus = p_status;
      },
      loadBottom() {
        // 一次下拉加载5条更多数据，使用定时器默认ajax加载
        this.loadData()
        this.queryParam.pageNum++;
        this.$refs.loadmore.onBottomLoaded();
      },
      loadTop() {
        // 默认下拉刷新最新数据
        this.loadData("refresh");
        this.queryParam.pageNum = 0
        this.allLoaded = false;
        this.$refs.loadmore.onTopLoaded();
      },
      avatarShow(e) {
        this.imageZoom = e
        this.pictureZoomShow = true
      },
    }
  };
</script>

<style>

  @import '@/assets/index/style.css';

  strong{
    font-weight: 600;
  }
  .mint-button--small {
    display: inline-block;
    font-size: 4vw;
    height: 6vw;
  }
  .dingdans_item {
    padding: 2.4vw 1.2vw;
    background: #ffffff;
    border-bottom: 1vw solid #eee;
    padding-right: 3%;
    padding-left: 3%;
  }

  .dingdans_top {
    font-size: 3.68vw;
    height: 3.88vw;
    line-height: 3.88vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dingdans_con {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 1.3vw 0;
  }

  .dingdans_con_left {
    width: 35vw;
    height: 20vw;
    display: flex;
  }

  .dingdans_con_left img {
    width: 100%;
    margin: auto;
    border-radius: 10px;
  }

  .diangdans_con_right {
    width: 130vw;
    padding-left: 10px;
  }

  .dingdans_con_right_down {
    margin-top: 1.4vw;
    font-size: 13px;
    margin-bottom: 2vw;
  }
  /*.dingdans_con_right_down_1 {*/
  /*  !*margin-left: 55vw;*!*/
  /*  margin-bottom: -7vw;*/
  /*  font-size: 3.5vw;*/
  /*  margin-top: -1vw;*/
  /*}*/
/*
 -----分割线---
*/
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  /* 这里直接设置 1rem = 50px begin */
  html {
    font-size: 50px;
  }
  /* 这里直接设置 1rem = 50px end */
  html,
  body {
    /*font-family: "微软雅黑";*/
    /*color: #333;*/
    /*background: #fff;*/
  }
  /*ul,*/
  /*li {*/
  /*  list-style: none;*/
  /*}*/
  /* 给要上拉的容器设置 begin */
  .hello {
    background-color: #f3f2f8;
    padding-top: 12vw;
    font-size: 13px;
    height: 100vh;
    overflow-y: auto;
  }
  /* 给要上拉的容器设置 end */
  /*.fl {*/
  /*  float: left;*/
  /*}*/
  /*.fr {*/
  /*  float: right;*/
  /*}*/
  /*.clearfix::before,*/
  /*.clearfix::after {*/
  /*  content: "";*/
  /*  display: block;*/
  /*  overflow: hidden;*/
  /*  clear: both;*/
  /*  visibility: hidden;*/
  /*}*/
  /*li {*/
  /*  background: #fff;*/
  /*}*/
  /*.order-intr {*/
  /*  position: relative;*/
  /*  padding: 0.3rem 0.4rem;*/
  /*  width: calc(100% - 0.6rem);*/
  /*  margin: 0.4rem auto;*/
  /*  border: 0.02rem solid #666;*/
  /*  border-radius: 0.16rem;*/
  /*}*/
  /*.order-intr img {*/
  /*  width: 3rem;*/
  /*  height: 2.4rem;*/
  /*}*/
  /*.title {*/
  /*  margin-left: 0.24rem;*/
  /*  text-align: left;*/
  /*}*/
  /*.title h3 {*/
  /*  font-size: 0.4rem;*/
  /*}*/
  /*.title p {*/
  /*  font-size: 0.3rem;*/
  /*}*/
  /*.price {*/
  /*  position: absolute;*/
  /*  right: 0.3rem;*/
  /*  bottom: 0.3rem;*/
  /*  font-size: 0.5rem;*/
  /*  color: #fe696b;*/
  /*}*/
  .mint-loadmore-top,
  .mint-loadmore-bottom {
    font-size: 0.28rem;
  }





</style>
