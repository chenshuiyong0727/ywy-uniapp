<template>
	<view @touchmove.stop.prevent="()=>{}">
        <!-- 用户自定义输入内容 -->
        <view @click.stop.prevent="handlerOpenPicker"><slot></slot></view>

        <uni-transition :mode-class="['fade']" :styles="maskClass" :duration="300" :show="visible" @click="handlerClosePicker" />
		<uni-transition :mode-class="['slide-bottom']" :styles="transClass" :duration="300" :show="visible">
            <view class="fy-picker_wrapper" @touchmove.stop.prevent="()=>{}">
                <!-- bar -->
                <view class="fy-picker_bar" :style="customBarStyle" v-if="showBar">
                    <template v-if="$slots.bar">
                        <slot name="bar"></slot>
                    </template>
                    <template v-else>
                        <text class="fy-picker_bar_btn" :style="{color: cancelColor}" @click.stop.prevent="handlerClosePicker">{{ cancelText }}</text>
                        <text class="fy-picker_bar_btn" :style="{color: confirmColor}" @click.stop.prevent="handlerConfirm">{{ confirmText }}</text>
                    </template>
                </view>
				<view v-if="barBorder" class="fy-picker_bar__border"></view>

                <!-- 内容 -->
                <view class="fy-picker-views">
                    <picker-view :indicator-style="indicatorStyle" :value="pickerValue" @change="bindPickerChange" :style="getPickerViewStyle" class="fy-picker-view">
                        <template v-if="mode === 'date'">
                            <picker-view-column v-for="(column, columnIndex) in pickerData" :key="columnIndex" class="picker-view-column" :style="getColumnStyle">
                                <view class="picker-view-column_item" v-for="(item, index) in column" :key="index"><text class="picker-view-column_item_text">{{ item['text'] }}</text></view>
                            </picker-view-column>
                        </template>
                        <template v-else-if="rangeKey">
                            <picker-view-column v-for="(column, columnIndex) in pickerData" :key="columnIndex" class="picker-view-column" :style="getColumnStyle">
                                <view class="picker-view-column_item" v-for="(item, index) in column" :key="index"><text class="picker-view-column_item_text">{{item[rangeKey]}}</text></view>
                            </picker-view-column>
                        </template>
                        <template v-else>
                            <picker-view-column v-for="(column, columnIndex) in pickerData" :key="columnIndex" class="picker-view-column" :style="getColumnStyle">
                                <view class="picker-view-column_item" v-for="(item, index) in column" :key="index"><text class="picker-view-column_item_text">{{item}}</text></view>
                            </picker-view-column>
                        </template>
                    </picker-view>
                </view>
            </view>
		</uni-transition>
	</view>
</template>

<script>
/**
 * picker 选择器
 * @description 从底部弹起的滚动选择器。支持三种选择器，通过mode来区分，分别是普通选择器，多列选择器，日期选择器，默认是普通选择器。
 * @description [地址选择器可使用fy-tree-select](https://ext.dcloud.net.cn/plugin?id=5498)。
 * @property {String} mode picker的类型 selector | multiSelector | date
 * @property {Array} range 需要展示的数据（mode = date不需要传）
 * @property {String} rangeKey 获取二维数据的key值（mode = date不需要传）
 * @property {Array | Number | String} value  默认选中下标，日期为2021-07-01, range为单项时，value是number类型的下标，多项则为Array<number>类型的下标。
 * @property {String} dateformat  mode = date， 数据格式化 YYYY、YYYY-MM、YYYY-MM-DD
 * @property {String | Number} start 表示有效日期范围的开始，字符串格式为"YYYY-MM-DD"（只有时间类型有效）
 * @property {String | Number} end 表示有效日期范围的结束，字符串格式为"YYYY-MM-DD"（只有时间类型有效）
 * @property {Boolean} showBar 是否显示操作栏
 * @property {Object} customBarStyle 是否自定义操纵栏样式
 * @property {Boolean} barBorder 是否显示操作栏的下边框
 * @property {String} cancelText 取消按钮文案
 * @property {String} confirmText 确认按钮文案
 * @property {String} cancelColor 取消按钮颜色
 * @property {String} confirmColor 确定按钮颜色
 * @event {Function} change 每项数据改变时触发
 * @event {Function} close 关闭时触发
 * @event {Function} open 打开时触发
 * @event {Function} confirm 点击确认时触发
 */
const SystemInfo = uni.getSystemInfoSync();
const nowTimestamp = new Date().getTime();
export default {
    props: {
        mode: { type: String, default: 'selector' }, // picker的类型 selector | multiSelector | date

        range:  { type: Array, default() { return [] } }, // 需要展示的数据（mode = date不需要传）
        rangeKey: { type: String, default: '' }, // 获取二维数据的key值（mode = date不需要传）

        value: { type: [Array, Number, String], default() { return '' } }, // 默认选中下标，日期为2021-07-01, range为单项时，value是number类型的下标，多项则为Array<number>类型的下标。

        dateformat: { type: String, default: 'YYYY-MM-DD' }, // mode = date， 数据格式化 YYYY、YYYY-MM、YYYY-MM-DD
        start: { type: [String, Number], default() { return nowTimestamp - 2830464000000 } }, // 表示有效日期范围的开始，字符串格式为"YYYY-MM-DD"（只有时间类型有效）
        end: { type: [String, Number], default() { return nowTimestamp + 2830464000000 } }, // 表示有效日期范围的结束，字符串格式为"YYYY-MM-DD"（只有时间类型有效）

        showBar: { type: Boolean, default: true }, // 是否显示操作栏
        customBarStyle: { type: Object, default() { return {} } }, // 是否自定义操纵栏样式
        barBorder: { type: Boolean, default: true }, // 是否显示操作栏的下边框
        cancelText: { type: String, default: '取消' }, // 取消按钮文案
		confirmText: { type: String, default: '确定' }, // 确认按钮文案
		cancelColor: { type: String, default: '#666666' }, // 取消按钮颜色
		confirmColor: { type: String, default: '#4cd964' }, // 确定按钮颜色
    },
    data() {
        return {
            visible: false, 

            maskClass: { // 遮罩层样式
                'position': 'fixed', 'bottom': 0, 'top': 0, 'left': 0, 'right': 0, 'backgroundColor': 'rgba(0, 0, 0, 0.6)', 'z-index': '99999'
            },
            transClass: { // 内容弹框样式
                'position': 'fixed', 'left': 0, 'right': 0, 'bottom': 0, 'z-index': '99999'
            },

            indicatorStyle: `flex: 1;height: 44px;`,

            pickerData: [],
            pickerValue: [], // 选中的下标，pickerData有多少想项，pickerValue的长度就有多少

			windowWidth: SystemInfo.windowWidth,
			windowHeight: SystemInfo.windowHeight,
        };
    },
    computed: {
        getColumnStyle() {
            return `width: ${this.windowWidth / this.pickerData.length}px`;
        },
		getPickerViewStyle() {
			// #ifdef APP-PLUS
			let orit = plus.navigator.getOrientation();
			if((orit==0) || (orit==180)) {
			   	return `height: ${this.windowHeight * 0.38}px`;
			}else{
				return `height: ${this.windowHeight * 0.76}px`;
			}
			// #endif
			
			// #ifndef APP-PLUS
			return `height: ${this.windowHeight * 0.38}px`;
			// #endif
		}
    },
    watch: {
        visible: {
            immediate: true,
            handler: function(data) {
                if (data) {
					
                    this.initPickerData();
                }
            }
        }
    },
	mounted() {
		this.windowWidth = SystemInfo.windowWidth;
		this.windowHeight = SystemInfo.windowHeight;
		uni.onWindowResize(() => {
			uni.getSystemInfo({
				success: (res) => {  
					this.windowWidth = res.windowWidth;
					this.windowHeight = res.windowHeight;
					
				}  
			})
		})
	},
    methods: {
        // 初始化分发数据
        initPickerData() {
            try {
                const { mode, range, dateformat, value } = this;

                if (mode === 'date') { // 日期
                    const dateformatArray = dateformat.split('-');
                    const maxLenght = dateformatArray.length;
                    if(typeof value !== 'string') return console.error('当mode=date时，value类型应该为string!');

                    for (let i = 0; i < maxLenght; i++) {
                        const item = dateformatArray[i];
                        if (item === 'YYYY') {
                            const list = this.getYearList() || [];
                            this.$set(this.pickerData, i, list);
                           this.setPickerIndex(list, i);
                        } else if (item === 'MM') {
                            const list = this.getMonthList() || [];
                            this.$set(this.pickerData, i, list)
                            this.setPickerIndex(list, i);
                        } else if (item === 'DD') {
                            const list = this.getDayList() || [];
                            this.$set(this.pickerData, i, list);
                            this.setPickerIndex(list, i);
                        }
                    }
                } else if (mode === 'selector') { // 单列
                    let newRange = JSON.parse(JSON.stringify(range));
                    if (this.checkTowArray(newRange) === false) {
                        newRange = [newRange];
                    }

                    this.pickerValue = value >= 0 && typeof value === 'number' ? [value] : [0];
                    this.pickerData = newRange.length > 0 ? [newRange[0]] : newRange;
                } else if (mode === 'multiSelector') { // 多列
                    let newRange = JSON.parse(JSON.stringify(range));
                    if (this.checkTowArray(newRange) === false) {
                        newRange = [newRange];
                    }
                    const maxLenght = newRange.length;
                    if(Array.isArray(value) === false) return console.error('当range是多列时，value类型应该为Array<number>!');
                    this.pickerValue = value.length !== maxLenght ? new Array(maxLenght).fill(0) : JSON.parse(JSON.stringify(value)); // 填充默认值
                    this.pickerData = newRange;
                }
            } catch(err) {
                console.log(err);
            }
        },
        
        /**
         * 更新指定列的数据（供外部调用）
         * @param { Array } data 更新的数据
         * @param { Number } columnIndex 更新的列
        */
        updateColumnData(data) {
          
          this.pickerData[1] = data
        },
            
        setPickerIndex(list, i) {
            const dateValue = this.value ? this.value.split('-') : [];
            let index = 0;
            for (var k = 0, len = list.length; k < len; k++) {
                if (list[k]['value'] == dateValue[i]) {
                    index = k; break;
                }
            }
            this.$set(this.pickerValue, i, index);
        },

        // 检测是否是二维数组
        checkTowArray(data) {
            if (Array.isArray(data) === false || data.length === 0) {
                return false;
            } else if(Array.isArray(data[0]) === false) {
                return false;
            } else {
                return true;
            }
        },

        // 监听picker-view的选中
        bindPickerChange(data) {
          
            const { value } = data.detail;
            const { mode } = this;
            
            const prevPickerValue = JSON.parse(JSON.stringify(this.pickerValue)); // 保存上一份值的数据
            this.pickerValue = value;

            if (mode === 'date' && value.length === 3) { // 日期的只有更改年、月份时会更新日的列表数据
                if ((prevPickerValue[0] != value[0]) || (prevPickerValue[1] != value[1])) {
                    this.$set(this.pickerData, 2, this.getDayList() || [])
                    this.$set(this.pickerValue, 2, 0)
                }
            }

            this.$emit('change', { value: JSON.parse(JSON.stringify(value)) })
        },

        /**
         * 获取年份列表
         */
        getYearList() {
            try {
                const startYear = Number(this.formatDate(this.start, 'YYYY'));
                const endYear = Number(this.formatDate(this.end, 'YYYY'));
                const temp = [];
                for (var i = startYear; i <= endYear; i++) {
                    const item = { 'text': `${i}年`, 'value': String(i) };
                    temp.push(item);
                }
                return temp;
            } catch(err) {
                return [];
            }
        },
        /**
         * 获取月份列表
         */
        getMonthList() {
            try {
                const MaxMonth = 12;
                const temp = [];
                for (let i = 1; i <= MaxMonth; i++) {
                    const value = i < 10 ? `0${i}` : i;
                    const item = { 'text': `${value}月`, 'value': String(value) };
                    temp.push(item)
                }
                return temp;
            } catch(err) {
                return [];
            }
        },
        /**
         * 获取日列表
         */
        getDayList() {
            try {
                const { pickerData, pickerValue } = this;
                const columnArray = this.dateformat.split('-') || [];
                const columnLen = columnArray.length;
                const date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth()+1;

                for (let i = 0; i < columnLen; i++) {
                    const item = columnArray[i].toLocaleUpperCase();
                    if (item === 'YYYY') {
                        year = pickerData[i][pickerValue[i]]['value'];
                    } else if (item === 'MM') {
                        month = pickerData[i][pickerValue[i]]['value'];
                    }
                }

                const temp = [];
                if (year && month) {
                     let lastday = new Date(year, month, 0).getDate();
                    for (let i = 1; i <= lastday; i++) {
                        const value = i < 10 ? `0${i}` : i;
                        const item = { 'text': `${value}日`, 'value': String(value) };
                        temp.push(item);
                    }
                }

                return temp;
            } catch(err) {
                console.log(err)
                return [];
            }
        },
        // 切换picker的显示
        handlerOpenPicker() {
            this.visible = true;
            this.$emit('open', { visible: true })
        },
        handlerClosePicker() {
            this.visible = false;
            this.$emit('close', { visible: false })
        },
        // 点击确定
        handlerConfirm() {
            const { mode, pickerData, pickerValue } = this;
            let rangeKey = mode === 'date' ? 'value' : this.rangeKey;

            const selectedTemp = [];
            const selectItems = [];
            for (var i = 0, len = pickerData.length; i < len; i++) {
                const column = pickerData[i];
                const item = column[pickerValue[i]];
                if (typeof item === 'object' && rangeKey) {
                    selectedTemp.push(item[rangeKey]);
                } else {
                    selectedTemp.push(item);
                }
                selectItems.push(item);
            }

            let dataString = null;
            if (mode === 'date') {
                dataString = selectedTemp.join('/');
                selectedTemp.length == 2 && (dataString += '/01'); // 补全年月日
                dataString = this.formatDate(dataString, this.dateformat);
            } else {
                dataString = selectedTemp.join('-');
            }

            const resultValue = JSON.parse(JSON.stringify(pickerValue));
            this.$emit('confirm', { text: dataString, value: resultValue, selected: JSON.parse(JSON.stringify(selectItems)) });

            if (mode === 'date') {
                this.$emit('input', dataString);
            } else if (pickerValue.length === 1) {
                this.$emit('input', resultValue[0]);
            } else {
                this.$emit('input', resultValue);
            }
            this.visible = false;
        },
        /**
         * 格式化时间
         * @param { Date | String | Number | null } d 需要处理的时间
         * @param { String } fmt 格式化字符串 YYYY-MM-dd hh:mm:ss
         * @returns { string } 返回格式化的时间
        * */
	    formatDate(d, fmt = 'YYYY-MM-DD hh:mm:ss') {
            if (typeof d === 'undefined' || d === null) {
                d = new Date()
            } else if (typeof d === 'number') {
                if (String(d).length === 10) {
                    d = new Date(d*1000);
                } else {
                    d = new Date(d);
                }
            } else if (typeof d === 'string') {
                d = new Date(Date.parse(String(d).replace(/-/g, "/")));
            }
            let date = d;

            const o = {
                "M+": date.getMonth() + 1, //月份 
                "MM+": date.getMonth() + 1 < 10 ? '0' + date.getMonth() + 1 : date.getMonth() + 1, //月份 
                "D+": date.getDate(), //日 
                "DD+": date.getDate() < 10 ? '0' + date.getDate() : date.getDate(), //日 
                "h+": date.getHours(), //小时
                "hh+": date.getHours() < 10 ? '0' + date.getHours() : date.getHours(), //小时
                "m+": date.getMinutes(), //分 
                "mm+": date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(), //分 
                "s+": date.getSeconds(), //秒 
                "ss+": date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(), //秒 
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
                "S": date.getMilliseconds() //毫秒 
            };
            if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (let k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
                    k]).substr(("" + o[k]).length)));
            }

            return fmt;
        },
        /**
         * 提取数组下标（简单的一维数组）
         * @param { Array } data 数组
         * @param { String } key 
         * @param { any } targetValue 目标值
         */
        array_getIndex(data, key, targetValue) {
            let index = -1;
            for (var i = 0, len = data.length; i < len; i++) {
                const item = data[i];
                if (item[key] == targetValue) {
                    index = i;
                    break;
                }
            }
            return index;
        }
    }
};
</script>

<style lang="scss" scoped>
@import './fy-picker.scss';
</style>
